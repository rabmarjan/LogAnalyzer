import { isObject, isNull, isUndefined } from 'lodash';

export function createFormatCsvValues(escapeValue, separator, fields, formatsMap) {
  return function formatCsvValues(values) {
    return fields.map((field) => {
      let value = values[field];

      if (isNull(value) || isUndefined(value)) {
        return '';
      }

      if (formatsMap.has(field)) {
        const formatter = formatsMap.get(field);
        value = formatter.convert(value);
      }

      if (isObject(value)) {
        return JSON.stringify(value);
      }

      return value.toString();
    })
      .map(escapeValue)
      .join(separator);
  };
}
