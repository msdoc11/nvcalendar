<!-- markdownlint-disable MD033 -->
# nvcalendar

[![npm version](https://img.shields.io/npm/v/nvcalendar?color=1a7f37)](https://www.npmjs.com/package/nvcalendar)
[![npm downloads](https://img.shields.io/npm/dm/nvcalendar)](https://www.npmjs.com/package/nvcalendar)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)

Calendar, date picker and attribute-driven date visualisation for **Nuxt 3/4** and **Vue 3**.

- 📅 **Calendar** — any number of month panes, keyboard navigation, swipe, transitions
- 🎯 **Date picker** — single, multiple and range selection, with or without time
- 🎨 **Attributes** — highlights, dots, bars, popovers and custom content, driven by data
- 🔁 **Recurring dates** — weekdays, days of month, ordinal weekdays, intervals
- 🌍 **Intl-powered** — month/weekday names, first day of week and input masks come from the locale
- 🌗 **Light, dark and system themes**, 18 accent presets or any CSS colour
- ♿ **Accessible** — grid semantics, roving tab index, arrow-key navigation, focus-visible rings
- 📦 **Zero runtime dependencies**, fully typed, SSR-safe

---

## Installation

```bash
npx nuxi module add nvcalendar
```

or manually:

```bash
npm install nvcalendar
# pnpm add nvcalendar · yarn add nvcalendar · bun add nvcalendar
```

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['nvcalendar'],
})
```

That's it — components are auto-imported and the stylesheet is registered for you.

```vue
<template>
  <NvDatePicker v-model="date" />
</template>

<script setup lang="ts">
const date = ref(new Date())
</script>
```

### Plain Vue 3 (no Nuxt)

```ts
import { createApp } from 'vue'
import NvCalendar from 'nvcalendar/vue'
import 'nvcalendar/styles'
import App from './App.vue'

createApp(App).use(NvCalendar, { color: 'indigo', isDark: 'system' })
```

Or import the components directly:

```ts
import { NvCalendar, NvDatePicker } from 'nvcalendar/vue'
```

---

## Module options

```ts
export default defineNuxtConfig({
  modules: ['nvcalendar'],
  nvcalendar: {
    // Component name prefix: <NvCalendar>, <NvDatePicker>, …
    prefix: 'Nv',
    // Register the bundled stylesheet
    css: true,
    // Auto-import composables
    composables: true,
    // Applied to every component unless overridden by a prop
    defaults: {
      color: 'blue',
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
})
```

---

## `<NvCalendar>`

### Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `rows` | `number` | `1` | Month panes stacked vertically |
| `columns` | `number` | `1` | Month panes side by side |
| `step` | `number` | pane count | Months moved per navigation step |
| `page` | `{ month, year }` | — | Controlled page, use with `v-model:page` |
| `initialPage` | `{ month, year }` | — | Page shown on first render |
| `initialDate` | `Date \| string \| number` | today | Derives the initial page |
| `minDate` / `maxDate` | `Date \| string \| number` | `null` | Selectable and navigable bounds |
| `disabledDates` | date input | — | Dates that cannot be picked |
| `availableDates` | date input | — | Inverse of `disabledDates` |
| `locale` | `string \| LocaleConfig` | browser locale | BCP-47 id or full config |
| `firstDayOfWeek` | `0`–`6` | from locale | `0` = Sunday |
| `masks` | `LocaleMasks` | — | Format overrides |
| `today` | `Date \| string \| number` | now | Reference date for "today" |
| `color` | `string` | `blue` | Preset name or any CSS colour |
| `isDark` | `boolean \| 'system'` | `false` | Theme |
| `expanded` | `boolean` | `false` | Fill the container width |
| `borderless` / `transparent` | `boolean` | `false` | Chrome removal |
| `trimWeeks` | `boolean` | `false` | Show only the weeks in the month |
| `titlePosition` | `'left' \| 'center' \| 'right'` | `center` | Header title alignment |
| `showWeeknumbers` | `boolean \| 'left' \| 'right'` | `false` | Locale week numbers |
| `showIsoWeeknumbers` | `boolean \| 'left' \| 'right'` | `false` | ISO-8601 week numbers |
| `attributes` | `CalendarAttribute[]` | `[]` | See [Attributes](#attributes) |
| `navVisibility` | `'click' \| 'hover' \| 'focus' \| 'hidden'` | `click` | Month/year picker trigger |
| `hideArrows` / `hideHeader` / `hideWeekdays` | `boolean` | `false` | Chrome removal |
| `transition` | `'slide-h' \| 'slide-v' \| 'fade' \| 'none'` | `slide-h` | Page transition |
| `disablePageSwipe` | `boolean` | `false` | Turn off touch swipe |
| `disableKeyboardNavigation` | `boolean` | `false` | Turn off arrow-key navigation |
| `popoverDelay` | `number` | `120` | Hover popover delay in ms |
| `popoverPlacement` | `Placement` | `bottom` | Day popover placement |

### Events

| Event | Payload |
| --- | --- |
| `update:page` | `{ month, year }` |
| `did-move` | `{ month, year }[]` — every visible page |
| `dayclick` | `(day: CalendarDay, event: MouseEvent)` |
| `daymouseenter` / `daymouseleave` | `(day, MouseEvent)` |
| `dayfocusin` / `dayfocusout` | `(day, FocusEvent)` |
| `daykeydown` | `(day, KeyboardEvent)` |
| `weeknumberclick` | `(week: number, days: CalendarDay[])` |

### Slots

| Slot | Scope |
| --- | --- |
| `header-title` | `{ page, title }` |
| `header-prev-button` / `header-next-button` | `{ move, disabled }` |
| `weekday` | `{ weekday }` |
| `weeknumber` | `{ week }` |
| `day-content` | `{ day, attributes }` |
| `day-popover` | `{ day, attributes, title, hide }` |
| `footer` | — |

### Exposed methods

```vue
<script setup lang="ts">
const calendar = ref()

// calendar.value.movePrev()
// calendar.value.moveNext()
// calendar.value.moveBy(3)
// calendar.value.moveToPage({ month: 12, year: 2026 })
// calendar.value.moveToDate(new Date(2026, 11, 24))
// calendar.value.focusDay(new Date())
</script>

<template>
  <NvCalendar ref="calendar" />
</template>
```

---

## `<NvDatePicker>`

Accepts **every** `<NvCalendar>` prop plus the following.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | see below | `null` | The selection |
| `mode` | `'date' \| 'dateTime' \| 'time'` | `date` | Clock visibility |
| `selection` | `'single' \| 'multiple' \| 'range'` | `single` | Selection behaviour |
| `allowClear` | `boolean` | `true` | Re-clicking a selected day clears it |
| `keepVisibleOnInput` | `boolean` | `false` | Keep the popover open after picking |
| `is24hr` | `boolean` | from locale | Force the 24-hour clock |
| `timeAccuracy` | `1 \| 2 \| 3` | `2` | Hours / + minutes / + seconds |
| `rules` | `DatePickerRules` | — | Restrict selectable time values |
| `hideTimeHeader` | `boolean` | `false` | Hide the clock header |
| `minRangeSpan` / `maxRangeSpan` | `number` | — | Range length limits, in days |
| `selectAttribute` | `CalendarAttribute` | — | Styling of the selection |
| `dragAttribute` | `CalendarAttribute` | — | Styling of a range being dragged |
| `updateOnInput` | `boolean` | `true` | Parse while typing |
| `inputDebounce` | `number` | `300` | Debounce for the above, in ms |
| `popoverPlacementInput` | `Placement` | `bottom-start` | Popover placement |

### Model value shapes

```vue
<!-- single -->
<NvDatePicker v-model="date" />                      <!-- Date | null -->

<!-- multiple -->
<NvDatePicker v-model="dates" selection="multiple" /> <!-- Date[] -->

<!-- range -->
<NvDatePicker v-model="range" selection="range" />    <!-- { start, end } -->
```

Strings and timestamps are accepted as input, and can be emitted back with model
modifiers:

```vue
<NvDatePicker v-model.string="isoDate" :masks="{ modelValue: 'YYYY-MM-DD' }" />
<NvDatePicker v-model.number="timestamp" />
```

### Attaching to an input

Providing the default slot switches the picker into popover mode.

```vue
<NvDatePicker v-model="date">
  <template #default="{ inputValue, inputEvents, togglePopover }">
    <input :value="inputValue" v-on="inputEvents">
    <button @click="togglePopover">📅</button>
  </template>
</NvDatePicker>
```

For a range, `inputValue` and `inputEvents` are split into `start` and `end`:

```vue
<NvDatePicker v-model="range" selection="range">
  <template #default="{ inputValue, inputEvents }">
    <input :value="inputValue.start" v-on="inputEvents.start">
    <input :value="inputValue.end" v-on="inputEvents.end">
  </template>
</NvDatePicker>
```

### Date and time

```vue
<NvDatePicker
  v-model="appointment"
  mode="dateTime"
  :rules="{ hours: { min: 9, max: 18 }, minutes: { interval: 15 } }"
/>
```

`rules` accepts a fixed value, a list of values or a `{ min, max, interval }`
object for `hours`, `minutes` and `seconds`.

### Events

`update:modelValue`, `update:page`, `did-move`, `dayclick`, `drag`,
`popover-show`, `popover-hide`.

---

## Attributes

Attributes attach visual meaning to dates. They are plain objects, so they can
come straight from an API response.

```vue
<NvCalendar :attributes="attributes" />
```

```ts
const attributes = [
  {
    key: 'vacation',
    highlight: { color: 'teal', fillMode: 'light' },
    dates: { start: '2026-08-03', end: '2026-08-17' },
    popover: { label: 'Vacation' },
  },
  {
    key: 'standup',
    dot: 'green',
    dates: { repeat: { weekdays: [1, 2, 3, 4, 5] } },
  },
  {
    key: 'payday',
    bar: 'orange',
    dates: { repeat: { days: -1 } },       // last day of every month
    popover: { label: 'Payday' },
  },
  {
    key: 'release',
    highlight: { fillMode: 'outline' },
    dates: { repeat: { ordinalWeekdays: { 2: 4 } } }, // 2nd Thursday
    customData: { id: 42 },
  },
]
```

### `dates`

| Shape | Meaning |
| --- | --- |
| `Date \| string \| number` | one day |
| `{ start, end }` | inclusive range; either side may be `null` for an open range |
| `{ start, span }` | range of `span` days |
| `{ repeat: {...} }` | recurrence |
| `Array<any of the above>` | union |

`excludeDates` uses the same shapes and subtracts from the result.

### `repeat`

| Key | Type | Example |
| --- | --- | --- |
| `every` | `'day' \| 'week' \| 'month' \| 'year'` | `every: 'week'` |
| `interval` | `number` | every 2nd week |
| `weekdays` | `0`–`6` or array | `[1, 3, 5]` |
| `days` | day of month, negative from the end | `[1, 15, -1]` |
| `weeks` | week of month, negative from the end | `-1` |
| `months` | `1`–`12` | `[6, 7, 8]` |
| `years` | number or array | `2026` |
| `ordinalWeekdays` | `{ ordinal: weekday }` | `{ 1: 1, '-1': 5 }` |
| `from` / `until` | date | bounds of the recurrence |

### Decorations

`highlight`, `dot`, `bar` and `content` accept:

- `true` — use the calendar accent colour
- `'pink'` — a preset name, the same palette as the `color` prop
- `'#ff0055'` / `'var(--brand)'` — any CSS colour
- a config object — `{ color, fillMode, class, style, contentClass, contentStyle }`
- a segmented object — `{ start, base, end }` to style range edges differently

`fillMode` is `'solid'`, `'light'`, `'outline'` or `'none'`. Ranges default to a
solid circle on the first and last day and a light bar in between.

The label colour follows the fill it sits on: the day publishes the colour of
its topmost highlight as `--nv-accent`, and the text is derived from that. On a
solid fill the browser picks black or white by the lightness of the colour, so
pale accents stay readable.

### Popovers

```ts
{ popover: 'Simple label' }
{ popover: { label: 'Detailed', visibility: 'click', hideIndicator: true } }
```

`visibility` is `'hover'`, `'focus'`, `'click'`, `'visible'` or `'hidden'`.
Use the `day-popover` slot for full control over the content.

---

## Theming

Every colour is derived from a single custom property, so a theme is one line:

```css
.my-calendar {
  --nv-accent: #7c3aed;
}
```

```vue
<NvCalendar color="#7c3aed" />
<NvCalendar color="var(--brand)" />
<NvCalendar color="violet" />
```

Presets: `gray`, `red`, `orange`, `amber`, `yellow`, `lime`, `green`, `emerald`,
`teal`, `cyan`, `sky`, `blue`, `indigo`, `violet`, `purple`, `fuchsia`, `pink`,
`rose`.

Useful custom properties:

| Property | Purpose |
| --- | --- |
| `--nv-accent` | Accent colour, everything else is derived from it |
| `--nv-color-<preset>` | The 18 palette entries, e.g. `--nv-color-teal` |
| `--nv-bg`, `--nv-fg`, `--nv-fg-muted`, `--nv-border` | Surfaces |
| `--nv-radius`, `--nv-radius-sm` | Corner rounding |
| `--nv-day-content-size`, `--nv-day-min-height` | Day cell metrics |
| `--nv-pane-padding`, `--nv-pane-min-width` | Pane metrics |
| `--nv-font-size`, `--nv-font-family` | Typography |
| `--nv-duration` | Animation speed |

Dark mode is applied through the `nv-dark` class, controlled by `isDark`.
`isDark="system"` follows `prefers-color-scheme` reactively.

---

## Format tokens

Used by `masks` and by `locale.format()`.

| Token | Output |
| --- | --- |
| `YYYY` `YY` | `2026` `26` |
| `MMMM` `MMM` `MM` `M` | `July` `Jul` `07` `7` |
| `DD` `D` | `05` `5` |
| `dddd` `ddd` `dd` `d` | `Sunday` `Sun` `S` `0` |
| `HH` `H` `hh` `h` | 24- and 12-hour |
| `mm` `m` `ss` `s` `SSS` | minutes, seconds, milliseconds |
| `A` `a` | `PM` `pm` |
| `Z` `ZZ` | `+02:00` `+0200` |
| `[text]` | literal text |

Default masks:

```ts
{
  title: 'MMMM YYYY',
  weekdays: 'dd',
  navMonths: 'MMM',
  dayPopover: 'dddd, D MMMM YYYY',
  input: [/* derived from the locale */, 'YYYY-MM-DD', 'YYYY/MM/DD'],
  modelValue: 'YYYY-MM-DD',
}
```

---

## Keyboard

| Key | Action |
| --- | --- |
| <kbd>←</kbd> <kbd>→</kbd> | Previous / next day |
| <kbd>↑</kbd> <kbd>↓</kbd> | Previous / next week |
| <kbd>Home</kbd> <kbd>End</kbd> | First / last day of the week |
| <kbd>PageUp</kbd> <kbd>PageDown</kbd> | Previous / next month |
| <kbd>Shift</kbd> + <kbd>PageUp/Down</kbd> | Previous / next year |
| <kbd>Enter</kbd> <kbd>Space</kbd> | Select the focused day |
| <kbd>Esc</kbd> | Close a popover, cancel a range drag |

---

## Composables and utilities

```ts
import {
  useCalendar,          // the state machine behind <NvCalendar>
  useCalendarDefaults,  // read the app-wide defaults
} from '#imports'

import {
  resolveLocale,
  buildPage,
  normalizeDates,
  matchRange,
  addDays,
  diffInDays,
  getIsoWeeknumber,
} from 'nvcalendar/runtime/utils/date'
```

Types are exported from `nvcalendar/types`:

```ts
import type {
  CalendarAttribute,
  CalendarDay,
  CalendarPage,
  DateRangeValue,
  RepeatRule,
} from 'nvcalendar/types'
```

---

## SSR

All components render on the server. Popovers are teleported to `<body>` and
mount only on the client, so there is nothing to wrap in `<ClientOnly>`.
Dates are handled in the user's local time zone; pass `today` if you need a
deterministic reference date for snapshot tests.

---

## Development

```bash
npm install
npm run test         # unit tests
npm run lint
npm run build        # build the module into dist/
```

---

## Contributing

Development setup, project layout and the checks a pull request has to pass are
in [CONTRIBUTING.md](./CONTRIBUTING.md). Please read the
[code of conduct](./CODE_OF_CONDUCT.md) first, and report vulnerabilities
privately as described in [SECURITY.md](./SECURITY.md).

---

## Credits and licence

nvcalendar is an independent, clean-room implementation released under the
[MIT licence](./LICENSE). It is inspired by the idea of an attribute-driven Vue
calendar — an idea popularised by the excellent
[V-Calendar](https://vcalendar.io) project — but shares no source code, markup,
stylesheets or documentation with it. It is not affiliated with, endorsed by or
derived from V-Calendar or its authors. All APIs, class names, CSS and internals
here were written from scratch for this package.

If you are looking for the original project, please support it directly.
