/**
 * ELASTICSEARCH CONFIDENTIAL
 * _____________________________
 *
 *  [2014] Elasticsearch Incorporated All Rights Reserved.
 *
 * NOTICE:  All information contained herein is, and remains
 * the property of Elasticsearch Incorporated and its suppliers,
 * if any.  The intellectual and technical concepts contained
 * herein are proprietary to Elasticsearch Incorporated
 * and its suppliers and may be covered by U.S. and Foreign Patents,
 * patents in process, and are protected by trade secret or copyright law.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Elasticsearch Incorporated.
 */

import React from 'react';
import ReactDOM from 'react-dom';
import { ClusterView } from '../components/clusterView';
import { uiModules } from 'ui/modules';

const uiModule = uiModules.get('monitoring/directives', []);
uiModule.directive('clusterView', kbnUrl => {
  return {
    restrict: 'E',
    scope: {
      totalCount: '=',
      filter: '=',
      showing: '=',
      labels: '=',
      shardStats: '=',
      showSystemIndices: '=',
      toggleShowSystemIndices: '='
    },
    link: function (scope, element) {
      ReactDOM.render(
        <ClusterView
          scope={scope}
          kbnUrl={kbnUrl}
          showSystemIndices={scope.showSystemIndices}
          toggleShowSystemIndices={scope.toggleShowSystemIndices}
        />,
        element[0]
      );
    }
  };
});
