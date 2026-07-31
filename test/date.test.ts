import { describe, expect, it } from 'vitest'
import {
  addDays,
  addMonths,
  daysInMonth,
  diffInDays,
  getDayId,
  getIsoWeeknumber,
  getWeekdayOrdinal,
  getWeekdayOrdinalFromEnd,
  getWeeknumber,
  isSameDay,
  toDate,
  withTimeOf,
} from '../src/runtime/utils/date'

describe('toDate', () => {
  it('parses date-only strings as local dates', () => {
    const date = toDate('2026-07-31')!
    expect(date.getFullYear()).toBe(2026)
    expect(date.getMonth()).toBe(6)
    expect(date.getDate()).toBe(31)
    expect(date.getHours()).toBe(0)
  })

  it('returns null for empty or invalid input', () => {
    expect(toDate(null)).toBeNull()
    expect(toDate('')).toBeNull()
    expect(toDate('not a date')).toBeNull()
    expect(toDate(new Date('nope'))).toBeNull()
  })

  it('accepts timestamps and clones Date instances', () => {
    const source = new Date(2026, 0, 15, 10, 30)
    const copy = toDate(source)!
    expect(copy).not.toBe(source)
    expect(copy.getTime()).toBe(source.getTime())
    expect(toDate(source.getTime())!.getTime()).toBe(source.getTime())
  })
})

describe('arithmetic', () => {
  it('clamps the day of month when adding months', () => {
    const result = addMonths(new Date(2026, 0, 31), 1)
    expect(result.getMonth()).toBe(1)
    expect(result.getDate()).toBe(28)
  })

  it('handles leap years', () => {
    expect(daysInMonth(2024, 2)).toBe(29)
    expect(daysInMonth(2026, 2)).toBe(28)
    expect(addMonths(new Date(2024, 0, 31), 1).getDate()).toBe(29)
  })

  it('counts whole days regardless of time of day', () => {
    const from = new Date(2026, 2, 1, 23, 59)
    const to = new Date(2026, 2, 5, 0, 1)
    expect(diffInDays(from, to)).toBe(4)
    expect(diffInDays(to, from)).toBe(-4)
  })

  it('is stable across a DST boundary', () => {
    const from = new Date(2026, 2, 25)
    const to = addDays(from, 14)
    expect(diffInDays(from, to)).toBe(14)
    expect(to.getHours()).toBe(0)
  })
})

describe('week numbers', () => {
  it('computes ISO week numbers', () => {
    expect(getIsoWeeknumber(new Date(2026, 0, 1)).week).toBe(1)
    expect(getIsoWeeknumber(new Date(2026, 0, 1)).year).toBe(2026)
    expect(getIsoWeeknumber(new Date(2027, 0, 1))).toEqual({ week: 53, year: 2026 })
    expect(getIsoWeeknumber(new Date(2026, 6, 31)).week).toBe(31)
  })

  it('computes locale week numbers relative to the first day of week', () => {
    expect(getWeeknumber(new Date(2026, 0, 1), 0)).toBe(1)
    expect(getWeeknumber(new Date(2026, 0, 4), 0)).toBe(2)
    expect(getWeeknumber(new Date(2026, 0, 4), 1)).toBe(1)
  })
})

describe('helpers', () => {
  it('formats a stable day id', () => {
    expect(getDayId(new Date(2026, 6, 5))).toBe('2026-07-05')
  })

  it('reports weekday ordinals from both ends', () => {
    expect(getWeekdayOrdinal(new Date(2026, 6, 9))).toBe(2)
    expect(getWeekdayOrdinalFromEnd(new Date(2026, 6, 30))).toBe(-1)
    expect(getWeekdayOrdinalFromEnd(new Date(2026, 6, 23))).toBe(-2)
  })

  it('copies the time of day onto another date', () => {
    const result = withTimeOf(new Date(2026, 6, 31), new Date(2020, 0, 1, 18, 45, 30))
    expect(result.getDate()).toBe(31)
    expect(result.getHours()).toBe(18)
    expect(result.getMinutes()).toBe(45)
    expect(isSameDay(result, new Date(2026, 6, 31))).toBe(true)
  })
})
