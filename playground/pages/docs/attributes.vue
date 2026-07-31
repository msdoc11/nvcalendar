<script setup lang="ts">
import { computed } from 'vue'

const { t, calendarLocale, locale } = useI18n()
const { theme } = useSiteTheme()
const { day } = useDemoMonth()

useHead({ title: () => t('docs.attributes.title') })

const demo = computed(() => [
  {
    key: 'vacation',
    highlight: { color: 'teal', fillMode: 'light' },
    dates: { start: day(6), end: day(13) },
    popover: { label: 'Vacation' },
  },
  { key: 'standup', dot: 'emerald', dates: { repeat: { weekdays: [1, 3, 5] } }, popover: { label: 'Standup' } },
  { key: 'payday', bar: 'orange', dates: { repeat: { days: -1 } }, popover: { label: 'Payday' } },
])

const datesCode = `// one day
{ dates: '2026-07-15' }

{ dates: { start: '2026-07-06', end: '2026-07-13' } }

{ dates: { start: '2026-07-06', span: 5 } }

{ dates: { repeat: { weekdays: [1, 3, 5] } } }

{ dates: ['2026-07-01', { start: '2026-07-06', end: '2026-07-13' }] }`

const repeatCode = `// every weekday
{ repeat: { weekdays: [1, 2, 3, 4, 5] } }

{ repeat: { days: [1, -1] } }

{ repeat: { ordinalWeekdays: { 2: 4 } } }

{ repeat: { every: 'day', interval: 3, from: '2026-07-01', until: '2026-07-31' } }`

const decorationCode = `// the calendar accent
{ highlight: true }

{ highlight: 'pink', dot: '#22c55e', bar: 'var(--brand)' }

{ highlight: { color: 'teal', fillMode: 'light', contentClass: 'font-bold' } }

{
  highlight: {
    start: { color: 'green', fillMode: 'solid' },
    base: { color: 'green', fillMode: 'light' },
    end: { color: 'red', fillMode: 'solid' },
  },
}`

const popoverCode = `// a label is enough
{ popover: 'Sprint 42' }

{ popover: { label: 'Sprint 42', visibility: 'click', hideIndicator: true } }`

const repeatRows = [
  { field: 'every', type: `'day' | 'week' | 'month' | 'year'`, en: 'Base unit of the recurrence', ru: 'Базовая единица повтора' },
  { field: 'interval', type: 'number', en: 'Repeat once every N units', ru: 'Повторять раз в N единиц' },
  { field: 'weekdays', type: '0–6 or an array', en: '0 is Sunday', ru: '0 — воскресенье' },
  { field: 'days', type: 'number or an array', en: 'Day of month; negative counts from the end', ru: 'Число месяца; отрицательное считается с конца' },
  { field: 'weeks', type: 'number or an array', en: 'Week of month; negative counts from the end', ru: 'Неделя месяца; отрицательная считается с конца' },
  { field: 'months', type: '1–12 or an array', en: 'Month of year', ru: 'Месяц года' },
  { field: 'years', type: 'number or an array', en: 'Year', ru: 'Год' },
  { field: 'ordinalWeekdays', type: '{ ordinal: weekday }', en: '{ 1: 1 } is the first Monday', ru: '{ 1: 1 } — первый понедельник' },
  { field: 'from / until', type: 'date', en: 'Bounds of the recurrence', ru: 'Границы повтора' },
]
</script>

<template>
  <article class="prose">
    <h1 class="text-3xl font-semibold">
      {{ t('docs.attributes.title') }}
    </h1>
    <p class="text-lg">
      {{ t('docs.attributes.lead') }}
    </p>

    <div class="not-prose flex justify-center rounded-card border border-line bg-surface-2 p-4">
      <NvCalendar
        v-bind="theme"
        :locale="calendarLocale"
        :attributes="demo"
      />
    </div>

    <h2 id="dates">
      {{ t('docs.attributes.datesTitle') }}
    </h2>
    <p>{{ t('docs.attributes.datesText') }}</p>
    <CodeBlock
      :code="datesCode"
      lang="javascript"
    />

    <h2 id="repeat">
      {{ t('docs.attributes.repeatTitle') }}
    </h2>
    <p>{{ t('docs.attributes.repeatText') }}</p>
    <CodeBlock
      :code="repeatCode"
      lang="javascript"
    />
    <div class="not-prose overflow-x-auto rounded-card border border-line">
      <table class="w-full text-sm">
        <tbody>
          <tr
            v-for="row in repeatRows"
            :key="row.field"
            class="border-b border-line last:border-0"
          >
            <td class="px-3 py-2 align-top">
              <code class="font-mono text-xs">{{ row.field }}</code>
            </td>
            <td class="px-3 py-2 align-top font-mono text-xs text-ink-muted">
              {{ row.type }}
            </td>
            <td class="px-3 py-2 text-ink-muted">
              {{ locale === 'ru' ? row.ru : row.en }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <h2 id="decorations">
      {{ t('docs.attributes.decorationsTitle') }}
    </h2>
    <p>{{ t('docs.attributes.decorationsText') }}</p>
    <CodeBlock
      :code="decorationCode"
      lang="javascript"
    />

    <h2 id="popovers">
      {{ t('docs.attributes.popoverTitle') }}
    </h2>
    <p>{{ t('docs.attributes.popoverText') }}</p>
    <CodeBlock
      :code="popoverCode"
      lang="javascript"
    />
  </article>
</template>
