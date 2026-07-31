import type { DateSource, DayOfWeek } from '../types'

export const MS_PER_MINUTE = 60_000
export const MS_PER_HOUR = 3_600_000
export const MS_PER_DAY = 86_400_000

const PAD = (value: number, length = 2) => String(Math.abs(value)).padStart(length, '0')

export function toDate(source: DateSource | null | undefined): Date | null {
  if (source == null || source === '') return null
  if (source instanceof Date) return Number.isNaN(source.getTime()) ? null : new Date(source.getTime())
  if (typeof source === 'number') {
    const date = new Date(source)
    return Number.isNaN(date.getTime()) ? null : date
  }
  if (typeof source === 'string') {
    const dateOnly = /^(\d{4})-(\d{2})-(\d{2})$/.exec(source)
    if (dateOnly) {
      const year = Number(dateOnly[1])
      const month = Number(dateOnly[2])
      const day = Number(dateOnly[3])
      if (month < 1 || month > 12 || day < 1 || day > daysInMonth(year, month)) return null
      return new Date(year, month - 1, day)
    }
    const parsed = new Date(source)
    return Number.isNaN(parsed.getTime()) ? null : parsed
  }
  return null
}

export function isDate(value: unknown): value is Date {
  return value instanceof Date && !Number.isNaN(value.getTime())
}

export function today(): Date {
  return startOfDay(new Date())
}

export function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

export function endOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999)
}

export function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

export function endOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999)
}

export function addDays(date: Date, amount: number): Date {
  const result = new Date(date.getTime())
  result.setDate(result.getDate() + amount)
  return result
}

export function addMonths(date: Date, amount: number): Date {
  const day = date.getDate()
  const result = new Date(date.getTime())
  result.setDate(1)
  result.setMonth(result.getMonth() + amount)
  result.setDate(Math.min(day, daysInMonth(result.getFullYear(), result.getMonth() + 1)))
  return result
}

export function addYears(date: Date, amount: number): Date {
  return addMonths(date, amount * 12)
}

export function daysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate()
}

export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0
}

export function diffInDays(from: Date, to: Date): number {
  const a = Date.UTC(from.getFullYear(), from.getMonth(), from.getDate())
  const b = Date.UTC(to.getFullYear(), to.getMonth(), to.getDate())
  return Math.round((b - a) / MS_PER_DAY)
}

export function diffInMonths(from: Date, to: Date): number {
  return (to.getFullYear() - from.getFullYear()) * 12 + (to.getMonth() - from.getMonth())
}

export function isSameDay(a: Date | null, b: Date | null): boolean {
  if (!a || !b) return false
  return a.getFullYear() === b.getFullYear()
    && a.getMonth() === b.getMonth()
    && a.getDate() === b.getDate()
}

export function isSameMonth(a: Date | null, b: Date | null): boolean {
  if (!a || !b) return false
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth()
}

export function isSameTime(a: Date | null, b: Date | null): boolean {
  if (!a || !b) return a === b
  return a.getTime() === b.getTime()
}

export function clampDate(date: Date, min?: Date | null, max?: Date | null): Date {
  if (min && date.getTime() < min.getTime()) return new Date(min.getTime())
  if (max && date.getTime() > max.getTime()) return new Date(max.getTime())
  return date
}

export function getDayId(date: Date): string {
  return `${date.getFullYear()}-${PAD(date.getMonth() + 1)}-${PAD(date.getDate())}`
}

export function getMonthId(year: number, month: number): string {
  return `${year}-${PAD(month)}`
}

export function getIsoWeeknumber(date: Date): { week: number, year: number } {
  const target = startOfDay(date)
  const dayOffset = (target.getDay() + 6) % 7
  target.setDate(target.getDate() - dayOffset + 3)
  const isoYear = target.getFullYear()
  const firstThursday = new Date(isoYear, 0, 4)
  firstThursday.setDate(firstThursday.getDate() - ((firstThursday.getDay() + 6) % 7) + 3)
  const week = 1 + Math.round(diffInDays(firstThursday, target) / 7)
  return { week, year: isoYear }
}

export function getWeeknumber(date: Date, firstDayOfWeek: DayOfWeek = 0): number {
  const firstOfYear = new Date(date.getFullYear(), 0, 1)
  const offset = (firstOfYear.getDay() - firstDayOfWeek + 7) % 7
  const gridStart = addDays(firstOfYear, -offset)
  return Math.floor(diffInDays(gridStart, date) / 7) + 1
}

export function withTimeOf(date: Date, time: Date | null): Date {
  if (!time) return new Date(date.getTime())
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    time.getHours(),
    time.getMinutes(),
    time.getSeconds(),
    time.getMilliseconds(),
  )
}

export function setTime(date: Date, hours: number, minutes: number, seconds = 0, ms = 0): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), hours, minutes, seconds, ms)
}

export function getTimeOfDay(date: Date): number {
  return date.getHours() * 60 + date.getMinutes()
}

export function getWeekdayOrdinal(date: Date): number {
  return Math.floor((date.getDate() - 1) / 7) + 1
}

export function getWeekdayOrdinalFromEnd(date: Date): number {
  const total = daysInMonth(date.getFullYear(), date.getMonth() + 1)
  return -(Math.floor((total - date.getDate()) / 7) + 1)
}

export function dayIsWithin(date: Date, start: Date | null, end: Date | null): boolean {
  const time = startOfDay(date).getTime()
  if (start && time < startOfDay(start).getTime()) return false
  if (end && time > startOfDay(end).getTime()) return false
  return true
}

export function minDate(a: Date | null, b: Date | null): Date | null {
  if (!a) return b
  if (!b) return a
  return a.getTime() <= b.getTime() ? a : b
}

export function maxDate(a: Date | null, b: Date | null): Date | null {
  if (!a) return b
  if (!b) return a
  return a.getTime() >= b.getTime() ? a : b
}
