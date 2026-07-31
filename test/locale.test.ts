import { describe, expect, it } from 'vitest'
import { CalendarLocale, getLocaleDateMask, resolveLocale } from '../src/runtime/utils/locale'

const en = new CalendarLocale({ id: 'en-US' })
const ru = new CalendarLocale({ id: 'ru-RU' })

describe('format', () => {
  const date = new Date(2026, 6, 5, 14, 7, 9)

  it('formats numeric tokens', () => {
    expect(en.format(date, 'YYYY-MM-DD')).toBe('2026-07-05')
    expect(en.format(date, 'D/M/YY')).toBe('5/7/26')
    expect(en.format(date, 'HH:mm:ss')).toBe('14:07:09')
    expect(en.format(date, 'h:mm A')).toBe('2:07 PM')
  })

  it('formats names from the locale', () => {
    expect(en.format(date, 'MMMM')).toBe('July')
    expect(en.format(date, 'MMM')).toBe('Jul')
    expect(en.format(date, 'dddd')).toBe('Sunday')
    expect(ru.format(date, 'MMMM')).toMatch(/июл/i)
  })

  it('keeps bracketed literals verbatim', () => {
    expect(en.format(date, '[on] MMMM D')).toBe('on July 5')
  })

  it('returns an empty string for null', () => {
    expect(en.format(null, 'YYYY')).toBe('')
  })
})

describe('parse', () => {
  it('round-trips its own output', () => {
    const date = new Date(2026, 10, 23, 9, 5)
    const text = en.format(date, 'YYYY-MM-DD HH:mm')
    const parsed = en.parse(text, 'YYYY-MM-DD HH:mm')!
    expect(parsed.getTime()).toBe(new Date(2026, 10, 23, 9, 5).getTime())
  })

  it('parses month names', () => {
    const parsed = en.parse('March 8, 2027', 'MMMM D, YYYY')!
    expect(parsed.getMonth()).toBe(2)
    expect(parsed.getDate()).toBe(8)
    expect(parsed.getFullYear()).toBe(2027)
  })

  it('applies the meridiem', () => {
    expect(en.parse('7:30 PM', 'h:mm A')!.getHours()).toBe(19)
    expect(en.parse('12:30 AM', 'h:mm A')!.getHours()).toBe(0)
    expect(en.parse('12:30 PM', 'h:mm A')!.getHours()).toBe(12)
  })

  it('rejects impossible dates', () => {
    expect(en.parse('2026-02-30', 'YYYY-MM-DD')).toBeNull()
    expect(en.parse('2026-13-01', 'YYYY-MM-DD')).toBeNull()
  })

  it('tries every mask in order', () => {
    const masks = ['MM/DD/YYYY', 'YYYY-MM-DD']
    expect(en.parse('2026-07-05', masks)!.getMonth()).toBe(6)
    expect(en.parse('07/05/2026', masks)!.getDate()).toBe(5)
  })
})

describe('locale metadata', () => {
  it('derives a numeric mask from the locale', () => {
    expect(getLocaleDateMask('en-US')).toBe('MM/DD/YYYY')
    expect(getLocaleDateMask('de-DE')).toBe('DD.MM.YYYY')
  })

  it('orders weekdays from the first day of week', () => {
    expect(new CalendarLocale({ id: 'en-US', firstDayOfWeek: 0 }).getWeekdayOrder()).toEqual([0, 1, 2, 3, 4, 5, 6])
    expect(new CalendarLocale({ id: 'en-US', firstDayOfWeek: 1 }).getWeekdayOrder()).toEqual([1, 2, 3, 4, 5, 6, 0])
  })

  it('caches equivalent configurations', () => {
    expect(resolveLocale('en-US')).toBe(resolveLocale({ id: 'en-US' }))
  })

  it('lets callers override masks', () => {
    const custom = new CalendarLocale({ id: 'en-US', masks: { title: 'MMM YYYY' } })
    expect(custom.masks.title).toBe('MMM YYYY')
    expect(custom.masks.navMonths).toBe('MMM')
  })
})
