# Changelog

## 0.2.0

- `<NvTimePicker>` picks hours, minutes, seconds and AM/PM from scrolling
  columns instead of native `<select>` elements. The selected value is
  highlighted, the columns scroll to it on open and follow the arrow keys.
  Long columns wrap around like the native time input: after 59 comes 00.
  Theme with `--nv-time-row`, `--nv-time-rows` and `--nv-time-column-width`.
- A time-only popover (`mode="time"` with the default slot) no longer draws a
  divider above the columns.

## 0.1.0

Initial release.

- `<NvCalendar>` — multi-pane month grid, keyboard and swipe navigation,
  month/year navigation popover, week numbers, page transitions
- `<NvDatePicker>` — single, multiple and range selection, `date` / `dateTime` /
  `time` modes, popover mode with input binding, range span limits
- `<NvTimePicker>` — 12- and 24-hour clocks, hour/minute/second rules
- `<NvPopover>` — flipping, viewport-aware positioning with no dependencies
- Attributes: highlights, dots, bars, content styling, popovers, recurrence
  rules and exclusions
- Intl-driven locales, derived input masks, token formatter and parser
- 18 accent presets, custom accent colours, light/dark/system themes
- Nuxt module with auto-imported components, app-wide defaults and a plain
  Vue 3 entry point
