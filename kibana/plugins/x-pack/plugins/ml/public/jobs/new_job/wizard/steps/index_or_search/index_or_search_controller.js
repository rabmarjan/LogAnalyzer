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

/*
 * Controller for the first step in the Create Job wizard, allowing the user to
 * select the Kibana index pattern or saved search to use for creating a job.
 */

import uiRoutes from 'ui/routes';
import { checkLicenseExpired } from 'plugins/ml/license/check_license';
import { preConfiguredJobRedirect } from 'plugins/ml/jobs/new_job/wizard/preconfigured_job_redirect';
import { checkCreateJobsPrivilege } from 'plugins/ml/privilege/check_privilege';
import { getIndexPatterns } from 'plugins/ml/util/index_utils';
import template from './index_or_search.html';

uiRoutes
  .when('/jobs/new_job', {
    redirectTo: '/jobs/new_job/step/index_or_search'
  });

uiRoutes
  .when('/jobs/new_job/step/index_or_search', {
    template,
    resolve: {
      CheckLicense: checkLicenseExpired,
      privileges: checkCreateJobsPrivilege,
      indexPatterns: getIndexPatterns,
      preConfiguredJobRedirect
    }
  });

import { uiModules } from 'ui/modules';
const module = uiModules.get('apps/ml');

module.controller('MlNewJobStepIndexOrSearch',
  function (
    $scope,
    $route,
    timefilter) {

    timefilter.disableTimeRangeSelector(); // remove time picker from top of page
    timefilter.disableAutoRefreshSelector(); // remove time picker from top of page

    $scope.indexPatterns = $route.current.locals.indexPatterns;

    $scope.withIndexPatternUrl = function (pattern) {
      if (!pattern) {
        return;
      }

      return '#/jobs/new_job/step/job_type?index=' + encodeURIComponent(pattern.id);
    };

    $scope.withSavedSearchUrl = function (savedSearch) {
      if (!savedSearch) {
        return;
      }

      return '#/jobs/new_job/step/job_type?savedSearchId=' + encodeURIComponent(savedSearch.id);
    };

  });
