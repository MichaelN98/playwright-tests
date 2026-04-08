// @ts-check
import { test, expect } from '@playwright/test';
import { HomePage } from './pages/HomePage.js';
import { RegistrationModal } from './pages/RegistrationModal.js';

/**
 * All test users have emails starting with "aqa-" prefix
 * so they can be distinguished from real users.
 * Example: aqa-1712345678@test.com
 */
const generateEmail = () => `aqa-${Date.now()}@test.com`;

test.use({
  httpCredentials: { username: 'guest', password: 'welcome2qauto' },
});

// ── Expected error messages (from requirements) ───────────────────────────────
const MSG = {
  nameRequired:      'Name required',
  nameInvalid:       'Name is invalid',
  nameLength:        'Name has to be from 2 to 20 characters long',
  lastNameRequired:  'Last name required',
  lastNameLength:    'Last name has to be from 2 to 20 characters long',
  emailRequired:     'Email required',
  emailInvalid:      'Email is incorrect',
  passwordRequired:  'Password required',
  passwordInvalid:   'Password has to be from 8 to 15 characters long and contain at least one integer, one capital, and one small letter',
  repeatPwdRequired: 'Re-enter password required',
  repeatPwdMismatch: 'Passwords do not match',
};

const VALID = { name: 'John', lastName: 'Doe', password: 'Password1' };

// ─────────────────────────────────────────────────────────────────────────────

test.describe('Registration Form', () => {

  /** @type {RegistrationModal} */
  let modal;

  test.beforeEach(async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();
    modal = await homePage.openRegistrationModal();
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // POSITIVE SCENARIO
  // ═══════════════════════════════════════════════════════════════════════════

  test('Positive: successful registration with valid data', async () => {
    await modal.fillAll({
      name:           VALID.name,
      lastName:       VALID.lastName,
      email:          generateEmail(),
      password:       VALID.password,
      repeatPassword: VALID.password,
    });

    await expect(modal.registerBtn).toBeEnabled();
    await modal.submit();
    await expect(modal.modal).not.toBeVisible();
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // NEGATIVE — NAME FIELD
  // ═══════════════════════════════════════════════════════════════════════════

  test('Negative [Name]: empty field → "Name required" + red border', async () => {
    await modal.nameInput.click();
    await modal.lastNameInput.click(); // blur

    await expect(modal.nameError).toHaveText(MSG.nameRequired);
    await expect(modal.nameInput).toHaveClass(/is-invalid/);
  });

  test('Negative [Name]: 1 character → length error', async () => {
    await modal.fillName('A');

    await expect(modal.nameError).toHaveText(MSG.nameLength);
    await expect(modal.nameInput).toHaveClass(/is-invalid/);
  });

  test('Negative [Name]: digits → "Name is invalid"', async () => {
    await modal.fillName('John1');

    await expect(modal.nameError).toHaveText(MSG.nameInvalid);
    await expect(modal.nameInput).toHaveClass(/is-invalid/);
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // NEGATIVE — LAST NAME FIELD
  // ═══════════════════════════════════════════════════════════════════════════

  test('Negative [Last name]: empty field → "Last name required" + red border', async () => {
    await modal.lastNameInput.click();
    await modal.emailInput.click();

    await expect(modal.lastNameError).toHaveText(MSG.lastNameRequired);
    await expect(modal.lastNameInput).toHaveClass(/is-invalid/);
  });

  test('Negative [Last name]: 21 characters → length error', async () => {
    await modal.fillLastName('D'.repeat(21));

    await expect(modal.lastNameError).toHaveText(MSG.lastNameLength);
    await expect(modal.lastNameInput).toHaveClass(/is-invalid/);
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // NEGATIVE — EMAIL FIELD
  // ═══════════════════════════════════════════════════════════════════════════

  test('Negative [Email]: empty field → "Email required" + red border', async () => {
    await modal.emailInput.click();
    await modal.passwordInput.click();

    await expect(modal.emailError).toHaveText(MSG.emailRequired);
    await expect(modal.emailInput).toHaveClass(/is-invalid/);
  });

  test('Negative [Email]: invalid format → "Email is incorrect"', async () => {
    await modal.fillEmail('aqa-testtest.com');

    await expect(modal.emailError).toHaveText(MSG.emailInvalid);
    await expect(modal.emailInput).toHaveClass(/is-invalid/);
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // NEGATIVE — PASSWORD FIELD
  // ═══════════════════════════════════════════════════════════════════════════

  test('Negative [Password]: empty field → "Password required" + red border', async () => {
    await modal.passwordInput.click();
    await modal.repeatPasswordInput.click();

    await expect(modal.passwordError).toHaveText(MSG.passwordRequired);
    await expect(modal.passwordInput).toHaveClass(/is-invalid/);
  });

  test('Negative [Password]: 7 chars (below min 8) → requirements error', async () => {
    await modal.fillPassword('Pass1Ab');

    await expect(modal.passwordError).toHaveText(MSG.passwordInvalid);
    await expect(modal.passwordInput).toHaveClass(/is-invalid/);
  });

  test('Negative [Password]: no uppercase → requirements error', async () => {
    await modal.fillPassword('password1');

    await expect(modal.passwordError).toHaveText(MSG.passwordInvalid);
    await expect(modal.passwordInput).toHaveClass(/is-invalid/);
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // NEGATIVE — RE-ENTER PASSWORD FIELD
  // ═══════════════════════════════════════════════════════════════════════════

  test('Negative [Re-enter password]: empty field → "Re-enter password required"', async () => {
    await modal.repeatPasswordInput.click();
    await modal.nameInput.click();

    await expect(modal.repeatPasswordError).toHaveText(MSG.repeatPwdRequired);
    await expect(modal.repeatPasswordInput).toHaveClass(/is-invalid/);
  });

  test('Negative [Re-enter password]: mismatch → "Passwords do not match"', async () => {
    await modal.fillPassword(VALID.password);
    await modal.fillRepeatPassword('WrongPass1');

    await expect(modal.repeatPasswordError).toHaveText(MSG.repeatPwdMismatch);
    await expect(modal.repeatPasswordInput).toHaveClass(/is-invalid/);
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // NEGATIVE — REGISTER BUTTON STATE
  // ═══════════════════════════════════════════════════════════════════════════

  test('Negative [Button]: disabled when all fields are empty', async () => {
    await expect(modal.registerBtn).toBeDisabled();
  });

  test('Negative [Button]: disabled when form has validation errors', async () => {
    await modal.fillAll({
      name:           'A', // too short — invalid
      lastName:       VALID.lastName,
      email:          generateEmail(),
      password:       VALID.password,
      repeatPassword: VALID.password,
    });

    await expect(modal.registerBtn).toBeDisabled();
  });

});
