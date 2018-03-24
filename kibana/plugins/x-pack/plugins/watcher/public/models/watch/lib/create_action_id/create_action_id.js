export function createActionId(actions, type) {
  const existingIds = actions.map(action => action.id);

  let nextValidIncrement = 1;
  let nextValidId = undefined;
  while (nextValidId === undefined) {
    const proposedId = `${type}_${nextValidIncrement}`;
    if (!existingIds.includes(proposedId)) {
      nextValidId = proposedId;
    } else {
      nextValidIncrement++;
    }
  }

  return nextValidId;
}
