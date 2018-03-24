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

// the tooltip descriptions are located in tooltips.json

import './styles/main.less';

import semver from 'semver';
import { metadata } from 'ui/metadata';

import { uiModules } from 'ui/modules';
const module = uiModules.get('apps/ml');

module.directive('mlDocumentationHelpLink', function () {
  return {
    scope: {
      uri: '@mlUri',
      label: '@mlLabel'
    },
    restrict: 'AE',
    replace: true,
    template: '<a href="{{fullUrl()}}" rel="noopener noreferrer" target="_blank"' +
                'class="documentation-help-link" tooltip="{{label}}">' +
                '{{label}}<i class="fa fa-external-link"></i></a>',
    controller: function ($scope) {
      const baseUrl = 'https://www.elastic.co';
      const major = semver.major(metadata.version);
      const minor = semver.minor(metadata.version);
      const version = `${major}.${minor}`;

      $scope.fullUrl = function () {
        return `${baseUrl}/guide/en/x-pack/${version}/${$scope.uri}`;
      };
    }
  };

});
