import { test, expect } from './fixtures';
import { CalculatorPage } from './pages/CalculatorPage';

test.describe('UI-2 — Кнопки', () => {

  // TC-UI-2-1
  test('Наличие всех кнопок цифр', async ({ page }) => {
    const calc = new CalculatorPage(page);
    for (const d of ['0','1','2','3','4','5','6','7','8','9']) {
      expect(await calc.isButtonPresent(d)).toBe(true);
    }
  });

  // TC-UI-2-2
  test('Наличие кнопок операций', async ({ page }) => {
    const calc = new CalculatorPage(page);
    for (const op of ['+','-','*','/']) {
      expect(await calc.isButtonPresent(op)).toBe(true);
    }
  });

  // TC-UI-2-3
  test('Наличие кнопок C, =, .', async ({ page }) => {
    const calc = new CalculatorPage(page);
    for (const key of ['C','=','.']) {
      expect(await calc.isButtonPresent(key)).toBe(true);
    }
  });

});
