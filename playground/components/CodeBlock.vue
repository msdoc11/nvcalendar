<script setup lang="ts">
import { computed, ref } from 'vue'
import Prism from '../utils/prism'

const props = withDefaults(defineProps<{
  code: string
  lang?: 'markup' | 'javascript' | 'bash'
  label?: string
}>(), {
  lang: 'markup',
})

const { t } = useI18n()

const grammar = computed(() => Prism.languages[props.lang] ?? Prism.languages.markup!)
const highlighted = computed(() => Prism.highlight(props.code.trim(), grammar.value, props.lang))
const copied = ref(false)

async function copy() {
  try {
    await navigator.clipboard.writeText(props.code.trim())
    copied.value = true
    setTimeout(() => (copied.value = false), 1400)
  }
  catch {
    copied.value = false
  }
}
</script>

<template>
  <div class="overflow-hidden rounded-card border border-line bg-code-bg">
    <div class="flex items-center justify-between gap-3 border-b border-line py-1.5 pl-4 pr-1.5">
      <span class="font-mono text-xs text-ink-muted">{{ label ?? (lang === 'bash' ? 'terminal' : 'vue') }}</span>
      <button
        type="button"
        class="rounded-md px-3 py-1 text-xs text-ink-muted transition-colors hover:bg-surface-3 hover:text-ink active:scale-96"
        @click="copy"
      >
        {{ copied ? t('card.copied') : t('card.copy') }}
      </button>
    </div>
    <pre
      class="max-h-120 overflow-auto p-4 font-mono text-[0.8125rem]/6"
      v-html="highlighted"
    />
  </div>
</template>
