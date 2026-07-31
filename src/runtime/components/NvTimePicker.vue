<script setup lang="ts">
import { computed } from 'vue'
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

const hourOptions = computed(() => {
  if (use24hr.value) {
    return hourValues.value.map(hour => ({ value: hour, label: String(hour).padStart(2, '0') }))
  }
  const inHalf = hourValues.value.filter(hour => (meridiem.value === 'am' ? hour < 12 : hour >= 12))
  return inHalf.map(hour => ({ value: hour, label: String(hour % 12 === 0 ? 12 : hour % 12) }))
})

const minuteOptions = computed(() =>
  minuteValues.value.map(minute => ({ value: minute, label: String(minute).padStart(2, '0') })))

const secondOptions = computed(() =>
  secondValues.value.map(second => ({ value: second, label: String(second).padStart(2, '0') })))

const canSwitchMeridiem = computed(() =>
  !use24hr.value && hourValues.value.some(hour => (meridiem.value === 'am' ? hour >= 12 : hour < 12)))

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

function onSelect(part: 'hours' | 'minutes' | 'seconds', event: Event) {
  const amount = Number((event.target as HTMLSelectElement).value)
  commit(withPart(part, amount))
}

function onMeridiem(event: Event) {
  const next = (event.target as HTMLSelectElement).value
  const hours = value.value.getHours()
  if (next === 'am' && hours >= 12) commit(withPart('hours', hours - 12))
  if (next === 'pm' && hours < 12) commit(withPart('hours', hours + 12))
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

    <div class="nv-time-fields">
      <label class="nv-time-field">
        <span class="nv-sr-only">Hours</span>
        <select
          class="nv-select"
          :disabled="disabled"
          :value="value.getHours()"
          @change="onSelect('hours', $event)"
        >
          <option
            v-for="option in hourOptions"
            :key="option.value"
            :value="option.value"
          >
            {{ option.label }}
          </option>
        </select>
      </label>

      <template v-if="accuracy >= 2">
        <span class="nv-time-separator">:</span>
        <label class="nv-time-field">
          <span class="nv-sr-only">Minutes</span>
          <select
            class="nv-select"
            :disabled="disabled"
            :value="value.getMinutes()"
            @change="onSelect('minutes', $event)"
          >
            <option
              v-for="option in minuteOptions"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </option>
          </select>
        </label>
      </template>

      <template v-if="accuracy >= 3">
        <span class="nv-time-separator">:</span>
        <label class="nv-time-field">
          <span class="nv-sr-only">Seconds</span>
          <select
            class="nv-select"
            :disabled="disabled"
            :value="value.getSeconds()"
            @change="onSelect('seconds', $event)"
          >
            <option
              v-for="option in secondOptions"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </option>
          </select>
        </label>
      </template>

      <label
        v-if="!use24hr"
        class="nv-time-field nv-time-field--meridiem"
      >
        <span class="nv-sr-only">AM/PM</span>
        <select
          class="nv-select"
          :disabled="disabled || !canSwitchMeridiem"
          :value="meridiem"
          @change="onMeridiem"
        >
          <option value="am">
            AM
          </option>
          <option value="pm">
            PM
          </option>
        </select>
      </label>
    </div>
  </div>
</template>
