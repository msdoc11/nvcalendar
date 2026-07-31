<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { CalendarLocale } from '../utils/locale'
import type { PageAddress, Placement } from '../types'
import { canMoveToPage } from '../utils/page'
import NvPopover from './NvPopover.vue'

defineOptions({ name: 'NvCalendarNav' })

const props = withDefaults(defineProps<{
  modelValue?: boolean
  anchor?: HTMLElement | null
  page: PageAddress
  locale: CalendarLocale
  minDate?: Date | null
  maxDate?: Date | null
  placement?: Placement
  themeClass?: unknown
  themeStyle?: Record<string, string> | undefined
}>(), {
  modelValue: false,
  anchor: null,
  minDate: null,
  maxDate: null,
  placement: 'bottom',
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'select': [page: PageAddress]
}>()

const view = ref<'month' | 'year'>('month')
const yearCursor = ref(props.page.year)
const direction = ref<'next' | 'prev' | 'none'>('none')

watch(() => props.modelValue, (visible) => {
  if (visible) {
    view.value = 'month'
    yearCursor.value = props.page.year
    direction.value = 'none'
  }
})

const transitionName = computed(() =>
  (direction.value === 'none' ? 'nv-fade' : `nv-slide-h-${direction.value}`))

const months = computed(() => Array.from({ length: 12 }, (_, index) => {
  const month = index + 1
  const address: PageAddress = { month, year: yearCursor.value }
  return {
    month,
    label: props.locale.format(new Date(yearCursor.value, index, 1), props.locale.masks.navMonths),
    isActive: props.page.month === month && props.page.year === yearCursor.value,
    isDisabled: !canMoveToPage(address, props.minDate, props.maxDate),
  }
}))

const years = computed(() => {
  const start = Math.floor(yearCursor.value / 12) * 12
  return Array.from({ length: 12 }, (_, index) => {
    const year = start + index
    const isDisabled = (props.minDate ? year < props.minDate.getFullYear() : false)
      || (props.maxDate ? year > props.maxDate.getFullYear() : false)
    return { year, label: String(year), isActive: year === props.page.year, isDisabled }
  })
})

const title = computed(() => (view.value === 'month'
  ? String(yearCursor.value)
  : `${years.value[0]?.label} – ${years.value[years.value.length - 1]?.label}`))

const canPrev = computed(() => (view.value === 'month'
  ? !props.minDate || yearCursor.value - 1 >= props.minDate.getFullYear()
  : !props.minDate || (years.value[0]?.year ?? 0) - 1 >= props.minDate.getFullYear()))

const canNext = computed(() => (view.value === 'month'
  ? !props.maxDate || yearCursor.value + 1 <= props.maxDate.getFullYear()
  : !props.maxDate || (years.value[11]?.year ?? 0) + 1 <= props.maxDate.getFullYear()))

const items = computed(() => (view.value === 'month'
  ? months.value.map(item => ({ ...item, id: `m${item.month}`, value: item.month }))
  : years.value.map(item => ({ ...item, id: `y${item.year}`, value: item.year }))))

const gridKey = computed(() => `${view.value}-${yearCursor.value}`)

function movePrev() {
  direction.value = 'prev'
  yearCursor.value -= view.value === 'month' ? 1 : 12
}

function moveNext() {
  direction.value = 'next'
  yearCursor.value += view.value === 'month' ? 1 : 12
}

function toggleView() {
  direction.value = 'none'
  view.value = view.value === 'month' ? 'year' : 'month'
}

function select(value: number) {
  if (view.value === 'year') {
    direction.value = 'none'
    yearCursor.value = value
    view.value = 'month'
    return
  }
  emit('select', { month: value, year: yearCursor.value })
  emit('update:modelValue', false)
}
</script>

<template>
  <NvPopover
    :model-value="modelValue"
    :anchor="anchor"
    :placement="placement"
    :content-class="['nv-nav-popover', themeClass]"
    :style="themeStyle"
    role="dialog"
    aria-label="Choose month and year"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <div class="nv-nav">
      <div class="nv-nav-header">
        <button
          type="button"
          class="nv-arrow"
          :disabled="!canPrev"
          aria-label="Previous"
          @click="movePrev"
        >
          <svg
            viewBox="0 0 24 24"
            class="nv-icon"
            aria-hidden="true"
          ><path
            d="M15 5 8 12l7 7"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          /></svg>
        </button>
        <button
          type="button"
          class="nv-nav-title"
          @click="toggleView"
        >
          {{ title }}
        </button>
        <button
          type="button"
          class="nv-arrow"
          :disabled="!canNext"
          aria-label="Next"
          @click="moveNext"
        >
          <svg
            viewBox="0 0 24 24"
            class="nv-icon"
            aria-hidden="true"
          ><path
            d="m9 5 7 7-7 7"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          /></svg>
        </button>
      </div>

      <div class="nv-nav-body">
        <Transition :name="transitionName">
          <div
            :key="gridKey"
            class="nv-nav-grid"
          >
            <button
              v-for="item in items"
              :key="item.id"
              type="button"
              class="nv-nav-item"
              :class="{ 'nv-nav-item--active': item.isActive }"
              :disabled="item.isDisabled"
              @click="select(item.value)"
            >
              {{ item.label }}
            </button>
          </div>
        </Transition>
      </div>
    </div>
  </NvPopover>
</template>
