import { test, expect } from './fixtures';
import { CalculatorPage } from './pages/CalculatorPage';

test.describe('UI-3 — Десятичная точка', () => {

  // TC-UI-3-1
  test('Ввод дробной части через .', async ({ page }) => {
    const calc = new CalculatorPage(page);
    await calc.pressKeys('3', '.', '1', '4');
    expect(await calc.getDisplay()).toBe('3.14');
  });

  // TC-UI-3-2
  test('Повторное нажатие . игнорируется', async ({ page }) => {
    const calc = new CalculatorPage(page);
    await calc.pressKeys('3', '.', '.', '5');
    expect(await calc.getDisplay()).toBe('3.5');
  });

});
