import type { Placement } from '../types'

export interface Rect {
  top: number
  left: number
  width: number
  height: number
}

export interface PositionOptions {
  placement?: Placement
  offset?: number
  padding?: number
  viewport?: { width: number, height: number }
  flip?: boolean
}

export interface PositionResult {
  x: number
  y: number
  placement: Placement
  side: 'top' | 'bottom' | 'left' | 'right'
  arrow: number
}

const OPPOSITE: Record<string, 'top' | 'bottom' | 'left' | 'right'> = {
  top: 'bottom',
  bottom: 'top',
  left: 'right',
  right: 'left',
}

function splitPlacement(placement: Placement): {
  side: 'top' | 'bottom' | 'left' | 'right'
  align: 'start' | 'center' | 'end'
} {
  const [side, align] = placement.split('-') as ['top' | 'bottom' | 'left' | 'right', 'start' | 'end' | undefined]
  return { side, align: align ?? 'center' }
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

export function computePosition(anchor: Rect, floating: Rect, options: PositionOptions = {}): PositionResult {
  const {
    placement = 'bottom-start',
    offset = 8,
    padding = 8,
    flip = true,
    viewport = {
      width: typeof window === 'undefined' ? 1024 : window.innerWidth,
      height: typeof window === 'undefined' ? 768 : window.innerHeight,
    },
  } = options

  const { align } = splitPlacement(placement)
  let { side } = splitPlacement(placement)

  const space = {
    top: anchor.top - padding,
    bottom: viewport.height - (anchor.top + anchor.height) - padding,
    left: anchor.left - padding,
    right: viewport.width - (anchor.left + anchor.width) - padding,
  }
  const needed = side === 'top' || side === 'bottom' ? floating.height + offset : floating.width + offset

  if (flip && space[side] < needed && space[OPPOSITE[side]!]! > space[side]!) {
    side = OPPOSITE[side]!
  }

  let x: number
  let y: number

  if (side === 'top' || side === 'bottom') {
    y = side === 'top' ? anchor.top - floating.height - offset : anchor.top + anchor.height + offset
    if (align === 'start') x = anchor.left
    else if (align === 'end') x = anchor.left + anchor.width - floating.width
    else x = anchor.left + (anchor.width - floating.width) / 2
    x = clamp(x, padding, Math.max(padding, viewport.width - floating.width - padding))
    y = clamp(y, padding, Math.max(padding, viewport.height - floating.height - padding))
  }
  else {
    x = side === 'left' ? anchor.left - floating.width - offset : anchor.left + anchor.width + offset
    if (align === 'start') y = anchor.top
    else if (align === 'end') y = anchor.top + anchor.height - floating.height
    else y = anchor.top + (anchor.height - floating.height) / 2
    y = clamp(y, padding, Math.max(padding, viewport.height - floating.height - padding))
    x = clamp(x, padding, Math.max(padding, viewport.width - floating.width - padding))
  }

  const arrow = side === 'top' || side === 'bottom'
    ? clamp(anchor.left + anchor.width / 2 - x, 12, Math.max(12, floating.width - 12))
    : clamp(anchor.top + anchor.height / 2 - y, 12, Math.max(12, floating.height - 12))

  return {
    x: Math.round(x),
    y: Math.round(y),
    placement: (align === 'center' ? side : `${side}-${align}`) as Placement,
    side,
    arrow: Math.round(arrow),
  }
}

export function elementRect(element: HTMLElement): Rect {
  const rect = element.getBoundingClientRect()
  return { top: rect.top, left: rect.left, width: rect.width, height: rect.height }
}
