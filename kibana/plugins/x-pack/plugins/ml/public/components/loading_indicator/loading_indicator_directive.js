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

import './styles/main.less';
import template from './loading_indicator.html';

import { uiModules } from 'ui/modules';
const module = uiModules.get('apps/ml');

module.directive('mlLoadingIndicator', function () {
  return {
    restrict: 'E',
    template,
    transclude: true,
    scope: {
      label: '@?',
      isLoading: '<',
      height: '<?'
    },
    link: function (scope) {
      scope.height = scope.height ? +scope.height : 100;
    }
  };
});
