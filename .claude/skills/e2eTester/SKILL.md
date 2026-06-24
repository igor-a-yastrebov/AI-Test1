---
name: e2eTester
description: >
  Пишет, обновляет и синхронизирует e2e-тесты калькулятора (Electron + Playwright).
  Используй когда нужно добавить новые тест-кейсы, обновить тесты под изменившиеся
  требования или привести существующие spec-файлы в соответствие с Page Object Model.
---

# e2eTester — инструкция для агента

## Контекст проекта

Десктопный калькулятор на Electron (Windows). Тесты — Playwright `_electron`.

| Файл / папка | Роль |
|---|---|
| `REQUIREMENTS.md` | Единый источник истины по поведению приложения |
| `e2eTestCases.md` | Таблицы тест-кейсов с ID (`TC-*`), привязанных к требованиям |
| `tests/fixtures.ts` | Запуск Electron, фикстуры `app` и `page` |
| `tests/pages/CalculatorPage.ts` | Page Object — единственный способ взаимодействия с UI в тестах |
| `tests/*.spec.ts` | Spec-файлы, сгруппированные по требованию (UI-1, C-1, …) |
| `playwright.config.ts` | Конфиг Playwright (testDir, timeout, retries) |

---

## Порядок работы

### 1. Прочитай источники истины

Перед любым изменением тестов прочитай:

1. `REQUIREMENTS.md` — что должно делать приложение.
2. `e2eTestCases.md` — какие TC уже описаны, к какому требованию привязаны.
3. `tests/pages/CalculatorPage.ts` — какие методы POM уже есть.
4. Все `tests/*.spec.ts` — что уже написано, чтобы не дублировать.

### 2. Обнови Page Object при необходимости

Если новый тест требует действия или проверки, которых нет в `CalculatorPage`:

- Добавь метод в `tests/pages/CalculatorPage.ts`.
- Методы должны быть тонкими обёртками над Playwright-локаторами.
- Не добавляй бизнес-логику в POM — только взаимодействие с DOM.

Существующие методы:
```typescript
getDisplay(): Promise<string>           // текст #display
pressKey(key: string): Promise<void>   // клик по [data-key="${key}"]
```

Примеры новых методов, которые могут понадобиться:
```typescript
getFontSize(): Promise<number>         // для TC-UI-4-1
pressKeys(...keys: string[]): Promise<void>  // удобная цепочка нажатий
```

### 3. Соответствие TC → spec-файл

Каждый spec-файл соответствует одному разделу требований:

| Раздел | Spec-файл |
|---|---|
| UI-1 | `tests/ui1-display.spec.ts` |
| UI-2 | `tests/ui2-buttons.spec.ts` |
| UI-3 | `tests/ui3-decimal.spec.ts` |
| UI-4 | `tests/ui4-font.spec.ts` |
| C-1  | `tests/c1-clear.spec.ts` |
| C-2  | `tests/c2-input.spec.ts` |
| C-3  | `tests/c3-operator.spec.ts` |
| C-4  | `tests/c4-chain.spec.ts` |
| C-5  | `tests/c5-equals.spec.ts` |
| C-6  | `tests/c6-divzero.spec.ts` |
| C-7  | `tests/c7-format.spec.ts` |

Если spec-файл не существует — создай его. Не кидай тесты в существующий файл другого раздела.

### 4. Шаблон spec-файла

```typescript
import { test, expect } from './fixtures';
import { CalculatorPage } from './pages/CalculatorPage';

test.describe('<РАЗДЕЛ> — <Название>', () => {

  // TC-<ID>
  test('<название тест-кейса>', async ({ page }) => {
    const calc = new CalculatorPage(page);
    // шаги из e2eTestCases.md
    // одна проверка expect на тест (если нет веских причин иметь больше)
  });

});
```

Правила форматирования:
- Комментарий `// TC-<ID>` над каждым `test(...)`.
- Названия тестов — копия колонки «Название» из `e2eTestCases.md`, без изменений.
- Не переиспользуй `calc` между тестами — каждый тест создаёт свой инстанс `CalculatorPage`.
- Нет `beforeEach`/`afterEach` — состояние сбрасывается при перезапуске Electron через фикстуру.

### 5. Как обновлять тесты при изменении требований

1. Прочитай изменённый раздел в `REQUIREMENTS.md`.
2. Сравни с соответствующим разделом в `e2eTestCases.md`:
   - Если тест-кейс устарел — обнови строку в таблице `e2eTestCases.md` **и** код в spec-файле.
   - Если требование добавлено — добавь строку в таблицу **и** новый `test(...)` в spec.
   - Если требование удалено — удали строку из таблицы **и** соответствующий `test(...)`.
3. Никогда не оставляй `e2eTestCases.md` и spec-файлы в рассинхроне.

### 6. Запуск и проверка

После любых изменений запусти тесты:

```
npx playwright test
```

- Все тесты должны пройти (`N passed`).
- Если тест упал — разберись в причине: баг в тесте или в приложении.
- Не комментируй тесты и не ставь `.skip` без явного указания пользователя.

---

## Ограничения

- **Не трогай** `tests/fixtures.ts` и `playwright.config.ts` — это инфраструктура.
- **Не используй** `page.locator(...)` напрямую в spec-файлах — только через `CalculatorPage`.
- **Не добавляй** `expect` внутрь методов POM — POM не знает про assertions.
- **Не дублируй** тест-кейсы: перед добавлением проверь, нет ли TC с тем же ID.
