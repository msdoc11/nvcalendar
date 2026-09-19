<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, watch } from 'vue'
import type { DatePickerRules, TimeRule } from '../types'
import type { CalendarLocale } from '../utils/locale'

defineOptions({ name: 'NvTimePicker' })

const props = withDefaults(defineProps<{
  modelValue: Date | null
  locale: CalendarLocale
  is24hr?: boolean
  accuracy?: 1 | 2 | 3
  rules?: DatePickerRules
  disabled?: boolean
  hideHeader?: boolean
  label?: string
}>(), {
  is24hr: undefined,
  accuracy: 2,
  disabled: false,
  hideHeader: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: Date]
}>()

type Part = 'hours' | 'minutes' | 'seconds' | 'meridiem'

interface TimeOption {
  value: number | string
  label: string
  disabled?: boolean
}

interface TimeColumn {
  part: Part
  name: string
  options: TimeOption[]
  selected: number | string
  /** Long columns wrap around like the native time input: the list is drawn three times. */
  loops: boolean
}

interface RenderedOption {
  key: string
  copy: number
  option: TimeOption
}

/** Visible rows per column; the column scrolls beyond that. */
const VISIBLE_ROWS = 7
/** The copy of a looping list that carries the real listbox semantics. */
const MAIN_COPY = 1
/** How long the scroll position has to rest before it is treated as settled. */
const SETTLE_DELAY = 150

const use24hr = computed(() => props.is24hr ?? !props.locale.hour12)

function expand(rule: number | number[] | TimeRule | undefined, max: number): number[] {
  const all = Array.from({ length: max + 1 }, (_, index) => index)
  if (rule === undefined) return all
  if (typeof rule === 'number') return [rule]
  if (Array.isArray(rule)) return rule.filter(value => value >= 0 && value <= max)
  const min = rule.min ?? 0
  const top = rule.max ?? max
  const interval = rule.interval && rule.interval > 0 ? rule.interval : 1
  return all.filter(value => value >= min && value <= top && (value - min) % interval === 0)
}

const hourValues = computed(() => expand(props.rules?.hours, 23))
const minuteValues = computed(() => expand(props.rules?.minutes, 59))
const secondValues = computed(() => expand(props.rules?.seconds, 59))

const value = computed(() => props.modelValue ?? new Date())

const meridiem = computed(() => (value.value.getHours() < 12 ? 'am' : 'pm'))

function pad(amount: number): string {
  return String(amount).padStart(2, '0')
}

const hourOptions = computed<TimeOption[]>(() => {
  if (use24hr.value) {
    return hourValues.value.map(hour => ({ value: hour, label: pad(hour) }))
  }
  const inHalf = hourValues.value.filter(hour => (meridiem.value === 'am' ? hour < 12 : hour >= 12))
  return inHalf.map(hour => ({ value: hour, label: pad(hour % 12 === 0 ? 12 : hour % 12) }))
})

const minuteOptions = computed<TimeOption[]>(() =>
  minuteValues.value.map(minute => ({ value: minute, label: pad(minute) })))

const secondOptions = computed<TimeOption[]>(() =>
  secondValues.value.map(second => ({ value: second, label: pad(second) })))

const canSwitchMeridiem = computed(() =>
  !use24hr.value && hourValues.value.some(hour => (meridiem.value === 'am' ? hour >= 12 : hour < 12)))

const meridiemOptions = computed<TimeOption[]>(() => [
  { value: 'am', label: 'AM', disabled: meridiem.value !== 'am' && !canSwitchMeridiem.value },
  { value: 'pm', label: 'PM', disabled: meridiem.value !== 'pm' && !canSwitchMeridiem.value },
])

function column(part: Part, name: string, options: TimeOption[], selected: number | string): TimeColumn {
  return { part, name, options, selected, loops: part !== 'meridiem' && options.length > VISIBLE_ROWS }
}

const columns = computed<TimeColumn[]>(() => {
  const list: TimeColumn[] = [column('hours', 'Hours', hourOptions.value, value.value.getHours())]
  if (props.accuracy >= 2) list.push(column('minutes', 'Minutes', minuteOptions.value, value.value.getMinutes()))
  if (props.accuracy >= 3) list.push(column('seconds', 'Seconds', secondOptions.value, value.value.getSeconds()))
  if (!use24hr.value) list.push(column('meridiem', 'AM/PM', meridiemOptions.value, meridiem.value))
  return list
})

function renderedOptions(item: TimeColumn): RenderedOption[] {
  const copies = item.loops ? [0, 1, 2] : [MAIN_COPY]
  return copies.flatMap(copy => item.options.map(option => ({ key: `${copy}:${option.value}`, copy, option })))
}

const headerLabel = computed(() => props.label
  ?? props.locale.format(value.value, use24hr.value ? 'HH:mm' : 'h:mm A'))

function commit(next: Date) {
  emit('update:modelValue', next)
}

function withPart(part: 'hours' | 'minutes' | 'seconds', amount: number): Date {
  const next = new Date(value.value.getTime())
  if (part === 'hours') next.setHours(amount)
  if (part === 'minutes') next.setMinutes(amount)
  if (part === 'seconds') next.setSeconds(amount)
  return next
}

function select(part: Part, optionValue: number | string) {
  if (props.disabled) return
  if (part === 'meridiem') {
    const hours = value.value.getHours()
    if (optionValue === 'am' && hours >= 12) commit(withPart('hours', hours - 12))
    if (optionValue === 'pm' && hours < 12) commit(withPart('hours', hours + 12))
    return
  }
  const amount = Number(optionValue)
  if (amount === columns.value.find(item => item.part === part)?.selected) return
  commit(withPart(part, amount))
}

// --- Scrolling -------------------------------------------------------------

const columnElements = new Map<Part, HTMLElement>()
/** Columns whose smooth scroll is still in flight; wrapping waits until it settles. */
const settleTimers = new Map<Part, ReturnType<typeof setTimeout>>()

function bindColumn(part: Part, element: unknown) {
  if (element instanceof HTMLElement) columnElements.set(part, element)
  else columnElements.delete(part)
}

function paddingTop(element: HTMLElement): number {
  return Number.parseFloat(getComputedStyle(element).paddingTop) || 0
}

/** Height of one copy of a looping list, measured from the rendered options. */
function copyHeight(element: HTMLElement): number {
  const first = element.querySelector<HTMLElement>('[data-copy="0"]')
  const second = element.querySelector<HTMLElement>('[data-copy="1"]')
  if (!first || !second) return 0
  return second.offsetTop - first.offsetTop
}

/** Keeps a looping column inside the middle copy, so there is always more list in both directions. */
function wrap(element: HTMLElement) {
  const height = copyHeight(element)
  if (height <= 0) return
  const low = height * 0.25
  const high = height * 1.75
  if (element.scrollTop < low) element.scrollTop += height
  else if (element.scrollTop > high) element.scrollTop -= height
}

function onScroll(item: TimeColumn) {
  const element = columnElements.get(item.part)
  if (!element || !item.loops) return
  if (settleTimers.has(item.part)) {
    // Programmatic smooth scroll in progress: wait for it to rest before jumping.
    clearTimeout(settleTimers.get(item.part))
    settleTimers.set(item.part, setTimeout(() => {
      settleTimers.delete(item.part)
      wrap(element)
    }, SETTLE_DELAY))
    return
  }
  wrap(element)
}

function scrollBehavior(): ScrollBehavior {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return 'auto'
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
}

/** The selected option closest to the current scroll position: in a looping list there are three. */
function nearestActive(element: HTMLElement): HTMLElement | null {
  const actives = [...element.querySelectorAll<HTMLElement>('.nv-time-option--active')]
  if (!actives.length) return null
  const offset = paddingTop(element)
  return actives.reduce((best, candidate) =>
    Math.abs(candidate.offsetTop - offset - element.scrollTop) < Math.abs(best.offsetTop - offset - element.scrollTop)
      ? candidate
      : best)
}

/** Aligns the selected option with the top of each column. */
function scrollToSelection(behavior: ScrollBehavior) {
  for (const item of columns.value) {
    const element = columnElements.get(item.part)
    if (!element) continue
    const active = behavior === 'auto'
      ? element.querySelector<HTMLElement>(`.nv-time-option--active[data-copy="${MAIN_COPY}"]`)
      : nearestActive(element)
    if (!active) continue
    const top = Math.max(0, active.offsetTop - paddingTop(element))
    if (Math.abs(element.scrollTop - top) < 1) continue
    if (behavior === 'smooth' && typeof element.scrollTo === 'function') {
      if (item.loops) {
        clearTimeout(settleTimers.get(item.part))
        settleTimers.set(item.part, setTimeout(() => {
          settleTimers.delete(item.part)
          wrap(element)
        }, SETTLE_DELAY))
      }
      element.scrollTo({ top, behavior })
    }
    else {
      element.scrollTop = top
    }
  }
}

let visibilityObserver: ResizeObserver | null = null

/** A picker mounted inside a hidden container has no layout yet; align it once it is shown. */
function scrollWhenVisible() {
  const first = columnElements.values().next().value
  if (!first) return
  if (first.clientHeight > 0) {
    scrollToSelection('auto')
    return
  }
  if (typeof ResizeObserver === 'undefined') return
  visibilityObserver = new ResizeObserver(() => {
    if (first.clientHeight === 0) return
    scrollToSelection('auto')
    visibilityObserver?.disconnect()
    visibilityObserver = null
  })
  visibilityObserver.observe(first)
}

onMounted(scrollWhenVisible)

onBeforeUnmount(() => {
  visibilityObserver?.disconnect()
  settleTimers.forEach(timer => clearTimeout(timer))
  settleTimers.clear()
})

watch(
  () => columns.value.map(item => `${item.part}:${item.selected}:${item.options.length}`).join('|'),
  () => nextTick(() => scrollToSelection(scrollBehavior())),
)

// --- Keyboard --------------------------------------------------------------

function onKeydown(item: TimeColumn, event: KeyboardEvent) {
  if (props.disabled) return
  const enabled = item.options.filter(option => !option.disabled)
  if (!enabled.length) return
  const last = enabled.length - 1
  const index = enabled.findIndex(option => option.value === item.selected)
  const step = (amount: number) => (item.loops
    ? (index + amount + enabled.length * Math.ceil(Math.abs(amount) / enabled.length)) % enabled.length
    : Math.min(Math.max(index + amount, 0), last))
  let next = index
  switch (event.key) {
    case 'ArrowDown':
      next = step(1)
      break
    case 'ArrowUp':
      next = step(-1)
      break
    case 'PageDown':
      next = step(VISIBLE_ROWS)
      break
    case 'PageUp':
      next = step(-VISIBLE_ROWS)
      break
    case 'Home':
      next = 0
      break
    case 'End':
      next = last
      break
    default:
      return
  }
  event.preventDefault()
  if (next === index || next < 0) return
  select(item.part, enabled[next]!.value)
  void nextTick(() => {
    const element = columnElements.get(item.part)
    const active = element ? nearestActive(element) : null
    active?.focus({ preventScroll: true })
  })
}
</script>

<template>
  <div
    class="nv-time-picker"
    :class="{ 'nv-time-picker--disabled': disabled }"
  >
    <div
      v-if="!hideHeader"
      class="nv-time-header"
    >
      <svg
        viewBox="0 0 24 24"
        class="nv-icon"
        aria-hidden="true"
      >
        <circle
          cx="12"
          cy="12"
          r="9"
          fill="none"
          stroke="currentColor"
          stroke-width="1.8"
        />
        <path
          d="M12 7v5.2l3.2 2"
          fill="none"
          stroke="currentColor"
          stroke-width="1.8"
          stroke-linecap="round"
        />
      </svg>
      <span>{{ headerLabel }}</span>
    </div>

    <div class="nv-time-columns">
      <div
        v-for="item in columns"
        :key="item.part"
        :ref="element => bindColumn(item.part, element)"
        class="nv-time-column"
        :class="[`nv-time-column--${item.part}`, { 'nv-time-column--loop': item.loops }]"
        role="listbox"
        :aria-label="item.name"
        :aria-disabled="disabled || undefined"
        @keydown="onKeydown(item, $event)"
        @scroll.passive="onScroll(item)"
      >
        <button
          v-for="rendered in renderedOptions(item)"
          :key="rendered.key"
          type="button"
          class="nv-time-option"
          :class="{ 'nv-time-option--active': rendered.option.value === item.selected }"
          :data-copy="rendered.copy"
          :role="rendered.copy === MAIN_COPY ? 'option' : undefined"
          :aria-selected="rendered.copy === MAIN_COPY ? rendered.option.value === item.selected : undefined"
          :aria-hidden="rendered.copy === MAIN_COPY ? undefined : 'true'"
          :tabindex="rendered.copy === MAIN_COPY && rendered.option.value === item.selected ? 0 : -1"
          :disabled="disabled || rendered.option.disabled"
          @click="select(item.part, rendered.option.value)"
        >
          {{ rendered.option.label }}
        </button>
      </div>
    </div>
  </div>
</template>
