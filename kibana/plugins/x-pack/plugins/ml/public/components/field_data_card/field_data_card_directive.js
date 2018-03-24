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
 * AngularJS directive for rendering a card showing data on a field in an index pattern.
 */

import _ from 'lodash';
import $ from 'jquery';
import chrome from 'ui/chrome';
import 'ui/filters/moment';

import template from './field_data_card.html';
import { ML_JOB_FIELD_TYPES } from 'plugins/ml/../common/constants/field_types';

import { uiModules } from 'ui/modules';
const module = uiModules.get('apps/ml');

module.directive('mlFieldDataCard', function () {

  function link(scope, element) {
    scope.ML_JOB_FIELD_TYPES = ML_JOB_FIELD_TYPES;

    if (scope.card.type === ML_JOB_FIELD_TYPES.NUMBER) {
      if (scope.card.fieldName) {
        scope.$watch('card.stats', () => {
          const cardinality = _.get(scope, ['card', 'stats', 'cardinality'], 0);
          scope.detailsMode = cardinality > 100 ? 'distribution' : 'top';
        });

        const cardinality = _.get(scope, ['card', 'stats', 'cardinality'], 0);
        scope.detailsMode = cardinality > 100 ? 'distribution' : 'top';
      }
      // Create a div for the chart tooltip.
      $('.ml-field-data-card-tooltip').remove();
      $('body').append('<div class="ml-field-data-card-tooltip" style="opacity:0; display: none;">');
    }

    if (scope.card.type === ML_JOB_FIELD_TYPES.DATE) {
      scope.$watch('card.stats', () => {
        // Convert earliest and latest to Dates for formatting with moment filter in the template.
        if (_.has(scope, 'card.stats.earliest')) {
          scope.card.stats.earliest = new Date(scope.card.stats.earliest);
        }
        if (_.has(scope, 'card.stats.latest')) {
          scope.card.stats.latest = new Date(scope.card.stats.latest);
        }
      }, true);
    }

    scope.getCardUrl = function () {
      const urlBasePath = chrome.getBasePath();
      const baseCardPath = `${urlBasePath}/plugins/ml/components/field_data_card/content_types`;
      const cardType = scope.card.type;
      switch (cardType) {
        case ML_JOB_FIELD_TYPES.BOOLEAN:
          return `${baseCardPath}/card_boolean.html`;
        case ML_JOB_FIELD_TYPES.DATE:
          return `${baseCardPath}/card_date.html`;
        case ML_JOB_FIELD_TYPES.GEO_POINT:
          return `${baseCardPath}/card_geo_point.html`;
        case ML_JOB_FIELD_TYPES.IP:
          return `${baseCardPath}/card_ip.html`;
        case ML_JOB_FIELD_TYPES.KEYWORD:
          return `${baseCardPath}/card_keyword.html`;
        case ML_JOB_FIELD_TYPES.NUMBER:
          if (scope.card.fieldName) {
            return `${baseCardPath}/card_number.html`;
          } else {
            return `${baseCardPath}/card_document_count.html`;
          }
        case ML_JOB_FIELD_TYPES.TEXT:
          return `${baseCardPath}/card_text.html`;
        default:
          return `${baseCardPath}/card_other.html`;
      }
    };

    element.on('$destroy', () => {
      scope.$destroy();
    });

  }

  return {
    scope: {
      card: '=',
      indexPattern: '=',
      query: '=',
      earliest: '=',
      latest: '='
    },
    template,
    link: link
  };
})
  .filter('formatField', function () {
  // Filter to format the value of a field according to the defined format
  // of the field in the index pattern.
    return function (value, fieldFormat) {
      return fieldFormat.convert(value, 'text');
    };
  });
