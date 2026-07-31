<script setup lang="ts">
const { t } = useI18n()

const items = [
  { to: '/demo', key: 'demo.nav.calendar' },
  { to: '/demo/date-picker', key: 'demo.nav.picker' },
  { to: '/demo/attributes', key: 'demo.nav.attributes' },
  { to: '/demo/time', key: 'demo.nav.time' },
  { to: '/demo/inputs', key: 'demo.nav.inputs' },
  { to: '/demo/slots', key: 'demo.nav.slots' },
  { to: '/demo/locales', key: 'demo.nav.locales' },
  { to: '/demo/theming', key: 'demo.nav.theming' },
]
</script>

<template>
  <div class="mx-auto max-w-6xl px-4 py-10 sm:px-6">
    <nav
      class="-mx-1 flex gap-1 overflow-x-auto pb-4"
      :aria-label="t('demo.title')"
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

    <NuxtPage />
  </div>
</template>
