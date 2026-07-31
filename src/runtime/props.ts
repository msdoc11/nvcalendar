import type { PropType } from 'vue'
import type {
  CalendarAttribute,
  DateInput,
  DatePickerMode,
  DatePickerModelValue,
  DatePickerRules,
  DatePickerSelection,
  DateSource,
  DayOfWeek,
  LocaleConfig,
  LocaleMasks,
  PageAddress,
  Placement,
} from './types'

export type WeeknumberPosition = boolean | 'left' | 'right' | 'left-outside' | 'right-outside'

/**
 * Runtime prop definitions shared by `NvCalendar` and `NvDatePicker`.
 * Declared as an object so the date picker can forward them verbatim.
 */
export const calendarProps = {
  /** Number of month panes stacked vertically. */
  rows: { type: Number, default: 1 },
  /** Number of month panes placed side by side. */
  columns: { type: Number, default: 1 },
  /** Months moved per navigation step. Defaults to the number of panes. */
  step: { type: Number, default: undefined },
  /** Month shown on first render. */
  initialPage: { type: Object as PropType<PageAddress>, default: undefined },
  /** Date used to derive the initial page when `initialPage` is not given. */
  initialDate: { type: [Date, String, Number] as PropType<DateSource>, default: undefined },
  /** Controlled month, usable with `v-model:page`. */
  page: { type: Object as PropType<PageAddress | null>, default: undefined },

  /** Earliest selectable day. Navigation stops at its month. */
  minDate: { type: [Date, String, Number] as PropType<DateSource | null>, default: null },
  /** Latest selectable day. Navigation stops at its month. */
  maxDate: { type: [Date, String, Number] as PropType<DateSource | null>, default: null },
  /** Days that cannot be picked: a date, a range, a recurrence, or an array. */
  disabledDates: { type: [Date, String, Number, Object, Array] as PropType<DateInput | DateInput[]>, default: undefined },
  /** The inverse of `disabledDates`: only these days can be picked. */
  availableDates: { type: [Date, String, Number, Object, Array] as PropType<DateInput | DateInput[]>, default: undefined },

  /** BCP-47 locale id or a full locale configuration. */
  locale: { type: [String, Object] as PropType<string | LocaleConfig>, default: undefined },
  firstDayOfWeek: { type: Number as PropType<DayOfWeek>, default: undefined },
  masks: { type: Object as PropType<LocaleMasks>, default: undefined },
  /** Reference date used for "today". Handy for tests and stories. */
  today: { type: [Date, String, Number] as PropType<DateSource>, default: undefined },

  /** Accent colour: a preset name (`blue`, `red`, …) or any CSS colour. */
  color: { type: String, default: undefined },
  /** `true`, `false`, or `'system'` to follow `prefers-color-scheme`. */
  isDark: { type: [Boolean, String] as PropType<boolean | 'system'>, default: undefined },
  /** Stretch the calendar to the width of its container. */
  expanded: { type: Boolean, default: undefined },
  /** Hide the outer border. */
  borderless: { type: Boolean, default: undefined },
  /** Drop the background so the calendar sits on whatever is behind it. */
  transparent: { type: Boolean, default: undefined },

  /** Show only the weeks belonging to the month instead of a fixed 6-week grid. */
  trimWeeks: { type: Boolean, default: undefined },
  /** Alignment of the month title in the pane header. */
  titlePosition: { type: String as PropType<'left' | 'center' | 'right'>, default: undefined },
  /** Locale week numbers, on the given side of the grid. */
  showWeeknumbers: { type: [Boolean, String] as PropType<WeeknumberPosition>, default: false },
  /** ISO-8601 week numbers, on the given side of the grid. */
  showIsoWeeknumbers: { type: [Boolean, String] as PropType<WeeknumberPosition>, default: false },

  /** Decorations and popovers attached to dates. */
  attributes: { type: Array as PropType<CalendarAttribute[]>, default: () => [] },

  /** How the month/year navigation popover is opened. */
  navVisibility: { type: String as PropType<'click' | 'hover' | 'focus' | 'hidden'>, default: 'click' },
  /** Hide the previous/next arrows. */
  hideArrows: { type: Boolean, default: false },
  /** Hide the whole pane header. */
  hideHeader: { type: Boolean, default: false },
  /** Hide the weekday row. */
  hideWeekdays: { type: Boolean, default: false },

  /** Animation played when the month changes. */
  transition: { type: String as PropType<'slide-h' | 'slide-v' | 'fade' | 'none'>, default: undefined },
  /** Turn off changing the month by swiping on a touch screen. */
  disablePageSwipe: { type: Boolean, default: false },
  /** Turn off moving between days with the arrow keys. */
  disableKeyboardNavigation: { type: Boolean, default: false },
  /** Milliseconds before a hover popover opens. */
  popoverDelay: { type: Number, default: undefined },
  /** Placement of day popovers. */
  popoverPlacement: { type: String as PropType<Placement>, default: 'bottom' },
} as const

export const timePickerProps = {
  /** Force the 24-hour clock. Defaults to the locale preference. */
  is24hr: { type: Boolean, default: undefined },
  /** `1` = hours, `2` = hours and minutes, `3` = hours, minutes and seconds. */
  timeAccuracy: { type: Number as PropType<1 | 2 | 3>, default: 2 },
  /** Restricts selectable hours/minutes/seconds. */
  rules: { type: Object as PropType<DatePickerRules>, default: undefined },
  hideTimeHeader: { type: Boolean, default: false },
} as const

export const datePickerProps = {
  ...calendarProps,
  ...timePickerProps,
  /** The selection. Its shape follows the `selection` prop. */
  modelValue: {
    type: [Date, String, Number, Object, Array] as PropType<DatePickerModelValue>,
    default: null,
  },
  /** `date` hides the clock, `dateTime` shows it, `time` hides the calendar. */
  mode: { type: String as PropType<DatePickerMode>, default: 'date' },
  /** Selection behaviour of the picker. */
  selection: { type: String as PropType<DatePickerSelection>, default: 'single' },
  /** Clicking the selected date clears the selection. */
  allowClear: { type: Boolean, default: true },
  /** Keep the popover open after a date is picked. */
  keepVisibleOnInput: { type: Boolean, default: false },
  /** Emit the model value as a formatted string using `masks.modelValue`. */
  modelModifiers: { type: Object as PropType<{ string?: boolean, number?: boolean }>, default: () => ({}) },

  /** Attribute used to paint the current selection. */
  selectAttribute: { type: Object as PropType<CalendarAttribute>, default: undefined },
  /** Attribute used to paint a range while it is being dragged. */
  dragAttribute: { type: Object as PropType<CalendarAttribute>, default: undefined },

  /** Number of days a range must span at minimum. */
  minRangeSpan: { type: Number, default: undefined },
  /** Number of days a range may span at most. */
  maxRangeSpan: { type: Number, default: undefined },

  /** Popover placement when the picker is attached to an input. */
  popoverPlacementInput: { type: String as PropType<Placement>, default: 'bottom-start' },
  /** Parse and commit while the user types instead of on blur/enter. */
  updateOnInput: { type: Boolean, default: true },
  inputDebounce: { type: Number, default: 300 },
} as const
