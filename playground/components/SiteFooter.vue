<script setup lang="ts">
const { t } = useI18n()

const links = [
  { to: '/docs', key: 'footer.docs', external: false },
  { to: '/demo', key: 'footer.demos', external: false },
  { to: 'https://www.npmjs.com/package/nvcalendar', key: 'footer.npm', external: true },
  { to: 'https://github.com/msdoc11/nvcalendar', key: 'footer.github', external: true },
]
</script>

<template>
  <footer class="mt-24 border-t border-line">
    <div class="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <p class="max-w-md text-sm text-ink-muted">
        {{ t('footer.built') }}
      </p>

      <nav class="flex flex-wrap gap-x-5 gap-y-2 text-sm">
        <component
          :is="link.external ? 'a' : resolveComponent('NuxtLink')"
          v-for="link in links"
          :key="link.to"
          :href="link.external ? link.to : undefined"
          :to="link.external ? undefined : link.to"
          class="text-ink-muted no-underline transition-colors hover:text-ink"
        >
          {{ t(link.key) }}
        </component>
      </nav>
    </div>
  </footer>
</template>
