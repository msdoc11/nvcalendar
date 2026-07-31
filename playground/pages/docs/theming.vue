<script setup lang="ts">
const { t, calendarLocale, locale } = useI18n()
const { isDark } = useSiteTheme()

useHead({ title: () => t('docs.theming.title') })

const accentCode = `<!-- a preset name -->
<NvCalendar color="violet" />

<NvCalendar color="#7c3aed" />
<NvCalendar color="var(--brand)" />

<NvCalendar :attributes="[{ dates: today, highlight: 'violet' }]" />`

const darkCode = `<NvCalendar :is-dark="false" />
<NvCalendar :is-dark="true" />
<NvCalendar is-dark="system" />`

const varsCode = `.chunky {
  --nv-day-content-size: 40px;
  --nv-day-min-height: 46px;
  --nv-radius: 4px;
  --nv-font-size: 16px;
}`

const vars = [
  { name: '--nv-accent', en: 'Accent colour; everything else is derived from it', ru: 'Цвет акцента, всё остальное выводится из него' },
  { name: '--nv-color-<preset>', en: 'The eighteen palette entries, e.g. --nv-color-teal', ru: 'Восемнадцать цветов палитры, например --nv-color-teal' },
  { name: '--nv-bg, --nv-fg', en: 'Surface and text', ru: 'Фон и текст' },
  { name: '--nv-fg-muted, --nv-fg-faded', en: 'Secondary and tertiary text', ru: 'Второстепенный и третьестепенный текст' },
  { name: '--nv-border', en: 'Dividers and the outer border', ru: 'Разделители и внешняя рамка' },
  { name: '--nv-radius, --nv-radius-sm', en: 'Corner rounding', ru: 'Скругление углов' },
  { name: '--nv-day-content-size', en: 'Diameter of the day circle', ru: 'Диаметр кружка дня' },
  { name: '--nv-day-min-height', en: 'Height of one grid row', ru: 'Высота строки сетки' },
  { name: '--nv-pane-padding, --nv-pane-min-width', en: 'Pane metrics', ru: 'Размеры панели месяца' },
  { name: '--nv-font-size, --nv-font-family', en: 'Typography', ru: 'Типографика' },
  { name: '--nv-duration', en: 'Animation speed', ru: 'Скорость анимации' },
]

const presets = [
  'gray', 'red', 'orange', 'amber', 'yellow', 'lime', 'green', 'emerald',
  'teal', 'cyan', 'sky', 'blue', 'indigo', 'violet', 'purple', 'fuchsia',
  'pink', 'rose',
]
</script>

<template>
  <article class="prose">
    <h1 class="text-3xl font-semibold">
      {{ t('docs.theming.title') }}
    </h1>
    <p class="text-lg">
      {{ t('docs.theming.lead') }}
    </p>

    <h2 id="accent">
      {{ t('docs.theming.accentTitle') }}
    </h2>
    <p>{{ t('docs.theming.accentText') }}</p>
    <CodeBlock :code="accentCode" />

    <ul class="not-prose flex flex-wrap gap-2">
      <li
        v-for="preset in presets"
        :key="preset"
        class="flex items-center gap-2 rounded-lg border border-line bg-surface px-2.5 py-1.5 text-xs text-ink-muted"
      >
        <span
          class="size-3.5 rounded-full"
          :style="{ background: `var(--nv-color-${preset}, oklch(0.6 0.19 258))` }"
          aria-hidden="true"
        />
        {{ preset }}
      </li>
    </ul>

    <h2 id="dark">
      {{ t('docs.theming.darkTitle') }}
    </h2>
    <p>{{ t('docs.theming.darkText') }}</p>
    <CodeBlock :code="darkCode" />
    <div class="not-prose grid gap-4 rounded-card border border-line bg-surface-2 p-4 sm:grid-cols-2">
      <div class="flex justify-center">
        <NvCalendar
          color="indigo"
          :is-dark="false"
          :locale="calendarLocale"
          trim-weeks
        />
      </div>
      <div class="flex justify-center">
        <NvCalendar
          color="indigo"
          :is-dark="true"
          :locale="calendarLocale"
          trim-weeks
        />
      </div>
    </div>

    <h2 id="custom-properties">
      {{ t('docs.theming.varsTitle') }}
    </h2>
    <p>{{ t('docs.theming.varsText') }}</p>
    <CodeBlock
      :code="varsCode"
      lang="markup"
      label="css"
    />
    <div class="not-prose overflow-x-auto rounded-card border border-line">
      <table class="w-full text-sm">
        <tbody>
          <tr
            v-for="row in vars"
            :key="row.name"
            class="border-b border-line last:border-0"
          >
            <td class="whitespace-nowrap px-3 py-2 align-top">
              <code class="font-mono text-xs">{{ row.name }}</code>
            </td>
            <td class="px-3 py-2 text-ink-muted">
              {{ locale === 'ru' ? row.ru : row.en }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="not-prose flex justify-center rounded-card border border-line bg-surface-2 p-4">
      <NvCalendar
        class="chunky"
        color="violet"
        :is-dark="isDark"
        :locale="calendarLocale"
        trim-weeks
      />
    </div>
  </article>
</template>

<style>
.chunky {
  --nv-day-content-size: 40px;
  --nv-day-min-height: 46px;
  --nv-radius: 4px;
  --nv-radius-sm: 2px;
  --nv-font-size: 16px;
  --nv-pane-min-width: 320px;
}

.chunky .nv-highlight--circle {
  border-radius: 4px;
}
</style>
