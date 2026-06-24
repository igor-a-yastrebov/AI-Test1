import { test, expect } from './fixtures';
import { CalculatorPage } from './pages/CalculatorPage';

test.describe('UI-1 — Табло', () => {

  // TC-UI-1-1
  test('начальное состояние табло показывает 0.00', async ({ page }) => {
    const calc = new CalculatorPage(page);
    expect(await calc.getDisplay()).toBe('0.00');
  });

  // TC-UI-1-2
  test('ввод числа отображается на табло', async ({ page }) => {
    const calc = new CalculatorPage(page);
    await calc.pressKey('1');
    await calc.pressKey('2');
    await calc.pressKey('3');
    expect(await calc.getDisplay()).toBe('123');
  });

  // TC-UI-1-3
  test('отображение дробной части', async ({ page }) => {
    const calc = new CalculatorPage(page);
    await calc.pressKey('5');
    await calc.pressKey('.');
    await calc.pressKey('2');
    expect(await calc.getDisplay()).toBe('5.2');
  });

});
