<script setup lang="ts">
const { t } = useI18n()

const items = [
  { to: '/docs', key: 'docs.nav.start' },
  { to: '/docs/calendar', key: 'docs.nav.calendar' },
  { to: '/docs/date-picker', key: 'docs.nav.picker' },
  { to: '/docs/attributes', key: 'docs.nav.attributes' },
  { to: '/docs/theming', key: 'docs.nav.theming' },
  { to: '/docs/locales', key: 'docs.nav.locales' },
  { to: '/docs/api', key: 'docs.nav.api' },
]
</script>

<template>
  <div class="mx-auto max-w-6xl px-4 sm:px-6">
    <div class="grid gap-10 py-10 lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-14">
      <aside class="lg:sticky lg:top-24 lg:self-start">
        <p class="mb-3 text-xs font-semibold uppercase tracking-wider text-ink-faint">
          {{ t('docs.title') }}
        </p>
        <nav
          class="flex gap-1 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0"
          :aria-label="t('docs.title')"
        >
          <NuxtLink
            v-for="item in items"
            :key="item.to"
            :to="item.to"
            class="whitespace-nowrap rounded-lg px-3 py-1.5 text-sm text-ink-muted no-underline transition-colors hover:bg-surface-2 hover:text-ink"
            exact-active-class="bg-selected font-semibold text-ink"
          >
            {{ t(item.key) }}
          </NuxtLink>
        </nav>
      </aside>

      <div class="min-w-0">
        <NuxtPage />
      </div>
    </div>
  </div>
</template>
