import type { Page } from '@playwright/test';

/**
 * Shared network-mocking helpers for the auth e2e suite. Every test drives the real app
 * through the browser (real routing, real form state, real component behavior) but
 * intercepts `fetch` calls to the backend (`VITE_API_BASE_URL`, whichever `.env.*` Vite
 * picks up) so tests don't depend on a live API or real user data. Response envelope
 * shape mirrors `IResponse<T>` (`src/types/endpoints.d.ts`) — kept as plain literals here
 * rather than imported, since `e2e/` intentionally doesn't share a tsconfig `paths` alias
 * with `src/` (black-box tests shouldn't need to resolve app-internal types).
 */

interface MockUser {
  id: number;
  email: string;
  has_accepted_gdpr: boolean;
  has_completed_onboarding?: boolean;
}

function ok(data: unknown, message = 'OK') {
  return { status: 'success', success: true, message, data };
}

function fail(message: string) {
  return { status: 'error', success: false, message, data: null };
}

export function makeUser(overrides: Partial<MockUser> = {}): MockUser {
  return { id: 1, email: 'jane.doe@example.com', has_accepted_gdpr: false, ...overrides };
}

/** One text step, one video step — enough to exercise both `TestimonialCard` and `MediaCard`. */
export const onboardingSteps = [
  {
    step: 1,
    title: 'La safe place pour votre suivi',
    backgroundColor: null,
    description: null,
    paragraphs: [
      'Je suis guidée dans mon parcours.',
      'Je trouve des praticiens spécialisés.',
      'Je suis mes cycles et symptômes.',
    ],
    icon: null,
    media: null,
  },
  {
    step: 2,
    title: null,
    backgroundColor: null,
    description: null,
    paragraphs: null,
    icon: null,
    media: 'https://example.com/videos/intro.mp4',
  },
  {
    step: 3,
    title: 'Évaluez votre score de risque',
    backgroundColor: null,
    description: 'Déterminez votre probabilité en quelques minutes.',
    paragraphs: ['Plus de 70 000 utilisatrices.', 'Fondé sur des études cliniques.'],
    icon: null,
    media: null,
  },
];

/** One text card, one video card — enough to exercise both `GdprCard` and `MediaCard`. */
export const gdprItems = [
  {
    step: 1,
    title: 'Vos données de santé',
    paragraphs: ['Nous protégeons vos données médicales.'],
    icon: null,
    media: null,
    media_text: null,
    link: null,
    backgroundColor: '#FFEDCC',
  },
  {
    step: 2,
    title: null,
    paragraphs: null,
    icon: null,
    media: 'https://example.com/videos/gdpr.mp4',
    media_text: null,
    link: null,
    backgroundColor: null,
  },
];

/** Mutable box a test can pass into a mock to inspect the request body it received. */
export function createCapture<T>() {
  return { body: null as T | null };
}

export async function mockOnboarding(page: Page, steps: unknown = onboardingSteps) {
  await page.route('**/onboarding', route => route.fulfill({ json: ok(steps) }));
}

/**
 * Mocks `GET /gdpr-consent` — the single endpoint behind both `useCheckGdprConsent`
 * (`LoginForm`'s pre-flight check) and `useGdprConsent` (`GdprScreen`'s own data fetch).
 * One mock covers both call sites since they hit the same URL.
 */
export async function mockGdprConsent(
  page: Page,
  { user = null as MockUser | null, gdpr = gdprItems, shouldFail = false } = {}
) {
  await page.route('**/gdpr-consent*', route =>
    route.fulfill(
      shouldFail
        ? { status: 500, json: fail('Impossible de vérifier le consentement.') }
        : { json: ok({ user, gdpr }) }
    )
  );
}

export async function mockSendCode(
  page: Page,
  { shouldFail = false, capture }: { shouldFail?: boolean; capture?: { body: unknown } } = {}
) {
  await page.route('**/auth/send-code', route => {
    if (capture) capture.body = route.request().postDataJSON();
    return route.fulfill(
      shouldFail ? { status: 500, json: fail('Erreur serveur.') } : { json: ok(null) }
    );
  });
}

export async function mockLogin(
  page: Page,
  { shouldFail = false, user = makeUser({ has_accepted_gdpr: true }) } = {}
) {
  await page.route('**/auth/login', route =>
    route.fulfill(
      shouldFail
        ? { status: 400, json: fail('Code invalide, veuillez réessayer.') }
        : { json: ok({ user, access_token: 'fake-access-token' }) }
    )
  );
}

export async function mockVerifyCode(
  page: Page,
  { shouldFail = false, user = makeUser({ has_accepted_gdpr: true }) } = {}
) {
  await page.route('**/auth/verify-code', route =>
    route.fulfill(
      shouldFail
        ? { status: 400, json: fail('Code invalide, veuillez réessayer.') }
        : { json: ok({ user, access_token: 'fake-access-token' }) }
    )
  );
}

export async function mockAcceptGdpr(
  page: Page,
  { capture }: { capture?: { body: unknown } } = {}
) {
  await page.route('**/gdpr/accept', route => {
    if (capture) capture.body = route.request().postDataJSON();
    return route.fulfill({ json: ok(null) });
  });
}

export async function mockOauthSignup(
  page: Page,
  provider: 'google' | 'apple',
  { user = makeUser({ has_accepted_gdpr: false }) } = {}
) {
  await page.route(`**/oauth/signup/${provider}`, route =>
    route.fulfill({ json: ok({ user, access_token: 'fake-oauth-token' }) })
  );
}

/**
 * Stubs Google Identity Services (`window.google.accounts.oauth2`) before any app script
 * runs, so `signInWithGoogle()` (`src/features/auth/services/google-auth.ts`) resolves or
 * rejects instantly instead of opening a real Google popup.
 */
export async function stubGoogleIdentity(page: Page, outcome: 'success' | 'cancelled' = 'success') {
  await page.addInitScript(outcome => {
    interface StubTokenClientConfig {
      callback: (response: {
        access_token?: string;
        error?: string;
        error_description?: string;
      }) => void;
      error_callback?: (error: { type: string; message?: string }) => void;
    }

    (window as unknown as { google: unknown }).google = {
      accounts: {
        oauth2: {
          initTokenClient: (config: StubTokenClientConfig) => ({
            requestAccessToken: () => {
              if (outcome === 'success') {
                config.callback({ access_token: 'fake-google-token' });
              } else {
                config.error_callback?.({
                  type: 'popup_closed',
                  message: 'Connexion Google annulée.',
                });
              }
            },
          }),
        },
      },
    };
  }, outcome);
}

export async function goToLogin(page: Page) {
  await mockOnboarding(page);
  await page.goto('/login');
}

export async function submitEmail(page: Page, email: string) {
  await page.getByLabel('Votre e-mail').fill(email);
  // `exact: true` matters here: Playwright's default name match is substring-based, and
  // "Continuer" would otherwise also match "Continuer avec Google"/"Continuer avec Apple".
  await page.getByRole('button', { name: 'Continuer', exact: true }).click();
}

export async function checkGdprBoxes(page: Page) {
  await page.getByRole('checkbox', { name: /données personnelles/i }).check();
  await page.getByRole('checkbox', { name: /CGU/i }).check();
}

/**
 * Types a full code into `OtpInput` — clicks box 1 and types the rest, relying on the
 * component's own auto-advance-on-digit behavior rather than targeting each box, so this
 * also exercises that behavior instead of working around it.
 */
export async function fillOtp(page: Page, code: string) {
  await page.getByLabel('Chiffre 1 sur 6').click();
  await page.keyboard.type(code);
}
