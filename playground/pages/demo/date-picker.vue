<script setup lang="ts">
import { ref } from 'vue'
import source from './date-picker.vue?raw'

provideDemoSource(source)

const { t, tc, calendarLocale } = useI18n()
const { theme } = useSiteTheme()
const { day } = useDemoMonth()

useHead({ title: () => t('demo.picker.title') })

const single = ref<Date | null>(day(12))
const noClear = ref<Date | null>(day(12))
const multiple = ref<Date[]>([day(4), day(9), day(17)])
const range = ref({ start: day(8), end: day(14) })
const rangeTwo = ref({ start: day(20), end: null as Date | null })
const spanRange = ref({ start: null as Date | null, end: null as Date | null })
const styled = ref({ start: day(6), end: day(11) })
const disabled = ref<Date | null>(null)
const asString = ref('2026-07-15')
const asNumber = ref(day(10).getTime())

const selectAttribute = {
  highlight: { color: 'pink', fillMode: 'solid' },
  popover: { label: 'Selected' },
}

const dragAttribute = {
  highlight: {
    start: { color: 'orange' },
    base: { color: 'orange', fillMode: 'light' },
    end: { color: 'orange' },
  },
}
</script>

<template>
  <div>
    <h1 class="text-2xl font-semibold">
      {{ t('demo.picker.title') }}
    </h1>
    <p class="mt-2 max-w-2xl text-ink-muted">
      {{ t('demo.picker.lead') }}
    </p>

    <div class="mt-8 grid gap-5 lg:grid-cols-2">
      <DemoCard
        id="single"
        v-bind="tc('demo.picker.cards.single')"
      >
        <NvDatePicker
          v-model="single"
          v-bind="theme"
          :locale="calendarLocale"
        />
        <template #value>
          {{ single }}
        </template>
      </DemoCard>

      <DemoCard
        id="noClear"
        v-bind="tc('demo.picker.cards.noClear')"
        tag=":allow-clear=&quot;false&quot;"
      >
        <NvDatePicker
          v-model="noClear"
          v-bind="theme"
          :locale="calendarLocale"
          :allow-clear="false"
        />
        <template #value>
          {{ noClear }}
        </template>
      </DemoCard>

      <DemoCard
        id="multiple"
        v-bind="tc('demo.picker.cards.multiple')"
        tag="selection=&quot;multiple&quot;"
      >
        <NvDatePicker
          v-model="multiple"
          v-bind="theme"
          :locale="calendarLocale"
          selection="multiple"
        />
        <template #value>
          {{ multiple.length }}
        </template>
      </DemoCard>

      <DemoCard
        id="range"
        v-bind="tc('demo.picker.cards.range')"
        tag="selection=&quot;range&quot;"
      >
        <NvDatePicker
          v-model="range"
          v-bind="theme"
          :locale="calendarLocale"
          selection="range"
        />
        <template #value>
          {{ range }}
        </template>
      </DemoCard>

      <DemoCard
        id="rangeTwo"
        v-bind="tc('demo.picker.cards.rangeTwo')"
        tag=":columns=&quot;2&quot;"
      >
        <NvDatePicker
          v-model="rangeTwo"
          v-bind="theme"
          :locale="calendarLocale"
          selection="range"
          :columns="2"
          trim-weeks
        />
        <template #value>
          {{ rangeTwo }}
        </template>
      </DemoCard>

      <DemoCard
        id="span"
        v-bind="tc('demo.picker.cards.span')"
        tag="min-range-span · max-range-span"
      >
        <NvDatePicker
          v-model="spanRange"
          v-bind="theme"
          :locale="calendarLocale"
          selection="range"
          :min-range-span="3"
          :max-range-span="7"
        />
        <template #value>
          {{ spanRange }}
        </template>
      </DemoCard>

      <DemoCard
        id="styled"
        v-bind="tc('demo.picker.cards.styled')"
        tag="select-attribute · drag-attribute"
      >
        <NvDatePicker
          v-model="styled"
          v-bind="theme"
          :locale="calendarLocale"
          selection="range"
          :select-attribute="selectAttribute"
          :drag-attribute="dragAttribute"
        />
        <template #value>
          {{ styled }}
        </template>
      </DemoCard>

      <DemoCard
        id="disabled"
        v-bind="tc('demo.picker.cards.disabled')"
        tag="disabled-dates"
      >
        <NvDatePicker
          v-model="disabled"
          v-bind="theme"
          :locale="calendarLocale"
          :disabled-dates="[{ repeat: { weekdays: [0, 6] } }, { start: day(10), end: day(13) }]"
        />
        <template #value>
          {{ disabled }}
        </template>
      </DemoCard>

      <DemoCard
        id="string"
        v-bind="tc('demo.picker.cards.string')"
        tag="v-model.string"
      >
        <NvDatePicker
          v-model.string="asString"
          v-bind="theme"
          :locale="calendarLocale"
        />
        <template #value>
          "{{ asString }}"
        </template>
      </DemoCard>

      <DemoCard
        id="number"
        v-bind="tc('demo.picker.cards.number')"
        tag="v-model.number"
      >
        <NvDatePicker
          v-model.number="asNumber"
          v-bind="theme"
          :locale="calendarLocale"
        />
        <template #value>
          {{ asNumber }}
        </template>
      </DemoCard>
    </div>
  </div>
</template>
