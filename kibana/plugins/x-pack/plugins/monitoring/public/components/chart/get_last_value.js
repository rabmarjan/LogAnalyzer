import { isNumber, get, last } from 'lodash';

/*
 * @param {Array/Number} data Data containing values to show in the horizontal legend
 * @return {Number/Null} Value to use from the given data
 */
export function getLastValue(data) {
  if (isNumber(data)) {
    return data;
  }
  if (!Array.isArray(data)) {
    return null;
  }

  const lastValue = get(last(data), '[1]');
  // check numeric to make sure 0 doesn't convert to null
  if (isNumber(lastValue)) {
    return lastValue;
  }

  // undefined/null return as null to show as N/A
  return null;
}
