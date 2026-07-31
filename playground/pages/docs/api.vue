<script setup lang="ts">
const { t } = useI18n()

useHead({ title: () => t('docs.api.title') })

const calendarProps = useCalendarPropsDocs()
const pickerProps = usePickerPropsDocs()

const events = [
  ['update:page', '{ month, year }'],
  ['did-move', '{ month, year }[]'],
  ['dayclick', '(day: CalendarDay, event: MouseEvent)'],
  ['daymouseenter / daymouseleave', '(day: CalendarDay, event: MouseEvent)'],
  ['dayfocusin / dayfocusout', '(day: CalendarDay, event: FocusEvent)'],
  ['daykeydown', '(day: CalendarDay, event: KeyboardEvent)'],
  ['weeknumberclick', '(week: number, days: CalendarDay[])'],
  ['update:modelValue', 'Date | Date[] | { start, end } | string | number | null'],
  ['drag', '{ start: Date | null, end: Date | null }'],
  ['popover-show / popover-hide', '—'],
]

const slots = [
  ['header-title', '{ page, title }'],
  ['header-prev-button / header-next-button', '{ move, disabled }'],
  ['weekday', '{ weekday }'],
  ['weeknumber', '{ week }'],
  ['day-content', '{ day, attributes }'],
  ['day-popover', '{ day, attributes, title, hide }'],
  ['footer', '—'],
  ['default (picker only)', '{ inputValue, inputEvents, showPopover, hidePopover, togglePopover, isVisible }'],
]

const methods = [
  ['movePrev()', 'boolean'],
  ['moveNext()', 'boolean'],
  ['moveBy(months: number)', 'boolean'],
  ['moveToPage({ month, year })', 'boolean'],
  ['moveToDate(date: Date)', 'boolean'],
  ['focusDay(date: Date)', 'Promise<void>'],
  ['showPopover() / hidePopover() / togglePopover()', 'void'],
]
</script>

<template>
  <article class="prose">
    <h1 class="text-3xl font-semibold">
      {{ t('docs.api.title') }}
    </h1>
    <p class="text-lg">
      {{ t('docs.api.lead') }}
    </p>

    <h2 id="calendar-props">
      {{ t('docs.api.calendarProps') }}
    </h2>
    <div class="not-prose">
      <PropsTable :rows="calendarProps" />
    </div>

    <h2 id="picker-props">
      {{ t('docs.api.pickerProps') }}
    </h2>
    <p>{{ t('docs.api.pickerNote') }}</p>
    <div class="not-prose">
      <PropsTable :rows="pickerProps" />
    </div>

    <h2 id="events">
      {{ t('docs.api.events') }}
    </h2>
    <div class="not-prose overflow-x-auto rounded-card border border-line">
      <table class="w-full text-sm">
        <thead>
          <tr class="bg-surface-2">
            <th class="px-3 py-2 text-start font-semibold">
              {{ t('docs.api.columns.event') }}
            </th>
            <th class="px-3 py-2 text-start font-semibold">
              {{ t('docs.api.columns.payload') }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="[name, payload] in events"
            :key="name"
            class="border-t border-line"
          >
            <td class="whitespace-nowrap px-3 py-2">
              <code class="font-mono text-xs text-ink">{{ name }}</code>
            </td>
            <td class="px-3 py-2">
              <code class="font-mono text-xs text-ink-muted">{{ payload }}</code>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <h2 id="slots">
      {{ t('docs.api.slots') }}
    </h2>
    <div class="not-prose overflow-x-auto rounded-card border border-line">
      <table class="w-full text-sm">
        <thead>
          <tr class="bg-surface-2">
            <th class="px-3 py-2 text-start font-semibold">
              {{ t('docs.api.columns.slot') }}
            </th>
            <th class="px-3 py-2 text-start font-semibold">
              {{ t('docs.api.columns.scope') }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="[name, scope] in slots"
            :key="name"
            class="border-t border-line"
          >
            <td class="whitespace-nowrap px-3 py-2">
              <code class="font-mono text-xs text-ink">{{ name }}</code>
            </td>
            <td class="px-3 py-2">
              <code class="font-mono text-xs text-ink-muted">{{ scope }}</code>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <h2 id="methods">
      {{ t('docs.api.methods') }}
    </h2>
    <div class="not-prose overflow-x-auto rounded-card border border-line">
      <table class="w-full text-sm">
        <thead>
          <tr class="bg-surface-2">
            <th class="px-3 py-2 text-start font-semibold">
              {{ t('docs.api.columns.method') }}
            </th>
            <th class="px-3 py-2 text-start font-semibold">
              {{ t('docs.api.columns.signature') }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="[name, signature] in methods"
            :key="name"
            class="border-t border-line"
          >
            <td class="whitespace-nowrap px-3 py-2">
              <code class="font-mono text-xs text-ink">{{ name }}</code>
            </td>
            <td class="px-3 py-2">
              <code class="font-mono text-xs text-ink-muted">{{ signature }}</code>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </article>
</template>
