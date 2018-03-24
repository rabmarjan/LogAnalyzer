import Boom from 'boom';

/**
 * Wraps ES errors into a Boom error response and returns it
 * This also handles the permissions issue gracefully
 *
 * @param err Object ES error
 * @return Object Boom error response
 */
export function wrapEsError(err) {
  const statusCode = err.statusCode;
  if (statusCode === 403) {
    return Boom.forbidden('Insufficient user permissions for adding a license.');
  }
  return Boom.boomify(err, err.statusCode);
}
