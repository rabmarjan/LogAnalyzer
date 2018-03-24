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
 * Angular directive for rendering the expanded row content in the
 * Machine Learning anomalies table. It displays more details on the
 * anomaly summarized in the row, including field names,
 * actual and typical values for the analyzed metric,
 * plus causes and examples events according to the detector configuration.
 */

import _ from 'lodash';
import moment from 'moment';

import template from './expanded_row.html';
import {
  getSeverity,
  showActualForFunction,
  showTypicalForFunction
} from 'plugins/ml/util/anomaly_utils';
import 'plugins/ml/filters/format_value';

import { uiModules } from 'ui/modules';
const module = uiModules.get('apps/ml');

module.directive('mlAnomaliesTableExpandedRow', function () {

  function link(scope) {
    scope.record = scope.$parent.record;
    scope.filter = scope.$parent.filter;
    scope.filteringEnabled = scope.$parent.filteringEnabled;
    scope.isShowingAggregatedData = scope.$parent.isShowingAggregatedData;

    const timeFieldName = 'timestamp';
    const momentTime = moment(scope.record.source[timeFieldName]);
    scope.anomalyTime = momentTime.format('MMMM Do YYYY, HH:mm:ss');
    if (_.has(scope.record.source, 'bucket_span')) {
      scope.anomalyEndTime = momentTime.add(scope.record.source.bucket_span, 's').format('MMMM Do YYYY, HH:mm:ss');
    }

    scope.$on('initRow', function () {
      // Only build the description and details on metric values,
      // causes and influencers when the row is first expanded.
      buildContent();
    });

    if (scope.$parent.open === true) {
      // Build the content if the row was already open before re-render (e.g. when sorting),
      buildContent();
    }

    if (_.has(scope.record, 'entityValue') && scope.record.entityName === 'mlcategory') {
      // For categorization results, controller will obtain the definition when the
      // row is first expanded and place the categoryDefinition in the row scope.
      const unbindWatch = scope.$parent.$watch('categoryDefinition', function (categoryDefinition) {
        if (categoryDefinition !== undefined) {
          scope.examples = categoryDefinition.examples;
          unbindWatch();
        }
      });
    }

    function buildContent() {
      buildDescription();
      buildMetrics();
      buildCauses();
      buildInfluencers();
    }

    function buildDescription() {
      const record = scope.record;
      let rowDescription = getSeverity(record.source.record_score) + ' anomaly in ' + record.detector;

      if (_.has(record, 'entityName')) {
        rowDescription += ' found for ' + record.entityName;
        rowDescription += ' ';
        rowDescription += record.entityValue;
      }

      if (_.has(record.source, 'partition_field_name') && (record.source.partition_field_name !== record.entityName)) {
        rowDescription += ' detected in ' + record.source.partition_field_name;
        rowDescription += ' ';
        rowDescription += record.source.partition_field_value;
      }

      scope.description = rowDescription;

      // Check for a correlatedByFieldValue in the source which will be present for multivariate analyses
      // where the record is anomalous due to relationship with another 'by' field value.
      if (_.has(record.source, 'correlated_by_field_value')) {
        let mvDescription = 'multivariate correlations found in ';
        mvDescription += record.source.by_field_name;
        mvDescription += '; ';
        mvDescription += record.source.by_field_value;
        mvDescription += ' is considered anomalous given ';
        mvDescription += record.source.correlated_by_field_value;
        scope.multiVariateDescription = mvDescription;
      }


      // Display a warning below the description if the record is an interim result.
      scope.isInterim = _.get(record, 'source.is_interim', false);
    }

    function buildMetrics() {
      const record = scope.record;
      const functionDescription = _.get(record, 'source.function_description', '');
      if (showActualForFunction(functionDescription) === true) {
        if (!_.has(scope.record.source, 'causes')) {
          scope.actual = record.source.actual;
        } else {
          const causes = scope.record.source.causes;
          if (causes.length === 1) {
            // If only one 'cause', move value to top level.
            const cause = _.first(causes);
            scope.actual = cause.actual;
          }
        }
      }
      if (showTypicalForFunction(functionDescription) === true) {
        if (!_.has(scope.record.source, 'causes')) {
          scope.typical = record.source.typical;
        } else {
          const causes = scope.record.source.causes;
          if (causes.length === 1) {
            // If only one 'cause', move value to top level.
            const cause = _.first(causes);
            scope.typical = cause.typical;
          }
        }
      }
    }

    function buildCauses() {
      if (_.has(scope.record.source, 'causes')) {
        const causes = scope.record.source.causes;

        // TODO - build different information depending on whether function is rare, freq_rare or another.

        // TODO - look in each cause for a 'correlatedByFieldValue' field,
        //    and if so, add to causes scope object for rendering in the template.
        if (causes.length === 1) {
          // Metrics and probability will already have been placed at the top level.
          // If cause has byFieldValue, move it to a top level fields for display.
          const cause = _.first(causes);
          if (_.has(cause, 'by_field_name')) {
            scope.singleCauseByFieldName = cause.by_field_name;
            scope.singleCauseByFieldValue = cause.by_field_value;
          }
        } else {
          scope.causes = _.map(causes, function (cause) {
            const simplified = _.pick(cause, 'typical', 'actual', 'probability');
            // Get the 'entity field name/value' to display in the cause -
            // For by and over, use by_field_name/Value (over_field_name/Value are in the toplevel fields)
            // For just an 'over' field - the over_field_name/Value appear in both top level and cause.
            simplified.entityName = _.has(cause, 'by_field_name') ? cause.by_field_name : cause.over_field_name;
            simplified.entityValue = _.has(cause, 'by_field_value') ? cause.by_field_value : cause.over_field_value;
            return simplified;
          });
        }

      }
    }

    function buildInfluencers() {
      if (_.has(scope.record, 'influencers')) {
        const influencers = [];
        _.each(scope.record.influencers, function (influencer) {
          _.each(influencer, function (influencerFieldValue, influencerFieldName) {
            influencers.push({ 'name': influencerFieldName, 'value': influencerFieldValue });
          });
        });
        scope.influencers = influencers;
      }
    }
  }


  return {
    restrict: 'AE',
    replace: false,
    scope: {},
    template,
    link: link
  };
});
