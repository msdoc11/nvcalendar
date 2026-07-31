export const PRESET_COLORS: ReadonlySet<string> = new Set([
  'gray', 'red', 'orange', 'amber', 'yellow', 'lime', 'green', 'emerald',
  'teal', 'cyan', 'sky', 'blue', 'indigo', 'violet', 'purple', 'fuchsia',
  'pink', 'rose',
])

export function isPresetColor(color: string | undefined | null): boolean {
  return !!color && PRESET_COLORS.has(color)
}

export function resolveColorValue(color: string): string {
  return PRESET_COLORS.has(color) ? `var(--nv-color-${color})` : color
}
