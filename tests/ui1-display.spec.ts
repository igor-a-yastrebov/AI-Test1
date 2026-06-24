import { test, expect } from './fixtures';

test.describe('UI-1 — Табло', () => {

  // TC-UI-1-1
  test('начальное состояние табло показывает 0.00', async ({ page }) => {
    const display = await page.locator('#display').textContent();
    expect(display).toBe('0.00');
  });

  // TC-UI-1-2
  test('ввод числа отображается на табло', async ({ page }) => {
    await page.locator('[data-key="1"]').click();
    await page.locator('[data-key="2"]').click();
    await page.locator('[data-key="3"]').click();
    const display = await page.locator('#display').textContent();
    expect(display).toBe('123');
  });

  // TC-UI-1-3
  test('отображение дробной части', async ({ page }) => {
    await page.locator('[data-key="5"]').click();
    await page.locator('[data-key="."]').click();
    await page.locator('[data-key="2"]').click();
    const display = await page.locator('#display').textContent();
    expect(display).toBe('5.2');
  });

});
