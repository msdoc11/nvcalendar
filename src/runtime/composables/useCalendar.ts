import { computed, nextTick, ref, watch } from 'vue'
import type { ComputedRef, ExtractPropTypes, Ref } from 'vue'
import type { calendarProps } from '../props'
import type { CalendarDay, CalendarPage, DayOfWeek, LocaleConfig, PageAddress } from '../types'
import { normalizeAttributes, normalizeDates } from '../utils/attributes'
import { addDays, addMonths, getDayId, isSameDay, startOfDay, toDate } from '../utils/date'
import { resolveLocale } from '../utils/locale'
import {
  addToPage,
  buildPage,
  canMoveToPage,
  clampPage,
  comparePages,
  pageForDate,
} from '../utils/page'
import { useCalendarDefaults } from './useDefaults'
import { useCalendarTheme } from './useTheme'

export type CalendarProps = ExtractPropTypes<typeof calendarProps>

export interface UseCalendarOptions {
  emit: (event: string, ...args: unknown[]) => void
  rootRef?: Ref<HTMLElement | null>
}

export function useCalendar(props: CalendarProps, options: UseCalendarOptions) {
  const { emit, rootRef } = options
  const defaults = useCalendarDefaults()

  const locale = computed(() => {
    const config: LocaleConfig = typeof props.locale === 'string'
      ? { id: props.locale }
      : { ...(props.locale ?? {}) }
    if (!config.id && defaults.locale) config.id = defaults.locale
    const firstDay = props.firstDayOfWeek ?? config.firstDayOfWeek ?? defaults.firstDayOfWeek
    if (firstDay !== undefined) config.firstDayOfWeek = firstDay as DayOfWeek
    const masks = { ...(defaults.masks ?? {}), ...(config.masks ?? {}), ...(props.masks ?? {}) }
    if (Object.keys(masks).length) config.masks = masks
    return resolveLocale(config)
  })

  const firstDayOfWeek = computed<DayOfWeek>(() => locale.value.firstDayOfWeek)

  const minDate = computed(() => toDate(props.minDate ?? null))
  const maxDate = computed(() => toDate(props.maxDate ?? null))
  const todayDate = computed(() => startOfDay(toDate(props.today ?? null) ?? new Date()))
  const disabledRanges = computed(() => normalizeDates(props.disabledDates))
  const availableRanges = computed(() => normalizeDates(props.availableDates))
  const attributes = computed(() => normalizeAttributes(props.attributes))

  const rows = computed(() => Math.max(1, props.rows ?? 1))
  const columns = computed(() => Math.max(1, props.columns ?? 1))
  const paneCount = computed(() => rows.value * columns.value)
  const step = computed(() => Math.max(1, props.step ?? columns.value * rows.value))

  function initialAddress(): PageAddress {
    if (props.page) return { ...props.page }
    if (props.initialPage) return { ...props.initialPage }
    const initial = toDate(props.initialDate ?? null)
    return pageForDate(initial ?? todayDate.value)
  }

  const internalPage = ref<PageAddress>(clampPage(initialAddress(), paneCount.value, minDate.value, maxDate.value))
  const direction = ref<'next' | 'prev' | 'none'>('none')

  const fromPage = computed<PageAddress>(() => props.page ?? internalPage.value)

  const pages = computed<CalendarPage[]>(() => {
    const result: CalendarPage[] = []
    for (let index = 0; index < paneCount.value; index++) {
      const address = addToPage(fromPage.value, index)
      result.push(buildPage({
        month: address.month,
        year: address.year,
        position: index + 1,
        row: Math.floor(index / columns.value) + 1,
        column: (index % columns.value) + 1,
        locale: locale.value,
        firstDayOfWeek: firstDayOfWeek.value,
        trimWeeks: props.trimWeeks ?? defaults.trimWeeks ?? false,
        minDate: minDate.value,
        maxDate: maxDate.value,
        disabledRanges: disabledRanges.value,
        availableRanges: availableRanges.value,
        attributes: attributes.value,
        today: todayDate.value,
      }))
    }
    return result
  })

  const lastPage = computed(() => addToPage(fromPage.value, paneCount.value - 1))

  const canMovePrev = computed(() => canMoveToPage(addToPage(fromPage.value, -1), minDate.value, null))
  const canMoveNext = computed(() => canMoveToPage(addToPage(lastPage.value, 1), null, maxDate.value))

  function commitPage(next: PageAddress, moveDirection: 'next' | 'prev' | 'none' = 'none') {
    const clamped = clampPage(next, paneCount.value, minDate.value, maxDate.value)
    if (comparePages(clamped, fromPage.value) === 0) return false
    direction.value = moveDirection === 'none'
      ? (comparePages(clamped, fromPage.value) > 0 ? 'next' : 'prev')
      : moveDirection
    internalPage.value = clamped
    emit('update:page', { ...clamped })
    emit('did-move', pages.value.map(page => ({ month: page.month, year: page.year })))
    return true
  }

  function moveBy(months: number) {
    return commitPage(addToPage(fromPage.value, months), months >= 0 ? 'next' : 'prev')
  }

  function movePrev() {
    if (!canMovePrev.value) return false
    return moveBy(-step.value)
  }

  function moveNext() {
    if (!canMoveNext.value) return false
    return moveBy(step.value)
  }

  function moveToPage(address: PageAddress) {
    return commitPage(address)
  }

  function moveToDate(date: Date, position = 1) {
    const target = pageForDate(date)
    const visible = pages.value.some(page => page.month === target.month && page.year === target.year)
    if (visible) return false
    return commitPage(addToPage(target, -(Math.max(1, position) - 1)))
  }

  watch(() => props.page, (value) => {
    if (value) internalPage.value = { ...value }
  })

  watch([paneCount, minDate, maxDate], () => {
    const clamped = clampPage(fromPage.value, paneCount.value, minDate.value, maxDate.value)
    if (comparePages(clamped, fromPage.value) !== 0) internalPage.value = clamped
  })

  const focusDate = ref<Date | null>(null)

  const tabDate = computed<Date>(() => {
    if (focusDate.value) return focusDate.value
    const inRange = pages.value.some(page => page.days.some(day => day.inMonth && day.isToday))
    if (inRange) return todayDate.value
    const first = pages.value[0]
    return first ? new Date(first.year, first.month - 1, 1) : todayDate.value
  })

  function isTabDay(day: CalendarDay): boolean {
    return day.inMonth && isSameDay(day.date, tabDate.value)
  }

  const focusRingDay = ref<string | null>(null)

  function hasFocusRing(day: CalendarDay): boolean {
    return focusRingDay.value === day.id
  }

  function clearFocusRing(day?: CalendarDay) {
    if (!day || focusRingDay.value === day.id) focusRingDay.value = null
  }

  async function focusDay(date: Date) {
    focusDate.value = date
    moveToDate(date)
    await nextTick()
    const root = rootRef?.value
    if (!root) return
    const element = root.querySelector<HTMLElement>(`[data-nv-day="${getDayId(date)}"]`)
    if (!element) return
    focusRingDay.value = getDayId(date)
    element.focus()
  }

  function keyboardTarget(day: CalendarDay, event: KeyboardEvent): Date | null {
    switch (event.key) {
      case 'ArrowLeft': return addDays(day.date, -1)
      case 'ArrowRight': return addDays(day.date, 1)
      case 'ArrowUp': return addDays(day.date, -7)
      case 'ArrowDown': return addDays(day.date, 7)
      case 'Home': return addDays(day.date, -(day.weekdayPosition - 1))
      case 'End': return addDays(day.date, 7 - day.weekdayPosition)
      case 'PageUp': return addMonths(day.date, event.shiftKey ? -12 : -1)
      case 'PageDown': return addMonths(day.date, event.shiftKey ? 12 : 1)
      default: return null
    }
  }

  function onDayKeydown(day: CalendarDay, event: KeyboardEvent) {
    emit('daykeydown', day, event)
    if (props.disableKeyboardNavigation) return

    const target = keyboardTarget(day, event)
    if (!target) return
    event.preventDefault()
    void focusDay(target)
  }

  const { isDark, themeClass, themeStyle } = useCalendarTheme(props)

  const transitionName = computed(() => {
    const name = props.transition ?? defaults.transition ?? 'slide-h'
    if (name === 'none' || direction.value === 'none') return undefined
    if (name === 'fade') return 'nv-fade'
    const axis = name === 'slide-v' ? 'v' : 'h'
    return `nv-slide-${axis}-${direction.value}`
  })

  const rootClass = computed(() => [
    ...themeClass.value,
    {
      'nv-expanded': props.expanded ?? defaults.expanded ?? false,
      'nv-borderless': props.borderless ?? defaults.borderless ?? false,
      'nv-transparent': props.transparent ?? defaults.transparent ?? false,
    },
  ])

  const touch = { x: 0, y: 0, active: false }

  function onTouchStart(event: TouchEvent) {
    if (props.disablePageSwipe) return
    const point = event.touches[0]
    if (!point) return
    touch.x = point.clientX
    touch.y = point.clientY
    touch.active = true
  }

  function onTouchEnd(event: TouchEvent) {
    if (!touch.active || props.disablePageSwipe) return
    touch.active = false
    const point = event.changedTouches[0]
    if (!point) return
    const dx = point.clientX - touch.x
    const dy = point.clientY - touch.y
    if (Math.abs(dx) < 60 || Math.abs(dx) < Math.abs(dy) * 1.5) return
    if (dx > 0) movePrev()
    else moveNext()
  }

  const weekdayLabels = computed(() => {
    const mask = locale.value.masks.weekdays
    return locale.value.getWeekdayOrder(firstDayOfWeek.value).map(weekday => ({
      weekday,
      label: locale.value.format(addDays(new Date(2000, 0, 2), weekday), mask),
      ariaLabel: locale.value.weekdayName(weekday, 'long'),
      isWeekend: weekday === 0 || weekday === 6,
    }))
  })

  return {
    locale,
    firstDayOfWeek,
    minDate,
    maxDate,
    todayDate,
    attributes,
    pages: pages as ComputedRef<CalendarPage[]>,
    fromPage,
    paneCount,
    rows,
    columns,
    canMovePrev,
    canMoveNext,
    movePrev,
    moveNext,
    moveBy,
    moveToPage,
    moveToDate,
    focusDate,
    focusDay,
    hasFocusRing,
    clearFocusRing,
    isTabDay,
    onDayKeydown,
    isDark,
    rootClass,
    themeClass,
    themeStyle,
    transitionName,
    weekdayLabels,
    onTouchStart,
    onTouchEnd,
  }
}

export type UseCalendarReturn = ReturnType<typeof useCalendar>
