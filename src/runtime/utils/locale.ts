import type { DayOfWeek, LocaleConfig, LocaleMasks } from '../types'
import { daysInMonth, toDate } from './date'

const formatterCache = new Map<string, Intl.DateTimeFormat>()

function getFormatter(localeId: string, options: Intl.DateTimeFormatOptions): Intl.DateTimeFormat {
  const key = `${localeId}|${JSON.stringify(options)}`
  let formatter = formatterCache.get(key)
  if (!formatter) {
    formatter = new Intl.DateTimeFormat(localeId, options)
    formatterCache.set(key, formatter)
  }
  return formatter
}

const WEEKDAY_ORIGIN = new Date(2000, 0, 2)

export function getDefaultLocaleId(): string {
  if (typeof navigator !== 'undefined' && navigator.language) return navigator.language
  try {
    return new Intl.DateTimeFormat().resolvedOptions().locale || 'en-US'
  }
  catch {
    return 'en-US'
  }
}

export function getLocaleFirstDayOfWeek(localeId: string): DayOfWeek {
  try {
    const locale = new Intl.Locale(localeId) as Intl.Locale & {
      weekInfo?: { firstDay: number }
      getWeekInfo?: () => { firstDay: number }
    }
    const info = typeof locale.getWeekInfo === 'function' ? locale.getWeekInfo() : locale.weekInfo
    if (info?.firstDay) return (info.firstDay % 7) as DayOfWeek
  }
  catch {
    return 0
  }
  return 0
}

export function localeUses12HourClock(localeId: string): boolean {
  try {
    return getFormatter(localeId, { hour: 'numeric' }).resolvedOptions().hour12 ?? false
  }
  catch {
    return false
  }
}

export function getMonthNames(localeId: string, format: 'long' | 'short' | 'narrow' = 'long'): string[] {
  const formatter = getFormatter(localeId, { month: format })
  return Array.from({ length: 12 }, (_, index) => formatter.format(new Date(2000, index, 1)))
}

export function getWeekdayNames(localeId: string, format: 'long' | 'short' | 'narrow' = 'long'): string[] {
  const formatter = getFormatter(localeId, { weekday: format })
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(WEEKDAY_ORIGIN)
    date.setDate(date.getDate() + index)
    return formatter.format(date)
  })
}

const TOKEN_PATTERN
  = /\[([^\]]*)\]|YYYY|YY|MMMM|MMM|MM|M|DD|D|dddd|ddd|dd|d|HH|H|hh|h|mm|m|ss|[sAa]|SSS|ZZ|Z/g

const REGEX_ESCAPE = /[.*+?^${}()|[\]\\]/g

function escapeRegExp(value: string): string {
  return value.replace(REGEX_ESCAPE, '\\$&')
}

function pad(value: number, length = 2): string {
  return String(value).padStart(length, '0')
}

function timezoneOffset(date: Date, separator: string): string {
  const offset = -date.getTimezoneOffset()
  const sign = offset >= 0 ? '+' : '-'
  const abs = Math.abs(offset)
  return `${sign}${pad(Math.floor(abs / 60))}${separator}${pad(abs % 60)}`
}

export function getLocaleDateMask(localeId: string): string {
  try {
    const parts = getFormatter(localeId, { year: 'numeric', month: '2-digit', day: '2-digit' })
      .formatToParts(new Date(2000, 0, 2))
    return parts.map((part) => {
      switch (part.type) {
        case 'year': return 'YYYY'
        case 'month': return 'MM'
        case 'day': return 'DD'
        default: return /[A-Z]/i.test(part.value) ? `[${part.value}]` : part.value
      }
    }).join('')
  }
  catch {
    return 'MM/DD/YYYY'
  }
}

export function getLocaleTimeMask(localeId: string): string {
  return localeUses12HourClock(localeId) ? 'h:mm A' : 'HH:mm'
}

export const DEFAULT_MASKS: Required<Omit<LocaleMasks, 'input' | 'inputDateTime' | 'inputTime' | 'modelValue'>> = {
  title: 'MMMM YYYY',
  weekdays: 'dd',
  navMonths: 'MMM',
  dayPopover: 'dddd, D MMMM YYYY',
}

export class CalendarLocale {
  readonly id: string
  readonly firstDayOfWeek: DayOfWeek
  readonly masks: Required<LocaleMasks>
  readonly hour12: boolean

  private readonly monthsLong: string[]
  private readonly monthsShort: string[]
  private readonly weekdaysLong: string[]
  private readonly weekdaysShort: string[]
  private readonly weekdaysNarrow: string[]

  constructor(config: LocaleConfig = {}) {
    this.id = config.id || getDefaultLocaleId()
    this.firstDayOfWeek = config.firstDayOfWeek ?? getLocaleFirstDayOfWeek(this.id)
    this.hour12 = localeUses12HourClock(this.id)

    const dateMask = getLocaleDateMask(this.id)
    const timeMask = getLocaleTimeMask(this.id)
    this.masks = {
      ...DEFAULT_MASKS,
      input: [dateMask, 'YYYY-MM-DD', 'YYYY/MM/DD'],
      inputDateTime: [`${dateMask} ${timeMask}`, `YYYY-MM-DD ${timeMask}`],
      inputTime: [timeMask, 'HH:mm', 'HH:mm:ss'],
      modelValue: 'YYYY-MM-DD',
      ...(config.masks ?? {}),
    } as Required<LocaleMasks>

    this.monthsLong = getMonthNames(this.id, 'long')
    this.monthsShort = getMonthNames(this.id, 'short')
    this.weekdaysLong = getWeekdayNames(this.id, 'long')
    this.weekdaysShort = getWeekdayNames(this.id, 'short')
    this.weekdaysNarrow = getWeekdayNames(this.id, 'narrow')
  }

  getWeekdayOrder(firstDayOfWeek = this.firstDayOfWeek): DayOfWeek[] {
    return Array.from({ length: 7 }, (_, index) => ((index + firstDayOfWeek) % 7) as DayOfWeek)
  }

  monthName(month: number, format: 'long' | 'short' = 'long'): string {
    const names = format === 'short' ? this.monthsShort : this.monthsLong
    return names[(month - 1 + 12) % 12] ?? ''
  }

  weekdayName(weekday: number, format: 'long' | 'short' | 'narrow' = 'long'): string {
    const names = format === 'short'
      ? this.weekdaysShort
      : format === 'narrow' ? this.weekdaysNarrow : this.weekdaysLong
    return names[(weekday + 7) % 7] ?? ''
  }

  format(date: Date | null, mask: string): string {
    if (!date) return ''
    const hours24 = date.getHours()
    const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12
    return mask.replace(TOKEN_PATTERN, (token, literal?: string) => {
      if (literal !== undefined) return literal
      switch (token) {
        case 'YYYY': return String(date.getFullYear())
        case 'YY': return pad(date.getFullYear() % 100)
        case 'MMMM': return this.monthName(date.getMonth() + 1, 'long')
        case 'MMM': return this.monthName(date.getMonth() + 1, 'short')
        case 'MM': return pad(date.getMonth() + 1)
        case 'M': return String(date.getMonth() + 1)
        case 'DD': return pad(date.getDate())
        case 'D': return String(date.getDate())
        case 'dddd': return this.weekdayName(date.getDay(), 'long')
        case 'ddd': return this.weekdayName(date.getDay(), 'short')
        case 'dd': return this.weekdayName(date.getDay(), 'narrow')
        case 'd': return String(date.getDay())
        case 'HH': return pad(hours24)
        case 'H': return String(hours24)
        case 'hh': return pad(hours12)
        case 'h': return String(hours12)
        case 'mm': return pad(date.getMinutes())
        case 'm': return String(date.getMinutes())
        case 'ss': return pad(date.getSeconds())
        case 's': return String(date.getSeconds())
        case 'SSS': return pad(date.getMilliseconds(), 3)
        case 'A': return hours24 < 12 ? 'AM' : 'PM'
        case 'a': return hours24 < 12 ? 'am' : 'pm'
        case 'ZZ': return timezoneOffset(date, '')
        case 'Z': return timezoneOffset(date, ':')
        default: return token
      }
    })
  }

  parse(value: string, masks: string | string[], reference?: Date | null): Date | null {
    const text = String(value ?? '').trim()
    if (!text) return null
    const list = Array.isArray(masks) ? masks : [masks]
    for (const mask of list) {
      const parsed = this.parseWithMask(text, mask, reference)
      if (parsed) return parsed
    }
    return toDate(text)
  }

  private parseWithMask(value: string, mask: string, reference?: Date | null): Date | null {
    const groups: string[] = []
    let source = ''
    let lastIndex = 0

    TOKEN_PATTERN.lastIndex = 0
    let match: RegExpExecArray | null
    while ((match = TOKEN_PATTERN.exec(mask)) !== null) {
      source += escapeRegExp(mask.slice(lastIndex, match.index))
      lastIndex = match.index + match[0].length
      const token = match[0]
      if (match[1] !== undefined) {
        source += escapeRegExp(match[1])
        continue
      }
      switch (token) {
        case 'YYYY': source += '(\\d{4})'; groups.push('year'); break
        case 'YY': source += '(\\d{2})'; groups.push('shortYear'); break
        case 'MMMM': source += `(${this.monthsLong.map(escapeRegExp).join('|')})`; groups.push('monthName'); break
        case 'MMM': source += `(${this.monthsShort.map(escapeRegExp).join('|')})`; groups.push('shortMonthName'); break
        case 'MM': case 'M': source += '(\\d{1,2})'; groups.push('month'); break
        case 'DD': case 'D': source += '(\\d{1,2})'; groups.push('day'); break
        case 'dddd': source += `(?:${this.weekdaysLong.map(escapeRegExp).join('|')})`; break
        case 'ddd': source += `(?:${this.weekdaysShort.map(escapeRegExp).join('|')})`; break
        case 'dd': source += `(?:${this.weekdaysNarrow.map(escapeRegExp).join('|')})`; break
        case 'd': source += '\\d'; break
        case 'HH': case 'H': source += '(\\d{1,2})'; groups.push('hours'); break
        case 'hh': case 'h': source += '(\\d{1,2})'; groups.push('hours12'); break
        case 'mm': case 'm': source += '(\\d{1,2})'; groups.push('minutes'); break
        case 'ss': case 's': source += '(\\d{1,2})'; groups.push('seconds'); break
        case 'SSS': source += '(\\d{1,3})'; groups.push('milliseconds'); break
        case 'A': case 'a': source += '([AaPp][Mm])'; groups.push('meridiem'); break
        case 'ZZ': case 'Z': source += '([+-]\\d{2}:?\\d{2}|Z)'; groups.push('offset'); break
        default: source += escapeRegExp(token)
      }
    }
    source += escapeRegExp(mask.slice(lastIndex))

    const result = new RegExp(`^\\s*${source}\\s*$`, 'i').exec(value)
    if (!result) return null

    const base = reference ?? new Date()
    const parts: Record<string, number> = {
      year: base.getFullYear(),
      month: base.getMonth() + 1,
      day: base.getDate(),
      hours: 0,
      minutes: 0,
      seconds: 0,
      milliseconds: 0,
    }
    const extra = {
      meridiem: null as string | null,
      hours12: null as number | null,
      offsetMinutes: null as number | null,
    }

    groups.forEach((name, index) => {
      const raw = result[index + 1]
      if (raw === undefined) return
      switch (name) {
        case 'year': parts.year = Number(raw); break
        case 'shortYear': parts.year = 2000 + Number(raw); break
        case 'monthName': {
          const found = this.monthsLong.findIndex(item => item.toLowerCase() === raw.toLowerCase())
          if (found >= 0) parts.month = found + 1
          break
        }
        case 'shortMonthName': {
          const found = this.monthsShort.findIndex(item => item.toLowerCase() === raw.toLowerCase())
          if (found >= 0) parts.month = found + 1
          break
        }
        case 'hours12': extra.hours12 = Number(raw); break
        case 'meridiem': extra.meridiem = raw.toLowerCase(); break
        case 'offset': {
          if (raw.toUpperCase() === 'Z') { extra.offsetMinutes = 0; break }
          const sign = raw.startsWith('-') ? -1 : 1
          const digits = raw.replace(/\D/g, '')
          extra.offsetMinutes = sign * (Number(digits.slice(0, 2)) * 60 + Number(digits.slice(2, 4)))
          break
        }
        default: parts[name] = Number(raw)
      }
    })

    if (extra.hours12 !== null) {
      let hours = extra.hours12 % 12
      if (extra.meridiem === 'pm') hours += 12
      parts.hours = hours
    }

    if (parts.month < 1 || parts.month > 12) return null
    if (parts.day < 1 || parts.day > daysInMonth(parts.year, parts.month)) return null
    if (parts.hours > 23 || parts.minutes > 59 || parts.seconds > 59) return null

    if (extra.offsetMinutes !== null) {
      const utc = Date.UTC(parts.year, parts.month - 1, parts.day, parts.hours, parts.minutes, parts.seconds, parts.milliseconds)
      return new Date(utc - extra.offsetMinutes * 60_000)
    }
    return new Date(parts.year, parts.month - 1, parts.day, parts.hours, parts.minutes, parts.seconds, parts.milliseconds)
  }
}

const localeCache = new Map<string, CalendarLocale>()

export function resolveLocale(config: LocaleConfig | string | undefined | null): CalendarLocale {
  const normalized: LocaleConfig = typeof config === 'string' ? { id: config } : (config ?? {})
  const key = JSON.stringify([normalized.id ?? '', normalized.firstDayOfWeek ?? '', normalized.masks ?? null])
  let locale = localeCache.get(key)
  if (!locale) {
    locale = new CalendarLocale(normalized)
    localeCache.set(key, locale)
  }
  return locale
}
