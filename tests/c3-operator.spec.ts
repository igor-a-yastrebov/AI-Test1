import { test, expect } from './fixtures';
import { CalculatorPage } from './pages/CalculatorPage';

test.describe('C-3 — Оператор сохраняет первый операнд', () => {

  // TC-C-3-1
  test('После оператора начинается ввод второго операнда', async ({ page }) => {
    const calc = new CalculatorPage(page);
    await calc.pressKeys('5', '+', '3');
    expect(await calc.getDisplay()).toBe('3');
  });

});
