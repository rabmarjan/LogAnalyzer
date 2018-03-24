import moment from 'moment';

export function getMoment(date) {
  if (!date) {
    return null;
  }

  return moment(date);
}
