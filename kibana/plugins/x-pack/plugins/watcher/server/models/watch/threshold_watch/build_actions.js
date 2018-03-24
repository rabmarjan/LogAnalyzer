import { forEach } from 'lodash';

/*
watch.actions
 */
export function buildActions({ actions }) {
  const result = {};

  forEach(actions, (action) => {
    Object.assign(result, action.upstreamJson);
  });

  return result;
}
