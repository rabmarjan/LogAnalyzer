import { camelCase } from 'lodash';

export function createHtmlIdGenerator(rootPartOrParts = []) {
  const rootParts = Array.isArray(rootPartOrParts) ? rootPartOrParts : [rootPartOrParts];
  const cache = {};

  return (parts, useRootParts = true) => {
    if (!cache[parts]) {
      const root = useRootParts ? rootParts : [];
      const combined = root.concat(parts);
      const id = camelCase(combined);

      cache[parts] = id;
    }

    return cache[parts];
  };
}
