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

import uiRoutes from 'ui/routes';
import { checkLicense } from 'plugins/ml/license/check_license';
import { checkGetJobsPrivilege } from 'plugins/ml/privilege/check_privilege';

import template from './settings.html';

uiRoutes
  .when('/settings', {
    template,
    resolve: {
      CheckLicense: checkLicense,
      privileges: checkGetJobsPrivilege
    }
  });

import { uiModules } from 'ui/modules';
const module = uiModules.get('apps/ml');

module.controller('MlSettings',
  function (
    $scope,
    timefilter) {

    timefilter.disableTimeRangeSelector(); // remove time picker from top of page
    timefilter.disableAutoRefreshSelector(); // remove time picker from top of page

  });
