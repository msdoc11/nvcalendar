import { defineNuxtPlugin } from '#app'
import options from '#nvcalendar/options'
import type { NvCalendarDefaults } from './types'
import { nvCalendarDefaultsKey } from './composables/useDefaults'

export default defineNuxtPlugin((nuxtApp) => {
  const defaults = (options ?? {}) as NvCalendarDefaults
  nuxtApp.vueApp.provide(nvCalendarDefaultsKey, defaults)
  return {
    provide: {
      nvcalendar: defaults,
    },
  }
})
