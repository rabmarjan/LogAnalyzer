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
 * A class for determining whether a data set is polled.
 * returns a flag indentifying whether the data is polled
 * And a minimum bucket span
 */

import _ from 'lodash';

export function PolledDataCheckerProvider($injector) {
  const es = $injector.get('es');

  class PolledDataChecker {
    constructor(index, timeField, duration, query) {
      this.index = index;
      this.timeField = timeField;
      this.duration = duration;
      this.query = query;

      this.isPolled = false;
      this.minimumBucketSpan = 0;
    }

    run() {
      return new Promise((resolve, reject) => {
        const interval = { name: '1m',  ms: 60000 };
        this.performSearch(interval.ms)
          .then((resp) => {
            const fullBuckets = _.get(resp, 'aggregations.non_empty_buckets.buckets', []);
            const result = this.isPolledData(fullBuckets, interval);
            if (result.pass) {
            // data is polled, return a flag and the minimumBucketSpan which should be
            // used as a minimum bucket span for all subsequent tests.
              this.isPolled = true;
              this.minimumBucketSpan = result.meanTimeDiff;
            }
            resolve({
              isPolled: this.isPolled,
              minimumBucketSpan: this.minimumBucketSpan
            });
          })
          .catch((resp) => {
            reject(resp);
          });

      });
    }

    createSearch(intervalMs) {
      const search = {
        query: this.query,
        aggs: {
          non_empty_buckets: {
            date_histogram: {
              min_doc_count: 1,
              field: this.timeField,
              interval: `${intervalMs}ms`
            }
          }
        }
      };

      return search;
    }

    performSearch(intervalMs) {
      const body = this.createSearch(intervalMs);

      return es.search({
        index: this.index,
        size: 0,
        body
      });
    }

    // test that the coefficient of variation of time difference between non-empty buckets is small
    isPolledData(fullBuckets, intervalMs) {
      let pass = false;

      const timeDiffs = [];
      let sumOfTimeDiffs = 0;
      for (let i = 1; i < fullBuckets.length; i++) {
        const diff = (fullBuckets[i].key - fullBuckets[i - 1].key);
        sumOfTimeDiffs += diff;
        timeDiffs.push(diff);
      }

      const meanTimeDiff = sumOfTimeDiffs / (fullBuckets.length - 1);

      let sumSquareTimeDiffResiduals = 0;
      for (let i = 0; i < fullBuckets.length - 1; i++) {
        sumSquareTimeDiffResiduals += Math.pow(timeDiffs[i] - meanTimeDiff, 2);
      }

      const vari = sumSquareTimeDiffResiduals / (fullBuckets.length - 1);

      const cov = Math.sqrt(vari) / meanTimeDiff;

      if ((cov < 0.1) && (intervalMs < meanTimeDiff)) {
        pass = false;
      } else {
        pass = true;
      }
      return {
        pass,
        meanTimeDiff
      };
    }


  }

  return PolledDataChecker;
}
