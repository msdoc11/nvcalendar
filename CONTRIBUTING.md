# Contributing

Thanks for taking the time. Bug reports, ideas and pull requests are all welcome.

## Getting set up

```bash
git clone https://github.com/msdoc11/nvcalendar.git
cd nvcalendar
npm install
npm run dev
```

`npm run dev` starts the documentation site on <http://localhost:3000>. It runs
against the module source, so a change in `src/` is visible immediately.

## Layout

| Path | What lives there |
| --- | --- |
| `src/module.ts` | Nuxt module: options, component registration, plugin |
| `src/runtime/components` | The components themselves |
| `src/runtime/composables` | State shared between components |
| `src/runtime/utils` | Dates, locales, attributes, layout maths |
| `src/runtime/styles` | The single stylesheet |
| `playground/` | Documentation site and live demos |
| `test/` | Unit and component tests |

The module has no runtime dependencies. Please keep it that way: anything that
needs a package belongs in the documentation site, not in `src/`.

## Before opening a pull request

```bash
npm run lint
npm run test
npm run build
```

All three must pass. `npm run lint -- --fix` handles formatting.

## Tests

Logic is tested directly (`test/date.test.ts`, `test/attributes.test.ts`, …) and
behaviour through the components (`test/components.test.ts`). A bug fix should
come with a test that fails without it.

Dates are the usual source of flakiness. Pass the `today` prop and an explicit
`locale` so a test does not depend on the machine it runs on.

## Documentation

The API reference on the site is generated from `src/runtime/props.ts`: the
name, the type, the default and the JSDoc above each prop. A new prop shows up
there on its own, provided it carries a doc comment.

Demo snippets are extracted from the page sources at runtime, so an example can
never drift from the code that renders it. Add a demo by adding a `<DemoCard>`
with a unique `id` and the matching strings in `playground/i18n/en.ts` and
`playground/i18n/ru.ts`.

## Reporting a bug

Include the version, the browser, and the smallest reproduction you can manage.
A [Nuxt Studio](https://nuxt.studio) or StackBlitz link beats a description.
