# Contributing

Thanks for your interest in improving luna-pathway-frontend! This guide explains how to set up the
project, how we work with branches and commits, and what to check before opening a pull request.

## Getting set up

1. Fork the repository (external contributors) or clone it directly.
2. Install dependencies with Node.js 22: `npm install`
3. Create your local environment file: `cp .env.example .env.development`, then fill in the values
   you need. It is git-ignored and must never be committed.
4. Install [gitleaks](https://github.com/gitleaks/gitleaks) (`brew install gitleaks`). The
   pre-commit hook uses it to block commits that contain secrets.
5. Start the app: `npm run dev`

See the [README](./README.md) for the full list of variables and scripts.

## Branches

| Branch       | Purpose                                                 |
| ------------ | ------------------------------------------------------- |
| `main`       | Stable, released code                                   |
| `develop`    | Integration branch — all pull requests target `develop` |
| `feature/*`  | New features, e.g. `feature/secretary-inbox`            |
| `fix/*`      | Bug fixes                                               |
| `refactor/*` | Code changes with no behavior change                    |
| `chore/*`    | Tooling, dependencies, docs                             |

Always branch off an up-to-date `develop`:

```bash
git checkout develop
git pull
git checkout -b feature/my-feature
```

## Commits

Keep commits small and focused — one logical change per commit. Messages follow the
`type(scope): description` format, in English and in the imperative mood:

| Type       | Use it for                            |
| ---------- | ------------------------------------- |
| `feat`     | A new feature or component            |
| `fix`      | A bug fix                             |
| `refactor` | A code change with no behavior change |
| `docs`     | Documentation only                    |
| `test`     | Adding or updating tests              |
| `chore`    | Tooling, dependencies, configuration  |
| `ci`       | Continuous integration                |

The scope is optional and names the area you touched (`ui`, `secretary-inbox`, `e2e`, …). Examples
from this repository:

```
feat(ui): add button component
feat(patient-auth): add otp screen
refactor: rename diagnostic to patient-questionnaire
test(e2e): add login tests
```

## Before opening a pull request

Make sure everything passes locally:

```bash
npm run lint
npm run format:check
npm run build
npm run test:e2e
```

Then open a pull request into `develop` that explains what changed and why. Add screenshots for UI
changes, and tests for new behavior when possible. CI runs the same checks on every pull request.

## Code conventions

- Follow the structure described in [`docs/architecture.md`](./docs/architecture.md): one folder per
  feature (`<role>-<feature>`) and an `index.ts` barrel in every folder.
- Build screens with the shared components documented in
  [`docs/components.md`](./docs/components.md), and use the design tokens instead of raw colors.
- TypeScript, ESLint and Prettier are the source of truth for style — run `npm run format` before
  committing.

## Secrets

- Never commit `.env` files, API keys, tokens or real patient data. Only `.env.example`, with
  placeholder values, belongs in the repository.
- Remember that `VITE_*` variables end up in the browser bundle: never put a server-side secret in
  them.
- If you committed a secret by mistake, do not just delete it in a new commit — it stays in the git
  history. Tell the maintainers right away (see [`SECURITY.md`](./SECURITY.md)) so the key can be
  revoked and rotated.
