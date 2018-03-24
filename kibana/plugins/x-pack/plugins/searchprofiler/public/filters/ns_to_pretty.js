import { msToPretty } from './ms_to_pretty';

export function nsToPretty(ns, precision) {
  if (!precision) {
    precision = 1;
  }
  const units = ['ns', 'µs'];
  for (const i in units) {
    if (ns < 1000) {
      return ns.toFixed(precision) + units[i];
    }
    ns /= 1000;
  }
  return msToPretty(ns, precision);
}