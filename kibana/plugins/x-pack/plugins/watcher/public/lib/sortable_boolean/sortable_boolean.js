export function sortableBoolean(val) {
  const boolVal = Boolean(val);

  return {
    value: boolVal,
    sortOrder: boolVal ? -1 : 0
  };
}
