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

import _ from 'lodash';
import angular from 'angular';

export function filterAggTypes(aggTypes) {
  const filteredAggTypes = [];
  let typeCopy;
  _.each(aggTypes, (type) => {
    type.mlName = type.name;
    type.mlModelPlotAgg = { max: type.name, min: type.name };
    type.isCountType = false;
    type.isAggregatableStringType = false;

    _.each(type.params, (p) => {
      if (p.filterFieldTypes && typeof p.filterFieldTypes === 'string') {
        p.filterFieldTypes = p.filterFieldTypes.replace(',date', '');
      }
    });

    if (type.name === 'count') {
      type.mlModelPlotAgg = { max: 'max', min: 'min' };
      type.isCountType = true;
      filteredAggTypes.push(type);

      typeCopy = angular.copy(type);
      typeCopy.title   = 'High count';
      typeCopy.mlName = 'high_count';
      filteredAggTypes.push(typeCopy);

      typeCopy = angular.copy(type);
      typeCopy.title   = 'Low count';
      typeCopy.mlName = 'low_count';
      filteredAggTypes.push(typeCopy);

    } else if (type.name === 'sum') {
      filteredAggTypes.push(type);

      typeCopy = angular.copy(type);
      typeCopy.title   = 'High sum';
      typeCopy.mlName = 'high_sum';
      filteredAggTypes.push(typeCopy);

      typeCopy = angular.copy(type);
      typeCopy.title   = 'Low sum';
      typeCopy.mlName = 'low_sum';
      filteredAggTypes.push(typeCopy);

    } else if (type.name === 'avg') {
      type.title   = 'Mean';
      type.mlName = 'mean';
      filteredAggTypes.push(type);

      typeCopy = angular.copy(type);
      typeCopy.title   = 'High mean';
      typeCopy.mlName = 'high_mean';
      filteredAggTypes.push(typeCopy);

      typeCopy = angular.copy(type);
      typeCopy.title   = 'Low mean';
      typeCopy.mlName = 'low_mean';
      filteredAggTypes.push(typeCopy);

    } else if (type.name === 'median') {
      type.mlModelPlotAgg = { max: 'max', min: 'min' };
      filteredAggTypes.push(type);

      typeCopy = angular.copy(type);
      typeCopy.title   = 'High median';
      typeCopy.mlName = 'high_median';
      filteredAggTypes.push(typeCopy);

      typeCopy = angular.copy(type);
      typeCopy.title   = 'Low median';
      typeCopy.mlName = 'low_median';
      filteredAggTypes.push(typeCopy);


    } else if (type.name === 'min') {
      filteredAggTypes.push(type);
    } else if (type.name === 'max') {
      filteredAggTypes.push(type);
    } else if (type.name === 'cardinality') {
      type.title = 'Distinct count';
      type.mlName = 'distinct_count';
      type.mlModelPlotAgg = { max: 'max', min: 'min' };
      type.isAggregatableStringType = true;

      _.each(type.params, (p) => {
        if (p.filterFieldTypes) {
          p.filterFieldTypes = 'number,boolean,ip,string';
        }
      });

      filteredAggTypes.push(type);
    }
  });
  return filteredAggTypes;
}
