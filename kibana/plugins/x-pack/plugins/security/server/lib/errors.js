import { wrap as wrapBoom } from 'boom';

export function wrapError(error) {
  return wrapBoom(error, error.status);
}
