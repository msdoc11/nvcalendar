# Publishing checklist

## 1. The package metadata

Already set in `package.json`:

```jsonc
{
  "name": "nvcalendar",
  "version": "0.1.0",
  "author": "Nik <email@qsyro.com>",
  "repository": { "url": "git+https://github.com/msdoc11/nvcalendar.git" },
  "homepage": "https://github.com/msdoc11/nvcalendar#readme",
  "bugs": { "url": "https://github.com/msdoc11/nvcalendar/issues" }
}
```

Set `homepage` to the documentation domain once it is live.

The name was free at the time of writing. Confirm it still is:

```bash
npm view nvcalendar
# "npm error 404" means the name is free
```

## 2. Verify

```bash
npm run lint
npm run test
npm run build
npm pack --dry-run     # inspect exactly what ships
```

`npm pack --dry-run` must list `dist/`, `README.md`, `LICENSE` and
`package.json` — nothing else.

Smoke-test the tarball in a fresh Nuxt app:

```bash
npm pack                                  # creates nvcalendar-0.1.0.tgz
cd /tmp && npx nuxi init demo && cd demo
npm install /path/to/nvcalendar-0.1.0.tgz
# add 'nvcalendar' to modules in nuxt.config.ts, then:
npm run dev
```

## 3. Publish to npm

```bash
npm login
npm run release        # lint + test + build + publish
```

For a pre-release:

```bash
npm version 0.1.0-beta.1
npm publish --tag next --access public
```

Version bumps follow semver: `npm version patch|minor|major`, then
`git push --follow-tags`.

## 4. List on nuxt.com/modules

The catalogue is a GitHub repository — listing means opening a pull request.
The package has to be on npm first, because the checks read it from there.

```bash
git clone https://github.com/<your-fork>/modules.git nuxt-modules
cd nuxt-modules
git checkout -b add-nvcalendar

cp ../nvcalendar/nuxt-modules-submission.yml modules/nvcalendar.yml
cp ../nvcalendar/nvcalendar.svg icons/nvcalendar.svg

npm install
npm run test          # validates the YAML against the schema
git add modules/nvcalendar.yml icons/nvcalendar.svg
git commit -m "feat: add nvcalendar"
git push origin add-nvcalendar
```

Then open the pull request against `nuxt/modules`.

Two fields deserve a second look before submitting:

- `website` currently points at the repository. Change it to the documentation
  domain once that is live; the catalogue links the card to it.
- `category` is `UI`, where people browse for calendar components. There is also
  a `Date` category in the schema, but nothing uses it yet, so it does not show
  up as a filter on the site.

Once merged, the module appears on <https://nuxt.com/modules> and
`npx nuxi module add nvcalendar` starts working.

## 5. After release

- Tag the release on GitHub and paste the changelog entry.
- Keep `compatibility.nuxt` in `src/module.ts` in sync with what you test.
- Announce it — the Nuxt Discord `#showcase` channel and the module catalogue
  are where most people discover new modules.
