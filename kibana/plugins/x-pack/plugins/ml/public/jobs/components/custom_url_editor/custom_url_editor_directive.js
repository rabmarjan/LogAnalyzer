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
 * ml-custom-url-editor directive for editing a custom URL link which allows the
 * user to drill through from an anomaly to another URL such as a Kibana dashboard.
 */

import _ from 'lodash';
import rison from 'rison-node';

import template from './custom_url_editor.html';
import 'plugins/ml/components/item_select';
import { SavedObjectsClientProvider } from 'ui/saved_objects';

import { uiModules } from 'ui/modules';
const module = uiModules.get('apps/ml');

module.directive('mlCustomUrlEditor', function (Private) {
  return {
    scope: {
      addCustomUrl: '&',
      job: '='
    },
    restrict: 'AE',
    replace: true,
    transclude: true,
    template,
    controller: function ($scope) {
      const NEW_CUSTOM_URL_TYPE = {
        KIBANA_DASHBOARD: 'KIBANA_DASHBOARD',
        OTHER: 'OTHER'
      };
      $scope.NEW_CUSTOM_URL_TYPE = NEW_CUSTOM_URL_TYPE;

      const NEW_CUSTOM_URL_TIME_RANGE_TYPE = {
        DEFAULT: 'DEFAULT',
        INTERVAL: 'INTERVAL'
      };
      $scope.NEW_CUSTOM_URL_TIME_RANGE_TYPE = NEW_CUSTOM_URL_TIME_RANGE_TYPE;

      $scope.newCustomUrl = {
        label: undefined,
        type: NEW_CUSTOM_URL_TYPE.OTHER,
        kibanaDashboardSettings: {
          timeRange: {
            type: NEW_CUSTOM_URL_TIME_RANGE_TYPE.DEFAULT
          },
          queryFieldNames: []
        },
        otherUrlSettings: {
          urlValue: ''
        }
      };

      // Get the list of saved Kibana dashboards.
      $scope.savedDashboards = [];
      const savedObjectsClient = Private(SavedObjectsClientProvider);
      savedObjectsClient.find({
        type: 'dashboard',
        fields: ['title'],
        perPage: 1000
      }).then((resp) => {
        $scope.savedDashboards = _.chain(resp)
          .get('savedObjects', [])
          .map(savedObj => ({ id: savedObj.id, title: savedObj.attributes.title }))
          .sortBy(obj => obj.title.toLowerCase())
          .value();
        if ($scope.savedDashboards.length > 0) {
          // Set default new URL type to Kibana dashboard.
          $scope.newCustomUrl.type = NEW_CUSTOM_URL_TYPE.KIBANA_DASHBOARD;
        }

        initFields();
      }).catch((resp) => {
        console.log('Custom URL editor - error getting list of saved dashboards', resp);
      });

      // Get the list of partitioning and influencer fields that can be used as
      // entities to add to the query / filter used when linking to a Kibana dashboard.
      const detectors = $scope.job.analysis_config.detectors;
      const jobFieldNames = _.get($scope.job.analysis_config, 'influencers', []);
      _.each(detectors, (detector) => {
        if (_.has(detector, 'partition_field_name')) {
          jobFieldNames.push(detector.partition_field_name);
        }
        if (_.has(detector, 'by_field_name')) {
          jobFieldNames.push(detector.by_field_name);
        }
        if (_.has(detector, 'over_field_name')) {
          jobFieldNames.push(detector.over_field_name);
        }
      });

      // Remove duplicates, sort and get in format for use by the item-select component.
      $scope.jobFieldNames = _.chain(jobFieldNames)
        .uniq()
        .sortBy(fieldName => fieldName.toLowerCase())
        .map(fieldName => ({ id: fieldName }))
        .value();

      $scope.addQueryEntity = function () {
        if ($scope.jobFieldNames.length > 0) {
          $scope.newCustomUrl.kibanaDashboardSettings.queryFieldNames.push($scope.jobFieldNames[0]);
        }
      };

      $scope.removeQueryEntity = function (index) {
        $scope.newCustomUrl.kibanaDashboardSettings.queryFieldNames.splice(index, 1);
      };

      $scope.addUrl = function () {
        // TODO - add a button for testing the configured URL.

        const settings = $scope.newCustomUrl;

        const urlToAdd = { url_name: settings.label };
        if (settings.type === NEW_CUSTOM_URL_TYPE.KIBANA_DASHBOARD) {
          // Get the complete list of attributes for the selected dashboard (query, filters).
          savedObjectsClient.get('dashboard', settings.kibanaDashboardSettings.dashboardId)
            .then((response) => {
              // Use the filters from the saved dashboard if there are any.
              let filters = [];

              // Use the query from the dashboard only if no job entities are selected.
              let query = undefined;

              const searchSourceJSON = response.get('kibanaSavedObjectMeta.searchSourceJSON');
              if (searchSourceJSON !== undefined) {
                const searchSource = JSON.parse(searchSourceJSON);
                filters = _.get(searchSource, 'filter', []);
                query = searchSource.query;
              }

              // Add time settings to the global state URL parameter.
              // TODO - support ability to configure time range drilldown as an elasticsearch interval
              //        before and after the time of the anomaly.
              // For now use the existing $earliest$ and $latest$ tokens which get substituted for times around
              // the time of the anomaly on which the URL will be run against.
              const _g = rison.encode({
                time: {
                  from: '$earliest$',
                  to: '$latest$',
                  mode: 'absolute'
                }
              });

              const appState = {
                filters
              };

              // To put entities in filters section would involve creating parameters of the form
              // filters:!(('$state':(store:appState),meta:(alias:!n,disabled:!f,index:b30fd340-efb4-11e7-a600-0f58b1422b87,
              // key:airline,negate:!f,params:(query:AAL,type:phrase),type:phrase,value:AAL),query:(match:(airline:(query:AAL,type:phrase)))))
              // which includes the ID of the index holding the field used in the filter.

              // So for simplicity, put entities in the query, replacing any query which is there already.
              // e.g. query:(language:lucene,query:'region:us-east-1%20AND%20instance:i-20d061fa')
              if (settings.kibanaDashboardSettings.queryFieldNames.length > 0) {
                let queryString = '';
                _.each(settings.kibanaDashboardSettings.queryFieldNames, (fieldName, index) => {
                  if (index > 0) {
                    queryString += ' AND ';
                  }
                  queryString += `${fieldName}:$${fieldName}$`;
                });

                query = {
                  language: 'lucene',
                  query: queryString
                };
              }

              if (query !== undefined) {
                appState.query = query;
              }

              const _a = rison.encode(appState);

              const urlValue = `kibana#/dashboard/${settings.kibanaDashboardSettings.dashboardId}?_g=${_g}&_a=${_a}`;
              urlToAdd.url_value = urlValue;
              $scope.addCustomUrl()(urlToAdd);

              // Set the fields back to their defaults.
              initFields();
            })
            .catch((resp) => {
              console.log('Custom URL editor - error getting details on dashboard', resp);
            });

        } else {
          urlToAdd.url_value = settings.otherUrlSettings.urlValue;
          $scope.addCustomUrl()(urlToAdd);

          // Set the fields back to their defaults.
          initFields();
        }

      };

      function initFields() {
        $scope.newCustomUrl.label = '';
        $scope.newCustomUrl.otherUrlSettings = {
          urlValue: ''
        };

        if ($scope.savedDashboards.length > 0) {
          $scope.newCustomUrl.type = NEW_CUSTOM_URL_TYPE.KIBANA_DASHBOARD;
          $scope.newCustomUrl.kibanaDashboardSettings = {
            dashboardId: _.head($scope.savedDashboards).id,
            timeRange: {
              type: NEW_CUSTOM_URL_TIME_RANGE_TYPE.DEFAULT
            },
            queryFieldNames: []
          };
        } else {
          $scope.newCustomUrl.type = NEW_CUSTOM_URL_TYPE.OTHER;
        }
      }

    }
  };
});
