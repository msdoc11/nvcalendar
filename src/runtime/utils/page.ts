import type {
  CalendarDay,
  CalendarPage,
  CalendarWeek,
  DayOfWeek,
  NormalizedRange,
  PageAddress,
} from '../types'
import type { CalendarLocale } from './locale'
import type { NormalizedAttribute } from './attributes'
import { matchRange, resolveAttributesForDate } from './attributes'
import {
  addDays,
  daysInMonth,
  getDayId,
  getIsoWeeknumber,
  getMonthId,
  getWeeknumber,
  isSameDay,
  startOfDay,
} from './date'

export interface BuildPageOptions {
  month: number
  year: number
  position?: number
  row?: number
  column?: number
  locale: CalendarLocale
  firstDayOfWeek: DayOfWeek
  trimWeeks?: boolean
  minDate?: Date | null
  maxDate?: Date | null
  disabledRanges?: NormalizedRange[]
  availableRanges?: NormalizedRange[]
  attributes?: NormalizedAttribute[]
  titleMask?: string
  ariaMask?: string
  today?: Date
}

function isDateDisabled(date: Date, options: BuildPageOptions): boolean {
  const time = startOfDay(date).getTime()
  if (options.minDate && time < startOfDay(options.minDate).getTime()) return true
  if (options.maxDate && time > startOfDay(options.maxDate).getTime()) return true
  if (options.disabledRanges?.length && options.disabledRanges.some(range => matchRange(range, date))) return true
  if (options.availableRanges?.length && !options.availableRanges.some(range => matchRange(range, date))) return true
  return false
}

export function getWeekCount(year: number, month: number, firstDayOfWeek: DayOfWeek): number {
  const first = new Date(year, month - 1, 1)
  const offset = (first.getDay() - firstDayOfWeek + 7) % 7
  return Math.ceil((offset + daysInMonth(year, month)) / 7)
}

export function buildPage(options: BuildPageOptions): CalendarPage {
  const {
    month,
    year,
    locale,
    firstDayOfWeek,
    trimWeeks = false,
    attributes = [],
    position = 1,
    row = 1,
    column = 1,
  } = options

  const todayDate = options.today ? startOfDay(options.today) : startOfDay(new Date())
  const monthStart = new Date(year, month - 1, 1)
  const leading = (monthStart.getDay() - firstDayOfWeek + 7) % 7
  const weekCount = trimWeeks ? getWeekCount(year, month, firstDayOfWeek) : 6
  const gridStart = addDays(monthStart, -leading)

  const days: CalendarDay[] = []
  const weeks: CalendarWeek[] = []

  for (let weekIndex = 0; weekIndex < weekCount; weekIndex++) {
    const weekDays: CalendarDay[] = []
    for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
      const date = addDays(gridStart, weekIndex * 7 + dayIndex)
      const dayMonth = date.getMonth() + 1
      const dayYear = date.getFullYear()
      const inMonth = dayMonth === month && dayYear === year
      const monthLength = daysInMonth(dayYear, dayMonth)
      const iso = getIsoWeeknumber(date)
      const weekday = date.getDay() as DayOfWeek

      const day: CalendarDay = {
        id: getDayId(date),
        date,
        time: date.getTime(),
        day: date.getDate(),
        dayFromEnd: date.getDate() - monthLength - 1,
        weekday,
        weekdayPosition: dayIndex + 1,
        weekdayPositionFromEnd: dayIndex - 7,
        week: weekIndex + 1,
        weekFromEnd: weekIndex - weekCount,
        weeknumber: getWeeknumber(date, firstDayOfWeek),
        isoWeeknumber: iso.week,
        month: dayMonth,
        year: dayYear,
        inMonth,
        inPrevMonth: !inMonth && (dayYear < year || dayMonth < month),
        inNextMonth: !inMonth && (dayYear > year || dayMonth > month),
        isToday: isSameDay(date, todayDate),
        isWeekend: weekday === 0 || weekday === 6,
        isFirstDayOfMonth: date.getDate() === 1,
        isLastDayOfMonth: date.getDate() === monthLength,
        isDisabled: isDateDisabled(date, options),
        label: String(date.getDate()),
        ariaLabel: locale.format(date, options.ariaMask ?? locale.masks.dayPopover),
        attributes: [],
      }
      day.attributes = resolveAttributesForDate(attributes, date)

      weekDays.push(day)
      days.push(day)
    }

    const firstOfWeek = weekDays[0]!
    weeks.push({
      id: `week-${year}-${month}-${weekIndex + 1}`,
      week: weekIndex + 1,
      weeknumber: firstOfWeek.weeknumber,
      isoWeeknumber: firstOfWeek.isoWeeknumber,
      days: weekDays,
    })
  }

  const title = locale.format(monthStart, options.titleMask ?? locale.masks.title)

  return {
    id: getMonthId(year, month),
    month,
    year,
    position,
    row,
    column,
    title,
    shortTitle: `${locale.monthName(month, 'short')} ${year}`,
    monthLabel: locale.monthName(month, 'long'),
    shortMonthLabel: locale.monthName(month, 'short'),
    yearLabel: String(year),
    weeks,
    days,
    canMovePrev: canMoveToPage(addToPage({ month, year }, -1), options.minDate, options.maxDate),
    canMoveNext: canMoveToPage(addToPage({ month, year }, 1), options.minDate, options.maxDate),
  }
}

export function addToPage(page: PageAddress, months: number): PageAddress {
  const index = page.year * 12 + (page.month - 1) + months
  return { month: (index % 12) + 1, year: Math.floor(index / 12) }
}

export function pageIndex(page: PageAddress): number {
  return page.year * 12 + (page.month - 1)
}

export function comparePages(a: PageAddress, b: PageAddress): number {
  return pageIndex(a) - pageIndex(b)
}

export function pageForDate(date: Date): PageAddress {
  return { month: date.getMonth() + 1, year: date.getFullYear() }
}

export function canMoveToPage(page: PageAddress, minDate?: Date | null, maxDate?: Date | null): boolean {
  if (minDate && pageIndex(page) < pageIndex(pageForDate(minDate))) return false
  if (maxDate && pageIndex(page) > pageIndex(pageForDate(maxDate))) return false
  return true
}

export function clampPage(
  page: PageAddress,
  count: number,
  minDate?: Date | null,
  maxDate?: Date | null,
): PageAddress {
  let result = page
  if (minDate) {
    const min = pageForDate(minDate)
    if (comparePages(result, min) < 0) result = min
  }
  if (maxDate) {
    const max = addToPage(pageForDate(maxDate), -(count - 1))
    if (comparePages(result, max) > 0) result = max
    if (minDate && comparePages(result, pageForDate(minDate)) < 0) result = pageForDate(minDate)
  }
  return result
}
