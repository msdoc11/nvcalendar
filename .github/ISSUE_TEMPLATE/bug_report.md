---
name: Bug report
about: Something behaves differently from what the documentation says
title: ''
labels: bug
assignees: ''
---

## What happens

A short description of the actual behaviour.

## What you expected

## Reproduction

The smallest example that shows the problem. A StackBlitz link is ideal; a code
block is fine.

```vue
<template>
  <NvDatePicker v-model="date" />
</template>

<script setup>
const date = ref(new Date())
</script>
```

## Environment

- nvcalendar:
- Nuxt / Vue:
- Node:
- Browser and OS:
- Locale and time zone (if the problem involves dates):

## Notes

Anything else worth knowing: console errors, a screenshot, whether it also
happens with a different locale or accent colour.
