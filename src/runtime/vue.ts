import type { App, Plugin } from 'vue'
import type { NvCalendarDefaults } from './types'
import { provideCalendarDefaults } from './composables/useDefaults'
import NvCalendar from './components/NvCalendar.vue'
import NvCalendarNav from './components/NvCalendarNav.vue'
import NvDatePicker from './components/NvDatePicker.vue'
import NvPopover from './components/NvPopover.vue'
import NvTimePicker from './components/NvTimePicker.vue'

export interface NvCalendarPluginOptions extends NvCalendarDefaults {
  prefix?: string
}

const components = {
  Calendar: NvCalendar,
  DatePicker: NvDatePicker,
  TimePicker: NvTimePicker,
  Popover: NvPopover,
  CalendarNav: NvCalendarNav,
}

export const NvCalendarPlugin: Plugin = {
  install(app: App, options: NvCalendarPluginOptions = {}) {
    const { prefix = 'Nv', ...defaults } = options
    provideCalendarDefaults(app, defaults)
    for (const [name, component] of Object.entries(components)) {
      app.component(`${prefix}${name}`, component)
    }
  },
}

export default NvCalendarPlugin

export { NvCalendar, NvCalendarNav, NvDatePicker, NvPopover, NvTimePicker }
export * from './composables/useCalendar'
export * from './composables/useDefaults'
export * from './types'
export * from './utils/attributes'
export * from './utils/date'
export * from './utils/locale'
export * from './utils/page'
export * from './utils/render'
