import { computed } from 'vue'
import en from '../i18n/en'
import ru from '../i18n/ru'

export type LocaleId = 'en' | 'ru'

export interface LocaleOption {
  id: LocaleId
  label: string
  calendar: string
}

export const LOCALES: LocaleOption[] = [
  { id: 'en', label: 'English', calendar: 'en-GB' },
  { id: 'ru', label: 'Русский', calendar: 'ru-RU' },
]

const messages: Record<LocaleId, typeof en> = { en, ru }

type Messages = typeof en

function resolve(source: unknown, path: string): unknown {
  return path.split('.').reduce<unknown>(
    (value, key) => (value && typeof value === 'object' ? (value as Record<string, unknown>)[key] : undefined),
    source,
  )
}

export function useI18n() {
  const cookie = useCookie<LocaleId>('nv-lang', {
    default: () => 'en',
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
  })

  const locale = computed<LocaleId>({
    get: () => (cookie.value === 'ru' ? 'ru' : 'en'),
    set: (value) => {
      cookie.value = value
    },
  })

  const bundle = computed<Messages>(() => messages[locale.value])

  function t(path: string): string {
    const value = resolve(bundle.value, path)
    if (typeof value === 'string') return value
    const fallback = resolve(messages.en, path)
    return typeof fallback === 'string' ? fallback : path
  }

  function tc(path: string): { title: string, hint: string } {
    return { title: t(`${path}.title`), hint: t(`${path}.hint`) }
  }

  const calendarLocale = computed(() =>
    LOCALES.find(item => item.id === locale.value)?.calendar ?? 'en-GB')

  const htmlLang = computed(() => (locale.value === 'ru' ? 'ru' : 'en'))

  return { locale, t, tc, messages: bundle, calendarLocale, htmlLang }
}
