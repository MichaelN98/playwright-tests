// @ts-check
import { test, expect } from '@playwright/test';

const BASE_URL = 'https://qauto.forstudy.space';

const EMAIL_PREFIX = 'aqa';
const generateEmail = () => `${EMAIL_PREFIX}-${Date.now()}@test.com`;

test.use({
  httpCredentials: { username: 'guest', password: 'welcome2qauto' },
});

const S = {
  signUpBtn:      '.hero-descriptor_btn',
  modal:          '.modal-content',
  name:           '#signupName',
  lastName:       '#signupLastName',
  email:          '#signupEmail',
  password:       '#signupPassword',
  repeatPassword: '#signupRepeatPassword',
  registerBtn:    '.modal-content .btn-primary',
};

const nameErr      = (p) => p.locator(`.form-group:has(${S.name}) .invalid-feedback`);
const lastNameErr  = (p) => p.locator(`.form-group:has(${S.lastName}) .invalid-feedback`);
const emailErr     = (p) => p.locator(`.form-group:has(${S.email}) .invalid-feedback`);
const passwordErr  = (p) => p.locator(`.form-group:has(${S.password}) .invalid-feedback`);
const repeatPwdErr = (p) => p.locator(`.form-group:has(${S.repeatPassword}) .invalid-feedback`);

const MSG = {
  nameRequired:      'Name required',
  nameInvalid:       'Name is invalid',
  nameLength:        'Name has to be from 2 to 20 characters long',
  lastNameRequired:  'Last name required',
  lastNameInvalid:   'Last name is invalid',
  lastNameLength:    'Last name has to be from 2 to 20 characters long',
  emailRequired:     'Email required',
  emailInvalid:      'Email is incorrect',
  passwordRequired:  'Password required',
  passwordInvalid:   'Password has to be from 8 to 15 characters long and contain at least one integer, one capital, and one small letter',
  repeatPwdRequired: 'Re-enter password required',
  repeatPwdMismatch: 'Passwords do not match.',
};

const VALID = { name: 'John', lastName: 'Doe', password: 'Password1' };

test.describe('Registration Form', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    await page.click(S.signUpBtn);
    await expect(page.locator(S.modal)).toBeVisible();
  });

  test('Positive: successful registration with valid data', async ({ page }) => {
    await page.fill(S.name, VALID.name);
    await page.fill(S.lastName, VALID.lastName);
    await page.fill(S.email, generateEmail());
    await page.fill(S.password, VALID.password);
    await page.fill(S.repeatPassword, VALID.password);
    await expect(page.locator(S.registerBtn)).toBeEnabled();
    await page.click(S.registerBtn);
    await expect(page.locator(S.modal)).not.toBeVisible();
  });

  test('Negative [Name]: empty => Name required + red border', async ({ page }) => {
    await page.click(S.name);
    await page.click(S.lastName);
    await expect(nameErr(page)).toHaveText(MSG.nameRequired);
    await expect(page.locator(S.name)).toHaveClass(/is-invalid/);
  });

  test('Negative [Name]: 1 char => length error', async ({ page }) => {
    await page.fill(S.name, 'A');
    await page.click(S.lastName);
    await expect(nameErr(page)).toHaveText(MSG.nameLength);
    await expect(page.locator(S.name)).toHaveClass(/is-invalid/);
  });

  test('Negative [Name]: 21 chars => length error', async ({ page }) => {
    await page.fill(S.name, 'A'.repeat(21));
    await page.click(S.lastName);
    await expect(nameErr(page)).toHaveText(MSG.nameLength);
    await expect(page.locator(S.name)).toHaveClass(/is-invalid/);
  });

  test('Negative [Name]: digits => Name is invalid', async ({ page }) => {
    await page.fill(S.name, 'John1');
    await page.click(S.lastName);
    await expect(nameErr(page)).toHaveText(MSG.nameInvalid);
    await expect(page.locator(S.name)).toHaveClass(/is-invalid/);
  });

  test('Negative [Name]: special chars => Name is invalid', async ({ page }) => {
    await page.fill(S.name, 'Jo@hn');
    await page.click(S.lastName);
    await expect(nameErr(page)).toHaveText(MSG.nameInvalid);
    await expect(page.locator(S.name)).toHaveClass(/is-invalid/);
  });

  test('Negative [Name]: spaces only (trim) => error visible', async ({ page }) => {
    await page.fill(S.name, '   ');
    await page.click(S.lastName);
    await expect(nameErr(page)).toBeVisible();
    await expect(page.locator(S.name)).toHaveClass(/is-invalid/);
  });

  test('Negative [Last name]: empty => Last name required + red border', async ({ page }) => {
    await page.click(S.lastName);
    await page.click(S.email);
    await expect(lastNameErr(page)).toHaveText(MSG.lastNameRequired);
    await expect(page.locator(S.lastName)).toHaveClass(/is-invalid/);
  });

  test('Negative [Last name]: 1 char => length error', async ({ page }) => {
    await page.fill(S.lastName, 'D');
    await page.click(S.email);
    await expect(lastNameErr(page)).toHaveText(MSG.lastNameLength);
    await expect(page.locator(S.lastName)).toHaveClass(/is-invalid/);
  });

  test('Negative [Last name]: 21 chars => length error', async ({ page }) => {
    await page.fill(S.lastName, 'D'.repeat(21));
    await page.click(S.email);
    await expect(lastNameErr(page)).toHaveText(MSG.lastNameLength);
    await expect(page.locator(S.lastName)).toHaveClass(/is-invalid/);
  });

  test('Negative [Last name]: special chars => Last name is invalid', async ({ page }) => {
    await page.fill(S.lastName, 'Doe!');
    await page.click(S.email);
    await expect(lastNameErr(page)).toHaveText(MSG.lastNameInvalid);
    await expect(page.locator(S.lastName)).toHaveClass(/is-invalid/);
  });

  test('Negative [Email]: empty => Email required + red border', async ({ page }) => {
    await page.click(S.email);
    await page.click(S.password);
    await expect(emailErr(page)).toHaveText(MSG.emailRequired);
    await expect(page.locator(S.email)).toHaveClass(/is-invalid/);
  });

  test('Negative [Email]: missing @ => Email is incorrect', async ({ page }) => {
    await page.fill(S.email, 'aqa-testtest.com');
    await page.click(S.password);
    await expect(emailErr(page)).toHaveText(MSG.emailInvalid);
    await expect(page.locator(S.email)).toHaveClass(/is-invalid/);
  });

  test('Negative [Email]: missing domain => Email is incorrect', async ({ page }) => {
    await page.fill(S.email, 'aqa-test@');
    await page.click(S.password);
    await expect(emailErr(page)).toHaveText(MSG.emailInvalid);
    await expect(page.locator(S.email)).toHaveClass(/is-invalid/);
  });

  test('Negative [Email]: plain text => Email is incorrect', async ({ page }) => {
    await page.fill(S.email, 'not-an-email');
    await page.click(S.password);
    await expect(emailErr(page)).toHaveText(MSG.emailInvalid);
    await expect(page.locator(S.email)).toHaveClass(/is-invalid/);
  });

  test('Negative [Password]: empty => Password required + red border', async ({ page }) => {
    await page.click(S.password);
    await page.click(S.repeatPassword);
    await expect(passwordErr(page)).toHaveText(MSG.passwordRequired);
    await expect(page.locator(S.password)).toHaveClass(/is-invalid/);
  });

  test('Negative [Password]: 7 chars (below min 8) => requirements error', async ({ page }) => {
    await page.fill(S.password, 'Pass1Ab');
    await page.click(S.repeatPassword);
    await expect(passwordErr(page)).toHaveText(MSG.passwordInvalid);
    await expect(page.locator(S.password)).toHaveClass(/is-invalid/);
  });

  test('Negative [Password]: 16 chars (above max 15) => requirements error', async ({ page }) => {
    await page.fill(S.password, 'Password12345678');
    await page.click(S.repeatPassword);
    await expect(passwordErr(page)).toHaveText(MSG.passwordInvalid);
    await expect(page.locator(S.password)).toHaveClass(/is-invalid/);
  });

  test('Negative [Password]: no uppercase => requirements error', async ({ page }) => {
    await page.fill(S.password, 'password1');
    await page.click(S.repeatPassword);
    await expect(passwordErr(page)).toHaveText(MSG.passwordInvalid);
    await expect(page.locator(S.password)).toHaveClass(/is-invalid/);
  });

  test('Negative [Password]: no digit => requirements error', async ({ page }) => {
    await page.fill(S.password, 'Passwords');
    await page.click(S.repeatPassword);
    await expect(passwordErr(page)).toHaveText(MSG.passwordInvalid);
    await expect(page.locator(S.password)).toHaveClass(/is-invalid/);
  });

  test('Negative [Password]: no lowercase => requirements error', async ({ page }) => {
    await page.fill(S.password, 'PASSWORD1');
    await page.click(S.repeatPassword);
    await expect(passwordErr(page)).toHaveText(MSG.passwordInvalid);
    await expect(page.locator(S.password)).toHaveClass(/is-invalid/);
  });

  test('Negative [Re-enter password]: empty => Re-enter password required', async ({ page }) => {
    await page.click(S.repeatPassword);
    await page.click(S.name);
    await expect(repeatPwdErr(page)).toHaveText(MSG.repeatPwdRequired);
    await expect(page.locator(S.repeatPassword)).toHaveClass(/is-invalid/);
  });

  test('Negative [Re-enter password]: mismatch => Passwords do not match.', async ({ page }) => {
    await page.fill(S.password, VALID.password);
    await page.fill(S.repeatPassword, 'WrongPass1');
    await page.click(S.name);
    await expect(repeatPwdErr(page)).toHaveText(MSG.repeatPwdMismatch);
    await expect(page.locator(S.repeatPassword)).toHaveClass(/is-invalid/);
  });

  test('Negative [Button]: disabled when all fields empty', async ({ page }) => {
    await expect(page.locator(S.registerBtn)).toBeDisabled();
  });

  test('Negative [Button]: disabled when form has errors', async ({ page }) => {
    await page.fill(S.name, 'A');
    await page.fill(S.lastName, VALID.lastName);
    await page.fill(S.email, generateEmail());
    await page.fill(S.password, VALID.password);
    await page.fill(S.repeatPassword, VALID.password);
    await expect(page.locator(S.registerBtn)).toBeDisabled();
  });

});
