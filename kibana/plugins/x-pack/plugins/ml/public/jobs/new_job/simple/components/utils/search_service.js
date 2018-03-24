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

import _ from 'lodash';

import { ML_RESULTS_INDEX_PATTERN } from 'plugins/ml/constants/index_patterns';
import { escapeForElasticsearchQuery } from 'plugins/ml/util/string_utils';

import { uiModules } from 'ui/modules';
const module = uiModules.get('apps/ml');

module.service('mlSimpleJobSearchService', function ($q, es) {
  // detector swimlane search
  this.getScoresByRecord = function (jobId, earliestMs, latestMs, interval, firstSplitField) {
    const deferred = $q.defer();
    const obj = {
      success: true,
      results: {}
    };

    let jobIdFilterStr = 'job_id: ' + jobId;
    if (firstSplitField && firstSplitField.value !== undefined) {
      // Escape any reserved characters for the query_string query,
      // wrapping the value in quotes to do a phrase match.
      // Backslash is a special character in JSON strings, so doubly escape
      // any backslash characters which exist in the field value.
      jobIdFilterStr += ` AND ${escapeForElasticsearchQuery(firstSplitField.name)}:`;
      jobIdFilterStr += `"${String(firstSplitField.value).replace(/\\/g, '\\\\')}"`;
    }

    es.search({
      index: ML_RESULTS_INDEX_PATTERN,
      size: 0,
      body: {
        query: {
          bool: {
            filter: [{
              query_string: {
                query: 'result_type:record'
              }
            }, {
              bool: {
                must: [{
                  range: {
                    timestamp: {
                      gte: earliestMs,
                      lte: latestMs,
                      format: 'epoch_millis'
                    }
                  }
                }, {
                  query_string: {
                    query: jobIdFilterStr
                  }
                }]
              }
            }]
          }
        },
        aggs: {
          detector_index: {
            terms: {
              field: 'detector_index',
              order: {
                recordScore: 'desc'
              }
            },
            aggs: {
              recordScore: {
                max: {
                  field: 'record_score'
                }
              },
              byTime: {
                date_histogram: {
                  field: 'timestamp',
                  interval: interval,
                  min_doc_count: 1,
                  extended_bounds: {
                    min: earliestMs,
                    max: latestMs
                  }
                },
                aggs: {
                  recordScore: {
                    max: {
                      field: 'record_score'
                    }
                  }
                }
              }
            }
          }
        }
      }
    })
      .then((resp) => {
        const detectorsByIndex = _.get(resp, ['aggregations', 'detector_index', 'buckets'], []);
        _.each(detectorsByIndex, (dtr) => {
          const dtrResults = {};
          const dtrIndex = +dtr.key;

          const buckets = _.get(dtr, ['byTime', 'buckets'], []);
          for (let j = 0; j < buckets.length; j++) {
            const bkt = buckets[j];
            const time = bkt.key;
            dtrResults[time] = {
              recordScore: _.get(bkt, ['recordScore', 'value']),
            };
          }
          obj.results[dtrIndex] = dtrResults;
        });

        deferred.resolve(obj);
      })
      .catch((resp) => {
        deferred.reject(resp);
      });
    return deferred.promise;
  };

  this.getCategoryFields = function (index, field, size, query) {
    const deferred = $q.defer();
    const obj = {
      success: true,
      results: {}
    };

    es.search({
      index,
      size: 0,
      body: {
        query: query,
        aggs: {
          catFields: {
            terms: {
              field: field,
              size: size
            }
          }
        }
      }
    })
      .then((resp) => {
        obj.results.values  = [];
        const catFields = _.get(resp, ['aggregations', 'catFields', 'buckets'], []);
        _.each(catFields, (f) => {
          obj.results.values.push(f.key);
        });

        deferred.resolve(obj);
      })
      .catch((resp) => {
        deferred.reject(resp);
      });

    return deferred.promise;
  };

});
