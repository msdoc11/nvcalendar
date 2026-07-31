<script setup lang="ts">
import source from './attributes.vue?raw'

provideDemoSource(source)

const { t, tc, calendarLocale } = useI18n()
const { theme } = useSiteTheme()
const { day } = useDemoMonth()

useHead({ title: () => t('demo.attributes.title') })

const fillModes = [
  { key: 'solid', dates: day(4), highlight: { fillMode: 'solid' } },
  { key: 'light', dates: day(11), highlight: { fillMode: 'light' } },
  { key: 'outline', dates: day(18), highlight: { fillMode: 'outline' } },
  { key: 'colored', dates: day(25), highlight: { color: 'pink', fillMode: 'solid' } },
]

const segmented = [{
  key: 'segmented',
  dates: { start: day(7), end: day(17) },
  highlight: {
    start: { color: 'green', fillMode: 'solid' },
    base: { color: 'green', fillMode: 'light' },
    end: { color: 'red', fillMode: 'solid' },
  },
}]

const dotsAndBars = [
  { key: 'd1', dates: day(6), dot: true },
  { key: 'd2', dates: day(7), dot: 'red' },
  { key: 'd3', dates: day(7), dot: 'green' },
  { key: 'd4', dates: day(7), dot: 'orange' },
  { key: 'b1', dates: day(13), bar: true },
  { key: 'b2', dates: day(14), bar: 'purple' },
  { key: 'r', dates: { start: day(20), end: day(23) }, bar: 'amber' },
]

const repeats = [
  { key: 'weekdays', dot: 'blue', dates: { repeat: { weekdays: [1, 2, 3, 4, 5] } }, popover: 'Weekdays' },
  { key: 'first', highlight: { color: 'green', fillMode: 'outline' }, dates: { repeat: { days: 1 } }, popover: 'First of month' },
  { key: 'last', bar: 'red', dates: { repeat: { days: -1 } }, popover: 'Last of month' },
  { key: 'ordinal', dot: 'purple', dates: { repeat: { ordinalWeekdays: { 2: 4 } } }, popover: 'Second Thursday' },
  { key: 'every3', dot: 'orange', dates: { repeat: { every: 'day', interval: 3, from: day(1) } }, popover: 'Every third day' },
]

const excluded = [{
  key: 'workdays',
  highlight: { color: 'teal', fillMode: 'light' },
  dates: { start: day(1), end: day(28) },
  excludeDates: { repeat: { weekdays: [0, 6] } },
  popover: 'Working days only',
}]

const popovers = [
  { key: 'hover', dot: 'blue', dates: day(5), popover: { label: 'Opens on hover' } },
  { key: 'click', dot: 'green', dates: day(12), popover: { label: 'Opens on click', visibility: 'click' } },
  { key: 'focus', dot: 'orange', dates: day(19), popover: { label: 'Opens on focus', visibility: 'focus' } },
  { key: 'multiA', dot: 'red', dates: day(26), popover: { label: 'First entry' } },
  { key: 'multiB', bar: 'purple', dates: day(26), popover: { label: 'Second entry' } },
]

const custom = [
  {
    key: 'classy',
    dates: { start: day(9), end: day(12) },
    highlight: { color: 'amber', fillMode: 'light' },
    class: 'demo-bold',
    customData: { id: 7 },
  },
  {
    key: 'styled',
    dates: day(20),
    highlight: {
      style: { background: 'linear-gradient(135deg, oklch(0.6 0.2 275), oklch(0.65 0.24 350))' },
      contentStyle: { color: 'white' },
    },
  },
]

const order = [
  { key: 'under', dates: { start: day(6), end: day(20) }, highlight: { color: 'gray', fillMode: 'light' }, order: 0 },
  { key: 'over', dates: { start: day(12), end: day(14) }, highlight: { color: 'red', fillMode: 'solid' }, order: 10 },
]
</script>

<template>
  <div>
    <h1 class="text-2xl font-semibold">
      {{ t('demo.attributes.title') }}
    </h1>
    <p class="mt-2 max-w-2xl text-ink-muted">
      {{ t('demo.attributes.lead') }}
    </p>

    <div class="mt-8 grid gap-5 lg:grid-cols-2">
      <DemoCard
        id="fill"
        v-bind="tc('demo.attributes.cards.fill')"
      >
        <NvCalendar
          v-bind="theme"
          :locale="calendarLocale"
          :attributes="fillModes"
        />
      </DemoCard>

      <DemoCard
        id="segmented"
        v-bind="tc('demo.attributes.cards.segmented')"
      >
        <NvCalendar
          v-bind="theme"
          :locale="calendarLocale"
          :attributes="segmented"
        />
      </DemoCard>

      <DemoCard
        id="dots"
        v-bind="tc('demo.attributes.cards.dots')"
      >
        <NvCalendar
          v-bind="theme"
          :locale="calendarLocale"
          :attributes="dotsAndBars"
        />
      </DemoCard>

      <DemoCard
        id="repeat"
        v-bind="tc('demo.attributes.cards.repeat')"
      >
        <NvCalendar
          v-bind="theme"
          :locale="calendarLocale"
          :attributes="repeats"
        />
      </DemoCard>

      <DemoCard
        id="exclude"
        v-bind="tc('demo.attributes.cards.exclude')"
      >
        <NvCalendar
          v-bind="theme"
          :locale="calendarLocale"
          :attributes="excluded"
        />
      </DemoCard>

      <DemoCard
        id="popovers"
        v-bind="tc('demo.attributes.cards.popovers')"
      >
        <NvCalendar
          v-bind="theme"
          :locale="calendarLocale"
          :attributes="popovers"
        />
      </DemoCard>

      <DemoCard
        id="custom"
        v-bind="tc('demo.attributes.cards.custom')"
      >
        <NvCalendar
          v-bind="theme"
          :locale="calendarLocale"
          :attributes="custom"
        />
      </DemoCard>

      <DemoCard
        id="order"
        v-bind="tc('demo.attributes.cards.order')"
      >
        <NvCalendar
          v-bind="theme"
          :locale="calendarLocale"
          :attributes="order"
        />
      </DemoCard>
    </div>
  </div>
</template>

<style>
.demo-bold .nv-day-content {
  font-weight: 700;
}
</style>
