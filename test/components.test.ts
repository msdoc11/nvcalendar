import { afterEach, describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import NvCalendar from '../src/runtime/components/NvCalendar.vue'
import NvDatePicker from '../src/runtime/components/NvDatePicker.vue'

afterEach(() => {
  document.querySelectorAll('.nv-popover').forEach(element => element.remove())
})

function navItems(): HTMLButtonElement[] {
  const grid = [...document.querySelectorAll<HTMLElement>('.nv-nav-popover .nv-nav-grid')]
    .find(element => !element.className.includes('leave'))
  return [...(grid?.querySelectorAll<HTMLButtonElement>('.nv-nav-item') ?? [])]
}

const base = {
  locale: 'en-US',
  firstDayOfWeek: 0,
  today: new Date(2026, 6, 15),
  initialPage: { month: 7, year: 2026 },
} as const

function mountCalendar(props: Record<string, unknown> = {}) {
  return mount(NvCalendar, { props: { ...base, ...props } })
}

function mountPicker(props: Record<string, unknown> = {}) {
  return mount(NvDatePicker, { props: { ...base, ...props } })
}

describe('NvCalendar', () => {
  it('renders a full month grid', () => {
    const wrapper = mountCalendar()
    expect(wrapper.findAll('.nv-day')).toHaveLength(42)
    expect(wrapper.findAll('.nv-weekday')).toHaveLength(7)
    expect(wrapper.find('.nv-title').text()).toBe('July 2026')
  })

  it('renders one pane per column', () => {
    expect(mountCalendar({ columns: 2 }).findAll('.nv-pane')).toHaveLength(2)
    expect(mountCalendar({ columns: 2, rows: 2 }).findAll('.nv-pane')).toHaveLength(4)
  })

  it('marks grid edges so dividers only appear between panes', () => {
    const panes = mountCalendar({ columns: 2, rows: 2 }).findAll('.nv-pane')
    expect(panes.map(pane => pane.classes('nv-pane--first-column'))).toEqual([true, false, true, false])
    expect(panes.map(pane => pane.classes('nv-pane--first-row'))).toEqual([true, true, false, false])
  })

  it('navigates between months', async () => {
    const wrapper = mountCalendar()
    await wrapper.find('.nv-arrow--next').trigger('click')
    expect(wrapper.find('.nv-title').text()).toBe('August 2026')
    expect(wrapper.emitted('update:page')?.[0]).toEqual([{ month: 8, year: 2026 }])

    await wrapper.find('.nv-arrow--prev').trigger('click')
    expect(wrapper.find('.nv-title').text()).toBe('July 2026')
  })

  it('stops navigating past min/max dates', async () => {
    const wrapper = mountCalendar({ minDate: new Date(2026, 6, 1), maxDate: new Date(2026, 6, 31) })
    expect(wrapper.find('.nv-arrow--prev').attributes('disabled')).toBeDefined()
    expect(wrapper.find('.nv-arrow--next').attributes('disabled')).toBeDefined()
  })

  it('disables days outside the allowed range', () => {
    const wrapper = mountCalendar({ minDate: new Date(2026, 6, 10) })
    expect(wrapper.find('[data-nv-day="2026-07-09"]').attributes('disabled')).toBeDefined()
    expect(wrapper.find('[data-nv-day="2026-07-10"]').attributes('disabled')).toBeUndefined()
  })

  it('marks today', () => {
    const wrapper = mountCalendar()
    expect(wrapper.find('[data-nv-day="2026-07-15"]').element.closest('.nv-day')!.className)
      .toContain('nv-day--today')
  })

  it('lets the pointer through a day tooltip, so covered days stay usable', async () => {
    const wrapper = mount(NvCalendar, {
      props: { ...base, popoverDelay: 0, attributes: [{ key: 'p', dates: '2026-07-15', dot: true, popover: 'Note' }] },
      attachTo: document.body,
    })
    await wrapper.find('[data-nv-day="2026-07-15"]').trigger('mouseenter')
    await nextTick()

    const popover = document.querySelector<HTMLElement>('.nv-day-popover')!
    expect(popover.style.pointerEvents).toBe('none')
    wrapper.unmount()
  })

  it('takes the pointer when an attribute asks for an interactive popover', async () => {
    const wrapper = mount(NvCalendar, {
      props: {
        ...base,
        popoverDelay: 0,
        attributes: [{
          key: 'p',
          dates: '2026-07-15',
          dot: true,
          popover: { label: 'Note', isInteractive: true },
        }],
      },
      attachTo: document.body,
    })
    await wrapper.find('[data-nv-day="2026-07-15"]').trigger('mouseenter')
    await nextTick()

    const popover = document.querySelector<HTMLElement>('.nv-day-popover')!
    expect(popover.style.pointerEvents).toBe('')
    wrapper.unmount()
  })

  it('renders attribute decorations', () => {
    const wrapper = mountCalendar({
      attributes: [
        { key: 'dot', dates: '2026-07-08', dot: 'red' },
        { key: 'bar', dates: '2026-07-09', bar: true },
        { key: 'range', dates: { start: '2026-07-20', end: '2026-07-22' }, highlight: true },
      ],
    })
    expect(wrapper.findAll('.nv-dot')).toHaveLength(1)
    expect(wrapper.findAll('.nv-bar')).toHaveLength(1)
    expect(wrapper.findAll('.nv-highlight--circle')).toHaveLength(2)
    expect(wrapper.findAll('.nv-highlight--full')).toHaveLength(1)
  })

  it('shows a focus ring when focus is moved programmatically', async () => {
    const wrapper = mount(NvCalendar, { props: { ...base }, attachTo: document.body })
    const vm = wrapper.vm as unknown as { focusDay: (date: Date) => Promise<void> }

    await vm.focusDay(new Date(2026, 6, 20))
    await nextTick()

    const target = wrapper.find('[data-nv-day="2026-07-20"]')
    expect(target.classes()).toContain('nv-day-content--focused')
    expect(document.activeElement).toBe(target.element)
    wrapper.unmount()
  })

  it('drops the focus ring when another day takes focus', async () => {
    const wrapper = mount(NvCalendar, { props: { ...base }, attachTo: document.body })
    const vm = wrapper.vm as unknown as { focusDay: (date: Date) => Promise<void> }

    await vm.focusDay(new Date(2026, 6, 20))
    await nextTick()
    await wrapper.find('[data-nv-day="2026-07-21"]').trigger('focusin')
    await nextTick()

    expect(wrapper.find('[data-nv-day="2026-07-20"]').classes()).not.toContain('nv-day-content--focused')
    expect(wrapper.find('[data-nv-day="2026-07-21"]').classes()).not.toContain('nv-day-content--focused')
    wrapper.unmount()
  })

  it('keeps the ring while navigating with the arrow keys', async () => {
    const wrapper = mount(NvCalendar, { props: { ...base }, attachTo: document.body })
    await wrapper.find('[data-nv-day="2026-07-15"]').trigger('keydown', { key: 'ArrowRight' })
    await nextTick()
    await nextTick()

    expect(wrapper.find('[data-nv-day="2026-07-16"]').classes()).toContain('nv-day-content--focused')
    wrapper.unmount()
  })

  it('emits day events', async () => {
    const wrapper = mountCalendar()
    await wrapper.find('[data-nv-day="2026-07-15"]').trigger('click')
    const payload = wrapper.emitted('dayclick')?.[0] as [{ id: string }]
    expect(payload[0].id).toBe('2026-07-15')
  })

  it('renders week numbers when asked', () => {
    expect(mountCalendar().findAll('.nv-weeknumber')).toHaveLength(0)
    expect(mountCalendar({ showWeeknumbers: true }).findAll('.nv-weeknumber')).toHaveLength(6)
  })

  it('applies theme classes', () => {
    expect(mountCalendar({ color: 'teal' }).classes()).toContain('nv-color-teal')
    expect(mountCalendar({ isDark: true }).classes()).toContain('nv-dark')
    expect(mountCalendar({ color: '#ff0000' }).attributes('style')).toContain('--nv-accent: #ff0000')
  })

  it('jumps to a month picked in the navigation popover', async () => {
    const wrapper = mount(NvCalendar, { props: { ...base }, attachTo: document.body })
    await wrapper.find('.nv-title').trigger('click')
    await nextTick()

    const items = navItems()
    expect(items).toHaveLength(12)
    items[11]!.click()
    await nextTick()

    expect(wrapper.find('.nv-title').text()).toBe('December 2026')
    wrapper.unmount()
  })

  it('drills through the year view into a month', async () => {
    const wrapper = mount(NvCalendar, { props: { ...base }, attachTo: document.body })
    await wrapper.find('.nv-title').trigger('click')
    await nextTick()

    document.querySelector<HTMLButtonElement>('.nv-nav-title')!.click()
    await nextTick()

    const years = navItems().map(item => item.textContent?.trim())
    expect(years).toHaveLength(12)
    expect(years).toContain('2026')
    expect(years).toContain('2027')

    navItems().find(item => item.textContent?.trim() === '2027')!.click()
    await nextTick()

    const months = navItems()
    expect(months).toHaveLength(12)
    months[0]!.click()
    await nextTick()

    expect(wrapper.find('.nv-title').text()).toBe('January 2027')
    wrapper.unmount()
  })

  it('keeps the clicked pane when navigating a multi-month layout', async () => {
    const wrapper = mount(NvCalendar, { props: { ...base, columns: 2 }, attachTo: document.body })
    await wrapper.findAll('.nv-title')[1]!.trigger('click')
    await nextTick()

    navItems()[11]!.click()
    await nextTick()

    const titles = wrapper.findAll('.nv-title').map(item => item.text())
    expect(titles).toEqual(['November 2026', 'December 2026'])
    wrapper.unmount()
  })

  it('uses the day-content slot', () => {
    const wrapper = mountCalendar({})
    expect(wrapper.find('[data-nv-day="2026-07-15"]').text()).toBe('15')
  })
})

describe('NvDatePicker — single', () => {
  it('selects a day', async () => {
    const wrapper = mountPicker()
    await wrapper.find('[data-nv-day="2026-07-15"]').trigger('click')
    const [value] = wrapper.emitted('update:modelValue')![0] as [Date]
    expect(value.getDate()).toBe(15)
    expect(value.getMonth()).toBe(6)
  })

  it('clears the selection when the same day is clicked again', async () => {
    const wrapper = mountPicker({ modelValue: new Date(2026, 6, 15) })
    await wrapper.find('[data-nv-day="2026-07-15"]').trigger('click')
    expect(wrapper.emitted('update:modelValue')![0]).toEqual([null])
  })

  it('keeps the selection when allowClear is off', async () => {
    const wrapper = mountPicker({ modelValue: new Date(2026, 6, 15), allowClear: false })
    await wrapper.find('[data-nv-day="2026-07-15"]').trigger('click')
    const [value] = wrapper.emitted('update:modelValue')![0] as [Date]
    expect(value.getDate()).toBe(15)
  })

  it('highlights the selected day', () => {
    const wrapper = mountPicker({ modelValue: new Date(2026, 6, 15) })
    const cell = wrapper.find('[data-nv-day="2026-07-15"]').element.closest('.nv-day')!
    expect(cell.className).toContain('nv-day--solid')
    expect(cell.querySelector('.nv-highlight--circle')).not.toBeNull()
  })

  it('ignores disabled days', async () => {
    const wrapper = mountPicker({ disabledDates: '2026-07-15' })
    await wrapper.find('[data-nv-day="2026-07-15"]').trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('emits a formatted string with the string modifier', async () => {
    const wrapper = mountPicker({ modelModifiers: { string: true } })
    await wrapper.find('[data-nv-day="2026-07-15"]').trigger('click')
    expect(wrapper.emitted('update:modelValue')![0]).toEqual(['2026-07-15'])
  })

  it('opens on the month of the selected date', () => {
    const wrapper = mount(NvDatePicker, {
      props: { locale: 'en-US', firstDayOfWeek: 0, today: new Date(2026, 6, 15), modelValue: new Date(2026, 10, 3) },
    })
    expect(wrapper.find('.nv-title').text()).toBe('November 2026')
  })

  it('follows a selection set from outside', async () => {
    const wrapper = mountPicker({ modelValue: new Date(2026, 6, 15) })
    await wrapper.setProps({ modelValue: new Date(2027, 1, 2) })
    await nextTick()
    expect(wrapper.find('.nv-title').text()).toBe('February 2027')
  })

  it('accepts a string model value', () => {
    const wrapper = mountPicker({ modelValue: '2026-07-15' })
    const cell = wrapper.find('[data-nv-day="2026-07-15"]').element.closest('.nv-day')!
    expect(cell.className).toContain('nv-day--solid')
  })
})

describe('NvDatePicker — multiple', () => {
  it('adds and removes dates', async () => {
    const wrapper = mountPicker({ selection: 'multiple', modelValue: [new Date(2026, 6, 4)] })
    await wrapper.find('[data-nv-day="2026-07-09"]').trigger('click')
    const added = wrapper.emitted('update:modelValue')![0][0] as Date[]
    expect(added).toHaveLength(2)
    expect(added.map(date => date.getDate())).toEqual([4, 9])

    await wrapper.setProps({ modelValue: added })
    await wrapper.find('[data-nv-day="2026-07-04"]').trigger('click')
    const removed = wrapper.emitted('update:modelValue')![1][0] as Date[]
    expect(removed.map(date => date.getDate())).toEqual([9])
  })
})

describe('NvDatePicker — range', () => {
  it('commits a range after two clicks', async () => {
    const wrapper = mountPicker({ selection: 'range' })
    await wrapper.find('[data-nv-day="2026-07-10"]').trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(wrapper.emitted('drag')).toHaveLength(1)

    await wrapper.find('[data-nv-day="2026-07-14"]').trigger('click')
    const value = wrapper.emitted('update:modelValue')![0][0] as { start: Date, end: Date }
    expect(value.start.getDate()).toBe(10)
    expect(value.end.getDate()).toBe(14)
  })

  it('normalises a backwards range', async () => {
    const wrapper = mountPicker({ selection: 'range' })
    await wrapper.find('[data-nv-day="2026-07-14"]').trigger('click')
    await wrapper.find('[data-nv-day="2026-07-10"]').trigger('click')
    const value = wrapper.emitted('update:modelValue')![0][0] as { start: Date, end: Date }
    expect(value.start.getDate()).toBe(10)
    expect(value.end.getDate()).toBe(14)
  })

  it('previews the range while dragging', async () => {
    const wrapper = mountPicker({ selection: 'range' })
    await wrapper.find('[data-nv-day="2026-07-10"]').trigger('click')
    await wrapper.find('[data-nv-day="2026-07-13"]').trigger('mouseenter')
    expect(wrapper.findAll('.nv-highlight--full').length).toBeGreaterThan(0)
  })

  it('restarts the drag when the span is out of bounds', async () => {
    const wrapper = mountPicker({ selection: 'range', maxRangeSpan: 3 })
    await wrapper.find('[data-nv-day="2026-07-10"]').trigger('click')
    await wrapper.find('[data-nv-day="2026-07-20"]').trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()

    await wrapper.find('[data-nv-day="2026-07-21"]').trigger('click')
    const value = wrapper.emitted('update:modelValue')![0][0] as { start: Date, end: Date }
    expect(value.start.getDate()).toBe(20)
    expect(value.end.getDate()).toBe(21)
  })

  it('renders the range highlight from the model value', () => {
    const wrapper = mountPicker({
      selection: 'range',
      modelValue: { start: new Date(2026, 6, 10), end: new Date(2026, 6, 13) },
    })
    expect(wrapper.findAll('.nv-highlight--circle')).toHaveLength(2)
    expect(wrapper.findAll('.nv-highlight--tail-right')).toHaveLength(1)
    expect(wrapper.findAll('.nv-highlight--tail-left')).toHaveLength(1)
  })
})

describe('theme propagation', () => {
  it('themes the inline picker root, so the time panel is styled too', () => {
    const wrapper = mountPicker({ mode: 'dateTime', isDark: true, color: 'teal' })
    const root = wrapper.find('.nv-date-picker')
    expect(root.classes()).toContain('nv-dark')
    expect(root.classes()).toContain('nv-color-teal')
  })

  it('themes the input popover, which is teleported out of the calendar', async () => {
    const wrapper = mount(NvDatePicker, {
      props: { ...base, isDark: true, color: 'rose' },
      slots: { default: '<input class="probe">' },
      attachTo: document.body,
    })
    ;(wrapper.vm as unknown as { showPopover: () => void }).showPopover()
    await nextTick()
    await nextTick()

    const popover = document.querySelector('.nv-date-picker-popover')!
    expect(popover.classList.contains('nv-dark')).toBe(true)
    expect(popover.classList.contains('nv-color-rose')).toBe(true)
    wrapper.unmount()
  })

  it('themes the day popover and the navigation popover', async () => {
    const wrapper = mount(NvCalendar, {
      props: { ...base, isDark: true, color: 'amber' },
      attachTo: document.body,
    })
    await wrapper.find('.nv-title').trigger('click')
    await nextTick()

    const nav = document.querySelector('.nv-nav-popover')!
    expect(nav.classList.contains('nv-dark')).toBe(true)
    expect(nav.classList.contains('nv-color-amber')).toBe(true)
    wrapper.unmount()
  })

  it('keeps layout modifiers off the popovers', async () => {
    const wrapper = mount(NvCalendar, {
      props: { ...base, transparent: true, expanded: true },
      attachTo: document.body,
    })
    await wrapper.find('.nv-title').trigger('click')
    await nextTick()

    const nav = document.querySelector('.nv-nav-popover')!
    expect(nav.classList.contains('nv-transparent')).toBe(false)
    expect(nav.classList.contains('nv-expanded')).toBe(false)
    wrapper.unmount()
  })

  it('passes a custom accent colour through as a style', () => {
    const wrapper = mountPicker({ color: '#ff0055' })
    expect(wrapper.find('.nv-date-picker').attributes('style')).toContain('--nv-accent: #ff0055')
  })
})

describe('NvDatePicker — time', () => {
  it('shows a time picker in dateTime mode', () => {
    const wrapper = mountPicker({ mode: 'dateTime', modelValue: new Date(2026, 6, 15, 14, 30) })
    expect(wrapper.find('.nv-time-picker').exists()).toBe(true)
    expect(wrapper.findAll('.nv-select').length).toBeGreaterThanOrEqual(2)
  })

  it('hides the calendar in time mode', () => {
    const wrapper = mountPicker({ mode: 'time', modelValue: new Date(2026, 6, 15, 14, 30) })
    expect(wrapper.find('.nv-calendar').exists()).toBe(false)
    expect(wrapper.find('.nv-time-picker').exists()).toBe(true)
  })

  it('limits the minute options through rules', () => {
    const wrapper = mountPicker({
      mode: 'time',
      is24hr: true,
      modelValue: new Date(2026, 6, 15, 14, 30),
      rules: { minutes: { interval: 15 } },
    })
    const selects = wrapper.findAll('.nv-select')
    expect(selects[1]!.findAll('option')).toHaveLength(4)
  })

  it('keeps the time when a new day is picked', async () => {
    const wrapper = mountPicker({ mode: 'dateTime', modelValue: new Date(2026, 6, 15, 14, 30) })
    await wrapper.find('[data-nv-day="2026-07-20"]').trigger('click')
    const [value] = wrapper.emitted('update:modelValue')![0] as [Date]
    expect(value.getDate()).toBe(20)
    expect(value.getHours()).toBe(14)
    expect(value.getMinutes()).toBe(30)
  })
})
