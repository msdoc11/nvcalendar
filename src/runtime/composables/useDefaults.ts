import { inject } from 'vue'
import type { App, InjectionKey } from 'vue'
import type { NvCalendarDefaults } from '../types'

export const nvCalendarDefaultsKey: InjectionKey<NvCalendarDefaults>
  = Symbol.for('nvcalendar:defaults') as InjectionKey<NvCalendarDefaults>

const EMPTY: NvCalendarDefaults = {}

export function useCalendarDefaults(): NvCalendarDefaults {
  return inject(nvCalendarDefaultsKey, EMPTY)
}

export function provideCalendarDefaults(app: App, defaults: NvCalendarDefaults = {}): void {
  app.provide(nvCalendarDefaultsKey, defaults)
}
