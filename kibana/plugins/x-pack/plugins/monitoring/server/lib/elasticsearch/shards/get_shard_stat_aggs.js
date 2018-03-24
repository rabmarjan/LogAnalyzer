/*
 * @param {Object} config - Kibana config service
 * @param {Boolean} includeNodes - whether to add the aggs for node shards
 * @param {String} nodeResolver
 */
export function getShardAggs(config, includeNodes, nodeResolver) {
  const maxBucketSize = config.get('xpack.monitoring.max_bucket_size');
  const aggSize = 10;
  const indicesAgg = {
    terms: {
      field: 'shard.index',
      size: maxBucketSize
    },
    aggs: {
      states: {
        terms: { field: 'shard.state', size: aggSize },
        aggs: { primary: { terms: { field: 'shard.primary', size: 2 } } } // size = 2 since this is a boolean field
      }
    }
  };
  const nodesAgg = {
    terms: {
      field: `source_node.${nodeResolver}`,
      size: maxBucketSize
    },
    aggs: {
      index_count: { cardinality: { field: 'shard.index' } },
      node_names: {
        terms: { field: 'source_node.name', size: aggSize },
        aggs: { max_timestamp: { max: { field: 'timestamp' } } }
      },
      node_ids: { terms: { field: 'source_node.uuid', size: aggSize } } // for doing a join on the cluster state to determine if node is current master
    }
  };

  return {
    ...{ indices: indicesAgg },
    ...{ nodes: includeNodes ? nodesAgg : undefined }
  };
}

