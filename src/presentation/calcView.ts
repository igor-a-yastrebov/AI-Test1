import { CalcStore } from '../application/calcStore';
import { CalcAction } from '../domain/calcEngine';

const OPERATORS = new Set(['+', '-', '*', '/']);

export class CalcView {
  private readonly displayEl: HTMLElement;
  private readonly unsubscribe: () => void;

  constructor(private readonly store: CalcStore) {
    const el = document.getElementById('display');
    if (!el) throw new Error('#display element not found');
    this.displayEl = el;

    this.unsubscribe = store.subscribe(() => this.render());

    document.querySelectorAll<HTMLButtonElement>('button[data-key]').forEach(btn => {
      btn.addEventListener('click', () => this.handleKey(btn.dataset.key as string));
    });

    this.render();
  }

  private render(): void {
    const { display } = this.store.getState();
    this.displayEl.textContent = display;
    if (display.length > 10) {
      this.displayEl.style.fontSize = '28px';
    } else if (display.length > 7) {
      this.displayEl.style.fontSize = '38px';
    } else {
      this.displayEl.style.fontSize = '52px';
    }
  }

  private handleKey(key: string): void {
    let action: CalcAction;
    if (key === 'C') {
      action = { type: 'CLEAR' };
    } else if (key === '=') {
      action = { type: 'EQUALS' };
    } else if (key === 'SQRT') {
      action = { type: 'SQRT' };
    } else if (key === 'LN') {
      action = { type: 'LN' };
    } else if (OPERATORS.has(key)) {
      action = { type: 'OPERATOR', op: key };
    } else {
      action = { type: 'DIGIT', value: key };
    }
    this.store.dispatch(action);
  }

  destroy(): void {
    this.unsubscribe();
  }
}
