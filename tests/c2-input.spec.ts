import { test, expect } from './fixtures';
import { CalculatorPage } from './pages/CalculatorPage';

test.describe('C-2 — Ввод числа', () => {

  // TC-C-2-1
  test('Последовательный ввод цифр', async ({ page }) => {
    const calc = new CalculatorPage(page);
    await calc.pressKeys('1', '2', '3');
    expect(await calc.getDisplay()).toBe('123');
  });

  // TC-C-2-2
  test('Ведущий ноль заменяется цифрой', async ({ page }) => {
    const calc = new CalculatorPage(page);
    await calc.pressKeys('0', '5');
    expect(await calc.getDisplay()).toBe('5');
  });

  // TC-C-2-3
  test('Максимум 10 цифр в целой части', async ({ page }) => {
    const calc = new CalculatorPage(page);
    await calc.pressKeys('1','2','3','4','5','6','7','8','9','0','1');
    expect(await calc.getDisplay()).toBe('1234567890');
  });

  // TC-C-2-4
  test('Максимум 3 цифры после запятой', async ({ page }) => {
    const calc = new CalculatorPage(page);
    await calc.pressKeys('1', '.', '1', '2', '3', '4');
    expect(await calc.getDisplay()).toBe('1.123');
  });

});
