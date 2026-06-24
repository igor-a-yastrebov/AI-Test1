import { test, expect } from './fixtures';
import { CalculatorPage } from './pages/CalculatorPage';

test.describe('UI-4 — Размер шрифта', () => {

  // TC-UI-4-1
  test('Шрифт уменьшается при числе > 7 символов', async ({ page }) => {
    const calc = new CalculatorPage(page);
    const sizeBefore = await calc.getFontSize();
    await calc.pressKeys('1','2','3','4','5','6','7','8');
    const sizeAfter = await calc.getFontSize();
    expect(sizeAfter).toBeLessThan(sizeBefore);
  });

});
