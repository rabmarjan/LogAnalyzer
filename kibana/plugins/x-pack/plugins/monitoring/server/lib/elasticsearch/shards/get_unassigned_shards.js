import { get } from 'lodash';

// Methods for calculating metrics for
// - Number of Primary Shards
// - Number of Replica Shards
// - Unassigned Primary Shards
// - Unassigned Replica Shards
export function getUnassignedShards(indexShardStats) {
  let unassignedShards = 0;

  unassignedShards += get(indexShardStats, 'unassigned.primary');
  unassignedShards += get(indexShardStats, 'unassigned.replica');

  return unassignedShards;
}
