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
 * Controller for the second step in the Create Job wizard, allowing
 * the user to select the type of job they wish to create.
 */

import uiRoutes from 'ui/routes';
import { checkLicenseExpired } from 'plugins/ml/license/check_license';
import { checkCreateJobsPrivilege } from 'plugins/ml/privilege/check_privilege';
import { createSearchItems } from 'plugins/ml/jobs/new_job/utils/new_job_utils';
import { getIndexPattern, getSavedSearch, timeBasedIndexCheck } from 'plugins/ml/util/index_utils';
import template from './job_type.html';

uiRoutes
  .when('/jobs/new_job/step/job_type', {
    template,
    resolve: {
      CheckLicense: checkLicenseExpired,
      privileges: checkCreateJobsPrivilege,
      indexPattern: getIndexPattern,
      savedSearch: getSavedSearch
    }
  });


import { uiModules } from 'ui/modules';
const module = uiModules.get('apps/ml');

module.controller('MlNewJobStepJobType',
  function (
    $scope,
    $route,
    timefilter) {

    timefilter.disableTimeRangeSelector(); // remove time picker from top of page
    timefilter.disableAutoRefreshSelector(); // remove time picker from top of page

    const {
      indexPattern,
      savedSearch } = createSearchItems($route);

    // check to see that the index pattern is time based.
    // if it isn't, display a warning and disable all links
    $scope.indexWarningTitle = '';
    $scope.isTimeBasedIndex = timeBasedIndexCheck(indexPattern);
    if ($scope.isTimeBasedIndex === false) {
      $scope.indexWarningTitle = (savedSearch.id === undefined) ? `Index pattern ${indexPattern.title} is not time based` :
        `${savedSearch.title} uses index pattern ${indexPattern.title} which is not time based`;
    }

    $scope.indexPattern = indexPattern;
    $scope.recognizerResults = { count: 0 };

    $scope.pageTitleLabel = (savedSearch.id !== undefined) ?
      `saved search ${savedSearch.title}` : `index pattern ${indexPattern.title}`;

    $scope.getUrl = function (basePath) {
      return (savedSearch.id === undefined) ? `${basePath}?index=${indexPattern.id}` :
        `${basePath}?savedSearchId=${savedSearch.id}`;
    };
  });
