import { RegistrationModal } from './RegistrationModal.js';

export class HomePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.signUpBtn = page.locator('.hero-descriptor_btn');
  }

  async goto() {
    await this.page.goto('https://qauto.forstudy.space');
  }

  /**
   * Clicks "Sign up" and returns an initialised RegistrationModal
   * @returns {Promise<RegistrationModal>}
   */
  async openRegistrationModal() {
    await this.signUpBtn.click();
    const modal = new RegistrationModal(this.page);
    await modal.modal.waitFor({ state: 'visible' });
    return modal;
  }
}
