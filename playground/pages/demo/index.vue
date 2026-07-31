<script setup lang="ts">
import { ref } from 'vue'
import source from './index.vue?raw'

provideDemoSource(source)

const { t, tc, calendarLocale } = useI18n()
const { theme } = useSiteTheme()
const { day, year, month } = useDemoMonth()

useHead({ title: () => t('demo.calendar.title') })

const rows = ref(1)
const columns = ref(2)
const step = ref(1)
const page = ref({ month: month + 1, year })
const trimWeeks = ref(true)
const weeknumbers = ref<'none' | 'left' | 'right'>('left')
const firstDay = ref(1)
</script>

<template>
  <div>
    <h1 class="text-2xl font-semibold">
      {{ t('demo.calendar.title') }}
    </h1>
    <p class="mt-2 max-w-2xl text-ink-muted">
      {{ t('demo.calendar.lead') }}
    </p>

    <div class="mt-8 grid gap-5 lg:grid-cols-2">
      <DemoCard
        id="panes"
        v-bind="tc('demo.calendar.cards.panes')"
      >
        <div class="flex w-full flex-wrap gap-4">
          <label class="flex items-center gap-2 text-sm text-ink-muted">
            <span>{{ t('demo.controls.rows') }}</span>
            <input
              v-model.number="rows"
              type="number"
              min="1"
              max="3"
              class="w-16 rounded-lg border border-line bg-surface px-2 py-1 text-sm text-ink"
            >
          </label>
          <label class="flex items-center gap-2 text-sm text-ink-muted">
            <span>{{ t('demo.controls.columns') }}</span>
            <input
              v-model.number="columns"
              type="number"
              min="1"
              max="3"
              class="w-16 rounded-lg border border-line bg-surface px-2 py-1 text-sm text-ink"
            >
          </label>
          <label class="flex items-center gap-2 text-sm text-ink-muted">
            <span>{{ t('demo.controls.step') }}</span>
            <input
              v-model.number="step"
              type="number"
              min="1"
              max="6"
              class="w-16 rounded-lg border border-line bg-surface px-2 py-1 text-sm text-ink"
            >
          </label>
        </div>

        <NvCalendar
          v-bind="theme"
          :locale="calendarLocale"
          :rows="rows"
          :columns="columns"
          :step="step"
          trim-weeks
        />
      </DemoCard>

      <DemoCard
        id="page"
        v-bind="tc('demo.calendar.cards.page')"
        tag="v-model:page"
      >
        <NvCalendar
          v-model:page="page"
          v-bind="theme"
          :locale="calendarLocale"
        />
        <template #value>
          {{ page }}
        </template>
      </DemoCard>

      <DemoCard
        id="grid"
        v-bind="tc('demo.calendar.cards.grid')"
      >
        <div class="flex w-full flex-wrap gap-4">
          <label class="flex items-center gap-2 text-sm text-ink-muted">
            <input
              v-model="trimWeeks"
              type="checkbox"
              class="size-4"
            >
            <span>{{ t('demo.controls.trimWeeks') }}</span>
          </label>
          <label class="flex items-center gap-2 text-sm text-ink-muted">
            <span>{{ t('demo.controls.weeknumbers') }}</span>
            <select
              v-model="weeknumbers"
              class="rounded-lg border border-line bg-surface px-2 py-1 text-sm text-ink"
            >
              <option value="none">
                {{ t('demo.controls.none') }}
              </option>
              <option value="left">
                {{ t('demo.controls.left') }}
              </option>
              <option value="right">
                {{ t('demo.controls.right') }}
              </option>
            </select>
          </label>
        </div>

        <NvCalendar
          v-bind="theme"
          :locale="calendarLocale"
          :trim-weeks="trimWeeks"
          :show-iso-weeknumbers="weeknumbers === 'none' ? false : weeknumbers"
        />
      </DemoCard>

      <DemoCard
        id="firstDay"
        v-bind="tc('demo.calendar.cards.firstDay')"
        tag="first-day-of-week"
      >
        <label class="flex w-full items-center gap-2 text-sm text-ink-muted">
          <span>{{ t('demo.controls.firstDay') }}</span>
          <select
            v-model.number="firstDay"
            class="rounded-lg border border-line bg-surface px-2 py-1 text-sm text-ink"
          >
            <option :value="0">
              0
            </option>
            <option :value="1">
              1
            </option>
            <option :value="6">
              6
            </option>
          </select>
        </label>

        <NvCalendar
          v-bind="theme"
          :locale="calendarLocale"
          :first-day-of-week="firstDay"
          trim-weeks
        />
      </DemoCard>

      <DemoCard
        id="chrome"
        v-bind="tc('demo.calendar.cards.chrome')"
        tag="borderless · hide-arrows · hide-weekdays"
      >
        <NvCalendar
          v-bind="theme"
          :locale="calendarLocale"
          borderless
          transparent
          hide-arrows
          hide-weekdays
          trim-weeks
        />
      </DemoCard>

      <DemoCard
        id="transitions"
        v-bind="tc('demo.calendar.cards.transitions')"
        tag="transition"
      >
        <NvCalendar
          v-bind="theme"
          :locale="calendarLocale"
          transition="slide-v"
          trim-weeks
        />
      </DemoCard>

      <DemoCard
        id="bounds"
        v-bind="tc('demo.calendar.cards.bounds')"
        tag="min-date · max-date"
      >
        <NvCalendar
          v-bind="theme"
          :locale="calendarLocale"
          :min-date="day(5)"
          :max-date="day(24)"
        />
      </DemoCard>

      <DemoCard
        id="disabled"
        v-bind="tc('demo.calendar.cards.disabled')"
        tag="disabled-dates"
      >
        <NvCalendar
          v-bind="theme"
          :locale="calendarLocale"
          :disabled-dates="[{ repeat: { weekdays: [0, 6] } }, { start: day(10), end: day(14) }]"
        />
      </DemoCard>
    </div>
  </div>
</template>
