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
 * AngularJS directive for rendering a select element with threshold levels.
 */

import template from './controls_select.html';

import { uiModules } from 'ui/modules';
const module = uiModules.get('apps/ml');

module.directive('mlControlsSelect', function () {
  return {
    restrict: 'E',
    scope: {
      identifier: '@',
      label: '@',
      narrowStyle: '=',
      options: '=',
      showIcons: '=',
      selected: '=',
      updateFn: '='
    },
    template,
    link: function (scope) {
      scope.setOption = function (d) {
        if (typeof scope.updateFn === 'function') {
          scope.updateFn(d);
        }
      };
    }
  };
});
