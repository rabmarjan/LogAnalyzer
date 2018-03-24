/*
 * Utils for working with getting values out of nodes aggregations (different
 * information about nodes because of data changing after node restart)
 */

import { last, sortBy, get } from 'lodash';

// Get the key from the aggregation with the latest timestamp
export function getLatestAggKey(buckets) {
  return last(sortBy(buckets, (b => get(b, 'max_timestamp.value')))).key;
}

/* Get the last attributes from the aggregation
 * Or undefined, if no attributes were set
 * NOTE: this is lazy because attributes are not sorted. We expect the
 * attributes to not change across node restarts
 */
export function getNodeAttribute(buckets) {
  // nothing in the bucket, set to undefined
  if (buckets.length === 0) { return; }
  // boolean-ish string
  return last(buckets).key_as_string;
}
