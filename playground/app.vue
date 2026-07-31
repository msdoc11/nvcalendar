<script setup lang="ts">
import { onBeforeUnmount, onMounted, watch } from 'vue'

const { t, htmlLang, locale } = useI18n()
const { choice, systemDark, isDark } = useSiteTheme()

let media: MediaQueryList | null = null

function onMediaChange(event: MediaQueryListEvent | MediaQueryList) {
  systemDark.value = event.matches
}

onMounted(() => {
  if (!window.matchMedia) return
  media = window.matchMedia('(prefers-color-scheme: dark)')
  onMediaChange(media)
  media.addEventListener('change', onMediaChange)
})

onBeforeUnmount(() => {
  media?.removeEventListener('change', onMediaChange)
  media = null
})

useHead({
  htmlAttrs: {
    'lang': htmlLang,
    'data-theme': () => (isDark.value ? 'dark' : 'light'),
  },
  titleTemplate: title => (title ? `${title} · nvcalendar` : t('meta.title')),
  meta: [
    { name: 'description', content: () => t('meta.description') },
    { name: 'color-scheme', content: 'light dark' },
  ],
})

watch([choice, locale], () => {})
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <a
      href="#main"
      class="sr-only rounded-lg border border-line bg-surface px-4 py-2 shadow-e2 focus-visible:not-sr-only focus-visible:absolute focus-visible:left-2 focus-visible:top-2 focus-visible:z-100"
    >
      {{ t('nav.skip') }}
    </a>

    <SiteHeader />

    <main
      id="main"
      class="flex-1"
    >
      <NuxtPage />
    </main>

    <SiteFooter />
  </div>
</template>
