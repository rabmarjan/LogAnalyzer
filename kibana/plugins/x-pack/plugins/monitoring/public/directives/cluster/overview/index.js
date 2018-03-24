import React from 'react';
import ReactDOM from 'react-dom';
import { Overview } from 'plugins/monitoring/components/cluster/overview';
import { uiModules } from 'ui/modules';

const uiModule = uiModules.get('monitoring/directives', []);
uiModule.directive('monitoringClusterOverview', (kbnUrl, showLicenseExpiration) => {
  return {
    restrict: 'E',
    scope: { cluster: '=' },
    link(scope, $el) {

      const changeUrl = target => {
        scope.$evalAsync(() => {
          kbnUrl.changePath(target);
        });
      };

      scope.$watch('cluster', cluster => {
        ReactDOM.render((
          <Overview
            cluster={cluster}
            changeUrl={changeUrl}
            showLicenseExpiration={showLicenseExpiration}
          />
        ), $el[0]);
      });

    }
  };
});
