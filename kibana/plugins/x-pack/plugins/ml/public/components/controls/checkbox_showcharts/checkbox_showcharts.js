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
 * AngularJS directive+service for a checkbox element to toggle charts display.
 */

import { stateFactoryProvider } from 'plugins/ml/factories/state_factory';

import template from './checkbox_showcharts.html';
import 'plugins/ml/components/controls/controls_select';

import { uiModules } from 'ui/modules';
const module = uiModules.get('apps/ml');

module
  .service('mlCheckboxShowChartsService', function (Private) {
    const stateFactory = Private(stateFactoryProvider);
    this.state = stateFactory('mlCheckboxShowCharts', {
      showCharts: true
    });
  })
  .directive('mlCheckboxShowCharts', function (mlCheckboxShowChartsService) {
    return {
      restrict: 'E',
      template,
      scope: {
        visible: '='
      },
      link: function (scope) {
        scope.showCharts = mlCheckboxShowChartsService.state.get('showCharts');
        scope.toggleChartsVisibility = function () {
          mlCheckboxShowChartsService.state.set('showCharts', scope.showCharts);
          mlCheckboxShowChartsService.state.changed();
        };
      }
    };
  });
