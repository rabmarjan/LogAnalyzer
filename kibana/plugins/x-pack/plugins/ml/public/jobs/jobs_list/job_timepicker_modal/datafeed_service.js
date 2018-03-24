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

import jobTimePickerTemplate from './job_timepicker_modal.html';

import { uiModules } from 'ui/modules';
const module = uiModules.get('apps/ml');

module.service('mlDatafeedService', function ($modal) {

  this.openJobTimepickerWindow = function (job) {
    $modal.open({
      template: jobTimePickerTemplate,
      controller: 'MlJobTimepickerModal',
      backdrop: 'static',
      keyboard: false,
      resolve: {
        params: function () {
          return {
            job
          };
        }
      }
    });
  };

});
