<script setup lang="ts">
import { ref } from 'vue'
import source from './inputs.vue?raw'

provideDemoSource(source)

const { t, tc, calendarLocale } = useI18n()
const { theme } = useSiteTheme()
const { day } = useDemoMonth()

useHead({ title: () => t('demo.inputs.title') })

const basic = ref<Date | null>(day(12))
const withButton = ref<Date | null>(day(12))
const rangeInputs = ref({ start: day(3), end: day(8) })
const multiInput = ref<Date[]>([day(4), day(9)])
const dateTimeInput = ref(new Date())
const placed = ref<Date | null>(day(12))
const masked = ref<Date | null>(day(12))

const placement = ref('bottom-start')
const placements = [
  'bottom', 'bottom-start', 'bottom-end',
  'top', 'top-start', 'top-end',
  'right', 'right-start', 'right-end',
  'left', 'left-start', 'left-end',
]

const field = 'w-56 rounded-lg border border-line bg-surface px-3 py-2 text-sm text-ink'
</script>

<template>
  <div>
    <h1 class="text-2xl font-semibold">
      {{ t('demo.inputs.title') }}
    </h1>
    <p class="mt-2 max-w-2xl text-ink-muted">
      {{ t('demo.inputs.lead') }}
    </p>

    <div class="mt-8 grid gap-5 lg:grid-cols-2">
      <DemoCard
        id="plain"
        v-bind="tc('demo.inputs.cards.plain')"
      >
        <NvDatePicker
          v-model="basic"
          v-bind="theme"
          :locale="calendarLocale"
        >
          <template #default="{ inputValue, inputEvents }">
            <input
              :class="field"
              :value="inputValue"
              v-on="inputEvents"
            >
          </template>
        </NvDatePicker>
        <template #value>
          {{ basic }}
        </template>
      </DemoCard>

      <DemoCard
        id="button"
        v-bind="tc('demo.inputs.cards.button')"
        tag="togglePopover · isVisible"
      >
        <NvDatePicker
          v-model="withButton"
          v-bind="theme"
          :locale="calendarLocale"
        >
          <template #default="{ inputValue, inputEvents, togglePopover, isVisible }">
            <div class="flex items-center gap-2">
              <input
                :class="field"
                :value="inputValue"
                v-on="inputEvents"
              >
              <button
                type="button"
                class="rounded-lg border border-line px-3 py-2 text-sm transition-colors"
                :class="isVisible ? 'bg-brand-soft text-brand-ink' : 'bg-surface text-ink-muted hover:text-ink'"
                :aria-label="t('demo.inputs.cards.button.title')"
                :aria-expanded="isVisible"
                @click="togglePopover"
              >
                <svg
                  viewBox="0 0 24 24"
                  class="size-4"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.75"
                  aria-hidden="true"
                >
                  <rect
                    x="3"
                    y="5"
                    width="18"
                    height="16"
                    rx="3"
                  />
                  <path d="M3 10h18M8 3v4M16 3v4" />
                </svg>
              </button>
            </div>
          </template>
        </NvDatePicker>
        <template #value>
          {{ withButton }}
        </template>
      </DemoCard>

      <DemoCard
        id="range"
        v-bind="tc('demo.inputs.cards.range')"
      >
        <NvDatePicker
          v-model="rangeInputs"
          v-bind="theme"
          :locale="calendarLocale"
          selection="range"
          :columns="2"
        >
          <template #default="{ inputValue, inputEvents }">
            <div class="flex items-center gap-2">
              <input
                class="w-36 rounded-lg border border-line bg-surface px-3 py-2 text-sm text-ink"
                :value="inputValue.start"
                v-on="inputEvents.start"
              >
              <span class="text-ink-faint">–</span>
              <input
                class="w-36 rounded-lg border border-line bg-surface px-3 py-2 text-sm text-ink"
                :value="inputValue.end"
                v-on="inputEvents.end"
              >
            </div>
          </template>
        </NvDatePicker>
        <template #value>
          {{ rangeInputs }}
        </template>
      </DemoCard>

      <DemoCard
        id="multiple"
        v-bind="tc('demo.inputs.cards.multiple')"
      >
        <NvDatePicker
          v-model="multiInput"
          v-bind="theme"
          :locale="calendarLocale"
          selection="multiple"
        >
          <template #default="{ inputValue, inputEvents }">
            <input
              :class="field"
              :value="inputValue"
              v-on="inputEvents"
            >
          </template>
        </NvDatePicker>
        <template #value>
          {{ multiInput.length }}
        </template>
      </DemoCard>

      <DemoCard
        id="dateTime"
        v-bind="tc('demo.inputs.cards.dateTime')"
        tag="mode=&quot;dateTime&quot;"
      >
        <NvDatePicker
          v-model="dateTimeInput"
          v-bind="theme"
          :locale="calendarLocale"
          mode="dateTime"
        >
          <template #default="{ inputValue, inputEvents }">
            <input
              :class="field"
              :value="inputValue"
              v-on="inputEvents"
            >
          </template>
        </NvDatePicker>
        <template #value>
          {{ dateTimeInput }}
        </template>
      </DemoCard>

      <DemoCard
        id="placement"
        v-bind="tc('demo.inputs.cards.placement')"
        tag="popover-placement-input"
      >
        <label class="flex w-full items-center gap-2 text-sm text-ink-muted">
          <span>{{ t('demo.controls.placement') }}</span>
          <select
            v-model="placement"
            class="rounded-lg border border-line bg-surface px-2 py-1 text-sm text-ink"
          >
            <option
              v-for="item in placements"
              :key="item"
              :value="item"
            >
              {{ item }}
            </option>
          </select>
        </label>

        <NvDatePicker
          v-model="placed"
          v-bind="theme"
          :locale="calendarLocale"
          :popover-placement-input="placement"
        >
          <template #default="{ inputValue, inputEvents }">
            <input
              :class="field"
              :value="inputValue"
              v-on="inputEvents"
            >
          </template>
        </NvDatePicker>
      </DemoCard>

      <DemoCard
        id="mask"
        v-bind="tc('demo.inputs.cards.mask')"
        tag="masks.input"
      >
        <NvDatePicker
          v-model="masked"
          v-bind="theme"
          :locale="calendarLocale"
          :masks="{ input: ['D MMMM YYYY', 'D MMM YYYY', 'YYYY-MM-DD'] }"
        >
          <template #default="{ inputValue, inputEvents }">
            <input
              :class="field"
              :value="inputValue"
              v-on="inputEvents"
            >
          </template>
        </NvDatePicker>
        <template #value>
          {{ masked }}
        </template>
      </DemoCard>
    </div>
  </div>
</template>
