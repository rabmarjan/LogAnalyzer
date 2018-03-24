export const groupByTypes = {
  'all': {
    label: 'all documents',
    sizeRequired: false,
    value: 'all',
    validNormalizedTypes: []
  },
  'top': {
    label: 'top',
    sizeRequired: true,
    value: 'top',
    validNormalizedTypes: ['number', 'date', 'keyword']
  }
};
