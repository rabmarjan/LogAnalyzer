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

import _ from 'lodash';

import { stateFactoryProvider } from 'plugins/ml/factories/state_factory';

import template from './select_severity.html';
import 'plugins/ml/components/controls/controls_select';

import { uiModules } from 'ui/modules';
const module = uiModules.get('apps/ml');

module
  .service('mlSelectSeverityService', function (Private) {
    const stateFactory = Private(stateFactoryProvider);
    this.state = stateFactory('mlSelectSeverity', {
      threshold: { display: 'warning', val: 0 }
    });
  })
  .directive('mlSelectSeverity', function (mlSelectSeverityService) {
    return {
      restrict: 'E',
      template,
      link: function (scope) {
        scope.thresholdOptions = [
          { display: 'critical', val: 75 },
          { display: 'major', val: 50 },
          { display: 'minor', val: 25 },
          { display: 'warning', val: 0 }
        ];

        const tresholdState = mlSelectSeverityService.state.get('threshold');
        const thresholdValue = _.get(tresholdState, 'val', 0);
        let thresholdOption = scope.thresholdOptions.find(d => d.val === thresholdValue);
        if (thresholdOption === undefined) {
          // Attempt to set value in URL which doesn't map to one of the options.
          thresholdOption = scope.thresholdOptions.find(d => d.val === 0);
        }
        scope.threshold = thresholdOption;
        mlSelectSeverityService.state.set('threshold', scope.threshold);

        scope.setThreshold = function (threshold) {
          if(!_.isEqual(scope.threshold, threshold)) {
            scope.threshold = threshold;
            mlSelectSeverityService.state.set('threshold', scope.threshold).changed();
          }
        };

        mlSelectSeverityService.state.watch(() => {
          scope.setThreshold(mlSelectSeverityService.state.get('threshold'));
        });
      }
    };
  });
