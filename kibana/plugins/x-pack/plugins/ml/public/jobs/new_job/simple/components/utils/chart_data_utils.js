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

// various util functions for populating the chartData object used by the job wizards

import _ from 'lodash';
import { IntervalHelperProvider } from 'plugins/ml/util/ml_time_buckets';
import { calculateTextWidth } from 'plugins/ml/util/string_utils';

export function ChartDataUtilsProvider($q, Private, timefilter, mlSimpleJobSearchService, mlResultsService) {
  const TimeBuckets = Private(IntervalHelperProvider);

  function loadDocCountData(formConfig, chartData) {
    return $q((resolve, reject) => {
      const query = formConfig.combinedQuery;
      const bounds = timefilter.getActiveBounds();
      const buckets = new TimeBuckets();
      buckets.setInterval('auto');
      buckets.setBounds(bounds);

      const interval = buckets.getInterval().asMilliseconds();

      const end = formConfig.end;
      const start = formConfig.start;

      mlResultsService.getEventRateData(
        formConfig.indexPattern.title,
        query,
        formConfig.timeField,
        start,
        end,
        (interval + 'ms'))
        .then((resp) => {
          let highestValue = Math.max(chartData.eventRateHighestValue, chartData.highestValue);
          chartData.job.bars = [];

          _.each(resp.results, (value, t) => {
            if (!isFinite(value)) {
              value = 0;
            }

            if (value > highestValue) {
              highestValue = value;
            }

            const time = +t;
            const date = new Date(time);
            chartData.job.barsInterval = interval;
            chartData.job.bars.push({
              date,
              time,
              value,
            });
          });

          chartData.totalResults = resp.total;
          chartData.eventRateHighestValue = Math.ceil(highestValue);

          resolve(chartData);
        }).catch((resp) => {
          console.log('getEventRate visualization - error getting event rate data from elasticsearch:', resp);
          reject(resp);
        });
    });
  }

  function loadJobSwimlaneData(formConfig, chartData) {
    return $q((resolve) => {
      mlResultsService.getScoresByBucket(
        [formConfig.jobId],
        formConfig.start,
        formConfig.end,
        formConfig.resultsIntervalSeconds + 's',
        1
      )
        .then((data) => {
          let time = formConfig.start;

          const jobResults = data.results[formConfig.jobId];

          chartData.job.swimlane = [];
          _.each(jobResults, (value, t) => {
            time = +t;
            const date = new Date(time);
            chartData.job.swimlane.push({
              date,
              time,
              value,
              color: ''
            });
          });

          const pcnt = ((time - formConfig.start + formConfig.resultsIntervalSeconds) / (formConfig.end - formConfig.start) * 100);

          chartData.percentComplete = Math.round(pcnt);
          chartData.job.percentComplete = chartData.percentComplete;
          chartData.job.swimlaneInterval = formConfig.resultsIntervalSeconds * 1000;

          resolve(chartData);
        })
        .catch(() => {
          resolve(chartData);
        });
    });
  }

  function loadDetectorSwimlaneData(formConfig, chartData) {
    return $q((resolve) => {
      mlSimpleJobSearchService.getScoresByRecord(
        formConfig.jobId,
        formConfig.start,
        formConfig.end,
        formConfig.resultsIntervalSeconds + 's',
        {
          name: (formConfig.splitField !== undefined) ? formConfig.splitField.name : undefined,
          value: formConfig.firstSplitFieldName
        }
      )
        .then((data) => {
          let dtrIndex = 0;
          _.each(formConfig.fields, (field, key) => {

            const dtr = chartData.detectors[key];
            const times = data.results[dtrIndex];

            dtr.swimlane = [];
            _.each(times, (timeObj, t) => {
              const time = +t;
              const date = new Date(time);
              dtr.swimlane.push({
                date: date,
                time: time,
                value: timeObj.recordScore,
                color: ''
              });
            });

            dtr.percentComplete = chartData.percentComplete;
            dtr.swimlaneInterval = formConfig.resultsIntervalSeconds * 1000;

            dtrIndex++;
          });

          resolve(chartData);
        })
        .catch(() => {
          resolve(chartData);
        });
    });
  }

  function getSplitFields(formConfig, splitFieldName, size) {
    const query = formConfig.combinedQuery;
    return mlSimpleJobSearchService.getCategoryFields(
      formConfig.indexPattern.title,
      splitFieldName,
      size,
      query);
  }

  function updateChartMargin(chartData) {
    // Append extra 10px to width of tick label for highest axis value to allow for tick padding.
    chartData.chartTicksMargin.width = calculateTextWidth(chartData.eventRateHighestValue, true) + 10;
  }

  return {
    loadDocCountData,
    loadJobSwimlaneData,
    loadDetectorSwimlaneData,
    getSplitFields,
    updateChartMargin
  };
}
