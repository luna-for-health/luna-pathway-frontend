# doctors-frontend

[![License: Apache-2.0](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](./LICENSE)

Web frontend of **Luna for Health**, a women's health platform. It lets patients request an
appointment at a Luna center and lets the center's secretaries handle those requests. A doctor space
is planned.

The app talks to the Luna backend API. This repository contains **no keys or secrets**: every
environment-specific value comes from a local `.env` file that is never committed.

## Features

**Patient**

- Sign in with email + one-time code, Google or Apple
- GDPR consent and onboarding
- Account creation (name, birthdate, city, phone)
- Pre-appointment questionnaire: consultation reason, story (typed or dictated), symptom intensity,
  recent imaging, document upload, summary and submission

**Secretary**

- Sign in with email + password, forgot / reset password
- Inbox of appointment requests (new, to call back, processed), with search, patient details,
  symptoms, documents and status updates

**Doctor** — coming soon

## Tech stack

- [React 19](https://react.dev) + [TypeScript](https://www.typescriptlang.org) +
  [Vite](https://vite.dev)
- [Tailwind CSS v4](https://tailwindcss.com) with the Luna design tokens,
  [shadcn/ui](https://ui.shadcn.com) and [Radix](https://www.radix-ui.com) primitives
- [React Router](https://reactrouter.com) (data router) and
  [TanStack Query](https://tanstack.com/query)
- [React Hook Form](https://react-hook-form.com) + [Zod](https://zod.dev) for forms
- [Amplitude](https://amplitude.com) for product analytics
- [Playwright](https://playwright.dev) for end-to-end tests
- ESLint, Prettier, Husky + [gitleaks](https://github.com/gitleaks/gitleaks) pre-commit hook

## Getting started

**Requirements:** Node.js 22 (see [`.nvmrc`](./.nvmrc)) and npm.

```bash
git clone git@github.com:luna-for-health/doctors-frontend.git
cd doctors-frontend
npm install
cp .env.example .env.development   # then fill in your own values
npm run dev                        # http://localhost:5173
```

Optional but recommended: install [gitleaks](https://github.com/gitleaks/gitleaks)
(`brew install gitleaks`) so the pre-commit hook can block commits that contain secrets.

## Environment variables

All variables are listed in [`.env.example`](./.env.example). Copy it to `.env.development` (and
`.env.production` for production builds). Every `.env*` file except `.env.example` is git-ignored.

| Variable                  | Description                                         |
| ------------------------- | --------------------------------------------------- |
| `VITE_API_BASE_URL`       | Base URL of the backend API                         |
| `VITE_GOOGLE_CLIENT_ID`   | Google OAuth client ID (Google sign-in)             |
| `VITE_APPLE_CLIENT_ID`    | Apple Sign In service ID                            |
| `VITE_APPLE_REDIRECT_URI` | Apple Sign In redirect URI                          |
| `VITE_AMPLITUDE_API_KEY`  | Amplitude API key — leave empty to disable tracking |

> ⚠️ `VITE_*` variables are bundled into the client JavaScript and are visible in the browser. Never
> put a server-side secret in them.

## Scripts

| Command                   | Description                                   |
| ------------------------- | --------------------------------------------- |
| `npm run dev`             | Start the dev server                          |
| `npm run build`           | Type-check and build for production           |
| `npm run build:dev`       | Type-check and build with the development env |
| `npm run preview`         | Preview the production build locally          |
| `npm run lint`            | Run ESLint                                    |
| `npm run format`          | Format all files with Prettier                |
| `npm run format:check`    | Check formatting without writing              |
| `npm run test:e2e`        | Run the Playwright end-to-end tests           |
| `npm run test:e2e:ui`     | Open Playwright's interactive UI mode         |
| `npm run test:e2e:report` | Open the last test report                     |

## Project structure

```
src/
├── components/      # Shared UI: design-system components (ui/) and layout (layout/)
├── features/        # One folder per feature, prefixed by role
│   ├── patient-auth/
│   ├── patient-account-creation/
│   ├── patient-questionnaire/
│   ├── secretary-auth/
│   └── secretary-inbox/
├── hooks/           # Shared React hooks
├── icons/           # SVG icon components
├── lib/             # Shared helpers
├── providers/       # App-wide providers (React Query)
├── routes/          # Router, route guards and layouts
├── services/        # API client, token storage, analytics
└── types/           # Shared TypeScript types
e2e/                 # Playwright tests
```

More details in [`docs/architecture.md`](./docs/architecture.md) and the component guide in
[`docs/components.md`](./docs/components.md).

## Testing

End-to-end tests use Playwright and run on Chromium, Firefox and WebKit:

```bash
npx playwright install   # once, downloads the test browsers
npm run test:e2e
```

The tests start the app in Vite's `test` mode on port 5174, which does **not** load
`.env.development`. Every backend and third-party call (including Google sign-in) is mocked, so the
tests need no keys, no backend and no network access.

## Contributing

Contributions are welcome — see [`CONTRIBUTING.md`](./CONTRIBUTING.md) for the branch workflow,
commit conventions and checks to run before opening a pull request.

## Security

Please do **not** open a public issue for security problems. See [`SECURITY.md`](./SECURITY.md) to
report a vulnerability privately.

## License

Licensed under the [Apache License 2.0](./LICENSE).
