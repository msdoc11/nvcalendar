<script setup lang="ts">
import { computed, ref } from 'vue'
import type { CalendarDay, CalendarPage, PageAddress } from '../types'
import { calendarProps } from '../props'
import { useCalendar } from '../composables/useCalendar'
import { useCalendarDefaults } from '../composables/useDefaults'
import { addToPage } from '../utils/page'
import {
  buildDayRender,
  getIndicatorLayer,
  getPopoverAttributes,
  getPopoverVisibility,
} from '../utils/render'
import NvCalendarNav from './NvCalendarNav.vue'
import NvPopover from './NvPopover.vue'

defineOptions({ name: 'NvCalendar' })

const props = defineProps(calendarProps)

const emit = defineEmits<{
  'update:page': [page: PageAddress]
  'did-move': [pages: PageAddress[]]
  'dayclick': [day: CalendarDay, event: MouseEvent]
  'daymouseenter': [day: CalendarDay, event: MouseEvent]
  'daymouseleave': [day: CalendarDay, event: MouseEvent]
  'dayfocusin': [day: CalendarDay, event: FocusEvent]
  'dayfocusout': [day: CalendarDay, event: FocusEvent]
  'daykeydown': [day: CalendarDay, event: KeyboardEvent]
  'weeknumberclick': [week: number, days: CalendarDay[]]
}>()

const rootRef = ref<HTMLElement | null>(null)
const defaults = useCalendarDefaults()

const calendar = useCalendar(props, {
  emit: emit as unknown as (event: string, ...args: unknown[]) => void,
  rootRef,
})

const {
  locale,
  pages,
  minDate: minDateValue,
  maxDate: maxDateValue,
  canMovePrev,
  canMoveNext,
  movePrev,
  moveNext,
  moveBy,
  moveToPage,
  moveToDate,
  focusDay,
  hasFocusRing,
  clearFocusRing,
  isTabDay,
  onDayKeydown,
  rootClass,
  themeClass,
  themeStyle,
  transitionName,
  weekdayLabels,
  onTouchStart,
  onTouchEnd,
} = calendar

const titlePosition = computed(() => props.titlePosition ?? defaults.titlePosition ?? 'center')

const weeknumberSide = computed<'left' | 'right' | null>(() => {
  const value = props.showIsoWeeknumbers || props.showWeeknumbers
  if (!value) return null
  if (value === true) return 'left'
  return String(value).startsWith('right') ? 'right' : 'left'
})

const useIsoWeeknumbers = computed(() => Boolean(props.showIsoWeeknumbers))

const layoutStyle = computed(() => ({
  gridTemplateColumns: `repeat(${Math.max(1, props.columns)}, minmax(0, 1fr))`,
}))

const weekGridStyle = computed(() => {
  const left = weeknumberSide.value === 'left' ? 'var(--nv-weeknumber-width) ' : ''
  const right = weeknumberSide.value === 'right' ? ' var(--nv-weeknumber-width)' : ''
  return { gridTemplateColumns: `${left}repeat(7, minmax(0, 1fr))${right}` }
})

const paneKey = computed(() => pages.value.map(page => page.id).join('|'))

const renderedPages = computed(() => pages.value.map(page => ({
  page,
  weeks: page.weeks.map(week => ({
    week,
    days: week.days.map(day => ({ day, render: buildDayRender(day) })),
  })),
})))

function weeknumberFor(week: { weeknumber: number, isoWeeknumber: number }): number {
  return useIsoWeeknumbers.value ? week.isoWeeknumber : week.weeknumber
}

const navVisible = ref(false)
const navAnchor = ref<HTMLElement | null>(null)
const navPage = ref<PageAddress>({ month: 1, year: 2000 })

function openNav(page: CalendarPage, event: MouseEvent) {
  if (props.navVisibility === 'hidden') return
  navAnchor.value = event.currentTarget as HTMLElement
  navPage.value = { month: page.month, year: page.year }
  navVisible.value = !navVisible.value
}

function onNavSelect(address: PageAddress) {
  const offset = pages.value.findIndex(page =>
    page.month === navPage.value.month && page.year === navPage.value.year)
  moveToPage(addToPage(address, -Math.max(0, offset)))
}

const popoverVisible = ref(false)
const popoverAnchor = ref<HTMLElement | null>(null)
const popoverDay = ref<CalendarDay | null>(null)
let showTimer: ReturnType<typeof setTimeout> | null = null
let hideTimer: ReturnType<typeof setTimeout> | null = null

const popoverDelay = computed(() => props.popoverDelay ?? defaults.popoverDelay ?? 120)

function clearTimers() {
  if (showTimer) clearTimeout(showTimer)
  if (hideTimer) clearTimeout(hideTimer)
  showTimer = null
  hideTimer = null
}

function showPopover(day: CalendarDay, anchor: HTMLElement, delay = 0) {
  clearTimers()
  const open = () => {
    popoverDay.value = day
    popoverAnchor.value = anchor
    popoverVisible.value = true
  }
  if (delay > 0 && !popoverVisible.value) showTimer = setTimeout(open, delay)
  else open()
}

function hidePopover(immediate = false) {
  clearTimers()
  if (immediate) {
    popoverVisible.value = false
    return
  }
  hideTimer = setTimeout(() => {
    popoverVisible.value = false
  }, 160)
}

const popoverAttributes = computed(() => (popoverDay.value ? getPopoverAttributes(popoverDay.value) : []))

const popoverInteractive = computed(() =>
  popoverAttributes.value.some(attribute => attribute.popover?.isInteractive))

const popoverTitle = computed(() => (popoverDay.value
  ? locale.value.format(popoverDay.value.date, locale.value.masks.dayPopover)
  : ''))

function onDayClick(day: CalendarDay, event: MouseEvent) {
  emit('dayclick', day, event)
  const visibility = getPopoverVisibility(day)
  if (visibility === 'click') {
    if (popoverVisible.value && popoverDay.value?.id === day.id) hidePopover(true)
    else showPopover(day, event.currentTarget as HTMLElement)
  }
}

function onDayMouseEnter(day: CalendarDay, event: MouseEvent) {
  emit('daymouseenter', day, event)
  const visibility = getPopoverVisibility(day)
  if (visibility === 'hover' || visibility === 'visible') {
    showPopover(day, event.currentTarget as HTMLElement, popoverDelay.value)
  }
}

function onDayMouseLeave(day: CalendarDay, event: MouseEvent) {
  emit('daymouseleave', day, event)
  const visibility = getPopoverVisibility(day)
  if ((visibility === 'hover' || visibility === 'visible') && popoverDay.value?.id === day.id) {
    hidePopover()
  }
}

function onDayFocusIn(day: CalendarDay, event: FocusEvent) {
  emit('dayfocusin', day, event)
  calendar.focusDate.value = day.date
  if (!hasFocusRing(day)) clearFocusRing()
  if (getPopoverVisibility(day) === 'focus') {
    showPopover(day, event.currentTarget as HTMLElement)
  }
}

function onDayFocusOut(day: CalendarDay, event: FocusEvent) {
  emit('dayfocusout', day, event)
  clearFocusRing(day)
  if (getPopoverVisibility(day) === 'focus' && popoverDay.value?.id === day.id) hidePopover()
}

function onWeeknumberClick(week: { week: number, days: CalendarDay[] }) {
  emit('weeknumberclick', week.week, week.days)
}

defineExpose({
  pages,
  movePrev,
  moveNext,
  moveBy,
  moveToPage,
  moveToDate,
  focusDay,
  locale,
})
</script>

<template>
  <div
    ref="rootRef"
    class="nv-calendar"
    :class="rootClass"
    :style="themeStyle"
    @touchstart.passive="onTouchStart"
    @touchend.passive="onTouchEnd"
  >
    <div class="nv-panes">
      <Transition :name="transitionName">
        <div
          :key="paneKey"
          class="nv-pane-layout"
          :style="layoutStyle"
        >
          <div
            v-for="{ page, weeks } in renderedPages"
            :key="page.id"
            class="nv-pane"
            :class="{
              'nv-pane--first-column': page.column === 1,
              'nv-pane--first-row': page.row === 1,
            }"
          >
            <div
              v-if="!hideHeader"
              class="nv-header"
              :class="`nv-header--${titlePosition}`"
            >
              <div class="nv-header-slot nv-header-slot--prev">
                <slot
                  v-if="page.position === 1 && !hideArrows"
                  name="header-prev-button"
                  :move="movePrev"
                  :disabled="!canMovePrev"
                >
                  <button
                    type="button"
                    class="nv-arrow nv-arrow--prev"
                    :disabled="!canMovePrev"
                    aria-label="Previous month"
                    @click="movePrev()"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      class="nv-icon"
                      aria-hidden="true"
                    ><path
                      d="M15 5 8 12l7 7"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    /></svg>
                  </button>
                </slot>
              </div>

              <slot
                name="header-title"
                :page="page"
                :title="page.title"
              >
                <button
                  type="button"
                  class="nv-title"
                  :class="{ 'nv-title--static': navVisibility === 'hidden' }"
                  :aria-label="page.title"
                  @click="openNav(page, $event)"
                  @mouseenter="navVisibility === 'hover' && openNav(page, $event)"
                  @focus="navVisibility === 'focus' && openNav(page, $event)"
                >
                  {{ page.title }}
                </button>
              </slot>

              <div class="nv-header-slot nv-header-slot--next">
                <slot
                  v-if="page.position === pages.length && !hideArrows"
                  name="header-next-button"
                  :move="moveNext"
                  :disabled="!canMoveNext"
                >
                  <button
                    type="button"
                    class="nv-arrow nv-arrow--next"
                    :disabled="!canMoveNext"
                    aria-label="Next month"
                    @click="moveNext()"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      class="nv-icon"
                      aria-hidden="true"
                    ><path
                      d="m9 5 7 7-7 7"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    /></svg>
                  </button>
                </slot>
              </div>
            </div>

            <div
              v-if="!hideWeekdays"
              class="nv-weekdays"
              :style="weekGridStyle"
              role="row"
            >
              <div
                v-if="weeknumberSide === 'left'"
                class="nv-weeknumber-header"
              />
              <div
                v-for="weekday in weekdayLabels"
                :key="weekday.weekday"
                class="nv-weekday"
                :class="{ 'nv-weekday--weekend': weekday.isWeekend }"
                role="columnheader"
                :aria-label="weekday.ariaLabel"
              >
                <slot
                  name="weekday"
                  :weekday="weekday"
                >
                  {{ weekday.label }}
                </slot>
              </div>
              <div
                v-if="weeknumberSide === 'right'"
                class="nv-weeknumber-header"
              />
            </div>

            <div
              class="nv-weeks"
              role="grid"
              :aria-label="page.title"
            >
              <div
                v-for="row in weeks"
                :key="row.week.id"
                class="nv-week"
                :style="weekGridStyle"
                role="row"
              >
                <button
                  v-if="weeknumberSide === 'left'"
                  type="button"
                  class="nv-weeknumber"
                  @click="onWeeknumberClick(row.week)"
                >
                  <slot
                    name="weeknumber"
                    :week="row.week"
                  >
                    {{ weeknumberFor(row.week) }}
                  </slot>
                </button>

                <div
                  v-for="{ day, render } in row.days"
                  :key="day.id"
                  class="nv-day"
                  :class="render.class"
                  :style="render.style"
                  role="gridcell"
                >
                  <div
                    v-if="render.highlights.length"
                    class="nv-day-layer nv-highlights"
                  >
                    <div
                      v-for="layer in render.highlights"
                      :key="layer.key"
                      :class="layer.class"
                      :style="layer.style"
                    />
                  </div>

                  <button
                    type="button"
                    class="nv-day-content"
                    :class="[render.contentClass, { 'nv-day-content--focused': hasFocusRing(day) }]"
                    :style="render.contentStyle"
                    :data-nv-day="day.id"
                    :tabindex="isTabDay(day) ? 0 : -1"
                    :disabled="day.isDisabled"
                    :aria-label="day.ariaLabel"
                    :aria-disabled="day.isDisabled || undefined"
                    @click="onDayClick(day, $event)"
                    @mouseenter="onDayMouseEnter(day, $event)"
                    @mouseleave="onDayMouseLeave(day, $event)"
                    @focusin="onDayFocusIn(day, $event)"
                    @focusout="onDayFocusOut(day, $event)"
                    @keydown="onDayKeydown(day, $event)"
                  >
                    <slot
                      name="day-content"
                      :day="day"
                      :attributes="day.attributes"
                    >
                      {{ day.label }}
                    </slot>
                  </button>

                  <div
                    v-if="render.dots.length"
                    class="nv-day-layer nv-dots"
                  >
                    <span
                      v-for="layer in render.dots"
                      :key="layer.key"
                      :class="layer.class"
                      :style="layer.style"
                    />
                  </div>

                  <div
                    v-if="render.bars.length"
                    class="nv-day-layer nv-bars"
                  >
                    <span
                      v-for="layer in render.bars"
                      :key="layer.key"
                      :class="layer.class"
                      :style="layer.style"
                    />
                  </div>
                </div>

                <button
                  v-if="weeknumberSide === 'right'"
                  type="button"
                  class="nv-weeknumber"
                  @click="onWeeknumberClick(row.week)"
                >
                  <slot
                    name="weeknumber"
                    :week="row.week"
                  >
                    {{ weeknumberFor(row.week) }}
                  </slot>
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </div>

    <div
      v-if="$slots.footer"
      class="nv-footer"
    >
      <slot name="footer" />
    </div>

    <NvCalendarNav
      v-model="navVisible"
      :anchor="navAnchor"
      :page="navPage"
      :locale="locale"
      :min-date="minDateValue"
      :max-date="maxDateValue"
      :theme-class="themeClass"
      :theme-style="themeStyle"
      @select="onNavSelect"
    />

    <NvPopover
      v-model="popoverVisible"
      :anchor="popoverAnchor"
      :placement="popoverPlacement"
      :content-class="['nv-day-popover', themeClass]"
      :style="themeStyle"
      :interactive="popoverInteractive"
      role="tooltip"
      @mouseenter="clearTimers()"
      @mouseleave="hidePopover()"
    >
      <slot
        v-if="popoverDay"
        name="day-popover"
        :day="popoverDay"
        :attributes="popoverAttributes"
        :hide="() => hidePopover(true)"
        :title="popoverTitle"
      >
        <div class="nv-day-popover-title">
          {{ popoverTitle }}
        </div>
        <div
          v-for="attribute in popoverAttributes"
          :key="attribute.key"
          class="nv-day-popover-row"
        >
          <span
            v-if="!attribute.popover?.hideIndicator"
            :class="getIndicatorLayer(attribute).class"
            :style="getIndicatorLayer(attribute).style"
          />
          <span class="nv-day-popover-label">{{ attribute.popover?.label }}</span>
        </div>
      </slot>
    </NvPopover>
  </div>
</template>
