<script setup lang="ts">
import { computed, ref } from 'vue'
import type { CalendarDay } from '../../../src/runtime/types'
import source from './slots.vue?raw'

provideDemoSource(source)

const { t, tc, calendarLocale } = useI18n()
const { theme } = useSiteTheme()
const { day } = useDemoMonth()

useHead({ title: () => t('demo.slots.title') })

const calendar = ref()
const events = ref<string[]>([])
const selected = ref<Date | null>(day(12))

function log(name: string, detail: string) {
  events.value = [`${new Date().toLocaleTimeString()}  ${name}: ${detail}`, ...events.value].slice(0, 10)
}

const workload = computed(() => [
  { key: 'a', dates: day(6), customData: { hours: 2 }, popover: 'Light day' },
  { key: 'b', dates: day(13), customData: { hours: 6 }, popover: 'Busy day' },
  { key: 'c', dates: day(20), customData: { hours: 9 }, popover: 'Overbooked' },
])

function hoursFor(item: CalendarDay): number | null {
  const attribute = item.attributes.find(entry => (entry.customData as { hours?: number })?.hours)
  return (attribute?.customData as { hours?: number })?.hours ?? null
}

const button = 'rounded-lg border border-line bg-surface px-3 py-1.5 text-xs text-ink-muted transition-colors hover:text-ink active:scale-96'
</script>

<template>
  <div>
    <h1 class="text-2xl font-semibold">
      {{ t('demo.slots.title') }}
    </h1>
    <p class="mt-2 max-w-2xl text-ink-muted">
      {{ t('demo.slots.lead') }}
    </p>

    <div class="mt-8 grid gap-5 lg:grid-cols-2">
      <DemoCard
        id="dayContent"
        v-bind="tc('demo.slots.cards.dayContent')"
        tag="#day-content"
      >
        <NvCalendar
          v-bind="theme"
          :locale="calendarLocale"
          :attributes="workload"
          expanded
        >
          <template #day-content="{ day: item }">
            <span class="flex flex-col items-center leading-tight">
              <span>{{ item.day }}</span>
              <span
                v-if="hoursFor(item)"
                class="text-[9px] opacity-70"
              >{{ hoursFor(item) }}h</span>
            </span>
          </template>
        </NvCalendar>
      </DemoCard>

      <DemoCard
        id="dayPopover"
        v-bind="tc('demo.slots.cards.dayPopover')"
        tag="#day-popover"
      >
        <NvCalendar
          v-bind="theme"
          :locale="calendarLocale"
          :attributes="workload"
          expanded
        >
          <template #day-popover="{ day: item, attributes }">
            <div class="grid gap-1 text-sm">
              <strong>{{ item.ariaLabel }}</strong>
              <div
                v-for="attribute in attributes"
                :key="attribute.key"
              >
                {{ attribute.popover?.label }} ·
                {{ (attribute.customData as { hours?: number })?.hours }}h
              </div>
            </div>
          </template>
        </NvCalendar>
      </DemoCard>

      <DemoCard
        id="header"
        v-bind="tc('demo.slots.cards.header')"
        tag="#header-title · #weekday · #footer"
      >
        <NvCalendar
          v-bind="theme"
          :locale="calendarLocale"
          show-weeknumbers
          expanded
        >
          <template #header-prev-button="{ move, disabled }">
            <button
              type="button"
              :class="button"
              :disabled="disabled"
              @click="move()"
            >
              ‹
            </button>
          </template>
          <template #header-next-button="{ move, disabled }">
            <button
              type="button"
              :class="button"
              :disabled="disabled"
              @click="move()"
            >
              ›
            </button>
          </template>
          <template #header-title="{ page }">
            <span class="text-sm font-semibold">
              {{ page.monthLabel }} <span class="opacity-50">{{ page.year }}</span>
            </span>
          </template>
          <template #weekday="{ weekday }">
            <span class="text-[11px] uppercase">{{ weekday.ariaLabel.slice(0, 2) }}</span>
          </template>
          <template #weeknumber="{ week }">
            <span class="text-[10px] opacity-60">#{{ week.isoWeeknumber }}</span>
          </template>
          <template #footer>
            <p class="text-center text-xs opacity-60">
              #footer
            </p>
          </template>
        </NvCalendar>
      </DemoCard>

      <DemoCard
        id="methods"
        v-bind="tc('demo.slots.cards.methods')"
        tag="moveToDate · focusDay"
      >
        <div class="flex w-full flex-wrap gap-2">
          <button
            type="button"
            :class="button"
            @click="calendar?.movePrev()"
          >
            movePrev()
          </button>
          <button
            type="button"
            :class="button"
            @click="calendar?.moveNext()"
          >
            moveNext()
          </button>
          <button
            type="button"
            :class="button"
            @click="calendar?.moveBy(6)"
          >
            moveBy(6)
          </button>
          <button
            type="button"
            :class="button"
            @click="calendar?.moveToDate(new Date(2027, 0, 15))"
          >
            moveToDate(2027-01-15)
          </button>
          <button
            type="button"
            :class="button"
            @click="calendar?.focusDay(new Date())"
          >
            focusDay(today)
          </button>
        </div>

        <NvCalendar
          ref="calendar"
          v-bind="theme"
          :locale="calendarLocale"
          expanded
        />
      </DemoCard>

      <DemoCard
        id="events"
        v-bind="tc('demo.slots.cards.events')"
        tag="dayclick · drag · did-move"
      >
        <NvDatePicker
          v-model="selected"
          v-bind="theme"
          :locale="calendarLocale"
          selection="range"
          expanded
          @dayclick="(item: CalendarDay) => log('dayclick', item.id)"
          @did-move="(pages: { month: number, year: number }[]) => log('did-move', pages.map(p => `${p.year}-${p.month}`).join(', '))"
          @drag="(value: { start: Date | null }) => log('drag', String(value.start?.toDateString()))"
        />
        <template #value>
          <div
            v-for="(entry, index) in events"
            :key="index"
          >
            {{ entry }}
          </div>
          <div v-if="!events.length">
            {{ t('demo.slots.log') }}
          </div>
        </template>
      </DemoCard>
    </div>
  </div>
</template>
