<script setup lang="ts">
import { ref } from 'vue'

const { t, calendarLocale } = useI18n()
const { theme } = useSiteTheme()

useHead({ title: () => t('docs.locales.title') })

const picked = ref<Date | null>(new Date())
const current = ref('de-DE')

const localeOptions = ['en-US', 'en-GB', 'ru-RU', 'de-DE', 'fr-FR', 'es-ES', 'ja-JP', 'zh-CN', 'ar-EG', 'he-IL']

const localeCode = `<!-- a BCP-47 id -->
<NvCalendar locale="de-DE" />

<NvCalendar :locale="{ id: 'de-DE', firstDayOfWeek: 1, masks: { title: 'MMMM YYYY' } }" />

<NvCalendar />`

const masksCode = `<NvCalendar
  :masks="{
    title: 'MMMM YYYY',
    weekdays: 'dd',
    navMonths: 'MMM',
    dayPopover: 'dddd, D MMMM YYYY',
    input: ['D MMMM YYYY', 'YYYY-MM-DD'],
    modelValue: 'YYYY-MM-DD',
  }"
/>`

const tokens = [
  ['YYYY YY', '2026, 26'],
  ['MMMM MMM MM M', 'July, Jul, 07, 7'],
  ['DD D', '05, 5'],
  ['dddd ddd dd d', 'Sunday, Sun, S, 0'],
  ['HH H hh h', '24- and 12-hour'],
  ['mm m ss s SSS', 'minutes, seconds, milliseconds'],
  ['A a', 'PM, pm'],
  ['Z ZZ', '+02:00, +0200'],
  ['[text]', 'literal text'],
]
</script>

<template>
  <article class="prose">
    <h1 class="text-3xl font-semibold">
      {{ t('docs.locales.title') }}
    </h1>
    <p class="text-lg">
      {{ t('docs.locales.lead') }}
    </p>

    <h2 id="locale">
      {{ t('docs.locales.localeTitle') }}
    </h2>
    <p>{{ t('docs.locales.localeText') }}</p>
    <CodeBlock :code="localeCode" />

    <div class="not-prose rounded-card border border-line bg-surface-2 p-4">
      <label class="flex items-center gap-2 text-sm text-ink-muted">
        <span>{{ t('demo.controls.locale') }}</span>
        <select
          v-model="current"
          class="rounded-lg border border-line bg-surface px-2 py-1.5 text-sm text-ink"
        >
          <option
            v-for="item in localeOptions"
            :key="item"
            :value="item"
          >
            {{ item }}
          </option>
        </select>
      </label>

      <div class="mt-4 flex justify-center">
        <NvDatePicker
          v-model="picked"
          v-bind="theme"
          :locale="current"
          trim-weeks
        />
      </div>
    </div>

    <h2 id="masks">
      {{ t('docs.locales.masksTitle') }}
    </h2>
    <p>{{ t('docs.locales.masksText') }}</p>
    <CodeBlock :code="masksCode" />

    <h3 id="tokens">
      {{ t('docs.locales.tokensTitle') }}
    </h3>
    <div class="not-prose overflow-x-auto rounded-card border border-line">
      <table class="w-full text-sm">
        <tbody>
          <tr
            v-for="[token, sample] in tokens"
            :key="token"
            class="border-b border-line last:border-0"
          >
            <td class="whitespace-nowrap px-3 py-2 align-top">
              <code class="font-mono text-xs">{{ token }}</code>
            </td>
            <td class="px-3 py-2 text-ink-muted">
              {{ sample }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="not-prose flex justify-center rounded-card border border-line bg-surface-2 p-4">
      <NvCalendar
        v-bind="theme"
        :locale="calendarLocale"
        :masks="{ title: '[Month of] MMMM', weekdays: 'ddd' }"
        trim-weeks
      />
    </div>
  </article>
</template>
