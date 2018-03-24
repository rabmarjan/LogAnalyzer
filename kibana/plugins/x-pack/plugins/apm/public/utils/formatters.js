import { memoize, first, zipObject, difference } from 'lodash';
import numeral from '@elastic/numeral';

import { colors } from '../style/variables';

const UNIT_CUT_OFF = 10 * 1000000;

export function asSeconds(value, withUnit = true) {
  const formatted = asDecimal(value / 1000000);
  return `${formatted}${withUnit ? ' s' : ''}`;
}

export function asMillis(value, withUnit = true) {
  const formatted = asInteger(value / 1000);
  return `${formatted}${withUnit ? ' ms' : ''}`;
}

export function asMillisWithDefault(value) {
  if (value == null) {
    return `N/A`;
  }
  return asMillis(value);
}

export const getTimeFormatter = memoize(
  max => (max > UNIT_CUT_OFF ? asSeconds : asMillis)
);

export function timeUnit(max) {
  return max > UNIT_CUT_OFF ? 's' : 'ms';
}

export function asTime(value) {
  return getTimeFormatter(value)(value);
}

export function asDecimal(value) {
  return numeral(value).format('0,0.0');
}

export function asInteger(value) {
  return numeral(value).format('0,0');
}

export function tpmUnit(type) {
  return type === 'request' ? 'rpm' : 'tpm';
}

export function getColorByType(types) {
  const assignedColors = {
    app: colors.apmBlue,
    cache: colors.apmGreen,
    components: colors.apmGreen,
    ext: colors.apmPurple,
    xhr: colors.apmPurple,
    template: colors.apmRed2,
    resource: colors.apmRed2,
    custom: colors.apmTan,
    db: colors.apmOrange,
    'hard-navigation': colors.apmYellow
  };

  const unknownTypes = difference(types, Object.keys(assignedColors));
  const unassignedColors = zipObject(unknownTypes, [
    colors.apmYellow,
    colors.apmRed,
    colors.apmBrown,
    colors.apmPink
  ]);

  return type => assignedColors[type] || unassignedColors[type];
}

export function getSpanLabel(type) {
  switch (type) {
    case 'db':
      return 'DB';
    case 'hard-navigation':
      return 'Navigation timing';
    default:
      return type;
  }
}

export function getPrimaryType(type) {
  return first(type.split('.'));
}
