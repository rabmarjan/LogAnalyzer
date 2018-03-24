import Boom from 'boom';

/**
 * Wraps ES errors into a Boom error response and returns it
 * This also handles the permissions issue gracefully
 *
 * @param err Object ES error
 * @return Object Boom error response
 */
export function wrapEsError(err) {
  return Boom.wrap(err, err.statusCode);
}
