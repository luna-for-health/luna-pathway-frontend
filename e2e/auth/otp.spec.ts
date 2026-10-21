import { expect, test } from '@playwright/test';

import {
  checkGdprBoxes,
  fillOtp,
  goToLogin,
  makeUser,
  mockGdprConsent,
  mockSendCode,
  mockVerifyCode,
  submitEmail,
} from './mocks';

test.describe('OtpScreen', () => {
  test('redirects to the login screen when reached with no email in state', async ({ page }) => {
    await goToLogin(page);
    await page.goto('/otp');

    await expect(page).toHaveURL('/login');
  });

  test('correct code calls /auth/verify-code and, for a fully onboarded patient, goes to the questionnaire', async ({
    page,
  }) => {
    await goToLogin(page);
    await mockGdprConsent(page, { user: makeUser({ has_accepted_gdpr: true }) });
    await mockSendCode(page);
    await submitEmail(page, 'jane.doe@example.com');
    await expect(page).toHaveURL('/otp');

    await mockVerifyCode(page, {
      user: makeUser({ has_accepted_gdpr: true, has_completed_onboarding: true }),
    });

    await fillOtp(page, '123456');

    await expect(page).toHaveURL('/diagnostic/intro');
  });

  test('correct code with GDPR accepted but onboarding not completed goes to account creation', async ({
    page,
  }) => {
    await goToLogin(page);
    await mockGdprConsent(page, { user: makeUser({ has_accepted_gdpr: true }) });
    await mockSendCode(page);
    await submitEmail(page, 'jane.doe@example.com');
    await expect(page).toHaveURL('/otp');

    await mockVerifyCode(page, { user: makeUser({ has_accepted_gdpr: true }) });

    await fillOtp(page, '123456');

    await expect(page).toHaveURL('/account/step-1');
  });

  test('signup flow: correct code calls /auth/verify-code and, GDPR not yet accepted, returns to GDPR', async ({
    page,
  }) => {
    await goToLogin(page);
    await mockGdprConsent(page, { user: null });
    await submitEmail(page, 'new.user@example.com');
    await expect(page).toHaveURL('/gdpr');

    await mockSendCode(page);
    await checkGdprBoxes(page);
    await page.getByRole('button', { name: 'Valider' }).click();
    await expect(page).toHaveURL('/otp');

    await mockVerifyCode(page, { user: makeUser({ has_accepted_gdpr: false }) });

    await fillOtp(page, '123456');

    await expect(page).toHaveURL('/gdpr');
  });

  test('wrong code shows an error and resets the boxes for another attempt', async ({ page }) => {
    await goToLogin(page);
    await mockGdprConsent(page, { user: makeUser({ has_accepted_gdpr: true }) });
    await mockSendCode(page);
    await submitEmail(page, 'jane.doe@example.com');
    await expect(page).toHaveURL('/otp');

    await mockVerifyCode(page, { shouldFail: true });
    await fillOtp(page, '000000');

    await expect(page.getByText('Code invalide, veuillez réessayer.')).toBeVisible();
    // OtpInput clears itself and refocuses box 1 ~550ms after the error is set.
    await expect(page.getByLabel('Chiffre 1 sur 6')).toHaveValue('');
    await expect(page.getByLabel('Chiffre 1 sur 6')).toBeFocused();
  });

  test('resend is disabled during the 30s cooldown and works once it elapses', async ({ page }) => {
    // Fake clock so the 30s cooldown doesn't make the test take 30 real seconds.
    await page.clock.install();
    await goToLogin(page);
    await mockGdprConsent(page, { user: makeUser({ has_accepted_gdpr: true }) });
    await mockSendCode(page);
    await submitEmail(page, 'jane.doe@example.com');
    await expect(page).toHaveURL('/otp');

    await expect(page.getByText(/Renvoyer le code dans 00:\d{2}/)).toBeVisible();
    await expect(page.getByRole('button', { name: 'Renvoyer le code' })).toHaveCount(0);

    await page.clock.runFor('00:31');

    const resendButton = page.getByRole('button', { name: 'Renvoyer le code' });
    await expect(resendButton).toBeVisible();
    await resendButton.click();

    await expect(page.getByText('Renvoyer le code dans 00:30')).toBeVisible();
  });

  test('back button (mobile) returns to the previous screen', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 }); // header's back button is `lg:hidden`
    await goToLogin(page);
    await mockGdprConsent(page, { user: makeUser({ has_accepted_gdpr: true }) });
    await mockSendCode(page);
    await submitEmail(page, 'jane.doe@example.com');
    await expect(page).toHaveURL('/otp');

    await page.getByRole('button', { name: 'Retour' }).click();

    await expect(page).toHaveURL('/login');
  });
});
