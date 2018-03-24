import moment from 'moment';
/*
 * Return `true` if timestamp of last update is younger than 10 minutes ago
 * If older than, it indicates cluster/instance is offline
 */
export function calculateAvailability(timestamp) {
  const lastUpdate = moment(timestamp); // converts to local time
  return lastUpdate.isAfter(moment().subtract(10, 'minutes')); // compares with local time
}
