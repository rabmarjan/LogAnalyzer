import React from 'react';
import moment from 'moment';
import { render } from 'react-dom';
import { uiModules } from 'ui/modules';
import { BeatsOverview } from 'plugins/monitoring/components/beats/overview';

const uiModule = uiModules.get('monitoring/directives', []);
uiModule.directive('monitoringBeatsOverview', (timefilter) => {
  return {
    restrict: 'E',
    scope: {
      data: '=',
    },
    link(scope, $el) {

      function onBrush({ xaxis }) {
        scope.$evalAsync(() => {
          timefilter.time.from = moment(xaxis.from);
          timefilter.time.to = moment(xaxis.to);
          timefilter.time.mode = 'absolute';
        });
      }

      scope.$watch('data', (data = {}) => {
        render((
          <BeatsOverview
            {...data}
            onBrush={onBrush}
          />
        ), $el[0]);
      });

    }
  };
});
