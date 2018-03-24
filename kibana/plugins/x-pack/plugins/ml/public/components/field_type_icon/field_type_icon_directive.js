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

import template from './field_type_icon.html';
import { ML_JOB_FIELD_TYPES } from 'plugins/ml/../common/constants/field_types';

import { uiModules } from 'ui/modules';
const module = uiModules.get('apps/ml');

module.directive('mlFieldTypeIcon', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      type: '='
    },
    template,
    controller: function ($scope) {
      $scope.ML_JOB_FIELD_TYPES = ML_JOB_FIELD_TYPES;
    }
  };
});
