import { describe, expect, it } from 'vitest'
import {
  matchRange,
  normalizeAttributes,
  normalizeDates,
  resolveAttributesForDate,
} from '../src/runtime/utils/attributes'

describe('normalizeDates', () => {
  it('accepts single dates, ranges and arrays', () => {
    expect(normalizeDates(new Date(2026, 6, 1))).toHaveLength(1)
    expect(normalizeDates([new Date(2026, 6, 1), '2026-07-04'])).toHaveLength(2)
    expect(normalizeDates({ start: '2026-07-01', end: '2026-07-05' })[0]!.isSingleDay).toBe(false)
  })

  it('expands a span into an end date', () => {
    const [range] = normalizeDates({ start: '2026-07-01', span: 3 })
    expect(range!.end!.getDate()).toBe(3)
  })

  it('reorders reversed ranges', () => {
    const [range] = normalizeDates({ start: '2026-07-10', end: '2026-07-01' })
    expect(range!.start!.getDate()).toBe(1)
    expect(range!.end!.getDate()).toBe(10)
  })
})

describe('matchRange', () => {
  const [range] = normalizeDates({ start: '2026-07-06', end: '2026-07-10' })

  it('flags the edges of a range', () => {
    expect(matchRange(range!, new Date(2026, 6, 6))).toEqual({ onStart: true, onEnd: false, isMultiDay: true })
    expect(matchRange(range!, new Date(2026, 6, 8))).toEqual({ onStart: false, onEnd: false, isMultiDay: true })
    expect(matchRange(range!, new Date(2026, 6, 10))).toEqual({ onStart: false, onEnd: true, isMultiDay: true })
    expect(matchRange(range!, new Date(2026, 6, 11))).toBeNull()
  })

  it('ignores the time of day', () => {
    const [single] = normalizeDates(new Date(2026, 6, 6, 23, 30))
    expect(matchRange(single!, new Date(2026, 6, 6, 1, 0))).not.toBeNull()
  })

  it('supports open-ended ranges', () => {
    const [open] = normalizeDates({ start: '2026-07-06' })
    expect(matchRange(open!, new Date(2030, 0, 1))).not.toBeNull()
    expect(matchRange(open!, new Date(2026, 6, 5))).toBeNull()
  })
})

describe('repeat rules', () => {
  it('matches weekdays', () => {
    const [rule] = normalizeDates({ repeat: { weekdays: [1, 3] } })
    expect(matchRange(rule!, new Date(2026, 6, 6))).not.toBeNull()
    expect(matchRange(rule!, new Date(2026, 6, 8))).not.toBeNull()
    expect(matchRange(rule!, new Date(2026, 6, 7))).toBeNull()
  })

  it('matches days of month counted from the end', () => {
    const [rule] = normalizeDates({ repeat: { days: -1 } })
    expect(matchRange(rule!, new Date(2026, 6, 31))).not.toBeNull()
    expect(matchRange(rule!, new Date(2026, 1, 28))).not.toBeNull()
    expect(matchRange(rule!, new Date(2026, 6, 30))).toBeNull()
  })

  it('matches ordinal weekdays', () => {
    const [rule] = normalizeDates({ repeat: { ordinalWeekdays: { 2: 4 } } })
    expect(matchRange(rule!, new Date(2026, 6, 9))).not.toBeNull()
    expect(matchRange(rule!, new Date(2026, 6, 2))).toBeNull()
  })

  it('honours the interval and the from/until bounds', () => {
    const [rule] = normalizeDates({
      repeat: { every: 'day', interval: 3, from: '2026-07-01', until: '2026-07-10' },
    })
    expect(matchRange(rule!, new Date(2026, 6, 1))).not.toBeNull()
    expect(matchRange(rule!, new Date(2026, 6, 4))).not.toBeNull()
    expect(matchRange(rule!, new Date(2026, 6, 5))).toBeNull()
    expect(matchRange(rule!, new Date(2026, 6, 13))).toBeNull()
  })
})

describe('resolveAttributesForDate', () => {
  const attributes = normalizeAttributes([
    { key: 'a', dates: { start: '2026-07-06', end: '2026-07-10' }, highlight: 'red' },
    { key: 'b', dates: '2026-07-08', dot: true, order: 5 },
    { key: 'c', dates: { repeat: { weekdays: [0, 6] } }, bar: 'gray', excludeDates: '2026-07-11' },
  ])

  it('resolves every matching attribute in order', () => {
    const resolved = resolveAttributesForDate(attributes, new Date(2026, 6, 8))
    expect(resolved.map(item => item.key)).toEqual(['a', 'b'])
    expect(resolved[0]!.highlight).toEqual({ color: 'red' })
    expect(resolved[1]!.dot).toEqual({})
  })

  it('applies excludeDates', () => {
    expect(resolveAttributesForDate(attributes, new Date(2026, 6, 12)).map(item => item.key)).toEqual(['c'])
    expect(resolveAttributesForDate(attributes, new Date(2026, 6, 11))).toHaveLength(0)
  })

  it('splits segmented decorations', () => {
    const segmented = normalizeAttributes([{
      key: 'segmented',
      dates: { start: '2026-07-06', end: '2026-07-10' },
      highlight: { start: { color: 'green' }, base: { color: 'gray' }, end: { color: 'blue' } },
    }])
    expect(resolveAttributesForDate(segmented, new Date(2026, 6, 6))[0]!.highlight!.color).toBe('green')
    expect(resolveAttributesForDate(segmented, new Date(2026, 6, 8))[0]!.highlight!.color).toBe('gray')
    expect(resolveAttributesForDate(segmented, new Date(2026, 6, 10))[0]!.highlight!.color).toBe('blue')
  })

  it('sorts attributes by order', () => {
    const ordered = normalizeAttributes([
      { key: 'low', dates: '2026-07-08', order: 1 },
      { key: 'high', dates: '2026-07-08', order: 10 },
      { key: 'mid', dates: '2026-07-08', order: 5 },
    ])
    expect(resolveAttributesForDate(ordered, new Date(2026, 6, 8)).map(item => item.key))
      .toEqual(['low', 'mid', 'high'])
  })
})
