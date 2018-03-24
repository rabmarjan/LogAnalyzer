import { forbidden } from 'boom';

const getStatusCode = err => {
  return err.isBoom ? err.output.statusCode : err.statusCode;
};

export function isAuthError(err) {
  const statusCode = getStatusCode(err);
  return (statusCode === 401 || statusCode === 403);
}

export function handleAuthError(err) {
  const statusCode = getStatusCode(err);

  let message;
  /* 401 is changed to 403 because in user perception, they HAVE provided
   * crendentials for the API.
   * They should see the same message whether they're logged in but
   * insufficient permissions, or they're login is valid for the production
   * connection but not the monitoring connection
   */
  if (statusCode === 401) {
    message = 'Invalid authentication for monitoring cluster';
  } else {
    message = 'Insufficient user permissions for monitoring data';
  }

  return forbidden(message);
}
