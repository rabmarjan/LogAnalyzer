import { TIME_UNITS } from 'plugins/watcher/constants';

export const getTimeUnitsLabel = (unit, size) => {
  const timeUnit = TIME_UNITS[unit];
  return size === 1
    ? timeUnit.labelSingular
    : timeUnit.labelPlural;
};
