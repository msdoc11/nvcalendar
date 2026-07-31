<script setup lang="ts">
import type { PropDoc } from '../composables/usePropsDocs'

defineProps<{ rows: PropDoc[] }>()

const { t } = useI18n()
</script>

<template>
  <div class="overflow-x-auto rounded-card border border-line">
    <table class="w-full min-w-2xl text-sm">
      <thead>
        <tr class="bg-surface-2">
          <th class="px-3 py-2 text-start font-semibold">
            {{ t('docs.api.columns.prop') }}
          </th>
          <th class="px-3 py-2 text-start font-semibold">
            {{ t('docs.api.columns.type') }}
          </th>
          <th class="px-3 py-2 text-start font-semibold">
            {{ t('docs.api.columns.default') }}
          </th>
          <th class="px-3 py-2 text-start font-semibold">
            {{ t('docs.api.columns.description') }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="row in rows"
          :key="row.name"
          class="border-t border-line align-top"
        >
          <td class="whitespace-nowrap px-3 py-2">
            <code class="font-mono text-xs text-ink">{{ row.name }}</code>
          </td>
          <td class="px-3 py-2">
            <code class="font-mono text-xs text-ink-muted">{{ row.type }}</code>
          </td>
          <td class="whitespace-nowrap px-3 py-2">
            <code class="font-mono text-xs text-ink-muted">{{ row.default }}</code>
          </td>
          <td class="px-3 py-2 text-ink-muted">
            {{ row.description }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
