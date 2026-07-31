<script setup lang="ts">
import { ref } from 'vue'
import {
  PICKER_INPUT,
  PICKER_MODEL,
  PICKER_MODES,
  PICKER_RANGE_INPUT,
  PICKER_TIME,
} from '../../utils/snippets'

const { t, calendarLocale } = useI18n()
const { theme } = useSiteTheme()
const { day } = useDemoMonth()

useHead({ title: () => t('docs.picker.title') })

const single = ref<Date | null>(day(12))
const range = ref({ start: day(8), end: day(14) })
const attached = ref<Date | null>(day(12))
</script>

<template>
  <article class="prose">
    <h1 class="text-3xl font-semibold">
      {{ t('docs.picker.title') }}
    </h1>
    <p class="text-lg">
      {{ t('docs.picker.lead') }}
    </p>

    <h2 id="modes">
      {{ t('docs.picker.modesTitle') }}
    </h2>
    <p>{{ t('docs.picker.modesText') }}</p>
    <CodeBlock :code="PICKER_MODES" />
    <div class="not-prose grid gap-4 rounded-card border border-line bg-surface-2 p-4 sm:grid-cols-2">
      <div class="flex justify-center">
        <NvDatePicker
          v-model="single"
          v-bind="theme"
          :locale="calendarLocale"
        />
      </div>
      <div class="flex justify-center">
        <NvDatePicker
          v-model="range"
          v-bind="theme"
          :locale="calendarLocale"
          selection="range"
        />
      </div>
    </div>

    <h2 id="time">
      {{ t('docs.picker.timeTitle') }}
    </h2>
    <p>{{ t('docs.picker.timeText') }}</p>
    <CodeBlock :code="PICKER_TIME" />

    <h2 id="input">
      {{ t('docs.picker.inputTitle') }}
    </h2>
    <p>{{ t('docs.picker.inputText') }}</p>
    <CodeBlock :code="PICKER_INPUT" />
    <div class="not-prose rounded-card border border-line bg-surface-2 p-4">
      <NvDatePicker
        v-model="attached"
        v-bind="theme"
        :locale="calendarLocale"
      >
        <template #default="{ inputValue, inputEvents }">
          <input
            class="w-56 rounded-lg border border-line bg-surface px-3 py-2 text-sm text-ink"
            :value="inputValue"
            v-on="inputEvents"
          >
        </template>
      </NvDatePicker>
    </div>
    <CodeBlock :code="PICKER_RANGE_INPUT" />

    <h2 id="model">
      {{ t('docs.picker.modelTitle') }}
    </h2>
    <p>{{ t('docs.picker.modelText') }}</p>
    <CodeBlock :code="PICKER_MODEL" />
  </article>
</template>
