<script setup lang="ts">
import { computed, ref, useId } from 'vue'
import Prism from '../utils/prism'

const props = defineProps<{
  id: string
  title: string
  hint?: string
  tag?: string
}>()

const { t } = useI18n()
const uid = useId()

const snippet = useDemoSnippet(props.id)
const source = computed(() =>
  (snippet ? formatSnippet(snippet, t('card.noteTheme'), t('card.noteDay')) : ''))
const highlighted = computed(() =>
  (source.value ? Prism.highlight(source.value, Prism.languages.markup!, 'markup') : ''))

const tabs = computed(() => [
  { id: 'demo' as const, label: t('card.tabDemo') },
  { id: 'code' as const, label: t('card.tabCode') },
])

const active = ref<'demo' | 'code'>('demo')
const copied = ref(false)

function onTabKeydown(event: KeyboardEvent) {
  if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return
  event.preventDefault()
  active.value = active.value === 'demo' ? 'code' : 'demo'
  const list = event.currentTarget as HTMLElement
  list.querySelector<HTMLElement>(`[data-tab="${active.value}"]`)?.focus()
}

async function copy() {
  try {
    await navigator.clipboard.writeText(source.value)
    copied.value = true
    setTimeout(() => (copied.value = false), 1400)
  }
  catch {
    copied.value = false
  }
}
</script>

<template>
  <section
    class="flex flex-col overflow-hidden rounded-card border border-line bg-surface shadow-e1 [contain-intrinsic-size:auto_26rem] [content-visibility:auto]"
  >
    <header class="px-4 pt-4">
      <div class="flex items-start justify-between gap-4">
        <h3 class="text-base font-semibold">
          {{ title }}
        </h3>

        <div
          v-if="source"
          class="flex flex-none gap-0.5 rounded-inner bg-surface-3 p-0.5"
          role="tablist"
          :aria-label="title"
          @keydown="onTabKeydown"
        >
          <button
            v-for="item in tabs"
            :id="`${uid}-tab-${item.id}`"
            :key="item.id"
            type="button"
            role="tab"
            class="min-h-7 rounded-md px-3 text-xs transition-colors"
            :class="active === item.id
              ? 'bg-surface font-semibold text-ink shadow-e1'
              : 'font-medium text-ink-muted hover:text-ink'"
            :data-tab="item.id"
            :aria-selected="active === item.id"
            :aria-controls="`${uid}-panel-${item.id}`"
            :tabindex="active === item.id ? 0 : -1"
            @click="active = item.id"
          >
            {{ item.label }}
          </button>
        </div>
      </div>

      <p
        v-if="hint"
        class="mt-2 text-sm text-ink-muted"
      >
        {{ hint }}
      </p>
      <code
        v-if="tag"
        class="mt-3 inline-block rounded-md bg-surface-3 px-1.5 py-0.5 font-mono text-xs text-ink-muted"
      >{{ tag }}</code>
    </header>

    <div
      v-show="active === 'demo'"
      :id="`${uid}-panel-demo`"
      role="tabpanel"
      :aria-labelledby="`${uid}-tab-demo`"
      class="flex flex-wrap items-start gap-3 p-4"
    >
      <slot />
    </div>

    <footer
      v-if="$slots.value"
      v-show="active === 'demo'"
      class="overflow-x-auto border-t border-line px-4 py-3 font-mono text-xs text-ink-muted"
    >
      <slot name="value" />
    </footer>

    <div
      v-show="active === 'code'"
      :id="`${uid}-panel-code`"
      role="tabpanel"
      :aria-labelledby="`${uid}-tab-code`"
      class="relative pt-3"
    >
      <button
        type="button"
        class="absolute inset-e-4 top-3 z-1 rounded-md border border-line bg-surface-2 px-3 py-1 text-xs text-ink-muted transition-colors hover:text-ink active:scale-96"
        @click="copy"
      >
        {{ copied ? t('card.copied') : t('card.copy') }}
      </button>
      <pre
        class="max-h-112 overflow-auto px-4 pb-4 font-mono text-[0.8125rem]/6"
        v-html="highlighted"
      />
    </div>
  </section>
</template>
