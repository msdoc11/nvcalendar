import type { CSSProperties } from 'vue'
import type { CalendarDay, ResolvedAttribute } from '../types'
import { resolveColorValue } from './color'

export interface RenderedLayer {
  key: string
  class: unknown[]
  style: CSSProperties | undefined
}

function accentStyle(color?: string): CSSProperties | undefined {
  return color ? ({ '--nv-accent': resolveColorValue(color) } as CSSProperties) : undefined
}

function mergeStyle(base: CSSProperties | undefined, extra?: CSSProperties): CSSProperties | undefined {
  if (!base) return extra
  if (!extra) return base
  return { ...base, ...extra }
}

function hasCircle(attribute: ResolvedAttribute): boolean {
  return !attribute.isMultiDay || attribute.onStart || attribute.onEnd
}

function edgeFillMode(attribute: ResolvedAttribute): 'solid' | 'light' | 'outline' | 'none' {
  return attribute.highlight?.fillMode ?? 'solid'
}

function tailFillMode(attribute: ResolvedAttribute): 'solid' | 'light' | 'outline' | 'none' {
  return attribute.highlightBase?.fillMode
    ?? (hasCircle(attribute) ? 'light' : attribute.highlight?.fillMode ?? 'light')
}

export function getHighlightLayers(day: CalendarDay): RenderedLayer[] {
  const layers: RenderedLayer[] = []

  day.attributes.forEach((attribute, index) => {
    const highlight = attribute.highlight
    if (!highlight) return

    const base = attribute.highlightBase ?? highlight
    const tailFill = tailFillMode(attribute)

    if (attribute.isMultiDay && tailFill !== 'none') {
      const shape = attribute.onStart && attribute.onEnd
        ? 'nv-highlight--full'
        : attribute.onStart
          ? 'nv-highlight--tail-right'
          : attribute.onEnd
            ? 'nv-highlight--tail-left'
            : 'nv-highlight--full'
      layers.push({
        key: `${attribute.key}-tail-${index}`,
        class: ['nv-highlight', `nv-highlight--${tailFill}`, shape, base.class],
        style: mergeStyle(accentStyle(base.color ?? highlight.color), base.style),
      })
    }

    const fillMode = edgeFillMode(attribute)
    if (hasCircle(attribute) && fillMode !== 'none') {
      layers.push({
        key: `${attribute.key}-circle-${index}`,
        class: [
          'nv-highlight',
          `nv-highlight--${fillMode}`,
          'nv-highlight--circle',
          highlight.class,
        ],
        style: mergeStyle(accentStyle(highlight.color), highlight.style),
      })
    }
  })

  return layers
}

export function getDotLayers(day: CalendarDay): RenderedLayer[] {
  return day.attributes
    .filter(attribute => attribute.dot)
    .map((attribute, index) => ({
      key: `${attribute.key}-dot-${index}`,
      class: ['nv-dot', attribute.dot?.class],
      style: mergeStyle(accentStyle(attribute.dot?.color), attribute.dot?.style),
    }))
}

export function getBarLayers(day: CalendarDay): RenderedLayer[] {
  return day.attributes
    .filter(attribute => attribute.bar)
    .map((attribute, index) => ({
      key: `${attribute.key}-bar-${index}`,
      class: ['nv-bar', attribute.bar?.class],
      style: mergeStyle(accentStyle(attribute.bar?.color), attribute.bar?.style),
    }))
}

export function hasSolidHighlight(day: CalendarDay): boolean {
  return day.attributes.some(attribute =>
    attribute.highlight && hasCircle(attribute) && edgeFillMode(attribute) === 'solid')
}

export function hasLightHighlight(day: CalendarDay): boolean {
  return !hasSolidHighlight(day)
    && day.attributes.some(attribute => attribute.highlight && tailFillMode(attribute) === 'light')
}

export function getDayContentClass(day: CalendarDay): unknown[] {
  const classes: unknown[] = []
  for (const attribute of day.attributes) {
    if (attribute.highlight?.contentClass) classes.push(attribute.highlight.contentClass)
    if (attribute.content?.class) classes.push(attribute.content.class)
    if (attribute.content?.color) classes.push('nv-day-content--colored')
  }
  return classes
}

export function getDayContentStyle(day: CalendarDay): CSSProperties | undefined {
  let style: CSSProperties | undefined
  for (const attribute of day.attributes) {
    style = mergeStyle(style, attribute.highlight?.contentStyle)
    if (attribute.content?.color) {
      style = mergeStyle(style, { '--nv-accent': attribute.content.color } as CSSProperties)
    }
    style = mergeStyle(style, attribute.content?.style)
  }
  return style
}

export function getDayClass(day: CalendarDay): unknown[] {
  const custom = day.attributes.map(attribute => attribute.attribute.class).filter(Boolean)
  return [
    {
      'nv-day--in-month': day.inMonth,
      'nv-day--out-month': !day.inMonth,
      'nv-day--prev-month': day.inPrevMonth,
      'nv-day--next-month': day.inNextMonth,
      'nv-day--today': day.isToday,
      'nv-day--weekend': day.isWeekend,
      'nv-day--disabled': day.isDisabled,
      'nv-day--solid': hasSolidHighlight(day),
      'nv-day--light': hasLightHighlight(day),
    },
    ...custom,
  ]
}

export function getDayStyle(day: CalendarDay): CSSProperties | undefined {
  let style: CSSProperties | undefined
  for (const attribute of day.attributes) {
    style = mergeStyle(style, attribute.attribute.style)
  }
  return style
}

export interface DayRender {
  class: unknown[]
  style: CSSProperties | undefined
  contentClass: unknown[]
  contentStyle: CSSProperties | undefined
  highlights: RenderedLayer[]
  dots: RenderedLayer[]
  bars: RenderedLayer[]
}

const EMPTY_LAYERS: RenderedLayer[] = []

function dayAccentColor(day: CalendarDay): string | undefined {
  for (let index = day.attributes.length - 1; index >= 0; index--) {
    const attribute = day.attributes[index]!
    if (!attribute.highlight) continue
    const color = attribute.highlight.color ?? attribute.highlightBase?.color
    if (color) return color
  }
  return undefined
}

export function buildDayRender(day: CalendarDay): DayRender {
  const decorated = day.attributes.length > 0
  return {
    class: getDayClass(day),
    style: decorated
      ? mergeStyle(accentStyle(dayAccentColor(day)), getDayStyle(day))
      : undefined,
    contentClass: decorated ? getDayContentClass(day) : EMPTY_LAYERS,
    contentStyle: decorated ? getDayContentStyle(day) : undefined,
    highlights: decorated ? getHighlightLayers(day) : EMPTY_LAYERS,
    dots: decorated ? getDotLayers(day) : EMPTY_LAYERS,
    bars: decorated ? getBarLayers(day) : EMPTY_LAYERS,
  }
}

export function getPopoverAttributes(day: CalendarDay): ResolvedAttribute[] {
  return day.attributes.filter(attribute => attribute.popover && attribute.popover.visibility !== 'hidden')
}

export function getPopoverVisibility(day: CalendarDay): 'hover' | 'focus' | 'click' | 'visible' | null {
  const attributes = getPopoverAttributes(day)
  if (!attributes.length) return null
  for (const attribute of attributes) {
    const visibility = attribute.popover?.visibility ?? 'hover'
    if (visibility === 'visible') return 'visible'
    if (visibility === 'click') return 'click'
    if (visibility === 'focus' || visibility === 'hover-focus') return 'focus'
  }
  return 'hover'
}

export function getIndicatorLayer(attribute: ResolvedAttribute): RenderedLayer {
  const color = attribute.highlight?.color ?? attribute.dot?.color ?? attribute.bar?.color
  const kind = attribute.bar ? 'bar' : attribute.dot ? 'dot' : 'highlight'
  return {
    key: String(attribute.key),
    class: ['nv-popover-indicator', `nv-popover-indicator--${kind}`],
    style: accentStyle(color),
  }
}
