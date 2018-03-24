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

// Service for carrying out queries to obtain data
// specific to fields in Elasticsearch indices.

import _ from 'lodash';
export function FieldsServiceProvider(es) {

  // Obtains the cardinality of one or more fields.
  // Returns an Object whose keys are the names of the fields,
  // with values equal to the cardinality of the field.
  function getCardinalityOfFields(
    index,
    types,
    fieldNames,
    query,
    timeFieldName,
    earliestMs,
    latestMs) {

    // Build the criteria to use in the bool filter part of the request.
    // Add criteria for the time range and the datafeed config query.
    const mustCriteria = [];
    const timeRangeCriteria = { range: {} };
    timeRangeCriteria.range[timeFieldName] = {
      gte: earliestMs,
      lte: latestMs,
      format: 'epoch_millis'
    };
    mustCriteria.push(timeRangeCriteria);

    if (types && types.length) {
      mustCriteria.push({ terms: { _type: types } });
    }

    if (query) {
      mustCriteria.push(query);
    }

    const aggs = {};
    _.each(fieldNames, (field) => {
      aggs[field] = { cardinality: { field } };
    });

    const body = {
      query: {
        bool: {
          must: mustCriteria
        }
      },
      size: 0,
      _source: {
        excludes: []
      },
      aggs: aggs
    };

    return new Promise((resolve, reject) => {
      es.search({
        index,
        body
      })
        .then((resp) => {
          const aggregations = resp.aggregations;
          const results = _.reduce(fieldNames, (obj, field) => {
            obj[field] = _.get(aggregations, [field, 'value'], 0);
            return obj;
          }, {});
          resolve(results);
        })
        .catch((resp) => {
          reject(resp);
        });
    });
  }

  return {
    getCardinalityOfFields
  };
}
