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
import { EVENT_RATE_COUNT_FIELD } from 'plugins/ml/jobs/new_job/simple/components/constants/general';

import template from './fields_selection.html';

import { uiModules } from 'ui/modules';
const module = uiModules.get('apps/ml');

module.directive('mlFieldsSelectionPopulation', function () {
  return {
    restrict: 'E',
    replace: true,
    template,
    controller: function ($scope) {
      $scope.eventRateSelected = false;

      // when a field is selected, temporarily store it.
      // the addField function is then called which processes it.
      $scope.tempSelectedField = {
        field: undefined
      };

      $scope.selectField = function () {
        $scope.addField();
      };

      $scope.addField = function () {
        // only allow the event rate field to be added once
        if ($scope.eventRateSelected === false ||
          ($scope.eventRateSelected === true && $scope.tempSelectedField.field.id !== EVENT_RATE_COUNT_FIELD)) {
          // clone the object, but not a deep clone.
          // we want field.agg to be unique but the reference to the inner agg.type object to be the original.
          const field = {
            ...$scope.tempSelectedField.field,
            agg: { type: $scope.tempSelectedField.field.agg.type }
          };

          $scope.formConfig.fields.push(field);
          $scope.chartStates.fields[field.id] = CHART_STATE.LOADING;

          $scope.sortFields();
          $scope.formChange(true);
        }
        $scope.tempSelectedField.field = undefined;
      };

      $scope.removeField = function (index, field) {
        $scope.formConfig.fields.splice(index, 1);
        delete $scope.chartStates.fields[field.id];
        $scope.sortFields();
        $scope.formChange(true);
      };

      // put the event rate field at the top
      $scope.sortFields = function () {
        $scope.eventRateSelected = false;
        let eventRateIndex = -1;
        $scope.formConfig.fields.forEach((f, i) => {
          if (f.id === EVENT_RATE_COUNT_FIELD) {
            eventRateIndex = i;
            $scope.eventRateSelected = true;
          }
        });

        if (eventRateIndex >= 0) {
          $scope.formConfig.fields.splice(0, 0, $scope.formConfig.fields.splice(eventRateIndex, 1)[0]);

        }
      };
    }
  };
});
