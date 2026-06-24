import { test, expect } from './fixtures';
import { CalculatorPage } from './pages/CalculatorPage';

test.describe('C-7 — Форматирование результата', () => {

  // TC-C-7-1
  test('Целое число форматируется с 2 знаками после запятой', async ({ page }) => {
    const calc = new CalculatorPage(page);
    await calc.pressKeys('5', '+', '0', '=');
    expect(await calc.getDisplay()).toBe('5.00');
  });

  // TC-C-7-2
  test('Результат с 1 десятичным знаком дополняется до 2', async ({ page }) => {
    const calc = new CalculatorPage(page);
    await calc.pressKeys('1', '+', '0', '.', '5', '=');
    expect(await calc.getDisplay()).toBe('1.50');
  });

  // TC-C-7-3
  test('Результат с 3 знаками показывает все 3', async ({ page }) => {
    const calc = new CalculatorPage(page);
    await calc.pressKeys('3', '+', '0', '.', '1', '4', '1', '=');
    expect(await calc.getDisplay()).toBe('3.141');
  });

  // TC-C-7-4
  test('Переполнение (≥ 10^10) показывает "Ошибка"', async ({ page }) => {
    const calc = new CalculatorPage(page);
    await calc.pressKeys('9','9','9','9','9','9','9','9','9','9', '+', '1', '=');
    expect(await calc.getDisplay()).toBe('Ошибка');
  });

});
