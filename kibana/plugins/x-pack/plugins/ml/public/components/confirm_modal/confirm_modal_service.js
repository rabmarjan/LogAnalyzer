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

// service for displaying a modal confirmation dialog with OK and Cancel buttons.

import template from './confirm_modal.html';

import { uiModules } from 'ui/modules';
const module = uiModules.get('apps/ml');

module.service('mlConfirmModalService', function ($modal, $q) {

  this.open = function (options) {
    const deferred = $q.defer();
    $modal.open({
      template,
      controller: 'MlConfirmModal',
      backdrop: 'static',
      keyboard: false,
      size: (options.size === undefined) ? 'sm' : options.size,
      resolve: {
        params: function () {
          return {
            message: options.message,
            title: options.title,
            okLabel: options.okLabel,
            cancelLabel: options.cancelLabel,
            hideCancel: options.hideCancel,
            ok: deferred.resolve,
            cancel: deferred.reject,
          };
        }
      }
    });
    return deferred.promise;
  };
});

