import { createConfigForNuxt } from '@nuxt/eslint-config/flat'

export default createConfigForNuxt({
  features: {
    tooling: true,
    stylistic: true,
  },
}).append({
  ignores: ['dist', 'node_modules', '.nuxt', 'playground/.nuxt', 'coverage'],
}).append({
  rules: {
    '@stylistic/max-statements-per-line': ['error', { max: 3 }],
  },
}).append({
  files: ['playground/pages/**/*.vue'],
  rules: {
    'vue/multi-word-component-names': 'off',
  },
}).append({
  files: ['playground/components/CodeBlock.vue', 'playground/components/DemoCard.vue'],
  rules: {
    'vue/no-v-html': 'off',
  },
})
