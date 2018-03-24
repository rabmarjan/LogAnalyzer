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

import { CHART_STATE } from 'plugins/ml/jobs/new_job/simple/components/constants/states';
import template from './fields_selection.html';

import { uiModules } from 'ui/modules';
const module = uiModules.get('apps/ml');

module.directive('mlFieldsSelection', function () {
  return {
    restrict: 'E',
    replace: true,
    template,
    controller: function ($scope) {
      $scope.toggleFields = (field) => {
        const key = field.id;

        const f = $scope.formConfig.fields[key];
        if (f === undefined) {
          $scope.formConfig.fields[key] = field;
          $scope.chartStates.fields[key] = CHART_STATE.LOADING;
        } else {
          delete $scope.formConfig.fields[key];
          delete $scope.chartStates.fields[key];
        }
        if ($scope.formConfig.splitField !== undefined) {
          $scope.setModelMemoryLimit($scope.formConfig);
        }
      };
    }
  };
});
