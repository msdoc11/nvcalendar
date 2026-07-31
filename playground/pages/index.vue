<script setup lang="ts">
import { computed, ref } from 'vue'
import { INSTALL_CLI, SHOWCASE } from '../utils/snippets'

const { t } = useI18n()
const { theme } = useSiteTheme()
const { day } = useDemoMonth()
const { calendarLocale } = useI18n()

const range = ref({ start: day(9), end: day(15) })
const copied = ref(false)

const heroAttributes = computed(() => [
  { key: 'standup', dot: 'emerald', dates: { repeat: { weekdays: [1, 3, 5] } } },
  { key: 'release', bar: 'orange', dates: { repeat: { ordinalWeekdays: { 2: 4 } } } },
])

const scheduleAttributes = computed(() => [
  {
    key: 'sprint',
    highlight: { color: 'teal', fillMode: 'light' },
    dates: { start: day(2), end: day(12) },
    popover: { label: 'Sprint 42' },
  },
  { key: 'standup', dot: 'emerald', dates: { repeat: { weekdays: [1, 3, 5] } }, popover: { label: 'Standup' } },
  { key: 'payday', bar: 'orange', dates: { repeat: { days: -1 } }, popover: { label: 'Payday' } },
  { key: 'review', highlight: { color: 'violet', fillMode: 'outline' }, dates: day(18), popover: { label: 'Review' } },
])

const features = [
  { key: 'calendar', icon: 'grid' },
  { key: 'picker', icon: 'cursor' },
  { key: 'attributes', icon: 'spark' },
  { key: 'intl', icon: 'globe' },
  { key: 'theming', icon: 'palette' },
  { key: 'a11y', icon: 'keyboard' },
] as const

async function copyInstall() {
  try {
    await navigator.clipboard.writeText(INSTALL_CLI)
    copied.value = true
    setTimeout(() => (copied.value = false), 1400)
  }
  catch {
    copied.value = false
  }
}
</script>

<template>
  <div>
    <section class="relative overflow-hidden border-b border-line">
      <div
        class="pointer-events-none absolute inset-x-0 -top-40 h-96 bg-[radial-gradient(60%_60%_at_50%_50%,var(--brand-soft),transparent)]"
        aria-hidden="true"
      />

      <div
        class="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-16 lg:py-24"
      >
        <div class="max-w-xl">
          <p
            class="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 font-mono text-xs text-ink-muted"
          >
            {{ t('hero.badge') }}
          </p>

          <h1 class="mt-5 text-hero font-semibold tracking-tight">
            {{ t('hero.title') }}
          </h1>

          <p class="mt-5 text-lg/relaxed text-ink-muted">
            {{ t('hero.subtitle') }}
          </p>

          <div class="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <NuxtLink
              to="/docs"
              class="inline-flex min-h-11 items-center justify-center rounded-xl bg-brand px-5 text-sm font-semibold text-on-brand no-underline shadow-e1 transition-colors hover:bg-brand-hover active:scale-96"
            >
              {{ t('hero.primary') }}
            </NuxtLink>
            <NuxtLink
              to="/demo"
              class="inline-flex min-h-11 items-center justify-center rounded-xl border border-line bg-surface px-5 text-sm font-semibold text-ink no-underline shadow-e1 transition-colors hover:border-line-strong hover:bg-surface-2 active:scale-96"
            >
              {{ t('hero.secondary') }}
            </NuxtLink>
          </div>

          <div
            class="mt-6 flex max-w-md items-center gap-2 rounded-xl border border-line bg-surface py-2 pl-4 pr-2 shadow-e1"
          >
            <code class="flex-1 overflow-x-auto whitespace-nowrap font-mono text-sm text-ink">{{ INSTALL_CLI }}</code>
            <button
              type="button"
              class="flex-none rounded-lg px-3 py-1.5 text-xs font-medium text-ink-muted transition-colors hover:bg-surface-2 hover:text-ink active:scale-96 cursor-pointer"
              @click="copyInstall"
            >
              {{ copied ? t('hero.copied') : t('hero.copy') }}
            </button>
          </div>
        </div>

        <div class="w-fit justify-self-center lg:justify-self-end">
          <div class="w-fit rounded-3xl border border-line bg-surface p-3 shadow-e3">
            <NvDatePicker
              v-model="range"
              v-bind="theme"
              :locale="calendarLocale"
              selection="range"
              :attributes="heroAttributes"
              borderless
              trim-weeks
            />
          </div>
          <p class="mt-3 text-center text-xs text-ink-faint">
            {{ t('hero.hint') }}
          </p>
        </div>
      </div>
    </section>

    <section class="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
      <h2 class="text-2xl font-semibold">
        {{ t('features.title') }}
      </h2>
      <p class="mt-3 max-w-2xl text-ink-muted">
        {{ t('features.lead') }}
      </p>

      <ul class="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <li
          v-for="feature in features"
          :key="feature.key"
          class="rounded-card border border-line bg-surface p-5 shadow-e1"
        >
          <span
            class="grid size-9 place-items-center rounded-inner bg-brand-soft text-brand-ink"
            aria-hidden="true"
          >
            <FeatureIcon :name="feature.icon" />
          </span>
          <h3 class="mt-4 font-semibold">
            {{ t(`features.items.${feature.key}.title`) }}
          </h3>
          <p class="mt-2 text-sm/relaxed text-ink-muted">
            {{ t(`features.items.${feature.key}.text`) }}
          </p>
        </li>
      </ul>
    </section>

    <section class="border-y border-line bg-surface-2">
      <div class="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
        <h2 class="text-2xl font-semibold">
          {{ t('showcase.title') }}
        </h2>
        <p class="mt-3 max-w-2xl text-ink-muted">
          {{ t('showcase.lead') }}
        </p>

        <div class="mt-10 grid items-start gap-8 lg:grid-cols-2">
          <CodeBlock :code="SHOWCASE" />
          <div class="justify-self-center">
            <NvCalendar
              v-bind="theme"
              :locale="calendarLocale"
              :attributes="scheduleAttributes"
              show-iso-weeknumbers
            />
          </div>
        </div>
      </div>
    </section>

    <section class="mx-auto max-w-6xl px-4 pt-16 text-center sm:px-6 lg:pt-24">
      <h2 class="text-2xl font-semibold">
        {{ t('cta.title') }}
      </h2>
      <p class="mx-auto mt-3 max-w-xl text-ink-muted">
        {{ t('cta.lead') }}
      </p>
      <NuxtLink
        to="/docs"
        class="mt-8 inline-flex min-h-11 items-center justify-center rounded-xl bg-brand px-6 text-sm font-semibold text-on-brand no-underline shadow-e1 transition-colors hover:bg-brand-hover active:scale-96"
      >
        {{ t('cta.action') }}
      </NuxtLink>
    </section>
  </div>
</template>
