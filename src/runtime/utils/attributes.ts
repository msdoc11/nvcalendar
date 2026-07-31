import type {
  AttributePopoverConfig,
  BarConfig,
  CalendarAttribute,
  CalendarDay,
  ContentConfig,
  DateInput,
  DateRangeSource,
  DotConfig,
  HighlightConfig,
  NormalizedRange,
  RepeatRule,
  ResolvedAttribute,
  Segmented,
} from '../types'
import {
  addDays,
  daysInMonth,
  diffInDays,
  diffInMonths,
  getWeekdayOrdinal,
  getWeekdayOrdinalFromEnd,
  isSameDay,
  startOfDay,
  toDate,
} from './date'

const FILL_MODES = new Set(['solid', 'light', 'outline', 'none'])

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value) && !(value instanceof Date)
}

function toArray<T>(value: T | T[] | null | undefined): T[] {
  if (value == null) return []
  return Array.isArray(value) ? value : [value]
}

function isRangeSource(value: unknown): value is DateRangeSource {
  return isPlainObject(value)
    && ('start' in value || 'end' in value || 'span' in value || 'repeat' in value)
}

export function normalizeDates(input: DateInput | DateInput[]): NormalizedRange[] {
  const list = Array.isArray(input) ? input : [input]
  const ranges: NormalizedRange[] = []

  list.forEach((item, index) => {
    if (item == null) return

    if (isRangeSource(item)) {
      const start = toDate(item.start ?? null)
      let end = toDate(item.end ?? null)
      if (!end && start && typeof item.span === 'number' && item.span > 0) {
        end = addDays(start, item.span - 1)
      }
      const repeat = item.repeat ? normalizeRepeat(item.repeat) : null
      const orderedStart = start && end && start.getTime() > end.getTime() ? end : start
      const orderedEnd = start && end && start.getTime() > end.getTime() ? start : end
      ranges.push({
        start: orderedStart,
        end: orderedEnd,
        repeat,
        isSingleDay: !repeat && !!orderedStart && isSameDay(orderedStart, orderedEnd),
        order: index,
      })
      return
    }

    const date = toDate(item)
    if (!date) return
    ranges.push({ start: date, end: date, repeat: null, isSingleDay: true, order: index })
  })

  return ranges
}

function normalizeRepeat(repeat: RepeatRule): RepeatRule {
  return {
    ...repeat,
    interval: repeat.interval && repeat.interval > 0 ? Math.floor(repeat.interval) : 1,
  }
}

function matchesNumber(value: number, allowed: number | number[] | undefined, total?: number): boolean {
  if (allowed === undefined) return true
  const list = toArray(allowed)
  if (!list.length) return true
  return list.some((item) => {
    if (item < 0 && total !== undefined) return value === total + item + 1
    return value === item
  })
}

export function matchesRepeat(rule: RepeatRule, date: Date, rangeStart: Date | null): boolean {
  const from = toDate(rule.from ?? null) ?? rangeStart
  const until = toDate(rule.until ?? null)
  const day = startOfDay(date)

  if (from && day.getTime() < startOfDay(from).getTime()) return false
  if (until && day.getTime() > startOfDay(until).getTime()) return false

  if (!matchesNumber(day.getDay(), rule.weekdays as number | number[] | undefined)) return false
  if (!matchesNumber(day.getDate(), rule.days, daysInMonth(day.getFullYear(), day.getMonth() + 1))) return false
  if (!matchesNumber(day.getMonth() + 1, rule.months)) return false
  if (!matchesNumber(day.getFullYear(), rule.years)) return false

  if (rule.weeks !== undefined) {
    const total = Math.ceil((daysInMonth(day.getFullYear(), day.getMonth() + 1)
      + new Date(day.getFullYear(), day.getMonth(), 1).getDay()) / 7)
    const week = Math.ceil((day.getDate() + new Date(day.getFullYear(), day.getMonth(), 1).getDay()) / 7)
    if (!matchesNumber(week, rule.weeks, total)) return false
  }

  if (rule.ordinalWeekdays) {
    const ordinal = getWeekdayOrdinal(day)
    const ordinalFromEnd = getWeekdayOrdinalFromEnd(day)
    const matched = Object.entries(rule.ordinalWeekdays).some(([key, weekdays]) => {
      const position = Number(key)
      if (position !== ordinal && position !== ordinalFromEnd) return false
      return toArray(weekdays).includes(day.getDay() as never)
    })
    if (!matched) return false
  }

  const interval = rule.interval ?? 1
  if (interval > 1 && from) {
    const origin = startOfDay(from)
    switch (rule.every) {
      case 'day': return diffInDays(origin, day) % interval === 0
      case 'week': return Math.floor(diffInDays(origin, day) / 7) % interval === 0
      case 'month': return diffInMonths(origin, day) % interval === 0
      case 'year': return (day.getFullYear() - origin.getFullYear()) % interval === 0
      default: return true
    }
  }

  if (rule.every === 'day' && rule.weekdays === undefined && rule.days === undefined) return true
  return true
}

export interface RangeMatch {
  onStart: boolean
  onEnd: boolean
  isMultiDay: boolean
}

export function matchRange(range: NormalizedRange, date: Date): RangeMatch | null {
  if (range.repeat) {
    if (range.start && startOfDay(date).getTime() < startOfDay(range.start).getTime()) return null
    if (range.end && startOfDay(date).getTime() > startOfDay(range.end).getTime()) return null
    if (!matchesRepeat(range.repeat, date, range.start)) return null
    return { onStart: true, onEnd: true, isMultiDay: false }
  }

  const time = startOfDay(date).getTime()
  const start = range.start ? startOfDay(range.start).getTime() : null
  const end = range.end ? startOfDay(range.end).getTime() : null
  if (start !== null && time < start) return null
  if (end !== null && time > end) return null

  return {
    onStart: start !== null && time === start,
    onEnd: end !== null && time === end,
    isMultiDay: start === null || end === null || start !== end,
  }
}

interface SegmentedConfig<T> {
  start: T | null
  base: T | null
  end: T | null
}

function isSegmentedObject(value: unknown): boolean {
  return isPlainObject(value) && ('start' in value || 'base' in value || 'end' in value)
}

function toHighlightConfig(value: unknown): HighlightConfig | null {
  if (value === false || value == null) return null
  if (value === true) return {}
  if (typeof value === 'string') {
    return FILL_MODES.has(value) ? { fillMode: value as HighlightConfig['fillMode'] } : { color: value }
  }
  return isPlainObject(value) ? { ...(value as HighlightConfig) } : null
}

function toSimpleConfig<T extends { color?: string }>(value: unknown): T | null {
  if (value === false || value == null) return null
  if (value === true) return {} as T
  if (typeof value === 'string') return { color: value } as T
  return isPlainObject(value) ? ({ ...value } as T) : null
}

function normalizeSegmented<T>(
  value: Segmented<unknown> | unknown,
  convert: (input: unknown) => T | null,
): SegmentedConfig<T> {
  if (isSegmentedObject(value)) {
    const source = value as Record<string, unknown>
    const base = convert(source.base)
    return {
      base,
      start: mergeConfig(base, convert(source.start)),
      end: mergeConfig(base, convert(source.end)),
    }
  }
  const config = convert(value)
  return { base: config, start: config, end: config }
}

function mergeConfig<T>(base: T | null, override: T | null): T | null {
  if (!override) return base
  if (!base) return override
  return { ...base, ...override }
}

function normalizePopover(value: CalendarAttribute['popover']): AttributePopoverConfig | null {
  if (!value) return null
  if (typeof value === 'string') return { label: value, visibility: 'hover' }
  return { visibility: 'hover', ...value }
}

export interface NormalizedAttribute {
  key: string | number
  order: number
  index: number
  attribute: CalendarAttribute
  ranges: NormalizedRange[]
  excludes: NormalizedRange[]
  highlight: SegmentedConfig<HighlightConfig>
  dot: SegmentedConfig<DotConfig>
  bar: SegmentedConfig<BarConfig>
  content: SegmentedConfig<ContentConfig>
  popover: AttributePopoverConfig | null
}

export function normalizeAttribute(attribute: CalendarAttribute, index: number): NormalizedAttribute {
  return {
    key: attribute.key ?? `attribute-${index}`,
    order: attribute.order ?? 0,
    index,
    attribute,
    ranges: normalizeDates(attribute.dates),
    excludes: normalizeDates(attribute.excludeDates),
    highlight: normalizeSegmented<HighlightConfig>(attribute.highlight, toHighlightConfig),
    dot: normalizeSegmented<DotConfig>(attribute.dot, toSimpleConfig),
    bar: normalizeSegmented<BarConfig>(attribute.bar, toSimpleConfig),
    content: normalizeSegmented<ContentConfig>(attribute.content, toSimpleConfig),
    popover: normalizePopover(attribute.popover),
  }
}

export function normalizeAttributes(attributes: CalendarAttribute[] | undefined | null): NormalizedAttribute[] {
  return (attributes ?? [])
    .filter(Boolean)
    .map((attribute, index) => normalizeAttribute(attribute, index))
    .sort((a, b) => (a.order - b.order) || (a.index - b.index))
}

function pickSegment<T>(segments: SegmentedConfig<T>, match: RangeMatch): T | null {
  if (!match.isMultiDay) return segments.start ?? segments.base
  if (match.onStart) return segments.start ?? segments.base
  if (match.onEnd) return segments.end ?? segments.base
  return segments.base
}

export function resolveAttributesForDate(
  attributes: NormalizedAttribute[],
  date: Date,
): ResolvedAttribute[] {
  const resolved: ResolvedAttribute[] = []

  for (const attribute of attributes) {
    let match: RangeMatch | null = null
    for (const range of attribute.ranges) {
      const result = matchRange(range, date)
      if (!result) continue
      match = match
        ? {
            onStart: match.onStart || result.onStart,
            onEnd: match.onEnd || result.onEnd,
            isMultiDay: match.isMultiDay || result.isMultiDay,
          }
        : result
    }
    if (!match) continue
    if (attribute.excludes.some(range => matchRange(range, date))) continue

    resolved.push({
      key: attribute.key,
      order: attribute.order,
      attribute: attribute.attribute,
      customData: attribute.attribute.customData,
      onStart: match.onStart,
      onEnd: match.onEnd,
      isMultiDay: match.isMultiDay,
      highlight: pickSegment(attribute.highlight, match),
      highlightBase: attribute.highlight.base ?? attribute.highlight.start,
      dot: pickSegment(attribute.dot, match),
      bar: pickSegment(attribute.bar, match),
      content: pickSegment(attribute.content, match),
      popover: attribute.popover,
    })
  }

  return resolved
}

export function getDayAttributes(day: CalendarDay): ResolvedAttribute[] {
  return day.attributes
}
