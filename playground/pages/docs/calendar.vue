<script setup lang="ts">
import { CALENDAR_BOUNDS, CALENDAR_PAGE, CALENDAR_PANES } from '../../utils/snippets'

const { t, calendarLocale } = useI18n()
const { theme } = useSiteTheme()
const { day } = useDemoMonth()

useHead({ title: () => t('docs.calendar.title') })

const keys = [
  { keys: '← →', en: 'Previous / next day', ru: 'Предыдущий / следующий день' },
  { keys: '↑ ↓', en: 'Previous / next week', ru: 'Предыдущая / следующая неделя' },
  { keys: 'Home End', en: 'First / last day of the week', ru: 'Первый / последний день недели' },
  { keys: 'PageUp PageDown', en: 'Previous / next month', ru: 'Предыдущий / следующий месяц' },
  { keys: 'Shift + PageUp/Down', en: 'Previous / next year', ru: 'Предыдущий / следующий год' },
  { keys: 'Enter Space', en: 'Select the focused day', ru: 'Выбрать день в фокусе' },
  { keys: 'Esc', en: 'Close a popover, cancel a range drag', ru: 'Закрыть панель, отменить протягивание' },
]

const { locale } = useI18n()
</script>

<template>
  <article class="prose">
    <h1 class="text-3xl font-semibold">
      {{ t('docs.calendar.title') }}
    </h1>
    <p class="text-lg">
      {{ t('docs.calendar.lead') }}
    </p>

    <h2 id="panes">
      {{ t('docs.calendar.panesTitle') }}
    </h2>
    <p>{{ t('docs.calendar.panesText') }}</p>
    <CodeBlock :code="CALENDAR_PANES" />
    <div class="not-prose flex justify-center rounded-card border border-line bg-surface-2 p-4">
      <NvCalendar
        v-bind="theme"
        :locale="calendarLocale"
        :columns="2"
        :step="1"
        trim-weeks
      />
    </div>

    <h2 id="month">
      {{ t('docs.calendar.pageTitle') }}
    </h2>
    <p>{{ t('docs.calendar.pageText') }}</p>
    <CodeBlock :code="CALENDAR_PAGE" />

    <h2 id="bounds">
      {{ t('docs.calendar.boundsTitle') }}
    </h2>
    <p>{{ t('docs.calendar.boundsText') }}</p>
    <CodeBlock :code="CALENDAR_BOUNDS" />
    <div class="not-prose flex justify-center rounded-card border border-line bg-surface-2 p-4">
      <NvCalendar
        v-bind="theme"
        :locale="calendarLocale"
        :min-date="day(5)"
        :max-date="day(24)"
        :disabled-dates="{ repeat: { weekdays: [0, 6] } }"
      />
    </div>

    <h2 id="keyboard">
      {{ t('docs.calendar.keyboardTitle') }}
    </h2>
    <p>{{ t('docs.calendar.keyboardText') }}</p>
    <div class="not-prose overflow-x-auto rounded-card border border-line">
      <table class="w-full text-sm">
        <tbody>
          <tr
            v-for="row in keys"
            :key="row.keys"
            class="border-b border-line last:border-0"
          >
            <td class="w-56 px-3 py-2 align-top">
              <kbd class="rounded-md bg-surface-3 px-1.5 py-0.5 font-mono text-xs">{{ row.keys }}</kbd>
            </td>
            <td class="px-3 py-2 text-ink-muted">
              {{ locale === 'ru' ? row.ru : row.en }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </article>
</template>
