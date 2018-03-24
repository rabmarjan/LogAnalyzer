export function toggle(collection, item) {
  const i = collection.indexOf(item);
  if (i >= 0) collection.splice(i, 1);
  else collection.push(item);
}

export function toggleSort(sort, orderBy) {
  if (sort.orderBy === orderBy) sort.reverse = !sort.reverse;
  else {
    sort.orderBy = orderBy;
    sort.reverse = false;
  }
}
