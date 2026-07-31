<script setup lang="ts">
import { computed, ref } from 'vue'
import source from './theming.vue?raw'

provideDemoSource(source)

const { t, tc, calendarLocale } = useI18n()
const { isDark } = useSiteTheme()
const { day } = useDemoMonth()

useHead({ title: () => t('demo.theming.title') })

const customColor = ref('#ff6b35')

const sample = computed(() => [
  { key: 'range', dates: { start: day(8), end: day(12) }, highlight: true },
  { key: 'dot', dates: day(17), dot: true },
  { key: 'bar', dates: day(20), bar: true },
])
</script>

<template>
  <div>
    <h1 class="text-2xl font-semibold">
      {{ t('demo.theming.title') }}
    </h1>
    <p class="mt-2 max-w-2xl text-ink-muted">
      {{ t('demo.theming.lead') }}
    </p>

    <div class="mt-8 grid gap-5 lg:grid-cols-2">
      <DemoCard
        id="custom"
        v-bind="tc('demo.theming.cards.custom')"
        tag="color"
      >
        <label class="flex w-full items-center gap-3 text-sm text-ink-muted">
          <span>{{ t('demo.controls.colour') }}</span>
          <input
            v-model="customColor"
            type="color"
            class="h-8 w-12 cursor-pointer rounded border-0 bg-transparent p-0"
          >
          <code class="font-mono text-xs">{{ customColor }}</code>
        </label>

        <NvCalendar
          :color="customColor"
          :is-dark="isDark"
          :locale="calendarLocale"
          :attributes="sample"
        />
      </DemoCard>

      <DemoCard
        id="vars"
        v-bind="tc('demo.theming.cards.vars')"
        tag="--nv-day-content-size"
      >
        <NvCalendar
          class="chunky"
          :is-dark="isDark"
          :locale="calendarLocale"
          :attributes="sample"
          trim-weeks
        />
      </DemoCard>

      <DemoCard
        id="forced"
        v-bind="tc('demo.theming.cards.forced')"
        tag="is-dark"
      >
        <NvCalendar
          color="indigo"
          :is-dark="false"
          :locale="calendarLocale"
          trim-weeks
        />
        <NvCalendar
          color="indigo"
          :is-dark="true"
          :locale="calendarLocale"
          trim-weeks
        />
      </DemoCard>
    </div>

    <h2 class="mt-12 text-lg font-semibold">
      {{ t('demo.theming.presets') }}
    </h2>
    <ul class="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <li
        v-for="preset in ACCENTS"
        :key="preset"
        class="rounded-card border border-line bg-surface p-3 [contain-intrinsic-size:auto_18rem] [content-visibility:auto]"
      >
        <NvCalendar
          :color="preset"
          :is-dark="isDark"
          :locale="calendarLocale"
          :attributes="sample"
          trim-weeks
          hide-weekdays
          borderless
          expanded
        />
        <p class="mt-2 text-center text-xs text-ink-faint">
          {{ preset }}
        </p>
      </li>
    </ul>
  </div>
</template>

<style>
.chunky {
  --nv-day-content-size: 40px;
  --nv-day-min-height: 46px;
  --nv-radius: 4px;
  --nv-radius-sm: 2px;
  --nv-font-size: 16px;
  --nv-pane-min-width: 300px;
}

.chunky .nv-highlight--circle {
  border-radius: 4px;
}
</style>
