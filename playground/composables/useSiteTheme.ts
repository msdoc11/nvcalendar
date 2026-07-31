import { computed } from 'vue'

export type ThemeChoice = 'system' | 'light' | 'dark'

export const ACCENTS = [
  'blue', 'indigo', 'violet', 'purple', 'fuchsia', 'pink', 'rose', 'red',
  'orange', 'amber', 'yellow', 'lime', 'green', 'emerald', 'teal', 'cyan',
  'sky', 'gray',
]

export function useSiteTheme() {
  const choice = useCookie<ThemeChoice>('nv-theme', {
    default: () => 'system',
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
  })

  const accent = useCookie<string>('nv-accent', {
    default: () => 'blue',
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
  })

  const systemDark = useState('site-system-dark', () => false)

  const isDark = computed(() =>
    (choice.value === 'system' ? systemDark.value : choice.value === 'dark'))

  const theme = computed(() => ({ color: accent.value, isDark: isDark.value }))

  return { choice, accent, systemDark, isDark, theme }
}

export function useDemoMonth() {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()
  return {
    now,
    year,
    month,
    day: (day: number) => new Date(year, month, day),
  }
}
