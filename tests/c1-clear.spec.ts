import { test, expect } from './fixtures';
import { CalculatorPage } from './pages/CalculatorPage';

test.describe('C-1 — Очистка', () => {

  // TC-C-1-1
  test('Кнопка C сбрасывает табло', async ({ page }) => {
    const calc = new CalculatorPage(page);
    await calc.pressKeys('5', '+', '3', 'C');
    expect(await calc.getDisplay()).toBe('0.00');
  });

});
