import { CalcStore } from '../application/calcStore';
import { CalcView } from './calcView';

document.addEventListener('DOMContentLoaded', () => {
  const store = new CalcStore();
  new CalcView(store);
});
