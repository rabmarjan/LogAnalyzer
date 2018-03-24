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

import template from './bucket_span_selection.html';

import { uiModules } from 'ui/modules';
const module = uiModules.get('apps/ml');

module.directive('mlBucketSpanSelection', function () {
  return {
    restrict: 'E',
    replace: true,
    template,
    controller: function ($scope) {

      $scope.bucketSpanFieldChange = function () {
        $scope.ui.bucketSpanEstimator.status = 0;
        $scope.ui.bucketSpanEstimator.message = '';
        $scope.formChange();
      };

      // this is passed into the bucketspan estimator and  reference to the guessBucketSpan function is inserted
      // to allow it for be called automatically without user interaction.
      $scope.bucketSpanEstimatorExportedFunctions = {};
    }
  };
});
