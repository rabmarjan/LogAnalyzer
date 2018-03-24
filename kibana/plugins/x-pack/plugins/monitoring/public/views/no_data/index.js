import uiRoutes from 'ui/routes';
import template from './index.html';

import React from 'react';
import {
  render,
  unmountComponentAtNode
} from 'react-dom';
import { NoData } from 'plugins/monitoring/components/no_data';

const REACT_NODE_ID = 'noDataReact';

uiRoutes.when('/no-data', {
  template,
  resolve: {
    clusters: ($injector) => {
      const monitoringClusters = $injector.get('monitoringClusters');
      const kbnUrl = $injector.get('kbnUrl');

      return monitoringClusters()
        .then(clusters => {
          if (clusters && clusters.length) {
            kbnUrl.changePath('/home');
            return Promise.reject();
          }
          return Promise.resolve();
        });
    }
  },
  controller($injector, $scope) {
    $scope.hasData = false; // control flag to control a redirect
    const timefilter = $injector.get('timefilter');
    timefilter.enableTimeRangeSelector();
    timefilter.enableAutoRefreshSelector();

    const $executor = $injector.get('$executor');
    timefilter.on('update', () => {
      // re-fetch if they change the time filter
      $executor.run();
    });

    $scope.$watch('hasData', hasData => {
      if (hasData) {
        const kbnUrl = $injector.get('kbnUrl');
        kbnUrl.redirect('/home');
      }
    });

    // Mount the React component to the template
    $scope.$$postDigest(() => {
      render(<NoData />, document.getElementById(REACT_NODE_ID));
    });

    // Register the monitoringClusters service.
    const monitoringClusters = $injector.get('monitoringClusters');
    $executor.register({
      execute: function () {
        return monitoringClusters();
      },
      handleResponse: function (clusters) {
        if (clusters.length) {
          // use the control flag because we can't redirect from inside here
          $scope.hasData = true;
        }
      }
    });

    // Start the executor
    $executor.start();

    // Destory the executor
    $scope.$on('$destroy', () => {
      $executor.destroy();
      unmountComponentAtNode(document.getElementById(REACT_NODE_ID));
    });
  }
})
  .otherwise({ redirectTo: '/home' });
