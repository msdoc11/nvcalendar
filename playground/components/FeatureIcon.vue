<script setup lang="ts">
defineProps<{
  name: 'grid' | 'cursor' | 'spark' | 'globe' | 'palette' | 'keyboard'
}>()

const paths: Record<string, string[]> = {
  grid: ['M3 5h18v16H3z', 'M3 10h18', 'M8 3v4M16 3v4', 'M8 14h.01M12 14h.01M16 14h.01'],
  cursor: ['M4 4h16v12H4z', 'M4 9h16', 'M13 14l6 6-2 .5-1 2-3-8.5z'],
  spark: ['M12 3v4M12 17v4M3 12h4M17 12h4', 'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z'],
  globe: ['M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z', 'M3 12h18', 'M12 3c2.5 2.5 3.5 5.6 3.5 9s-1 6.5-3.5 9c-2.5-2.5-3.5-5.6-3.5-9s1-6.5 3.5-9z'],
  palette: ['M12 3a9 9 0 0 0 0 18h2a2 2 0 0 0 0-4 2 2 0 0 1 2-2h1a4 4 0 0 0 4-4c0-4.4-4-8-9-8z', 'M8 10h.01M12 7h.01M16 10h.01'],
  keyboard: ['M3 6h18v12H3z', 'M7 10h.01M11 10h.01M15 10h.01M8 14h8'],
}
</script>

<template>
  <svg
    viewBox="0 0 24 24"
    class="size-5"
    fill="none"
    stroke="currentColor"
    stroke-width="1.75"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <path
      v-for="(d, index) in paths[name]"
      :key="index"
      :d="d"
    />
  </svg>
</template>
