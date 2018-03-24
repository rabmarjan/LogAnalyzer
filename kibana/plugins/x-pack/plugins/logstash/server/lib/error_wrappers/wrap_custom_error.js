import Boom from 'boom';

/**
 * Wraps a custom error into a Boom error response and returns it
 *
 * @param err Object error
 * @param statusCode Error status code
 * @return Object Boom error response
 */
export function wrapCustomError(err, statusCode) {
  return Boom.wrap(err, statusCode);
}
