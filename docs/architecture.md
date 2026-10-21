# Architecture

A short tour of how the app is organized. For the UI components, see
[`components.md`](./components.md).

## Folder structure

| Folder            | Role                                                                          |
| ----------------- | ----------------------------------------------------------------------------- |
| `src/components/` | Shared UI: design-system components (`ui/`) and app chrome (`layout/`)        |
| `src/features/`   | Business features, one folder per feature, prefixed by role                   |
| `src/hooks/`      | Shared hooks (`useIcon`, `useDebouncedValue`, `useSpeechToText`, …)           |
| `src/icons/`      | SVG icon components (`PascalCaseIcon`)                                        |
| `src/lib/`        | Shared helpers (`cn`, text formatting, time)                                  |
| `src/providers/`  | App-wide providers (`QueryProvider`)                                          |
| `src/routes/`     | Router, route guards and layouts                                              |
| `src/services/`   | `apiClient`, `tokenStorage`, `analytics`                                      |
| `src/types/`      | Shared types: UI props, icons, layout, API response envelope (`IResponse<T>`) |
| `e2e/`            | Playwright end-to-end tests                                                   |

Every folder exposes its public API through an `index.ts` barrel, and imports use the `@/` alias
(`@/components/ui`, `@/services`, …).

## Features

Features are grouped by role with a `<role>-<feature>` name:

| Feature                    | What it does                                                          |
| -------------------------- | --------------------------------------------------------------------- |
| `patient-auth`             | Welcome screen, email + OTP login, Google / Apple sign-in, GDPR       |
| `patient-account-creation` | Account creation after the first login (name, birthdate, city, phone) |
| `patient-questionnaire`    | Pre-appointment questionnaire, from the intro to the confirmation     |
| `secretary-auth`           | Secretary login, forgot / reset password                              |
| `secretary-inbox`          | Inbox of appointment requests and their processing                    |

Inside a feature, each subfolder has one job (only the ones the feature needs exist):

| Subfolder     | Content                                                              |
| ------------- | -------------------------------------------------------------------- |
| `api/`        | Backend calls and React Query hooks, plus the API types (`types.ts`) |
| `components/` | Feature-specific components                                          |
| `pages/`      | Screens mounted by the router                                        |
| `hooks/`      | Feature-specific hooks                                               |
| `lib/`        | Pure helpers (mapping, formatting, storage)                          |
| `schemas/`    | Zod form schemas                                                     |
| `services/`   | Integrations with third parties (e.g. Google / Apple sign-in)        |
| `types/`      | Component props and domain types                                     |

A feature may import shared code (`components`, `services`, `lib`, …) and, when needed, another
feature's public modules (e.g. the inbox reuses the questionnaire's symptom list).

## Routing and roles

The router lives in `src/routes/index.tsx` (React Router data router). Routes are grouped by who can
open them:

| Access             | Routes                                                                                                           |
| ------------------ | ---------------------------------------------------------------------------------------------------------------- |
| Public (patient)   | `/`, `/login`, `/gdpr`, `/otp`                                                                                   |
| Patient only       | `/account/step-1…4`, `/diagnostic/*`, and `/home`, `/annuaire`, `/dossier`, `/compte` (with the main navigation) |
| Public (secretary) | `/pro/login`, `/secretary/forgot-password`, `/secretary/reset-password`                                          |
| Secretary only     | `/secretary/inbox`, `/secretary/dossiers`, `/secretary/compte` (with the sidebar)                                |

- **Guards:** `RequirePatientAuth` and `RequireSecretaryAuth` read the current role from
  `tokenStorage`. Without the right role they redirect to `/login` or `/pro/login`, remembering the
  page that was requested, and they re-check when the token disappears mid-session (401, logout,
  another tab).
- **Layouts:** `AppLayout` adds the patient `MainNav`; `SecretaryLayout` adds the
  `SecretarySidebar`.

## Data flow

```
component → feature hook (React Query) → apiClient → backend
```

- **`apiClient`** (`src/services/api-client.ts`) wraps `fetch`: it prefixes `VITE_API_BASE_URL`,
  adds the `Bearer` token, `Accept-Language` and `X-Timezone`, clears the token on a 401 and throws
  an `ApiError` on failures. Responses follow the `IResponse<T>` envelope.
- **React Query** (`QueryProvider`) caches server data. Each feature exposes its own hooks in `api/`
  (e.g. `useSendCode`, `useInboxRequests`).
- **`tokenStorage`** keeps the token and its role (`patient` or `secretary`) in `localStorage` and
  notifies subscribers when it changes.
- **Local UI state** stays in components. Multi-step flows pass their answers through route state;
  the questionnaire also keeps a draft in `sessionStorage` so going back or reloading keeps the
  answers (uploaded files stay in memory only).

## Configuration and analytics

- Environment values come from `import.meta.env` (`.env.development` / `.env.production`, typed in
  `src/vite-env.d.ts`). See the README for the list.
- `analytics` (`src/services/analytics/`) wraps Amplitude with a typed event catalogue
  (`events.ts`). It does nothing when `VITE_AMPLITUDE_API_KEY` is empty.
- E2E tests run Vite in `test` mode on port 5174, which loads no `.env.development`, and mock every
  network call.

## Adding a new feature

1. Create `src/features/<role>-<feature>/` with the subfolders you need (`api/`, `components/`,
   `pages/`, `types/`, …), each with an `index.ts` barrel.
2. Add the API calls in `api/` with `apiClient`, and wrap them in React Query hooks.
3. Build screens in `pages/` from the shared components in `@/components/ui`.
4. Register the routes in `src/routes/index.tsx`, inside the guard and layout of the role they
   belong to.
5. Add analytics events to `src/services/analytics/events.ts` if needed.
6. Cover the main flow with a Playwright test in `e2e/`, mocking the API with `page.route`.

### Adding a new role

1. Add the role to the `AuthRole` type in `src/services/token-storage.ts`.
2. Create a `Require<Role>Auth` guard and a layout in `src/routes/`, following
   `RequireSecretaryAuth` and `SecretaryLayout`.
3. Group the role's routes under that guard and layout in `src/routes/index.tsx`.
