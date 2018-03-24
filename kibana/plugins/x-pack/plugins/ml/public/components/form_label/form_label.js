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

// directive for creating a form label including a hoverable icon
// to provide additional information in a tooltip. label and tooltip
// text elements get unique ids based on label-id so they can be
// referenced by attributes, for example:
//
// <ml-form-label label-id="uid">Label Text</ml-form-lable>
// <input
//   type="text"
//   aria-labelledby="ml_aria_label_uid"
//   aria-describedby="ml_aria_description_uid"
// />
module.directive('mlFormLabel', function () {
  return {
    scope: {
      labelId: '@',
      tooltipAppendToBody: '@'
    },
    restrict: 'E',
    replace: false,
    transclude: true,
    template: `
      <label class="kuiFormLabel" id="ml_aria_label_{{labelId}}" ng-transclude></label>
      <i ml-info-icon="{{labelId}}" tooltip-append-to-body="{{tooltipAppendToBody}}" />
    `
  };
});
