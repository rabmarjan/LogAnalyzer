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

import template from './form_filter_input.html';

import angular from 'angular';
import { uiModules } from 'ui/modules';
const module = uiModules.get('apps/ml');

module.directive('mlFormFilterInput', function () {
  return {
    scope: {
      placeholder: '@?',
      filter: '=',
      filterIcon: '=',
      filterChanged: '=',
      clearFilter: '='
    },
    restrict: 'E',
    replace: false,
    template,
    link(scope) {
      scope.placeholder = angular.isDefined(scope.placeholder) ? scope.placeholder : 'Filter';
    }
  };
});
