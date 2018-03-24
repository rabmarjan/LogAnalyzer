import { pick, values } from 'lodash';

/**
 * @param object to be used to generate the search value
 * @param array of property keys to use to generate the search value
 * @return newline delimited string built from the specified properties
 */
export function getSearchValue(obj, fields) {
  return values(pick(obj, fields)).join('\n');
}
