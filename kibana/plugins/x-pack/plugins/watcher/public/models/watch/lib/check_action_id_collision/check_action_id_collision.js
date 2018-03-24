import { find } from 'lodash';

export function checkActionIdCollision(actions, action) {
  const collision = find(actions, { id: action.id });

  return Boolean(collision);
}
