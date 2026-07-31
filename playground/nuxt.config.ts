import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  modules: ['../src/module'],
  devtools: { enabled: true },
  css: ['~/assets/site.css'],
  srcDir: '.',
  compatibilityDate: '2025-01-01',
  vite: {
    plugins: [tailwindcss()],
  },
  nvcalendar: {
    defaults: {
      color: 'blue',
    },
  },
})
