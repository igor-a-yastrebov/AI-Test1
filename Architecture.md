# Architecture — Калькулятор

## Архитектурный стиль

**Clean Architecture** с однонаправленным потоком данных (Unidirectional Data Flow, UDF).

## Обоснование

Калькулятор — конечный автомат (state machine): каждое действие пользователя переводит его из одного состояния в другое. Clean Architecture изолирует логику вычислений от UI и от Electron, что обеспечивает тестируемость ядра в отрыве от любого фреймворка и возможность замены слоёв независимо друг от друга.

---

## Слои (Layers)

### L-1. Domain — `CalcEngine`
Ядро приложения. Чистые TypeScript-функции без каких-либо внешних зависимостей.
- Определяет типы `CalcState` и `CalcAction`.
- Реализует функцию `reduce(state, action): CalcState`.
- Не знает ни о DOM, ни об Electron, ни о том, кто его вызывает.

### L-2. Application — `CalcStore`
Контейнер состояния. Связывает Domain и Presentation.
- Хранит текущий экземпляр `CalcState`.
- Принимает `CalcAction`, передаёт в `CalcEngine.reduce()`, сохраняет результат.
- Уведомляет подписчиков при каждом изменении состояния.
- Не содержит вычислительной логики и не знает о DOM.

### L-3. Presentation — `CalcView`
Слой отображения. Работает только с DOM и `CalcStore`.
- Подписывается на `CalcStore`, отрисовывает актуальный `CalcState` в DOM.
- Преобразует события нажатия кнопок в `CalcAction` и передаёт в `CalcStore.dispatch()`.
- Не содержит вычислительной логики.

### L-4. Infrastructure — Electron
Точка входа приложения.
- `main.ts` отвечает за жизненный цикл Electron: создание `BrowserWindow`, реакция на события `app`.
- Не содержит логики калькулятора.

---

## Поток данных

```
[Нажатие кнопки]
      │
      ▼
  CalcView  ──── dispatch(CalcAction) ────►  CalcStore
                                                  │
                                         CalcEngine.reduce()
                                                  │
                                             новый CalcState
                                                  │
  CalcView  ◄──── уведомление подписчика ─────────┘
      │
   render()
      │
      ▼
   [DOM]
```

---

## Структура модулей

```
src/
├── domain/
│   └── calcEngine.ts      ← CalcState, CalcAction, reduce()
├── application/
│   └── calcStore.ts       ← CalcStore: dispatch / getState / subscribe
├── presentation/
│   ├── calcView.ts        ← подписка на store, рендер DOM, обработка событий
│   ├── index.html
│   └── styles.css
└── infrastructure/
    └── main.ts            ← Electron BrowserWindow, app lifecycle
```

---

## Архитектурные требования

### Общие (AR-G)

**AR-G-1.** Зависимости направлены строго вниз: Infrastructure → Presentation → Application → Domain. Обратные зависимости запрещены.

**AR-G-2.** Все публичные интерфейсы (`CalcState`, `CalcAction`) определяются в domain-слое и не дублируются в других слоях.

**AR-G-3.** Слои взаимодействуют через интерфейсы, а не через прямые импорты конкретных классов (за исключением Infrastructure, который является точкой сборки).

---

### Domain (AR-D)

**AR-D-1.** `CalcEngine` не содержит импортов из Electron, DOM API (`document`, `window`) или любых npm-пакетов, не являющихся частью TypeScript standard library.

**AR-D-2.** Функция `reduce(state: CalcState, action: CalcAction): CalcState` является чистой (pure function): детерминирована, не производит побочных эффектов, не мутирует входящий объект состояния.

**AR-D-3.** `CalcAction` реализован как дискриминированное объединение (discriminated union) со строго типизированными вариантами для каждого действия пользователя (`DigitAction`, `OperatorAction`, `EqualsAction`, `ClearAction`).

**AR-D-4.** `CalcState` — неизменяемый (immutable) объект. Каждый вызов `reduce` возвращает новый экземпляр `CalcState`; мутация входящего состояния запрещена.

**AR-D-5.** `CalcEngine` должен быть покрываем unit-тестами без каких-либо mock-объектов для Electron или DOM.

---

### Application (AR-A)

**AR-A-1.** `CalcStore` предоставляет публичный API из трёх методов: `dispatch(action: CalcAction): void`, `getState(): CalcState`, `subscribe(listener: () => void): () => void`.

**AR-A-2.** `CalcStore` является единственным источником истины (single source of truth): состояние приложения хранится в одном месте.

**AR-A-3.** Метод `subscribe` возвращает функцию отписки (unsubscribe). `CalcView` обязан вызвать её при уничтожении компонента.

---

### Presentation (AR-P)

**AR-P-1.** `CalcView` не хранит вычислительное состояние (операнды, оператор, флаги). Единственный источник данных для рендера — объект `CalcState` из `CalcStore`.

**AR-P-2.** Все обновления DOM производятся исключительно в callback подписки на `CalcStore`, а не напрямую в обработчиках событий.

**AR-P-3.** `CalcView` не обращается к `CalcEngine` напрямую — только через `CalcStore.dispatch()`.

---

### Infrastructure (AR-I)

**AR-I-1.** `main.ts` содержит исключительно код управления жизненным циклом Electron (`app.whenReady`, `BrowserWindow`, `app.on('window-all-closed')`).

**AR-I-2.** Настройки `BrowserWindow` (размер, resizable, webPreferences) вынесены в именованную константу или объект конфигурации внутри `main.ts`.
