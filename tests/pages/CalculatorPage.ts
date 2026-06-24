import type { Page } from '@playwright/test';

export class CalculatorPage {
  constructor(private readonly page: Page) {}

  async getDisplay(): Promise<string> {
    return (await this.page.locator('#display').textContent()) ?? '';
  }

  async pressKey(key: string): Promise<void> {
    await this.page.locator(`[data-key="${key}"]`).click();
  }

  async pressKeys(...keys: string[]): Promise<void> {
    for (const key of keys) await this.pressKey(key);
  }

  async getFontSize(): Promise<number> {
    return this.page.locator('#display').evaluate(
      (el: HTMLElement) => parseFloat(getComputedStyle(el).fontSize)
    );
  }

  async isButtonPresent(key: string): Promise<boolean> {
    return this.page.locator(`[data-key="${key}"]`).isVisible();
  }
}
