<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, useSlots, watch } from 'vue'
import type {
  CalendarAttribute,
  CalendarDay,
  DatePickerModelValue,
  DateRangeValue,
  DateSource,
  PageAddress,
} from '../types'
import { calendarProps, datePickerProps } from '../props'
import { useCalendarDefaults } from '../composables/useDefaults'
import { useCalendarTheme } from '../composables/useTheme'
import { resolveLocale } from '../utils/locale'
import { diffInDays, isSameDay, toDate, withTimeOf } from '../utils/date'
import NvCalendar from './NvCalendar.vue'
import NvPopover from './NvPopover.vue'
import NvTimePicker from './NvTimePicker.vue'

defineOptions({ name: 'NvDatePicker', inheritAttrs: false })

const props = defineProps(datePickerProps)

const emit = defineEmits<{
  'update:modelValue': [value: DatePickerModelValue]
  'update:page': [page: PageAddress]
  'did-move': [pages: PageAddress[]]
  'dayclick': [day: CalendarDay, event: MouseEvent]
  'drag': [range: DateRangeValue<Date>]
  'popover-show': []
  'popover-hide': []
}>()

const slots = useSlots()
const defaults = useCalendarDefaults()
const calendarRef = ref<InstanceType<typeof NvCalendar> | null>(null)
const anchorRef = ref<HTMLElement | null>(null)

const locale = computed(() => {
  const config = typeof props.locale === 'string' ? { id: props.locale } : { ...(props.locale ?? {}) }
  if (!config.id && defaults.locale) config.id = defaults.locale
  const firstDay = props.firstDayOfWeek ?? config.firstDayOfWeek ?? defaults.firstDayOfWeek
  if (firstDay !== undefined) config.firstDayOfWeek = firstDay
  const masks = { ...(defaults.masks ?? {}), ...(config.masks ?? {}), ...(props.masks ?? {}) }
  if (Object.keys(masks).length) config.masks = masks
  return resolveLocale(config)
})

const { themeClass, themeStyle } = useCalendarTheme(props)

const isRange = computed(() => props.selection === 'range')
const isMultiple = computed(() => props.selection === 'multiple')
const showsCalendar = computed(() => props.mode !== 'time')
const showsTime = computed(() => props.mode === 'dateTime' || props.mode === 'time')

const singleDate = ref<Date | null>(null)
const multipleDates = ref<Date[]>([])
const rangeValue = ref<DateRangeValue<Date>>({ start: null, end: null })

const inputMasks = computed(() => {
  const masks = locale.value.masks
  if (props.mode === 'time') return masks.inputTime
  if (props.mode === 'dateTime') return masks.inputDateTime
  return masks.input
})

const displayMask = computed(() => {
  const mask = inputMasks.value
  return Array.isArray(mask) ? (mask[0] ?? 'YYYY-MM-DD') : mask
})

function parseValue(value: DateSource | null | undefined): Date | null {
  if (value == null || value === '') return null
  if (typeof value === 'string') {
    const direct = toDate(value)
    if (direct) return direct
    return locale.value.parse(value, [locale.value.masks.modelValue, ...(Array.isArray(inputMasks.value) ? inputMasks.value : [inputMasks.value])])
  }
  return toDate(value)
}

function syncFromModel(value: DatePickerModelValue) {
  if (isRange.value) {
    const source = (value ?? {}) as DateRangeValue<DateSource>
    rangeValue.value = {
      start: parseValue(source?.start ?? null),
      end: parseValue(source?.end ?? null),
    }
    return
  }
  if (isMultiple.value) {
    const source = Array.isArray(value) ? value : value == null ? [] : [value as DateSource]
    multipleDates.value = source.map(parseValue).filter((date): date is Date => !!date)
    return
  }
  singleDate.value = parseValue(value as DateSource)
}

watch(() => props.modelValue, syncFromModel, { immediate: true, deep: true })
watch(() => props.selection, () => syncFromModel(props.modelValue))

const modelMask = computed(() => {
  const mask = locale.value.masks.modelValue
  if (mask && mask !== 'YYYY-MM-DD') return mask
  if (props.mode === 'time') return 'HH:mm:ss'
  if (props.mode === 'dateTime') return 'YYYY-MM-DD HH:mm:ss'
  return 'YYYY-MM-DD'
})

function toModel(date: Date | null): DateSource | null {
  if (!date) return null
  if (props.modelModifiers?.string) return locale.value.format(date, modelMask.value)
  if (props.modelModifiers?.number) return date.getTime()
  return date
}

function emitModel() {
  if (isRange.value) {
    const { start, end } = rangeValue.value
    emit('update:modelValue', start || end
      ? { start: toModel(start), end: toModel(end) } as DatePickerModelValue
      : null)
    return
  }
  if (isMultiple.value) {
    emit('update:modelValue', multipleDates.value.map(date => toModel(date)) as DatePickerModelValue)
    return
  }
  emit('update:modelValue', toModel(singleDate.value) as DatePickerModelValue)
}

const dragStart = ref<Date | null>(null)
const dragEnd = ref<Date | null>(null)
const isDragging = computed(() => dragStart.value !== null)

function cancelDrag() {
  dragStart.value = null
  dragEnd.value = null
}

function orderedDrag(): DateRangeValue<Date> {
  const a = dragStart.value
  const b = dragEnd.value ?? dragStart.value
  if (!a || !b) return { start: a, end: b }
  return a.getTime() <= b.getTime() ? { start: a, end: b } : { start: b, end: a }
}

function isRangeSpanValid(start: Date, end: Date): boolean {
  const span = Math.abs(diffInDays(start, end)) + 1
  if (props.minRangeSpan !== undefined && span < props.minRangeSpan) return false
  if (props.maxRangeSpan !== undefined && span > props.maxRangeSpan) return false
  return true
}

function timeSourceFor(kind: 'single' | 'start' | 'end'): Date | null {
  if (props.mode === 'date') return null
  if (kind === 'single') return singleDate.value ?? new Date()
  return (kind === 'start' ? rangeValue.value.start : rangeValue.value.end) ?? new Date()
}

function applyTime(date: Date, kind: 'single' | 'start' | 'end'): Date {
  const source = timeSourceFor(kind)
  return source ? withTimeOf(date, source) : new Date(date.getTime())
}

function selectSingle(date: Date) {
  if (props.allowClear && singleDate.value && isSameDay(singleDate.value, date)) {
    singleDate.value = null
  }
  else {
    singleDate.value = applyTime(date, 'single')
  }
  emitModel()
}

function selectMultiple(date: Date) {
  const index = multipleDates.value.findIndex(item => isSameDay(item, date))
  if (index >= 0) {
    if (!props.allowClear && multipleDates.value.length === 1) return
    multipleDates.value = multipleDates.value.filter((_, position) => position !== index)
  }
  else {
    multipleDates.value = [...multipleDates.value, applyTime(date, 'single')]
      .sort((a, b) => a.getTime() - b.getTime())
  }
  emitModel()
}

function selectRange(date: Date) {
  if (!isDragging.value) {
    dragStart.value = date
    dragEnd.value = date
    emit('drag', orderedDrag())
    return
  }
  const anchor = dragStart.value!
  const ordered = date.getTime() < anchor.getTime()
    ? { start: date, end: anchor }
    : { start: anchor, end: date }

  if (!isRangeSpanValid(ordered.start, ordered.end)) {
    dragStart.value = date
    dragEnd.value = date
    emit('drag', orderedDrag())
    return
  }

  rangeValue.value = {
    start: applyTime(ordered.start, 'start'),
    end: applyTime(ordered.end, 'end'),
  }
  cancelDrag()
  emitModel()
}

function onDayClick(day: CalendarDay, event: MouseEvent) {
  emit('dayclick', day, event)
  if (day.isDisabled) return
  if (isRange.value) selectRange(day.date)
  else if (isMultiple.value) selectMultiple(day.date)
  else selectSingle(day.date)

  if (!props.keepVisibleOnInput && popoverVisible.value && !isDragging.value) {
    hidePopover()
  }
}

function onDayMouseEnter(day: CalendarDay) {
  if (!isDragging.value || day.isDisabled) return
  dragEnd.value = day.date
  emit('drag', orderedDrag())
}

function onRootKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && isDragging.value) {
    cancelDrag()
    event.stopPropagation()
  }
}

const selectedDates = computed<CalendarAttribute['dates']>(() => {
  if (isRange.value) {
    const { start, end } = rangeValue.value
    return start || end ? [{ start, end }] : []
  }
  if (isMultiple.value) return multipleDates.value
  return singleDate.value ? [singleDate.value] : []
})

const pickerAttributes = computed<CalendarAttribute[]>(() => {
  const list: CalendarAttribute[] = [...(props.attributes ?? [])]

  const dates = selectedDates.value
  if (Array.isArray(dates) ? dates.length : dates) {
    list.push({
      key: 'nv-selection',
      order: 100,
      highlight: true,
      ...(props.selectAttribute ?? {}),
      dates,
    })
  }

  if (isDragging.value) {
    const drag = orderedDrag()
    list.push({
      key: 'nv-drag',
      order: 90,
      highlight: { start: { fillMode: 'solid' }, base: { fillMode: 'light' }, end: { fillMode: 'solid' } },
      ...(props.dragAttribute ?? {}),
      dates: [{ start: drag.start, end: drag.end }],
    })
  }

  return list
})

const timeAccuracy = computed(() => props.timeAccuracy ?? 2)

function updateSingleTime(next: Date) {
  singleDate.value = next
  emitModel()
}

function updateRangeTime(part: 'start' | 'end', next: Date) {
  rangeValue.value = { ...rangeValue.value, [part]: next }
  emitModel()
}

const timeModel = computed(() => singleDate.value)

const hasInputSlot = computed(() => Boolean(slots.default))
const popoverVisible = ref(false)

function showPopover() {
  if (!hasInputSlot.value || popoverVisible.value) return
  popoverVisible.value = true
  emit('popover-show')
  void nextTick(moveToSelection)
}

function hidePopover() {
  if (!popoverVisible.value) return
  popoverVisible.value = false
  cancelDrag()
  emit('popover-hide')
}

function togglePopover() {
  if (popoverVisible.value) hidePopover()
  else showPopover()
}

function firstSelectedDate(): Date | null {
  if (isRange.value) return rangeValue.value.start ?? rangeValue.value.end
  if (isMultiple.value) return multipleDates.value[0] ?? null
  return singleDate.value
}

function moveToSelection() {
  const date = firstSelectedDate()
  if (date) calendarRef.value?.moveToDate(date)
}

watch(popoverVisible, (visible) => {
  if (!visible) return
  void nextTick(moveToSelection)
})

function formatDate(date: Date | null): string {
  return date ? locale.value.format(date, displayMask.value) : ''
}

const inputValue = computed(() => {
  if (isRange.value) {
    return { start: formatDate(rangeValue.value.start), end: formatDate(rangeValue.value.end) }
  }
  if (isMultiple.value) return multipleDates.value.map(formatDate).join(', ')
  return formatDate(singleDate.value)
})

let inputTimer: ReturnType<typeof setTimeout> | null = null

onBeforeUnmount(() => {
  if (inputTimer) clearTimeout(inputTimer)
})

function commitInput(text: string, part: 'single' | 'start' | 'end') {
  if (!text.trim()) {
    if (part === 'single') singleDate.value = null
    else rangeValue.value = { ...rangeValue.value, [part]: null }
    emitModel()
    return
  }

  if (isMultiple.value) {
    const parsed = text.split(',')
      .map(chunk => locale.value.parse(chunk.trim(), inputMasks.value))
      .filter((date): date is Date => !!date)
    if (parsed.length) {
      multipleDates.value = parsed.sort((a, b) => a.getTime() - b.getTime())
      emitModel()
    }
    return
  }

  const parsed = locale.value.parse(text, inputMasks.value)
  if (!parsed) return
  if (part === 'single') singleDate.value = parsed
  else rangeValue.value = { ...rangeValue.value, [part]: parsed }
  emitModel()
  calendarRef.value?.moveToDate(parsed)
}

function scheduleInput(text: string, part: 'single' | 'start' | 'end') {
  if (inputTimer) clearTimeout(inputTimer)
  inputTimer = setTimeout(() => commitInput(text, part), Math.max(0, props.inputDebounce))
}

function buildInputEvents(part: 'single' | 'start' | 'end') {
  return {
    input: (event: Event) => {
      if (!props.updateOnInput) return
      scheduleInput((event.target as HTMLInputElement).value, part)
    },
    change: (event: Event) => {
      if (inputTimer) clearTimeout(inputTimer)
      commitInput((event.target as HTMLInputElement).value, part)
    },
    keydown: (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        if (inputTimer) clearTimeout(inputTimer)
        commitInput((event.target as HTMLInputElement).value, part)
        hidePopover()
      }
      if (event.key === 'Escape') hidePopover()
    },
    focus: () => showPopover(),
    click: () => showPopover(),
  }
}

const inputEvents = computed(() => (isRange.value
  ? { start: buildInputEvents('start'), end: buildInputEvents('end') }
  : buildInputEvents('single')))

const initialSelectionDate = firstSelectedDate()

const calendarBindings = computed(() => {
  const result: Record<string, unknown> = {}
  for (const key of Object.keys(calendarProps)) {
    const value = (props as Record<string, unknown>)[key]
    if (value !== undefined) result[key] = value
  }
  if (!props.page && !props.initialPage && !props.initialDate && initialSelectionDate) {
    result.initialDate = initialSelectionDate
  }
  result.attributes = pickerAttributes.value
  return result
})

watch(() => {
  const date = firstSelectedDate()
  return date ? date.getTime() : null
}, () => moveToSelection())

const forwardedSlots = computed(() => Object.keys(slots).filter(name => name !== 'default' && name !== 'footer'))

function onCalendarPage(page: PageAddress) {
  emit('update:page', page)
}

defineExpose({
  showPopover,
  hidePopover,
  togglePopover,
  moveToDate: (date: Date) => calendarRef.value?.moveToDate(date),
  calendar: calendarRef,
})
</script>

<template>
  <div
    v-if="hasInputSlot"
    ref="anchorRef"
    class="nv-date-picker-anchor"
    v-bind="$attrs"
  >
    <slot
      :input-value="inputValue"
      :input-events="inputEvents"
      :show-popover="showPopover"
      :hide-popover="hidePopover"
      :toggle-popover="togglePopover"
      :is-visible="popoverVisible"
    />

    <NvPopover
      v-model="popoverVisible"
      :anchor="anchorRef"
      :placement="popoverPlacementInput"
      :show-arrow="false"
      :content-class="['nv-date-picker-popover', themeClass]"
      :style="themeStyle"
      role="dialog"
      @hide="cancelDrag"
    >
      <div
        class="nv-date-picker"
        :class="themeClass"
        :style="themeStyle"
        @keydown="onRootKeydown"
      >
        <NvCalendar
          v-if="showsCalendar"
          ref="calendarRef"
          v-bind="calendarBindings"
          @dayclick="onDayClick"
          @daymouseenter="onDayMouseEnter"
          @update:page="onCalendarPage"
          @did-move="emit('did-move', $event)"
        >
          <template
            v-for="name in forwardedSlots"
            :key="name"
            #[name]="scope"
          >
            <slot
              :name="name"
              v-bind="scope ?? {}"
            />
          </template>
        </NvCalendar>

        <div
          v-if="showsTime"
          class="nv-time-panel"
        >
          <template v-if="isRange">
            <NvTimePicker
              :model-value="rangeValue.start"
              :locale="locale"
              :is24hr="is24hr"
              :accuracy="timeAccuracy"
              :rules="rules"
              :hide-header="hideTimeHeader"
              :disabled="!rangeValue.start"
              @update:model-value="updateRangeTime('start', $event)"
            />
            <NvTimePicker
              :model-value="rangeValue.end"
              :locale="locale"
              :is24hr="is24hr"
              :accuracy="timeAccuracy"
              :rules="rules"
              :hide-header="hideTimeHeader"
              :disabled="!rangeValue.end"
              @update:model-value="updateRangeTime('end', $event)"
            />
          </template>
          <NvTimePicker
            v-else
            :model-value="timeModel"
            :locale="locale"
            :is24hr="is24hr"
            :accuracy="timeAccuracy"
            :rules="rules"
            :hide-header="hideTimeHeader"
            @update:model-value="updateSingleTime"
          />
        </div>

        <div
          v-if="$slots.footer"
          class="nv-date-picker-footer"
        >
          <slot name="footer" />
        </div>
      </div>
    </NvPopover>
  </div>

  <div
    v-else
    class="nv-date-picker"
    :class="themeClass"
    :style="themeStyle"
    v-bind="$attrs"
    @keydown="onRootKeydown"
  >
    <NvCalendar
      v-if="showsCalendar"
      ref="calendarRef"
      v-bind="calendarBindings"
      @dayclick="onDayClick"
      @daymouseenter="onDayMouseEnter"
      @update:page="onCalendarPage"
      @did-move="emit('did-move', $event)"
    >
      <template
        v-for="name in forwardedSlots"
        :key="name"
        #[name]="scope"
      >
        <slot
          :name="name"
          v-bind="scope ?? {}"
        />
      </template>
    </NvCalendar>

    <div
      v-if="showsTime"
      class="nv-time-panel"
    >
      <template v-if="isRange">
        <NvTimePicker
          :model-value="rangeValue.start"
          :locale="locale"
          :is24hr="is24hr"
          :accuracy="timeAccuracy"
          :rules="rules"
          :hide-header="hideTimeHeader"
          :disabled="!rangeValue.start"
          @update:model-value="updateRangeTime('start', $event)"
        />
        <NvTimePicker
          :model-value="rangeValue.end"
          :locale="locale"
          :is24hr="is24hr"
          :accuracy="timeAccuracy"
          :rules="rules"
          :hide-header="hideTimeHeader"
          :disabled="!rangeValue.end"
          @update:model-value="updateRangeTime('end', $event)"
        />
      </template>
      <NvTimePicker
        v-else
        :model-value="timeModel"
        :locale="locale"
        :is24hr="is24hr"
        :accuracy="timeAccuracy"
        :rules="rules"
        :hide-header="hideTimeHeader"
        @update:model-value="updateSingleTime"
      />
    </div>

    <div
      v-if="$slots.footer"
      class="nv-date-picker-footer"
    >
      <slot name="footer" />
    </div>
  </div>
</template>
