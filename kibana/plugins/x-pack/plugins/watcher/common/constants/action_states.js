export const ACTION_STATES = {

  // Action is not being executed because conditions haven't been met
  OK: 'OK',

  // Action has been acknowledged by user
  ACKNOWLEDGED: 'Acked',

  // Action has been throttled (time-based) by the system
  THROTTLED: 'Throttled',

  // Action has been completed
  FIRING: 'Firing',

  // Action has failed
  ERROR: 'Error'

};
