export const INSTALL_CLI = 'npx nuxi module add nvcalendar'

export const INSTALL_MANUAL = `npm install nvcalendar
# pnpm add nvcalendar
# yarn add nvcalendar
# bun add nvcalendar`

export const NUXT_CONFIG = `export default defineNuxtConfig({
  modules: ['nvcalendar'],
})`

export const FIRST_COMPONENT = `<script setup>
const date = ref(new Date())
</script>

<template>
  <NvDatePicker v-model="date" />
</template>`

export const MODULE_OPTIONS = `export default defineNuxtConfig({
  modules: ['nvcalendar'],

  nvcalendar: {
    prefix: 'Nv',
    css: true,
    composables: true,
    defaults: {
      color: 'indigo',
      isDark: 'system',
      locale: 'de-DE',
      firstDayOfWeek: 1,
      trimWeeks: true,
      titlePosition: 'center',
      transition: 'slide-h',
      popoverDelay: 120,
      masks: { title: 'MMMM YYYY' },
    },
  },
})`

export const PLAIN_VUE = `import { createApp } from 'vue'
import NvCalendar from 'nvcalendar/vue'
import 'nvcalendar/styles'
import App from './App.vue'

createApp(App)
  .use(NvCalendar, { color: 'indigo', isDark: 'system' })
  .mount('#app')`

export const CALENDAR_PANES = '<NvCalendar :columns="2" :step="1" trim-weeks />'

export const CALENDAR_PAGE = `<script setup>
const page = ref({ month: 7, year: 2026 })
const calendar = ref()
</script>

<template>
  <NvCalendar ref="calendar" v-model:page="page" />
  <button @click="calendar.moveToDate(new Date())">Today</button>
</template>`

export const CALENDAR_BOUNDS = `<NvCalendar
  :min-date="new Date(2026, 6, 5)"
  :max-date="new Date(2026, 6, 24)"
  :disabled-dates="{ repeat: { weekdays: [0, 6] } }"
/>`

export const PICKER_MODES = `<!-- Date | null -->
<NvDatePicker v-model="date" />

<NvDatePicker v-model="dates" selection="multiple" />

<NvDatePicker v-model="range" selection="range" />`

export const PICKER_TIME = `<NvDatePicker
  v-model="appointment"
  mode="dateTime"
  :rules="{ hours: { min: 9, max: 18 }, minutes: { interval: 15 } }"
/>`

export const PICKER_INPUT = `<NvDatePicker v-model="date">
  <template #default="{ inputValue, inputEvents, togglePopover }">
    <label for="date">Date</label>
    <input id="date" :value="inputValue" v-on="inputEvents">
    <button type="button" @click="togglePopover">Open calendar</button>
  </template>
</NvDatePicker>`

export const PICKER_RANGE_INPUT = `<NvDatePicker v-model="range" selection="range">
  <template #default="{ inputValue, inputEvents }">
    <input :value="inputValue.start" v-on="inputEvents.start">
    <input :value="inputValue.end" v-on="inputEvents.end">
  </template>
</NvDatePicker>`

export const PICKER_MODEL = `<!-- emits '2026-07-15' using masks.modelValue -->
<NvDatePicker v-model.string="isoDate" />

<NvDatePicker v-model.number="timestamp" />`

export const SHOWCASE = `<script setup>
const attributes = [
  {
    key: 'sprint',
    highlight: { color: 'teal', fillMode: 'light' },
    dates: { start: '2026-07-02', end: '2026-07-12' },
    popover: { label: 'Sprint 42' },
  },
  {
    key: 'standup',
    dot: 'emerald',
    dates: { repeat: { weekdays: [1, 3, 5] } },
    popover: { label: 'Standup' },
  },
  {
    key: 'payday',
    bar: 'orange',
    dates: { repeat: { days: -1 } },
    popover: { label: 'Payday' },
  },
]
</script>

<template>
  <NvCalendar :attributes="attributes" />
</template>`

export const ATTR_DATES = `// one day
{ dates: '2026-07-15' }

{ dates: { start: '2026-07-06', end: '2026-07-13' } }

{ dates: { start: '2026-07-06', span: 5 } }

{ dates: { repeat: { weekdays: [1, 3, 5] } } }

{ dates: ['2026-07-01', { start: '2026-07-06', end: '2026-07-13' }] }`

export const ATTR_REPEAT = `// every weekday
{ repeat: { weekdays: [1, 2, 3, 4, 5] } }

{ repeat: { days: [1, -1] } }

{ repeat: { ordinalWeekdays: { 2: 4 } } }

{ repeat: { every: 'day', interval: 3, from: '2026-07-01', until: '2026-07-31' } }`

export const ATTR_DECORATIONS = `// the calendar accent
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

export const ATTR_POPOVER = `// a label is enough
{ popover: 'Sprint 42' }

{ popover: { label: 'Sprint 42', visibility: 'click', hideIndicator: true } }`

export const THEME_ACCENT = `<!-- a preset name -->
<NvCalendar color="violet" />

<NvCalendar color="#7c3aed" />
<NvCalendar color="var(--brand)" />

<NvCalendar :attributes="[{ dates: today, highlight: 'violet' }]" />`

export const THEME_DARK = `<NvCalendar :is-dark="false" />
<NvCalendar :is-dark="true" />
<NvCalendar is-dark="system" />`

export const THEME_VARS = `.chunky {
  --nv-day-content-size: 40px;
  --nv-day-min-height: 46px;
  --nv-radius: 4px;
  --nv-font-size: 16px;
}`

export const LOCALE_USAGE = `<!-- a BCP-47 id -->
<NvCalendar locale="de-DE" />

<NvCalendar :locale="{ id: 'de-DE', firstDayOfWeek: 1, masks: { title: 'MMMM YYYY' } }" />

<NvCalendar />`

export const LOCALE_MASKS = `<NvCalendar
  :masks="{
    title: 'MMMM YYYY',
    weekdays: 'dd',
    navMonths: 'MMM',
    dayPopover: 'dddd, D MMMM YYYY',
    input: ['D MMMM YYYY', 'YYYY-MM-DD'],
    modelValue: 'YYYY-MM-DD',
  }"
/>`
