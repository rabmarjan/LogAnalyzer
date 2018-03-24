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

module.controller('MlConfirmModal', function ($scope, $modalInstance, params) {

  $scope.okFunc = params.ok;
  $scope.cancelFunc = params.cancel;

  $scope.message = params.message || '';
  $scope.title = params.title || '';

  $scope.okLabel = params.okLabel || 'OK';
  $scope.cancelLabel = params.cancelLabel || 'Cancel';

  $scope.hideCancel = params.hideCancel || false;

  $scope.ok = function () {
    $scope.okFunc();
    $modalInstance.close();
  };

  $scope.cancel = function () {
    $scope.cancelFunc();
    $modalInstance.close();
  };

});
