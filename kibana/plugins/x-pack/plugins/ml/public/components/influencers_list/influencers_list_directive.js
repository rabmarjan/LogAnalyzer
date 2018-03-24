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
 * AngularJS directive for rendering a list of Machine Learning influencers.
 */

import _ from 'lodash';

import 'plugins/ml/lib/angular_bootstrap_patch';
import 'plugins/ml/filters/abbreviate_whole_number';

import template from './influencers_list.html';
import { getSeverity } from 'plugins/ml/util/anomaly_utils';

import { FilterManagerProvider } from 'ui/filter_manager';

import { uiModules } from 'ui/modules';
const module = uiModules.get('apps/ml');

module.directive('mlInfluencersList', function (Private) {

  const filterManager = Private(FilterManagerProvider);

  function link(scope, element) {

    scope.$on('render', function () {
      render();
    });

    element.on('$destroy', function () {
      scope.$destroy();
    });

    scope.tooltipPlacement = scope.tooltipPlacement === undefined ? 'top' : scope.tooltipPlacement;

    function render() {
      if (scope.influencersData === undefined) {
        return;
      }

      const dataByViewBy = {};

      // TODO - position tooltip so it doesn't go off edge of window.
      const compiledTooltip = _.template(
        '<div class="ml-influencers-list-tooltip"><%= influencerFieldName %>: <%= influencerFieldValue %>' +
        '<hr/>Max anomaly score: <%= maxScoreValue %>' +
        '<hr/>Total anomaly score: <%= totalScoreValue %></div>');

      _.each(scope.influencersData, (fieldValues, influencerFieldName) => {
        const valuesForViewBy = [];

        _.each(fieldValues, function (valueData) {
          const maxScorePrecise = valueData.maxAnomalyScore;
          const maxScore = parseInt(maxScorePrecise);
          const totalScore = parseInt(valueData.sumAnomalyScore);
          const barScore = maxScore !== 0 ? maxScore : 1;
          const maxScoreLabel = maxScore !== 0 ? maxScore : '< 1';
          const totalScoreLabel = totalScore !== 0 ? totalScore : '< 1';
          const severity = getSeverity(maxScore);

          // Store the data for each influencerfieldname in an array to ensure
          // reliable sorting by max score.
          // If it was sorted as an object, the order when rendered using the AngularJS
          // ngRepeat directive could not be relied upon to be the same as they were
          // returned in the ES aggregation e.g. for numeric keys from a mlcategory influencer.
          valuesForViewBy.push({
            'influencerFieldValue': valueData.influencerFieldValue,
            'maxScorePrecise': maxScorePrecise,
            'barScore': barScore,
            'maxScoreLabel': maxScoreLabel,
            'totalScore': totalScore,
            'severity': severity,
            'tooltip': compiledTooltip({
              'influencerFieldName': influencerFieldName,
              'influencerFieldValue': valueData.influencerFieldValue,

              'maxScoreValue': maxScoreLabel,
              'totalScoreValue': totalScoreLabel
            })
          });
        });


        dataByViewBy[influencerFieldName] = _.sortBy(valuesForViewBy, 'maxScorePrecise').reverse();
      });

      scope.influencers = dataByViewBy;
    }

    // Provide a filter function so filters can be added.
    scope.filter = function (field, value, operator) {
      filterManager.add(field, value, operator, scope.indexPatternId);
    };

    scope.showNoResultsMessage = function () {
      return (scope.influencersData === undefined) || (_.keys(scope.influencersData).length === 0);
    };

  }

  return {
    scope: {
      influencersData: '=',
      indexPatternId: '=',
      tooltipPlacement: '@'
    },
    template,
    link: link
  };
});
