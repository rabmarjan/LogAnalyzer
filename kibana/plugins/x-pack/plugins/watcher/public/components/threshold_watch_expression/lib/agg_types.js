import { AGG_TYPES } from 'plugins/watcher/../common/constants';

export const aggTypes = {
  count: {
    label: 'count()',
    fieldRequired: false,
    value: AGG_TYPES.COUNT
  },
  average: {
    label: 'average()',
    fieldRequired: true,
    validNormalizedTypes: ['number'],
    value: AGG_TYPES.AVERAGE
  },
  sum: {
    label: 'sum()',
    fieldRequired: true,
    validNormalizedTypes: ['number'],
    value: AGG_TYPES.SUM
  },
  min: {
    label: 'min()',
    fieldRequired: true,
    validNormalizedTypes: ['number', 'date'],
    value: AGG_TYPES.MIN
  },
  max: {
    label: 'max()',
    fieldRequired: true,
    validNormalizedTypes: ['number', 'date'],
    value: AGG_TYPES.MAX
  }
};
