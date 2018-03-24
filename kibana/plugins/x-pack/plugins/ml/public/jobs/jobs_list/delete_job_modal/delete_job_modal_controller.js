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

module.controller('MlDeleteJobModal', function ($scope, $modalInstance, params) {

  $scope.ui = {
    stage: 0,
    status: params.status,
    jobId: params.jobId,
    isDatafeed: params.isDatafeed
  };

  $scope.delete = function () {
    $scope.ui.stage = 1;
    params.doDelete();
  };

  // once the job is saved and optional upload is complete.
  // close modal and return to jobs list
  $scope.close = function () {
    $modalInstance.close();
  };

});
