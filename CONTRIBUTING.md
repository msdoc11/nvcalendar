# Contributing

Thanks for taking the time. Bug reports, ideas and pull requests are all welcome.

## Getting set up

```bash
git clone https://github.com/msdoc11/nvcalendar.git
cd nvcalendar
npm install
npm run test
```

## Layout

| Path | What lives there |
| --- | --- |
| `src/module.ts` | Nuxt module: options, component registration, plugin |
| `src/runtime/components` | The components themselves |
| `src/runtime/composables` | State shared between components |
| `src/runtime/utils` | Dates, locales, attributes, layout maths |
| `src/runtime/styles` | The single stylesheet |
| `test/` | Unit and component tests |

The module has no runtime dependencies beyond `@nuxt/kit`. Please keep it that
way: a feature that needs a package belongs in an application, not in `src/`.

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

Props carry a doc comment in `src/runtime/props.ts`. Keep it accurate: it is the
source the reference documentation is generated from.

## Reporting a bug

Include the version, the browser, and the smallest reproduction you can manage.
A StackBlitz link beats a description.
