<script setup lang="ts">
import { ref } from 'vue'
import source from './locales.vue?raw'

provideDemoSource(source)

const { t, tc } = useI18n()
const { theme } = useSiteTheme()

useHead({ title: () => t('demo.locales.title') })

const current = ref('ru-RU')
const picked = ref<Date | null>(new Date())

const masks = ref({ title: 'MMMM YYYY', weekdays: 'dd', navMonths: 'MMM' })

const maskPresets = [
  { label: 'default', value: { title: 'MMMM YYYY', weekdays: 'dd', navMonths: 'MMM' } },
  { label: 'short', value: { title: 'MMM YY', weekdays: 'ddd', navMonths: 'MM' } },
  { label: 'long', value: { title: '[Month of] MMMM', weekdays: 'ddd', navMonths: 'MMMM' } },
]

const gallery = [
  { id: 'en-US', label: 'English (US)' },
  { id: 'en-GB', label: 'English (UK)' },
  { id: 'ru-RU', label: 'Русский' },
  { id: 'de-DE', label: 'Deutsch' },
  { id: 'fr-FR', label: 'Français' },
  { id: 'es-ES', label: 'Español' },
  { id: 'ja-JP', label: '日本語' },
  { id: 'zh-CN', label: '中文' },
  { id: 'ar-EG', label: 'العربية' },
  { id: 'he-IL', label: 'עברית' },
  { id: 'ko-KR', label: '한국어' },
  { id: 'pt-BR', label: 'Português' },
]
</script>

<template>
  <div>
    <h1 class="text-2xl font-semibold">
      {{ t('demo.locales.title') }}
    </h1>
    <p class="mt-2 max-w-2xl text-ink-muted">
      {{ t('demo.locales.lead') }}
    </p>

    <div class="mt-8 grid gap-5 lg:grid-cols-2">
      <DemoCard
        id="pick"
        v-bind="tc('demo.locales.cards.pick')"
      >
        <label class="flex w-full items-center gap-2 text-sm text-ink-muted">
          <span>{{ t('demo.controls.locale') }}</span>
          <select
            v-model="current"
            class="rounded-lg border border-line bg-surface px-2 py-1 text-sm text-ink"
          >
            <option
              v-for="item in gallery"
              :key="item.id"
              :value="item.id"
            >
              {{ item.label }} — {{ item.id }}
            </option>
          </select>
        </label>

        <NvDatePicker
          v-model="picked"
          v-bind="theme"
          :locale="current"
        >
          <template #default="{ inputValue, inputEvents }">
            <input
              class="w-56 rounded-lg border border-line bg-surface px-3 py-2 text-sm text-ink"
              :value="inputValue"
              v-on="inputEvents"
            >
          </template>
        </NvDatePicker>
        <template #value>
          {{ picked }}
        </template>
      </DemoCard>

      <DemoCard
        id="masks"
        v-bind="tc('demo.locales.cards.masks')"
        tag="masks"
      >
        <div class="flex w-full flex-wrap gap-2">
          <button
            v-for="preset in maskPresets"
            :key="preset.label"
            type="button"
            class="rounded-lg border border-line bg-surface px-3 py-1.5 text-xs text-ink-muted transition-colors hover:text-ink active:scale-96"
            @click="masks = { ...preset.value }"
          >
            {{ preset.label }}
          </button>
        </div>

        <NvCalendar
          v-bind="theme"
          :locale="current"
          :masks="masks"
        />
        <template #value>
          {{ masks }}
        </template>
      </DemoCard>
    </div>

    <h2 class="mt-12 text-lg font-semibold">
      {{ t('demo.locales.gallery') }}
    </h2>
    <ul class="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <li
        v-for="item in gallery"
        :key="item.id"
        class="rounded-card border border-line bg-surface p-3 [contain-intrinsic-size:auto_20rem] [content-visibility:auto]"
      >
        <NvCalendar
          v-bind="theme"
          :locale="item.id"
          trim-weeks
          borderless
          expanded
        />
        <p class="mt-2 text-center text-xs text-ink-faint">
          {{ item.label }} · {{ item.id }}
        </p>
      </li>
    </ul>
  </div>
</template>
