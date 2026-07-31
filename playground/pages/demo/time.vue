<script setup lang="ts">
import { ref } from 'vue'
import source from './time.vue?raw'

provideDemoSource(source)

const { t, tc, calendarLocale } = useI18n()
const { theme } = useSiteTheme()
const { day } = useDemoMonth()

useHead({ title: () => t('demo.time.title') })

const dateTime = ref(new Date())
const timeOnly = ref(new Date())
const hr24 = ref(new Date())
const accuracy = ref<1 | 2 | 3>(3)
const precise = ref(new Date())
const business = ref(new Date())
const rangeTime = ref({ start: day(8), end: day(10) })
</script>

<template>
  <div>
    <h1 class="text-2xl font-semibold">
      {{ t('demo.time.title') }}
    </h1>
    <p class="mt-2 max-w-2xl text-ink-muted">
      {{ t('demo.time.lead') }}
    </p>

    <div class="mt-8 grid gap-5 lg:grid-cols-2">
      <DemoCard
        id="dateTime"
        v-bind="tc('demo.time.cards.dateTime')"
        tag="mode=&quot;dateTime&quot;"
      >
        <NvDatePicker
          v-model="dateTime"
          v-bind="theme"
          :locale="calendarLocale"
          mode="dateTime"
        />
        <template #value>
          {{ dateTime }}
        </template>
      </DemoCard>

      <DemoCard
        id="timeOnly"
        v-bind="tc('demo.time.cards.timeOnly')"
        tag="mode=&quot;time&quot;"
      >
        <NvDatePicker
          v-model="timeOnly"
          v-bind="theme"
          :locale="calendarLocale"
          mode="time"
        />
        <template #value>
          {{ timeOnly }}
        </template>
      </DemoCard>

      <DemoCard
        id="hr24"
        v-bind="tc('demo.time.cards.hr24')"
        tag="is24hr"
      >
        <NvDatePicker
          v-model="hr24"
          v-bind="theme"
          :locale="calendarLocale"
          mode="dateTime"
          is24hr
        />
        <template #value>
          {{ hr24 }}
        </template>
      </DemoCard>

      <DemoCard
        id="accuracy"
        v-bind="tc('demo.time.cards.accuracy')"
        tag="time-accuracy"
      >
        <label class="flex w-full items-center gap-2 text-sm text-ink-muted">
          <span>{{ t('demo.controls.accuracy') }}</span>
          <select
            v-model.number="accuracy"
            class="rounded-lg border border-line bg-surface px-2 py-1 text-sm text-ink"
          >
            <option :value="1">
              1
            </option>
            <option :value="2">
              2
            </option>
            <option :value="3">
              3
            </option>
          </select>
        </label>

        <NvDatePicker
          v-model="precise"
          v-bind="theme"
          :locale="calendarLocale"
          mode="time"
          :time-accuracy="accuracy"
        />
        <template #value>
          {{ precise }}
        </template>
      </DemoCard>

      <DemoCard
        id="rules"
        v-bind="tc('demo.time.cards.rules')"
        tag="rules"
      >
        <NvDatePicker
          v-model="business"
          v-bind="theme"
          :locale="calendarLocale"
          mode="dateTime"
          is24hr
          :rules="{ hours: { min: 9, max: 18 }, minutes: { interval: 15 } }"
        />
        <template #value>
          {{ business }}
        </template>
      </DemoCard>

      <DemoCard
        id="range"
        v-bind="tc('demo.time.cards.range')"
        tag="selection=&quot;range&quot; mode=&quot;dateTime&quot;"
      >
        <NvDatePicker
          v-model="rangeTime"
          v-bind="theme"
          :locale="calendarLocale"
          selection="range"
          mode="dateTime"
          is24hr
        />
        <template #value>
          {{ rangeTime }}
        </template>
      </DemoCard>
    </div>
  </div>
</template>
