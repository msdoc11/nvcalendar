import { describe, expect, it } from 'vitest'
import { normalizeAttributes, normalizeDates } from '../src/runtime/utils/attributes'
import { CalendarLocale } from '../src/runtime/utils/locale'
import { addToPage, buildPage, clampPage, getWeekCount } from '../src/runtime/utils/page'
import { buildDayRender, getHighlightLayers } from '../src/runtime/utils/render'

const locale = new CalendarLocale({ id: 'en-US', firstDayOfWeek: 0 })

function page(overrides: Partial<Parameters<typeof buildPage>[0]> = {}) {
  return buildPage({
    month: 7,
    year: 2026,
    locale,
    firstDayOfWeek: 0,
    today: new Date(2026, 6, 15),
    ...overrides,
  })
}

describe('buildPage', () => {
  it('renders a fixed six-week grid by default', () => {
    const result = page()
    expect(result.weeks).toHaveLength(6)
    expect(result.days).toHaveLength(42)
    expect(result.id).toBe('2026-07')
    expect(result.title).toBe('July 2026')
  })

  it('trims to the weeks of the month when asked', () => {
    const result = page({ trimWeeks: true })
    expect(result.weeks).toHaveLength(getWeekCount(2026, 7, 0))
  })

  it('starts the grid on the configured first day of week', () => {
    expect(page().days[0]!.weekday).toBe(0)
    expect(page({ firstDayOfWeek: 1 }).days[0]!.weekday).toBe(1)
  })

  it('marks days inside and outside the month', () => {
    const result = page()
    const first = result.days.find(day => day.id === '2026-07-01')!
    expect(first.inMonth).toBe(true)
    expect(first.isFirstDayOfMonth).toBe(true)
    expect(result.days[0]!.inMonth).toBe(false)
    expect(result.days[0]!.inPrevMonth).toBe(true)
  })

  it('flags today against the supplied reference date', () => {
    expect(page().days.filter(day => day.isToday)).toHaveLength(1)
    expect(page().days.find(day => day.isToday)!.id).toBe('2026-07-15')
  })

  it('disables days outside min/max and inside disabledDates', () => {
    const result = page({
      minDate: new Date(2026, 6, 10),
      maxDate: new Date(2026, 6, 20),
      disabledRanges: normalizeDates({ repeat: { weekdays: [0, 6] } }),
    })
    expect(result.days.find(day => day.id === '2026-07-09')!.isDisabled).toBe(true)
    expect(result.days.find(day => day.id === '2026-07-15')!.isDisabled).toBe(false)
    expect(result.days.find(day => day.id === '2026-07-18')!.isDisabled).toBe(true)
    expect(result.days.find(day => day.id === '2026-07-21')!.isDisabled).toBe(true)
  })

  it('attaches resolved attributes to each day', () => {
    const result = page({
      attributes: normalizeAttributes([
        { key: 'range', dates: { start: '2026-07-06', end: '2026-07-10' }, highlight: true },
      ]),
    })
    expect(result.days.find(day => day.id === '2026-07-06')!.attributes).toHaveLength(1)
    expect(result.days.find(day => day.id === '2026-07-12')!.attributes).toHaveLength(0)
  })

  it('reports week numbers per row', () => {
    const result = page()
    expect(result.weeks[0]!.isoWeeknumber).toBeGreaterThan(0)
    expect(result.weeks[1]!.week).toBe(2)
  })
})

describe('page arithmetic', () => {
  it('wraps across year boundaries', () => {
    expect(addToPage({ month: 12, year: 2026 }, 1)).toEqual({ month: 1, year: 2027 })
    expect(addToPage({ month: 1, year: 2026 }, -1)).toEqual({ month: 12, year: 2025 })
    expect(addToPage({ month: 6, year: 2026 }, 12)).toEqual({ month: 6, year: 2027 })
  })

  it('clamps a multi-pane layout inside the allowed bounds', () => {
    const clamped = clampPage({ month: 12, year: 2026 }, 2, null, new Date(2026, 11, 31))
    expect(clamped).toEqual({ month: 11, year: 2026 })
    expect(clampPage({ month: 1, year: 2020 }, 1, new Date(2026, 0, 1), null))
      .toEqual({ month: 1, year: 2026 })
  })
})

describe('highlight layers', () => {
  const result = page({
    attributes: normalizeAttributes([
      { key: 'range', dates: { start: '2026-07-06', end: '2026-07-10' }, highlight: true },
      { key: 'single', dates: '2026-07-20', highlight: 'red' },
    ]),
  })

  function classesFor(id: string): string[] {
    return getHighlightLayers(result.days.find(day => day.id === id)!)
      .flatMap(layer => layer.class.filter((item): item is string => typeof item === 'string'))
  }

  it('draws a circle plus a tail on the first day of a range', () => {
    const classes = classesFor('2026-07-06')
    expect(classes).toContain('nv-highlight--tail-right')
    expect(classes).toContain('nv-highlight--circle')
    expect(classes).toContain('nv-highlight--solid')
  })

  it('draws only a light bar in the middle of a range', () => {
    const classes = classesFor('2026-07-08')
    expect(classes).toContain('nv-highlight--full')
    expect(classes).toContain('nv-highlight--light')
    expect(classes).not.toContain('nv-highlight--circle')
  })

  it('draws a single circle for a one-day attribute', () => {
    const classes = classesFor('2026-07-20')
    expect(classes).toContain('nv-highlight--circle')
    expect(classes).not.toContain('nv-highlight--tail-right')
  })
})

describe('attribute colours', () => {
  function dayNamed(id: string, color: string) {
    const built = page({
      attributes: normalizeAttributes([{ key: 'k', dates: id, highlight: { color } }]),
    })
    return built.days.find(day => day.id === id)!
  }

  it('maps preset names to the palette, not to the CSS keyword', () => {
    const layers = getHighlightLayers(dayNamed('2026-07-20', 'pink'))
    expect(layers[0]!.style).toEqual({ '--nv-accent': 'var(--nv-color-pink)' })
  })

  it('passes any other colour through untouched', () => {
    const layers = getHighlightLayers(dayNamed('2026-07-20', '#ff0055'))
    expect(layers[0]!.style).toEqual({ '--nv-accent': '#ff0055' })
  })

  it('publishes the fill colour on the day so the label can adapt', () => {
    const render = buildDayRender(dayNamed('2026-07-20', 'teal'))
    expect(render.style).toEqual({ '--nv-accent': 'var(--nv-color-teal)' })
  })

  it('takes the colour of the topmost attribute', () => {
    const built = page({
      attributes: normalizeAttributes([
        { key: 'under', dates: '2026-07-20', highlight: { color: 'gray' }, order: 0 },
        { key: 'over', dates: '2026-07-20', highlight: { color: 'rose' }, order: 5 },
      ]),
    })
    const render = buildDayRender(built.days.find(day => day.id === '2026-07-20')!)
    expect(render.style).toEqual({ '--nv-accent': 'var(--nv-color-rose)' })
  })
})
