import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import type { CSSProperties } from 'vue'
import { useCalendarDefaults } from './useDefaults'
import { isPresetColor } from '../utils/color'

export interface ThemeProps {
  color?: string
  isDark?: boolean | 'system'
}

export function useCalendarTheme(props: ThemeProps) {
  const defaults = useCalendarDefaults()
  const systemDark = ref(false)
  let media: MediaQueryList | null = null

  function onMediaChange(event: MediaQueryListEvent | MediaQueryList) {
    systemDark.value = event.matches
  }

  onMounted(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return
    media = window.matchMedia('(prefers-color-scheme: dark)')
    onMediaChange(media)
    media.addEventListener('change', onMediaChange)
  })

  onBeforeUnmount(() => {
    media?.removeEventListener('change', onMediaChange)
    media = null
  })

  const isDark = computed(() => {
    const value = props.isDark ?? defaults.isDark ?? false
    return value === 'system' ? systemDark.value : Boolean(value)
  })

  const color = computed(() => props.color ?? defaults.color ?? 'blue')

  const themeClass = computed(() => [
    isPresetColor(color.value) ? `nv-color-${color.value}` : null,
    { 'nv-dark': isDark.value },
  ])

  const themeStyle = computed<CSSProperties | undefined>(() =>
    (isPresetColor(color.value) ? undefined : ({ '--nv-accent': color.value } as CSSProperties)))

  return { isDark, color, themeClass, themeStyle }
}
