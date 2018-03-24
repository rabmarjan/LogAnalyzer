import Boom from 'boom';

/**
 * Wraps an unknown error into a Boom error response and returns it
 *
 * @param err Object Unknown error
 * @return Object Boom error response
 */
export function wrapUnknownError(err) {
  return Boom.wrap(err);
}