import { get } from 'lodash';

/**
 * Returns whether given role is enabled or not
 *
 * @param role Object Role JSON, as returned by roles API
 * @return Boolean true if role is enabled; false otherwise
 */
export function isRoleEnabled(role) {
  return get(role, 'transient_metadata.enabled', true);
}