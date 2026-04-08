export class RegistrationModal {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;

    // ── Container ─────────────────────────────────────────────
    this.modal       = page.locator('.modal-content');
    this.registerBtn = page.locator('.modal-content .btn-primary');

    // ── Inputs ────────────────────────────────────────────────
    this.nameInput           = page.locator('#signupName');
    this.lastNameInput       = page.locator('#signupLastName');
    this.emailInput          = page.locator('#signupEmail');
    this.passwordInput       = page.locator('#signupPassword');
    this.repeatPasswordInput = page.locator('#signupRepeatPassword');

    // ── Error messages ────────────────────────────────────────
    this.nameError           = page.locator('.form-group:has(#signupName) .invalid-feedback');
    this.lastNameError       = page.locator('.form-group:has(#signupLastName) .invalid-feedback');
    this.emailError          = page.locator('.form-group:has(#signupEmail) .invalid-feedback');
    this.passwordError       = page.locator('.form-group:has(#signupPassword) .invalid-feedback');
    this.repeatPasswordError = page.locator('.form-group:has(#signupRepeatPassword) .invalid-feedback');
  }

  // ── Field helpers (fill + blur) ───────────────────────────────

  /** Fill Name and blur to trigger validation */
  async fillName(value) {
    await this.nameInput.fill(value);
    await this.lastNameInput.click();
  }

  /** Fill Last name and blur to trigger validation */
  async fillLastName(value) {
    await this.lastNameInput.fill(value);
    await this.emailInput.click();
  }

  /** Fill Email and blur to trigger validation */
  async fillEmail(value) {
    await this.emailInput.fill(value);
    await this.passwordInput.click();
  }

  /** Fill Password and blur to trigger validation */
  async fillPassword(value) {
    await this.passwordInput.fill(value);
    await this.repeatPasswordInput.click();
  }

  /** Fill Re-enter password and blur to trigger validation */
  async fillRepeatPassword(value) {
    await this.repeatPasswordInput.fill(value);
    await this.nameInput.click();
  }

  /**
   * Fill all fields at once (no blur between fields).
   * @param {{ name: string, lastName: string, email: string, password: string, repeatPassword: string }} data
   */
  async fillAll({ name, lastName, email, password, repeatPassword }) {
    await this.nameInput.fill(name);
    await this.lastNameInput.fill(lastName);
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.repeatPasswordInput.fill(repeatPassword);
  }

  /** Click the Register button */
  async submit() {
    await this.registerBtn.click();
  }
}
