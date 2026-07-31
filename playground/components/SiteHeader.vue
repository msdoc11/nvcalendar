<script setup lang="ts">
import { ref } from 'vue'

const { t, locale } = useI18n()
const { choice, accent } = useSiteTheme()

const menuOpen = ref(false)

const links = [
  { to: '/docs', key: 'nav.docs' },
  { to: '/demo', key: 'nav.demos' },
]

const themes = [
  { value: 'system', key: 'nav.themeSystem' },
  { value: 'light', key: 'nav.themeLight' },
  { value: 'dark', key: 'nav.themeDark' },
] as const
</script>

<template>
  <header class="sticky top-0 z-50 border-b border-line bg-page/90 backdrop-blur-sm">
    <div class="mx-auto flex h-14 max-w-6xl items-center gap-3 px-4 sm:px-6">
      <NuxtLink
        to="/"
        class="flex items-center gap-2 font-semibold tracking-tight text-ink no-underline"
      >
        <span
          class="grid size-7 place-items-center rounded-lg bg-brand text-on-brand"
          aria-hidden="true"
        >
          <svg
            viewBox="0 0 24 24"
            class="size-4"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          >
            <rect
              x="3"
              y="5"
              width="18"
              height="16"
              rx="3"
            />
            <path d="M3 10h18M8 3v4M16 3v4" />
          </svg>
        </span>
        nvcalendar
      </NuxtLink>

      <nav
        class="ms-4 hidden items-center gap-1 sm:flex"
        :aria-label="t('nav.docs')"
      >
        <NuxtLink
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          class="rounded-lg px-3 py-1.5 text-sm text-ink-muted no-underline transition-colors hover:bg-surface-2 hover:text-ink"
          active-class="text-ink font-medium"
        >
          {{ t(link.key) }}
        </NuxtLink>
      </nav>

      <div class="ms-auto flex items-center gap-2">
        <label class="hidden items-center gap-2 md:flex">
          <span class="sr-only">{{ t('nav.accent') }}</span>
          <select
            v-model="accent"
            class="rounded-lg border border-line bg-surface px-2 py-1.5 text-sm text-ink"
          >
            <option
              v-for="item in ACCENTS"
              :key="item"
              :value="item"
            >
              {{ item }}
            </option>
          </select>
        </label>

        <label class="flex items-center gap-2">
          <span class="sr-only">{{ t('nav.theme') }}</span>
          <select
            v-model="choice"
            class="rounded-lg border border-line bg-surface px-2 py-1.5 text-sm text-ink"
          >
            <option
              v-for="item in themes"
              :key="item.value"
              :value="item.value"
            >
              {{ t(item.key) }}
            </option>
          </select>
        </label>

        <label class="flex items-center gap-2">
          <span class="sr-only">{{ t('nav.language') }}</span>
          <select
            v-model="locale"
            class="rounded-lg border border-line bg-surface px-2 py-1.5 text-sm text-ink"
          >
            <option
              v-for="item in LOCALES"
              :key="item.id"
              :value="item.id"
            >
              {{ item.label }}
            </option>
          </select>
        </label>

        <a
          href="https://github.com/msdoc11/nvcalendar"
          class="hidden rounded-lg p-2 text-ink-muted transition-colors hover:bg-surface-2 hover:text-ink sm:block"
          :aria-label="t('nav.github')"
        >
          <svg
            viewBox="0 0 16 16"
            class="size-5"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.4 7.4 0 0 1 2-.27c.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z"
            />
          </svg>
        </a>

        <button
          type="button"
          class="rounded-lg p-2 text-ink-muted transition-colors hover:bg-surface-2 hover:text-ink sm:hidden"
          :aria-label="t('nav.menu')"
          :aria-expanded="menuOpen"
          @click="menuOpen = !menuOpen"
        >
          <svg
            viewBox="0 0 24 24"
            class="size-5"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            aria-hidden="true"
          >
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </button>
      </div>
    </div>

    <nav
      v-if="menuOpen"
      class="border-t border-line px-4 py-2 sm:hidden"
      :aria-label="t('nav.menu')"
    >
      <NuxtLink
        v-for="link in links"
        :key="link.to"
        :to="link.to"
        class="block rounded-lg px-3 py-2 text-sm text-ink no-underline"
        @click="menuOpen = false"
      >
        {{ t(link.key) }}
      </NuxtLink>
    </nav>
  </header>
</template>
