export interface CalcState {
  display: string;
  acc: number | null;
  op: string | null;
  rawInput: string;
  fresh: boolean;
  justResult: boolean;
}

export type CalcAction =
  | { type: 'DIGIT'; value: string }
  | { type: 'OPERATOR'; op: string }
  | { type: 'EQUALS' }
  | { type: 'CLEAR' }
  | { type: 'SQRT' };

export const INITIAL_STATE: CalcState = {
  display: '0.00',
  acc: null,
  op: null,
  rawInput: '',
  fresh: true,
  justResult: false,
};

function fmt(n: number): string {
  if (!isFinite(n)) return 'Ошибка';
  if (Math.abs(n) >= 1e10) return 'Ошибка';
  const s3 = n.toFixed(3);
  return s3.endsWith('0') ? n.toFixed(2) : s3;
}

function numVal(s: string): number {
  return s === '' || s === '.' ? 0 : parseFloat(s);
}

function applyOp(a: number, op: string, b: number): number | null {
  switch (op) {
    case '+': return a + b;
    case '-': return a - b;
    case '*': return a * b;
    case '/': return b === 0 ? null : a / b;
    default: return b;
  }
}

export function reduce(state: CalcState, action: CalcAction): CalcState {
  switch (action.type) {
    case 'CLEAR':
      return { ...INITIAL_STATE };

    case 'DIGIT': {
      const d = action.value;
      let rawInput: string;

      if (state.fresh || state.justResult) {
        rawInput = d === '.' ? '0.' : d;
      } else {
        if (d === '.' && state.rawInput.includes('.')) return state;
        const parts = state.rawInput.split('.');
        if (d !== '.' && !state.rawInput.includes('.') && parts[0].length >= 10) return state;
        if (d !== '.' && state.rawInput.includes('.') && parts[1].length >= 3) return state;
        rawInput = state.rawInput === '0' && d !== '.' ? d : state.rawInput + d;
      }

      return { ...state, rawInput, display: rawInput, fresh: false, justResult: false };
    }

    case 'OPERATOR': {
      let { acc, display } = state;

      if (acc !== null && state.op !== null && !state.fresh) {
        const res = applyOp(acc, state.op, numVal(state.rawInput));
        if (res === null) return { ...INITIAL_STATE, display: 'Ошибка' };
        acc = res;
        display = fmt(res);
      } else if (!state.fresh) {
        acc = numVal(state.rawInput);
      }

      return { ...state, acc, op: action.op, rawInput: '', fresh: true, justResult: false, display };
    }

    case 'EQUALS': {
      if (state.acc === null || state.op === null || state.fresh) {
        if (!state.fresh && state.rawInput !== '') {
          return { ...state, display: fmt(numVal(state.rawInput)) };
        }
        return state;
      }

      const res = applyOp(state.acc, state.op, numVal(state.rawInput));
      if (res === null) return { ...INITIAL_STATE, display: 'Ошибка' };

      return {
        ...state,
        acc: null,
        op: null,
        rawInput: res.toString(),
        fresh: false,
        justResult: true,
        display: fmt(res),
      };
    }

    case 'SQRT': {
      const arg = numVal(state.rawInput);
      const res = Math.cbrt(arg);
      return {
        ...INITIAL_STATE,
        rawInput: res.toString(),
        fresh: false,
        justResult: true,
        display: fmt(res),
      };
    }
  }
}
