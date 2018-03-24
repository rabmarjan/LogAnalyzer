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

import { INTERVALS } from './intervals';
import { SingleSeriesCheckerProvider } from './single_series_checker';
import { PolledDataCheckerProvider } from './polled_data_checker';

export function BucketSpanEstimatorProvider($injector) {
  const Private = $injector.get('Private');

  const PolledDataChecker = Private(PolledDataCheckerProvider);
  const SingleSeriesChecker = Private(SingleSeriesCheckerProvider);

  class BucketSpanEstimator {
    constructor(index, timeField, aggTypes, fields, duration, query, splitField, splitFieldValues) {
      this.index = index;
      this.timeField = timeField;
      this.aggTypes = aggTypes;
      this.fields = fields;
      this.duration = duration;
      this.query = query;
      this.splitField = splitField;
      this.splitFieldValues = splitFieldValues;
      this.checkers = [];

      this.thresholds = {
        minimumBucketSpanMS: 0
      };

      // only run the tests over the last 250 hours of data
      const ONE_HOUR_MS = 3600000;
      const HOUR_MULTIPLIER = 250;
      const timePickerDurationLength = (this.duration.end - this.duration.start);
      const multiplierDurationLength = (ONE_HOUR_MS * HOUR_MULTIPLIER);

      if (timePickerDurationLength > multiplierDurationLength) {
        // move time range to the end of the data
        this.duration.start = this.duration.end - multiplierDurationLength;
      }

      this.query.bool.must.push({
        range: {
          [this.timeField]: {
            gte: this.duration.start,
            lte: this.duration.end,
            format: 'epoch_millis'
          }
        }
      });

      this.polledDataChecker = new PolledDataChecker(
        this.index,
        this.timeField,
        this.duration,
        this.query);

      if(this.aggTypes.length === this.fields.length) {
        // loop over detectors
        for(let i = 0; i < this.aggTypes.length; i++) {
          if (this.splitField === undefined) {
            // either a single metric job or no data split
            this.checkers.push({
              check: new SingleSeriesChecker(
                this.index,
                this.timeField,
                this.aggTypes[i],
                this.fields[i],
                this.duration,
                this.query,
                this.thresholds),
              result: null
            });
          } else {
            // loop over partition values
            for(let j = 0; j < this.splitFieldValues.length; j++) {
              const queryCopy = _.cloneDeep(this.query);
              // add a term to the query to filter on the partition value
              queryCopy.bool.must.push({
                term: {
                  [this.splitField]: this.splitFieldValues[j]
                }
              });
              this.checkers.push({
                check: new SingleSeriesChecker(
                  this.index,
                  this.timeField,
                  this.aggTypes[i],
                  this.fields[i],
                  this.duration,
                  queryCopy,
                  this.thresholds),
                result: null
              });
            }
          }
        }
      }
    }

    run() {
      return new Promise((resolve, reject) => {
        if (this.checkers.length === 0) {
          console.log('BucketSpanEstimator: run has stopped because no checks where created');
          reject('BucketSpanEstimator: run has stopped because no checks where created');
        }

        this.polledDataChecker.run()
          .then((result) => {
          // if the data is polled, set a minimum threshold
          // of bucket span
            if (result.isPolled) {
              this.thresholds.minimumBucketSpanMS = result.minimumBucketSpan;
            }
            let checkCounter = this.checkers.length;
            const runComplete = () => {
              checkCounter--;

              if (checkCounter === 0) {
                const median = this.processResults();
                if (median !== null) {
                  resolve(median);
                } else {
                // no results found
                  console.log('BucketSpanEstimator: run has stopped because no checks returned a valid interval');
                  reject('BucketSpanEstimator: run has stopped because no checks returned a valid interval');
                }
              }
            };

            _.each(this.checkers, (check) => {
              check.check.run()
                .then((interval) => {
                  check.result = interval;
                  runComplete();
                })
                .catch(() => {
                  // run failed. this may be due to a lack of data
                  // mark the result as null so it can be filtered out
                  // later by processResults()
                  check.result = null;
                  runComplete();
                });
            });
          })
          .catch((resp) => {
            reject(resp);
          });
      });
    }

    processResults() {
      const allResults = _.map(this.checkers, 'result');

      let reducedResults = [];
      const numberOfSplitFields = this.splitFieldValues.length || 1;
      // find the median results per detector
      // if the data has been split, the may be ten results per detector,
      // so we need to find the median of those first.
      for(let i = 0; i < this.aggTypes.length; i++) {
        const pos = (i * numberOfSplitFields);
        let resultsSubset = allResults.slice(pos, pos + numberOfSplitFields);
        // remove results of tests which have failed
        resultsSubset = _.remove(resultsSubset, res => res !== null);
        resultsSubset = _.sortBy(resultsSubset, r => r.ms);

        const tempMedian = this.findMedian(resultsSubset);
        if (tempMedian !== null) {
          reducedResults.push(tempMedian);
        }
      }

      reducedResults = _.sortBy(reducedResults, r => r.ms);

      return this.findMedian(reducedResults);
    }

    findMedian(results) {
      let median = null;

      if (results.length) {
        if (results.length % 2 === 0) {
          // even number of results
          const medIndex = (((results.length) / 2) - 1);
          // find the two middle values
          const med1 = results[medIndex];
          const med2 = results[medIndex + 1];

          if (med1 === med2) {
            // if they're the same, use them
            median = med1;
          } else {
            let interval = null;
            // find the average ms value between the two middle intervals
            const avgMs = ((med2.ms - med1.ms) / 2) + med1.ms;
            // loop over the allowed bucket spans to find closest one
            for(let i = 1; i < INTERVALS.length; i++) {
              if(avgMs < INTERVALS[i].ms) {
                // see if it's closer to this interval or the one before
                const int1 = INTERVALS[i - 1];
                const int2 = INTERVALS[i];
                const diff = int2.ms - int1.ms;
                const d = avgMs - int1.ms;
                interval = ((d / diff) < 0.5) ? int1 : int2;
                break;
              }
            }
            median = interval;
          }
        } else {
          // odd number of results, take the middle one
          median = results[(results.length - 1) / 2];
        }
      }
      return median;
    }
  }
  return BucketSpanEstimator;
}
