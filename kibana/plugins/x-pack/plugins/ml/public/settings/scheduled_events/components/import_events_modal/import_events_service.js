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

import template from './import_events_modal.html';

import { uiModules } from 'ui/modules';
const module = uiModules.get('apps/ml');

module.service('mlImportEventsService', function ($q, $modal) {

  this.openImportEventsWindow = function () {
    return $q((resolve, reject) => {
      const modal = $modal.open({
        template,
        controller: 'MlImportEventsModal',
        backdrop: 'static',
        keyboard: false
      });

      modal.result
        .then(resolve)
        .catch(reject);
    });
  };

});
