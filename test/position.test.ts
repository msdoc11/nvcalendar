import { describe, expect, it } from 'vitest'
import { computePosition } from '../src/runtime/utils/position'

const viewport = { width: 1000, height: 800 }
const anchor = { top: 400, left: 400, width: 100, height: 40 }
const floating = { top: 0, left: 0, width: 200, height: 300 }

describe('computePosition', () => {
  it('places the element below the anchor by default', () => {
    const result = computePosition(anchor, floating, { viewport })
    expect(result.side).toBe('bottom')
    expect(result.y).toBe(448)
    expect(result.x).toBe(400)
  })

  it('aligns to the end and to the centre', () => {
    expect(computePosition(anchor, floating, { viewport, placement: 'bottom-end' }).x).toBe(300)
    expect(computePosition(anchor, floating, { viewport, placement: 'bottom' }).x).toBe(350)
  })

  it('flips when there is not enough room', () => {
    const low = { ...anchor, top: 700 }
    expect(computePosition(low, floating, { viewport }).side).toBe('top')
  })

  it('keeps the side with the most room when neither side fits', () => {
    const tall = { top: 0, left: 0, width: 200, height: 790 }
    const nearTop = { top: 60, left: 400, width: 100, height: 40 }
    expect(computePosition(nearTop, tall, { viewport }).side).toBe('bottom')
  })

  it('keeps the element inside the viewport', () => {
    const edge = { top: 400, left: 960, width: 40, height: 40 }
    const result = computePosition(edge, floating, { viewport })
    expect(result.x).toBeLessThanOrEqual(viewport.width - floating.width - 8)
    expect(result.x).toBeGreaterThanOrEqual(8)
  })

  it('reports an arrow offset inside the floating element', () => {
    const result = computePosition(anchor, floating, { viewport })
    expect(result.arrow).toBeGreaterThanOrEqual(12)
    expect(result.arrow).toBeLessThanOrEqual(floating.width - 12)
  })
})
