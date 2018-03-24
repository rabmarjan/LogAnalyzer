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

import { uiModules } from 'ui/modules';
const module = uiModules.get('apps/ml');

module.controller('MlSaveStatusModal', function ($scope, $location, $modalInstance, params) {

  $scope.pscope = params.pscope;
  $scope.ui = {
    showTimepicker: false,
  };

  // return to jobs list page and open the datafeed modal for the new job
  $scope.openDatafeed = function () {
    $location.path('jobs');
    $modalInstance.close();
    params.openDatafeed();
  };

  // once the job is saved close modal and return to jobs list
  $scope.close = function () {
    if ($scope.pscope.ui.saveStatus.job === 2) {
      $location.path('jobs');
    }

    $scope.pscope.ui.saveStatus.job = 0;
    $modalInstance.close();
  };

});
