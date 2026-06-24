import type { Page } from '@playwright/test';

export class CalculatorPage {
  constructor(private readonly page: Page) {}

  async getDisplay(): Promise<string> {
    return (await this.page.locator('#display').textContent()) ?? '';
  }

  async pressKey(key: string): Promise<void> {
    await this.page.locator(`[data-key="${key}"]`).click();
  }
}
