/*
 * ELASTICSEARCH CONFIDENTIAL
 *
 * Copyright (c) 2017 Elasticsearch BV. All Rights Reserved.
 *
 * Notice: this software, and all information contained
 * therein, is the exclusive property of Elasticsearch BV
 * and its licensors, if any, and is protected under applicable
 * domestic and foreign law, and international treaties.
 *
 * Reproduction, republication or distribution without the
 * express written consent of Elasticsearch BV is
 * strictly prohibited.
 */

/*
  * Contains utility functions for building and processing queries.
  */

// Builds the base filter criteria used in queries,
// adding criteria for the time range and an optional query.
export function buildBaseFilterCriteria(timeFieldName, earliestMs, latestMs, query) {
  const filterCriteria = [{
    range: {
      [timeFieldName]: {
        gte: earliestMs,
        lte: latestMs,
        format: 'epoch_millis'
      }
    }
  }];

  if (query) {
    filterCriteria.push(query);
  }

  return filterCriteria;
}

// Wraps the supplied aggregations in a sampler aggregation.
// A supplied samplerShardSize (the shard_size parameter of the sampler aggregation)
// of less than 1 indicates no sampling, and the aggs are returned as-is.
export function buildSamplerAggregation(aggs, samplerShardSize) {
  if (samplerShardSize < 1) {
    return aggs;
  }

  return {
    sample: {
      sampler: {
        shard_size: samplerShardSize
      },
      aggs
    }
  };
}

// Returns the path of aggregations in the elasticsearch response, as an array,
// depending on whether sampling is being used.
// A supplied samplerShardSize (the shard_size parameter of the sampler aggregation)
// of less than 1 indicates no sampling, and an empty array is returned.
export function getSamplerAggregationsResponsePath(samplerShardSize) {
  return samplerShardSize > 0 ? ['sample'] : [];
}
