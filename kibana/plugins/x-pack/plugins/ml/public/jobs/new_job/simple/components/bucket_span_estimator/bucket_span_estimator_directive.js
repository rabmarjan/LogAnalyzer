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

import template from './bucket_span_estimator.html';
import { BucketSpanEstimatorProvider } from './bucket_span_estimator';
import { getQueryFromSavedSearch } from 'plugins/ml/jobs/new_job/utils/new_job_utils';
import { EVENT_RATE_COUNT_FIELD } from 'plugins/ml/jobs/new_job/simple/components/constants/general';

import { uiModules } from 'ui/modules';
const module = uiModules.get('apps/ml');

module.directive('mlBucketSpanEstimator', function ($injector) {
  const Private = $injector.get('Private');
  const es = $injector.get('es');
  const $q = $injector.get('$q');

  return {
    restrict: 'AE',
    replace: false,
    scope: {
      bucketSpanFieldChange: '=',
      formConfig: '=',
      jobStateWrapper: '=',
      JOB_STATE: '=jobState',
      ui: '=ui',
      exportedFunctions: '='
    },
    template,
    link: function ($scope) {
      const BucketSpanEstimator = Private(BucketSpanEstimatorProvider);
      const STATUS = {
        FAILED: -1,
        NOT_RUNNING: 0,
        RUNNING: 1,
        FINISHED: 2
      };
      $scope.STATUS = STATUS;

      $scope.guessBucketSpan = function () {
        $scope.ui.bucketSpanEstimator.status = STATUS.RUNNING;
        $scope.ui.bucketSpanEstimator.message = '';
        const aggTypes = [];
        const fields = [];
        const duration = {
          start: $scope.formConfig.start,
          end: $scope.formConfig.end
        };
        const splitField = $scope.formConfig.splitField !== undefined ? $scope.formConfig.splitField.name : undefined;
        let splitFieldValues = [];

        const query = getQueryFromSavedSearch($scope.formConfig);

        if ($scope.formConfig.fields === undefined) {
          // single metric config
          const fieldName = ($scope.formConfig.field === null) ?
            null : $scope.formConfig.field.name;
          fields.push(fieldName);
          aggTypes.push($scope.formConfig.agg.type);
        } else {
          // multi metric config
          _.each($scope.formConfig.fields, (field) => {
            const fieldName = (field.id === EVENT_RATE_COUNT_FIELD) ? null : field.name;
            fields.push(fieldName);
            aggTypes.push(field.agg.type);
          });
        }

        // a partition has been selected, so we need to load some field values to use in the
        // bucket span tests.
        if (splitField !== undefined) {
          getRandomFieldValues($scope.formConfig.indexPattern.title, splitField, query)
            .then((resp) => {
              splitFieldValues = resp;
              createBucketSpanEstimator(
                $scope.formConfig.indexPattern.title,
                $scope.formConfig.timeField,
                aggTypes,
                fields,
                duration,
                query,
                splitField,
                splitFieldValues);
            })
            .catch((resp) => {
              console.log('Bucket span could not be estimated', resp);
              $scope.ui.bucketSpanEstimator.status = STATUS.FAILED;
              $scope.ui.bucketSpanEstimator.message = 'Bucket span could not be estimated';
            });
        } else {
          // no partition field selected or we're in the single metric config
          createBucketSpanEstimator(
            $scope.formConfig.indexPattern.title,
            $scope.formConfig.timeField,
            aggTypes,
            fields,
            duration,
            query,
            splitField,
            splitFieldValues);
        }

      };

      // export the guessBucketSpan function so it can be called from outside this directive.
      // this is used when auto populating the settings from the URL.
      if ($scope.exportedFunctions !== undefined && typeof $scope.exportedFunctions === 'object') {
        $scope.exportedFunctions.guessBucketSpan = $scope.guessBucketSpan;
      }

      function createBucketSpanEstimator(
        indexPatternId,
        timeField,
        aggTypes,
        fields,
        duration,
        query,
        splitField,
        splitFieldValues) {
        const bss = new BucketSpanEstimator(
          $scope.formConfig.indexPattern.title,
          $scope.formConfig.timeField,
          aggTypes,
          fields,
          duration,
          query,
          splitField,
          splitFieldValues);

        $q.when(bss.run())
          .then((interval) => {
            const notify = ($scope.formConfig.bucketSpan !== interval.name);
            $scope.formConfig.bucketSpan = interval.name;
            $scope.ui.bucketSpanEstimator.status = STATUS.FINISHED;
            if (notify && typeof $scope.bucketSpanFieldChange === 'function') {
              $scope.bucketSpanFieldChange();
            }
          })
          .catch((resp) => {
            console.log('Bucket span could not be estimated', resp);
            $scope.ui.bucketSpanEstimator.status = STATUS.FAILED;
            $scope.ui.bucketSpanEstimator.message = 'Bucket span could not be estimated';
          });
      }

      function getRandomFieldValues(index, field, query) {
        let fieldValues = [];
        return $q((resolve, reject) => {
          const NUM_PARTITIONS = 10;
          // use a partitioned search to load 10 random fields
          // load ten fields, to test that there are at least 10.
          getFieldCardinality(index, field)
            .then((value) => {
              const numPartitions = (Math.floor(value / NUM_PARTITIONS)) || 1;
              es.search({
                index,
                size: 0,
                body: {
                  query,
                  aggs: {
                    fields_bucket_counts: {
                      terms: {
                        field,
                        include: {
                          partition: 0,
                          num_partitions: numPartitions
                        }
                      }
                    }
                  }
                }
              })
                .then((partitionResp) => {
                  if(_.has(partitionResp, 'aggregations.fields_bucket_counts.buckets')) {
                    const buckets = partitionResp.aggregations.fields_bucket_counts.buckets;
                    fieldValues = _.map(buckets, b => b.key);
                  }
                  resolve(fieldValues);
                })
                .catch((partitionResp) => {
                  reject(partitionResp);
                });
            })
            .catch((resp) => {
              reject(resp);
            });
        });
      }

      function getFieldCardinality(index, field) {
        return $q((resolve, reject) => {
          es.search({
            index,
            size: 0,
            body: {
              aggs: {
                field_count: {
                  cardinality: {
                    field,
                  }
                }
              }
            }
          })
            .then((resp) => {
              const value = _.get(resp, ['aggregations', 'field_count', 'value'], 0);
              resolve(value);
            })
            .catch((resp) => {
              reject(resp);
            });
        });
      }
    }
  };
});
