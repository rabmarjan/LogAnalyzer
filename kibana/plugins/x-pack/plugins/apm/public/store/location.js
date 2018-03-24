export const LOCATION_UPDATE = 'LOCATION_UPDATE';

function location(state = {}, action) {
  switch (action.type) {
    case LOCATION_UPDATE:
      return action.location;
    default:
      return state;
  }
}

export function updateLocation(nextLocation) {
  return { type: LOCATION_UPDATE, location: nextLocation };
}

export default location;
