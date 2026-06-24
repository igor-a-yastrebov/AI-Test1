# Architecture — Калькулятор

## Архитектурный стиль

**Clean Architecture** с однонаправленным потоком данных (Unidirectional Data Flow, UDF).

## Обоснование

Калькулятор — конечный автомат (state machine): каждое действие пользователя переводит его из одного состояния в другое. Clean Architecture изолирует логику вычислений от UI и от Electron, что обеспечивает тестируемость ядра в отрыве от любого фреймворка и возможность замены слоёв независимо друг от друга.

---

## Процессная модель Electron

Electron запускает два независимых процесса:

| Процесс | Файлы | Роль |
|---|---|---|
| **Main process** | `src/infrastructure/main.ts` | Жизненный цикл приложения, создание окна |
| **Renderer process** | `src/presentation/app.ts`, `calcView.ts`, `index.html` | UI калькулятора |

Общение между процессами (IPC) в текущей версии не используется. При необходимости добавляется через `ipcMain` / `ipcRenderer` не затрагивая Domain и Application слои.

---

## Слои (Layers)

### L-1. Domain — `CalcEngine`
Ядро приложения. Чистые TypeScript-функции без каких-либо внешних зависимостей.
- Определяет типы `CalcState` и `CalcAction`.
- Определяет порт `ICalcStore` — интерфейс, через который Presentation взаимодействует с Application.
- Реализует функцию `reduce(state, action): CalcState`.
- Не знает ни о DOM, ни об Electron, ни о том, кто его вызывает.

### L-2. Application — `CalcStore`
Контейнер состояния. Связывает Domain и Presentation.
- Реализует интерфейс `ICalcStore`.
- Хранит текущий экземпляр `CalcState`.
- Принимает `CalcAction`, передаёт в `CalcEngine.reduce()`, сохраняет результат.
- Уведомляет подписчиков при каждом изменении состояния.
- Не содержит вычислительной логики и не знает о DOM.

### L-3. Presentation — `CalcView` + `app.ts`
Слой отображения. Работает только с DOM и `ICalcStore`.
- **`app.ts`** — composition root рендерера: создаёт `CalcStore` и `CalcView`, связывает их, отвечает за вызов `CalcView.destroy()` при завершении.
- **`CalcView`** — подписывается на `ICalcStore`, отрисовывает актуальный `CalcState` в DOM, преобразует события нажатия кнопок в `CalcAction` и передаёт в `ICalcStore.dispatch()`.
- Не содержит вычислительной логики.
- Зависит от интерфейса `ICalcStore`, а не от конкретного класса `CalcStore`.

### L-4. Infrastructure — Electron
Точка входа приложения (main process).
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
│   ├── calcEngine.ts      ← CalcState, CalcAction, reduce()
│   └── ports.ts           ← ICalcStore (порт для Presentation)
├── application/
│   └── calcStore.ts       ← CalcStore: реализует ICalcStore
├── presentation/
│   ├── app.ts             ← composition root рендерера
│   ├── calcView.ts        ← подписка на ICalcStore, рендер DOM, события
│   ├── index.html
│   └── styles.css
└── infrastructure/
    └── main.ts            ← Electron BrowserWindow, app lifecycle
```

---

## Состояние калькулятора (CalcState)

`CalcState` — иммутабельный объект со следующими полями:

| Поле | Тип | Назначение |
|---|---|---|
| `display` | `string` | Строка, отображаемая на табло. В штатном режиме — текущее число; при ошибке — `'Ошибка'` |
| `acc` | `number \| null` | Накопленный первый операнд (null до первого оператора) |
| `op` | `string \| null` | Текущий оператор (`+`, `-`, `*`, `/`) |
| `rawInput` | `string` | Строка текущего вводимого числа |
| `fresh` | `boolean` | Флаг: следующий ввод начинает новое число |
| `justResult` | `boolean` | Флаг: последнее действие — вычисление результата |

**Состояние ошибки** представлено через `display: 'Ошибка'` и полным сбросом остальных полей до начального состояния (`INITIAL_STATE`). Отдельного поля `error` нет — рендерер определяет ошибку по значению `display`.

---

## Архитектурные требования

### Общие (AR-G)

**AR-G-1.** Зависимости направлены строго вниз: Infrastructure → Presentation → Application → Domain. Обратные зависимости запрещены.

**AR-G-2.** Все публичные интерфейсы (`CalcState`, `CalcAction`, `ICalcStore`) определяются в domain-слое и не дублируются в других слоях.

**AR-G-3.** Слои взаимодействуют через интерфейсы, определённые в domain-слое. `CalcView` зависит от `ICalcStore`, а не от конкретного класса `CalcStore`.

---

### Domain (AR-D)

**AR-D-1.** `CalcEngine` не содержит импортов из Electron, DOM API (`document`, `window`) или любых npm-пакетов, не являющихся частью TypeScript standard library.

**AR-D-2.** Функция `reduce(state: CalcState, action: CalcAction): CalcState` является чистой (pure function): детерминирована, не производит побочных эффектов, не мутирует входящий объект состояния.

**AR-D-3.** `CalcAction` реализован как discriminated union по полю `type` со следующими вариантами:
- `{ type: 'DIGIT'; value: string }`
- `{ type: 'OPERATOR'; op: string }`
- `{ type: 'EQUALS' }`
- `{ type: 'CLEAR' }`

**AR-D-4.** `CalcState` — неизменяемый (immutable) объект. Каждый вызов `reduce` возвращает новый экземпляр `CalcState`; мутация входящего состояния запрещена.

**AR-D-5.** `CalcEngine` должен быть покрываем unit-тестами без каких-либо mock-объектов для Electron или DOM.

---

### Application (AR-A)

**AR-A-1.** `CalcStore` предоставляет публичный API из трёх методов: `dispatch(action: CalcAction): void`, `getState(): CalcState`, `subscribe(listener: () => void): () => void` — в соответствии с интерфейсом `ICalcStore`.

**AR-A-2.** `CalcStore` является единственным источником истины (single source of truth): состояние приложения хранится в одном месте.

**AR-A-3.** Метод `subscribe` возвращает функцию отписки (unsubscribe). `app.ts` обязан вызвать её при уничтожении `CalcView`.

---

### Presentation (AR-P)

**AR-P-1.** `CalcView` не хранит вычислительное состояние (операнды, оператор, флаги). Единственный источник данных для рендера — объект `CalcState` из `ICalcStore`.

**AR-P-2.** Все обновления DOM производятся исключительно в callback подписки на `ICalcStore`, а не напрямую в обработчиках событий.

**AR-P-3.** `CalcView` не обращается к `CalcEngine` напрямую — только через `ICalcStore.dispatch()`.

**AR-P-4.** `app.ts` является владельцем экземпляра `CalcView` и обязан вызвать `CalcView.destroy()` при завершении работы приложения.

---

### Infrastructure (AR-I)

**AR-I-1.** `main.ts` содержит исключительно код управления жизненным циклом Electron (`app.whenReady`, `BrowserWindow`, `app.on('window-all-closed')`).

**AR-I-2.** Настройки `BrowserWindow` (размер, resizable, webPreferences) вынесены в именованную константу или объект конфигурации внутри `main.ts`.
