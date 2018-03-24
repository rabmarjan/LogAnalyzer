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

import template from './general_job_details.html';
import { changeJobIDCase } from './change_job_id_case';

import { uiModules } from 'ui/modules';
const module = uiModules.get('apps/ml');

module.directive('mlGeneralJobDetails', function () {
  return {
    restrict: 'E',
    replace: true,
    template,
    controller: function ($scope) {
      // force job ids to be lowercase
      $scope.changeJobIDCase = changeJobIDCase;
    }
  };
});
