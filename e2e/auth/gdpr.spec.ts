import { expect, test } from '@playwright/test';

import {
  checkGdprBoxes,
  createCapture,
  goToLogin,
  makeUser,
  mockAcceptGdpr,
  mockGdprConsent,
  mockOauthSignup,
  mockSendCode,
  stubGoogleIdentity,
  submitEmail,
} from './mocks';

test.describe('GdprScreen', () => {
  test('redirects to the login screen when reached with no email in state', async ({ page }) => {
    await goToLogin(page); // stays hermetic: mocks /onboarding before the redirect lands there
    await page.goto('/gdpr');

    await expect(page).toHaveURL('/login');
  });

  test('keeps "Valider" disabled until both checkboxes are checked', async ({ page }) => {
    await goToLogin(page);
    await mockGdprConsent(page, { user: makeUser({ has_accepted_gdpr: false }) });
    await submitEmail(page, 'jane.doe@example.com');
    await expect(page).toHaveURL('/gdpr');

    const submit = page.getByRole('button', { name: 'Valider' });
    await expect(submit).toBeDisabled();

    await page.getByRole('checkbox', { name: /données personnelles/i }).check();
    await expect(submit).toBeDisabled();

    await page.getByRole('checkbox', { name: /CGU/i }).check();
    await expect(submit).toBeEnabled();
  });

  test('signup flow (brand-new user): submit sends a code with type "signup" and goes to OTP', async ({
    page,
  }) => {
    await goToLogin(page);
    await mockGdprConsent(page, { user: null }); // no user record → LoginForm infers 'signup'
    await submitEmail(page, 'new.user@example.com');
    await expect(page).toHaveURL('/gdpr');

    const capture = createCapture<{ email: string; type: string }>();
    await mockSendCode(page, { capture });

    await checkGdprBoxes(page);
    await page.getByRole('button', { name: 'Valider' }).click();

    await expect(page).toHaveURL('/otp');
    expect(capture.body).toMatchObject({ email: 'new.user@example.com', type: 'signup' });
  });

  test('login flow (existing user, consent not yet accepted): submit sends type "login" and goes to OTP', async ({
    page,
  }) => {
    await goToLogin(page);
    await mockGdprConsent(page, { user: makeUser({ has_accepted_gdpr: false }) });
    await submitEmail(page, 'jane.doe@example.com');
    await expect(page).toHaveURL('/gdpr');

    const capture = createCapture<{ email: string; type: string }>();
    await mockSendCode(page, { capture });

    await checkGdprBoxes(page);
    await page.getByRole('button', { name: 'Valider' }).click();

    await expect(page).toHaveURL('/otp');
    expect(capture.body).toMatchObject({ email: 'jane.doe@example.com', type: 'login' });
  });

  test('already-authenticated flow (post Google sign-in), onboarding not completed: accepts GDPR directly and goes to account creation, no OTP', async ({
    page,
  }) => {
    await stubGoogleIdentity(page, 'success');
    await goToLogin(page);
    await mockOauthSignup(page, 'google', { user: makeUser({ has_accepted_gdpr: false }) });
    await mockGdprConsent(page, { user: makeUser({ has_accepted_gdpr: false }) });
    await page.getByRole('button', { name: 'Continuer avec Google' }).click();
    await expect(page).toHaveURL('/gdpr');

    await mockAcceptGdpr(page);

    await checkGdprBoxes(page);
    await page.getByRole('button', { name: 'Valider' }).click();

    await expect(page).toHaveURL('/account/step-1');
  });

  test('already-authenticated flow (post Google sign-in), patient already onboarded: accepts GDPR directly and goes to home, no OTP', async ({
    page,
  }) => {
    await stubGoogleIdentity(page, 'success');
    await goToLogin(page);
    await mockOauthSignup(page, 'google', { user: makeUser({ has_accepted_gdpr: false }) });
    await mockGdprConsent(page, {
      user: makeUser({ has_accepted_gdpr: false, has_completed_onboarding: true }),
    });
    await page.getByRole('button', { name: 'Continuer avec Google' }).click();
    await expect(page).toHaveURL('/gdpr');

    await mockAcceptGdpr(page);

    await checkGdprBoxes(page);
    await page.getByRole('button', { name: 'Valider' }).click();

    await expect(page).toHaveURL('/home');
    await expect(page.getByText('Connexion réussie.')).toBeVisible();
  });

  test('renders GDPR content cards and video steps from the API', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await goToLogin(page);
    await mockGdprConsent(page, { user: makeUser({ has_accepted_gdpr: false }) });
    await submitEmail(page, 'jane.doe@example.com');
    await expect(page).toHaveURL('/gdpr');

    await expect(page.getByText('Vos données de santé')).toBeVisible();
    await expect(page.locator('video')).toHaveCount(1);
  });
});
