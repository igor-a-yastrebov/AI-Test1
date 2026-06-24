import { test, expect } from './fixtures';
import { CalculatorPage } from './pages/CalculatorPage';

test.describe('C-4 — Цепочка операций', () => {

  // TC-C-4-1
  test('Промежуточный результат вычисляется при повторном операторе', async ({ page }) => {
    const calc = new CalculatorPage(page);
    await calc.pressKeys('2', '+', '3', '*');
    expect(await calc.getDisplay()).toBe('5.00');
  });

  // TC-C-4-2
  test('Пример из требований: 2+3×4=', async ({ page }) => {
    const calc = new CalculatorPage(page);
    await calc.pressKeys('2', '+', '3', '*', '4', '=');
    expect(await calc.getDisplay()).toBe('20.00');
  });

});
