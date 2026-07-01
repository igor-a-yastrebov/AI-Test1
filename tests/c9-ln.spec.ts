import { test, expect } from './fixtures';
import { CalculatorPage } from './pages/CalculatorPage';

test.describe('C-9 — Натуральный логарифм', () => {

  // TC-C-9-1
  test('ln(e) = 1.00', async ({ page }) => {
    const calc = new CalculatorPage(page);
    await calc.pressKeys('2', '.', '7', '1', '8', '2', '8', 'LN');
    expect(await calc.getDisplay()).toBe('1.00');
  });

  // TC-C-9-2
  test('ln(1) = 0.00', async ({ page }) => {
    const calc = new CalculatorPage(page);
    await calc.pressKeys('1', 'LN');
    expect(await calc.getDisplay()).toBe('0.00');
  });

  // TC-C-9-3
  test('ln(0) = Ошибка', async ({ page }) => {
    const calc = new CalculatorPage(page);
    await calc.pressKeys('0', 'LN');
    expect(await calc.getDisplay()).toBe('Ошибка');
  });

  // TC-C-9-4
  test('ln(отрицательного числа) = Ошибка', async ({ page }) => {
    const calc = new CalculatorPage(page);
    // получить отрицательное число: 0 - 5 = -5, затем LN
    await calc.pressKeys('0', '-', '5', '=', 'LN');
    expect(await calc.getDisplay()).toBe('Ошибка');
  });

});
