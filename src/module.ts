import {
  addComponent,
  addImportsDir,
  addPlugin,
  addTemplate,
  createResolver,
  defineNuxtModule,
} from '@nuxt/kit'
import type { NvCalendarDefaults } from './runtime/types'

export interface ModuleOptions {
  prefix?: string
  css?: boolean
  composables?: boolean
  defaults?: NvCalendarDefaults
}

const COMPONENTS = [
  'NvCalendar',
  'NvDatePicker',
  'NvTimePicker',
  'NvPopover',
  'NvCalendarNav',
] as const

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'nvcalendar',
    configKey: 'nvcalendar',
    compatibility: {
      nuxt: '>=3.0.0',
    },
  },
  defaults: {
    prefix: 'Nv',
    css: true,
    composables: true,
    defaults: {},
  },
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)
    const prefix = options.prefix ?? 'Nv'

    if (options.css !== false) {
      nuxt.options.css.push(resolver.resolve('./runtime/styles/nvcalendar.css'))
    }

    for (const name of COMPONENTS) {
      addComponent({
        name: `${prefix}${name.slice(2)}`,
        filePath: resolver.resolve(`./runtime/components/${name}.vue`),
      })
    }

    if (options.composables !== false) {
      addImportsDir(resolver.resolve('./runtime/composables'))
    }

    addTemplate({
      filename: 'nvcalendar-options.mjs',
      getContents: () => `export default ${JSON.stringify(options.defaults ?? {}, null, 2)}\n`,
    })

    nuxt.options.alias['#nvcalendar/options'] = '#build/nvcalendar-options.mjs'

    addPlugin({
      src: resolver.resolve('./runtime/plugin'),
      mode: 'all',
    })

    nuxt.options.build.transpile.push(resolver.resolve('./runtime'))
  },
})
