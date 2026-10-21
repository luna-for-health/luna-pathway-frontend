import { expect, test } from '@playwright/test';

import {
  goToLogin,
  makeUser,
  mockGdprConsent,
  mockOauthSignup,
  mockSendCode,
  stubGoogleIdentity,
  submitEmail,
} from './mocks';

test.describe('LoginScreen', () => {
  test('disables submit until the email is valid', async ({ page }) => {
    await goToLogin(page);

    const submit = page.getByRole('button', { name: 'Continuer', exact: true });
    await expect(submit).toBeDisabled();

    await page.getByLabel('Votre e-mail').fill('not-an-email');
    await expect(submit).toBeDisabled();

    await page.getByLabel('Votre e-mail').fill('jane.doe@example.com');
    await expect(submit).toBeEnabled();
  });

  test('existing user with accepted GDPR goes straight to the OTP screen', async ({ page }) => {
    await goToLogin(page);
    await mockGdprConsent(page, { user: makeUser({ has_accepted_gdpr: true }) });
    await mockSendCode(page);

    await submitEmail(page, 'jane.doe@example.com');

    await expect(page).toHaveURL('/otp');
    await expect(
      page.getByText('Code envoyé sur votre adresse jane.doe@example.com')
    ).toBeVisible();
  });

  test('existing user without accepted GDPR is routed to the GDPR screen', async ({ page }) => {
    await goToLogin(page);
    await mockGdprConsent(page, { user: makeUser({ has_accepted_gdpr: false }) });

    await submitEmail(page, 'jane.doe@example.com');

    await expect(page).toHaveURL('/gdpr');
    await expect(page.getByRole('checkbox', { name: /données personnelles/i })).toBeVisible();
  });

  test('brand-new user (no account yet) is also routed to the GDPR screen', async ({ page }) => {
    await goToLogin(page);
    await mockGdprConsent(page, { user: null });

    await submitEmail(page, 'new.user@example.com');

    await expect(page).toHaveURL('/gdpr');
  });

  test('shows an inline error when the consent check fails, without navigating away', async ({
    page,
  }) => {
    await goToLogin(page);
    await mockGdprConsent(page, { shouldFail: true });

    await submitEmail(page, 'jane.doe@example.com');

    await expect(page.getByText('Impossible de vérifier le consentement.')).toBeVisible();
    await expect(page).toHaveURL('/login');
  });

  test('Google sign-in without accepted GDPR redirects to GDPR as already authenticated', async ({
    page,
  }) => {
    await stubGoogleIdentity(page, 'success');
    await goToLogin(page);
    await mockOauthSignup(page, 'google', { user: makeUser({ has_accepted_gdpr: false }) });

    await page.getByRole('button', { name: 'Continuer avec Google' }).click();

    await expect(page).toHaveURL('/gdpr');
  });

  test('Google sign-in with accepted GDPR but no completed onboarding goes to account creation', async ({
    page,
  }) => {
    await stubGoogleIdentity(page, 'success');
    await goToLogin(page);
    await mockOauthSignup(page, 'google', { user: makeUser({ has_accepted_gdpr: true }) });

    await page.getByRole('button', { name: 'Continuer avec Google' }).click();

    await expect(page).toHaveURL('/account/step-1');
  });

  test('Google sign-in for a fully onboarded patient goes to the questionnaire', async ({
    page,
  }) => {
    await stubGoogleIdentity(page, 'success');
    await goToLogin(page);
    await mockOauthSignup(page, 'google', {
      user: makeUser({ has_accepted_gdpr: true, has_completed_onboarding: true }),
    });

    await page.getByRole('button', { name: 'Continuer avec Google' }).click();

    await expect(page).toHaveURL('/diagnostic/intro');
  });

  test('Google sign-in cancellation shows an inline error and stays on the login screen', async ({
    page,
  }) => {
    await stubGoogleIdentity(page, 'cancelled');
    await goToLogin(page);

    await page.getByRole('button', { name: 'Continuer avec Google' }).click();

    await expect(page.getByText('Connexion Google annulée.')).toBeVisible();
    await expect(page).toHaveURL('/login');
  });

  test('Apple sign-in shows a not-configured error immediately (no client ID in any env yet)', async ({
    page,
  }) => {
    await goToLogin(page);

    await page.getByRole('button', { name: 'Continuer avec Apple' }).click();

    await expect(
      page.getByText("La connexion avec Apple n'est pas encore configurée pour cet environnement.")
    ).toBeVisible();
    await expect(page).toHaveURL('/login');
  });

  test('onboarding carousel renders both testimonial and video slides', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await goToLogin(page);

    await expect(page.getByText('La safe place pour votre suivi')).toBeVisible();
    await expect(page.locator('video')).toHaveCount(1);
  });
});
