import { test, expect } from './fixtures';
import { CalculatorPage } from './pages/CalculatorPage';

test.describe('C-6 — Деление на ноль', () => {

  // TC-C-6-1
  test('Деление на ноль показывает "Ошибка"', async ({ page }) => {
    const calc = new CalculatorPage(page);
    await calc.pressKeys('5', '/', '0', '=');
    expect(await calc.getDisplay()).toBe('Ошибка');
  });

  // TC-C-6-2
  test('После ошибки состояние сбрасывается', async ({ page }) => {
    const calc = new CalculatorPage(page);
    await calc.pressKeys('5', '/', '0', '=');
    await calc.pressKey('5');
    expect(await calc.getDisplay()).toBe('5');
  });

});
