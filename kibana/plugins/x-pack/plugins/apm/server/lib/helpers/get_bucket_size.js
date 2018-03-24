import { calculateAuto } from './calculate_auto';
import moment from 'moment';
import { unitToSeconds } from './unit_to_seconds';
export function getBucketSize(start, end, interval) {
  const duration = moment.duration(end - start, 'ms');
  let bucketSize = calculateAuto.near(100, duration).asSeconds();
  if (bucketSize < 1) bucketSize = 1; // don't go too small
  let intervalString = `${bucketSize}s`;

  const matches = interval && interval.match(/^([\d]+)([shmdwMy]|ms)$/);
  let minBucketSize = 0;
  if (matches) {
    minBucketSize = Number(matches[1]) * unitToSeconds(matches[2]);
  }

  if (bucketSize < minBucketSize) {
    bucketSize = minBucketSize;
    intervalString = interval;
  }

  return { bucketSize, intervalString };
}
