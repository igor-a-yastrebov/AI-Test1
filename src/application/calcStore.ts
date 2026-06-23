import { CalcState, CalcAction, INITIAL_STATE, reduce } from '../domain/calcEngine';

type Listener = () => void;
type Unsubscribe = () => void;

export class CalcStore {
  private state: CalcState = { ...INITIAL_STATE };
  private readonly listeners = new Set<Listener>();

  getState(): CalcState {
    return this.state;
  }

  dispatch(action: CalcAction): void {
    this.state = reduce(this.state, action);
    this.listeners.forEach(listener => listener());
  }

  subscribe(listener: Listener): Unsubscribe {
    this.listeners.add(listener);
    return () => { this.listeners.delete(listener); };
  }
}
