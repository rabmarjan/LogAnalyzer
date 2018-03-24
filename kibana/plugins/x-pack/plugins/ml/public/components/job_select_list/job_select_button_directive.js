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
 * ml-job-select-list directive for rendering a multi-select control for selecting
 * one or more jobs from the list of configured jobs.
 */

import template from './job_select_button.html';

import 'ui/accessibility/kbn_accessible_click';
import { uiModules } from 'ui/modules';
const module = uiModules.get('apps/ml');

module.directive('jobSelectButton', function (mlJobSelectService) {

  function link(scope) {
    scope.selectJobBtnJobIdLabel = '';
    scope.unsafeHtml = '';
    scope.description = scope.singleSelection ? mlJobSelectService.singleJobDescription : mlJobSelectService.description;

    scope.createMenu = function () {
      let txt = '<ml-job-select-list ';
      if (scope.timeseriesonly) {
        txt += 'timeseriesonly="true" ';
      }
      if (scope.singleSelection) {
        txt += 'single-selection="true" ';
      }
      txt += '></ml-job-select-list>';
      scope.unsafeHtml = txt;
    };
  }

  return {
    scope: {
      timeseriesonly: '=',
      singleSelection: '='
    },
    link,
    replace: true,
    template
  };
});
