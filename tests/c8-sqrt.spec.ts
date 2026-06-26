import { test, expect } from './fixtures';
import { CalculatorPage } from './pages/CalculatorPage';

test.describe('C-8 — Кубический корень', () => {

  // TC-C-8-1
  test('∛27 = 3.00', async ({ page }) => {
    const calc = new CalculatorPage(page);
    await calc.pressKeys('2', '7', 'SQRT');
    expect(await calc.getDisplay()).toBe('3.00');
  });

  // TC-C-8-2
  test('∛8 = 2.00', async ({ page }) => {
    const calc = new CalculatorPage(page);
    await calc.pressKeys('8', 'SQRT');
    expect(await calc.getDisplay()).toBe('2.00');
  });

  // TC-C-8-3
  test('∛0 = 0.00', async ({ page }) => {
    const calc = new CalculatorPage(page);
    await calc.pressKeys('0', 'SQRT');
    expect(await calc.getDisplay()).toBe('0.00');
  });

  // TC-C-8-4
  test('∛(-8) = -2.00 (отрицательный аргумент)', async ({ page }) => {
    const calc = new CalculatorPage(page);
    // получить отрицательное число: 0 - 8 = -8, затем SQRT
    await calc.pressKeys('0', '-', '8', '=', 'SQRT');
    expect(await calc.getDisplay()).toBe('-2.00');
  });

});
