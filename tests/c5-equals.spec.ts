import { test, expect } from './fixtures';
import { CalculatorPage } from './pages/CalculatorPage';

test.describe('C-5 — = без второго операнда', () => {

  // TC-C-5-1
  test('= сразу после оператора не выполняет вычисление', async ({ page }) => {
    const calc = new CalculatorPage(page);
    await calc.pressKeys('5', '+', '=');
    expect(await calc.getDisplay()).toBe('5');
  });

});
