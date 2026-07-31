# Publishing checklist

## 1. Prepare the package

Before the first publish, replace the placeholders in `package.json`:

```jsonc
{
  "name": "nvcalendar",              // must be free on npm — check first
  "version": "0.1.0",
  "author": "Nik <email@qsyro.com>",
  "repository": { "url": "git+https://github.com/msdoc11/nvcalendar.git" },
  "homepage": "https://github.com/msdoc11/nvcalendar#readme",
  "bugs": { "url": "https://github.com/msdoc11/nvcalendar/issues" }
}
```

Check name availability:

```bash
npm view nvcalendar
# "npm error 404" means the name is free
```

If it is taken, use a scope: `@your-org/nvcalendar`. Scoped packages need
`npm publish --access public` (already in the `release` script).

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

1. The module must already be on npm and its repository must be public.
2. Fork <https://github.com/nuxt/modules>.
3. Copy [`nuxt-modules-submission.yml`](./nuxt-modules-submission.yml) to
   `modules/nvcalendar.yml` in your fork and fill in the maintainer fields.
4. Add an icon: `icons/nvcalendar.svg` (square, works on light and dark).
5. Open the pull request. CI validates the YAML against npm and GitHub, so the
   package must be published *before* you submit.

Once merged, the module appears on <https://nuxt.com/modules> and
`npx nuxi module add nvcalendar` starts working.

## 5. After release

- Tag the release on GitHub and paste the changelog entry.
- Keep `compatibility.nuxt` in `src/module.ts` in sync with what you test.
- Announce it — the Nuxt Discord `#showcase` channel and the module catalogue
  are where most people discover new modules.
