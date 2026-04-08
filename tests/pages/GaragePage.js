export class GaragePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;

    // ── Header ────────────────────────────────────────────────
    this.pageTitle   = page.locator('h1');

    // ── Actions ───────────────────────────────────────────────
    this.addCarBtn   = page.locator('button.btn-primary', { hasText: 'Add car' });

    // ── Car list / empty state ────────────────────────────────
    this.carList     = page.locator('.panel-page_cars');
    this.emptyState  = page.locator('.panel-page_empty');
    this.emptyMsg    = page.locator('.panel-empty_message');
  }

  async goto() {
    await this.page.goto('/panel/garage');
  }

  async isLoaded() {
    await this.page.waitForURL(/\/panel\/garage/);
    await this.pageTitle.waitFor({ state: 'visible' });
  }
}
