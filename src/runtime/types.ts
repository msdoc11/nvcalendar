import type { CSSProperties } from 'vue'

export type DateSource = Date | string | number

export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6

export interface RepeatRule {
  every?: 'day' | 'week' | 'month' | 'year'
  interval?: number
  weekdays?: DayOfWeek | DayOfWeek[]
  days?: number | number[]
  weeks?: number | number[]
  months?: number | number[]
  years?: number | number[]
  ordinalWeekdays?: Record<number | string, DayOfWeek | DayOfWeek[]>
  from?: DateSource | null
  until?: DateSource | null
}

export interface DateRangeSource {
  start?: DateSource | null
  end?: DateSource | null
  span?: number
  repeat?: RepeatRule
}

export type DateInput = DateSource | DateRangeSource | null | undefined

export interface NormalizedRange {
  start: Date | null
  end: Date | null
  repeat: RepeatRule | null
  isSingleDay: boolean
  order: number
}

export type FillMode = 'solid' | 'light' | 'outline' | 'none'

export interface HighlightConfig {
  color?: string
  fillMode?: FillMode
  class?: unknown
  style?: CSSProperties
  contentClass?: unknown
  contentStyle?: CSSProperties
}

export interface DotConfig {
  color?: string
  class?: unknown
  style?: CSSProperties
}

export interface BarConfig {
  color?: string
  class?: unknown
  style?: CSSProperties
}

export interface ContentConfig {
  color?: string
  class?: unknown
  style?: CSSProperties
}

export type PopoverVisibility = 'hover' | 'hover-focus' | 'focus' | 'click' | 'visible' | 'hidden'

export interface AttributePopoverConfig {
  label?: string
  visibility?: PopoverVisibility
  hideIndicator?: boolean
  isInteractive?: boolean
}

export type Segmented<T> = T | { start?: T, base?: T, end?: T }

export interface CalendarAttribute {
  key?: string | number
  order?: number
  dates?: DateInput | DateInput[]
  excludeDates?: DateInput | DateInput[]
  highlight?: boolean | string | Segmented<boolean | string | HighlightConfig>
  dot?: boolean | string | Segmented<boolean | string | DotConfig>
  bar?: boolean | string | Segmented<boolean | string | BarConfig>
  content?: boolean | string | Segmented<boolean | string | ContentConfig>
  popover?: string | AttributePopoverConfig
  class?: unknown
  style?: CSSProperties
  customData?: unknown
}

export interface ResolvedAttribute {
  key: string | number
  order: number
  attribute: CalendarAttribute
  customData: unknown
  onStart: boolean
  onEnd: boolean
  isMultiDay: boolean
  highlight: HighlightConfig | null
  highlightBase: HighlightConfig | null
  dot: DotConfig | null
  bar: BarConfig | null
  content: ContentConfig | null
  popover: AttributePopoverConfig | null
}

export interface CalendarDay {
  id: string
  date: Date
  time: number
  day: number
  dayFromEnd: number
  weekday: DayOfWeek
  weekdayPosition: number
  weekdayPositionFromEnd: number
  week: number
  weekFromEnd: number
  weeknumber: number
  isoWeeknumber: number
  month: number
  year: number
  inMonth: boolean
  inPrevMonth: boolean
  inNextMonth: boolean
  isToday: boolean
  isWeekend: boolean
  isFirstDayOfMonth: boolean
  isLastDayOfMonth: boolean
  isDisabled: boolean
  label: string
  ariaLabel: string
  attributes: ResolvedAttribute[]
}

export interface CalendarWeek {
  id: string
  week: number
  weeknumber: number
  isoWeeknumber: number
  days: CalendarDay[]
}

export interface CalendarPage {
  id: string
  month: number
  year: number
  position: number
  row: number
  column: number
  title: string
  shortTitle: string
  monthLabel: string
  shortMonthLabel: string
  yearLabel: string
  weeks: CalendarWeek[]
  days: CalendarDay[]
  canMovePrev: boolean
  canMoveNext: boolean
}

export interface PageAddress {
  month: number
  year: number
}

export interface LocaleMasks {
  title?: string
  weekdays?: string
  navMonths?: string
  dayPopover?: string
  input?: string | string[]
  inputDateTime?: string | string[]
  inputTime?: string | string[]
  modelValue?: string
}

export interface LocaleConfig {
  id?: string
  firstDayOfWeek?: DayOfWeek
  masks?: LocaleMasks
}

export type DatePickerMode = 'date' | 'dateTime' | 'time'
export type DatePickerSelection = 'single' | 'multiple' | 'range'

export interface DateRangeValue<T = Date> {
  start: T | null
  end: T | null
}

export type DatePickerModelValue
  = | DateSource
    | DateSource[]
    | DateRangeValue<DateSource>
    | null
    | undefined

export interface TimeRule {
  min?: number
  max?: number
  interval?: number
}

export interface DatePickerRules {
  hours?: number | number[] | TimeRule
  minutes?: number | number[] | TimeRule
  seconds?: number | number[] | TimeRule
}

export type Placement
  = | 'top' | 'top-start' | 'top-end'
    | 'bottom' | 'bottom-start' | 'bottom-end'
    | 'left' | 'left-start' | 'left-end'
    | 'right' | 'right-start' | 'right-end'

export interface NvCalendarDefaults {
  color?: string
  isDark?: boolean | 'system'
  locale?: string
  firstDayOfWeek?: DayOfWeek
  masks?: LocaleMasks
  popoverDelay?: number
  titlePosition?: 'left' | 'center' | 'right'
  trimWeeks?: boolean
  transition?: 'slide-h' | 'slide-v' | 'fade' | 'none'
  expanded?: boolean
  borderless?: boolean
  transparent?: boolean
}
