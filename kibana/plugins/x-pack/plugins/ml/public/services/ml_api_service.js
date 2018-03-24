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

import { pick } from 'lodash';
import './http_service';
import chrome from 'ui/chrome';

import { uiModules } from 'ui/modules';
const module = uiModules.get('apps/ml');

module.service('ml', function (prlHttpService) {
  const http = prlHttpService;
  const basePath = chrome.addBasePath('/api/ml');

  this.jobs = function (obj) {
    const jobId = (obj && obj.jobId) ? `/${obj.jobId}` : '';
    return http.request({
      url: `${basePath}/anomaly_detectors${jobId}`,
    });
  };

  this.jobStats = function (obj) {
    const jobId = (obj && obj.jobId) ? `/${obj.jobId}` : '';
    return http.request({
      url: `${basePath}/anomaly_detectors${jobId}/_stats`,
    });
  };

  this.addJob = function (obj) {
    return http.request({
      url: `${basePath}/anomaly_detectors/${obj.jobId}`,
      method: 'PUT',
      data: obj.job
    });
  };

  this.openJob = function (obj) {
    return http.request({
      url: `${basePath}/anomaly_detectors/${obj.jobId}/_open`,
      method: 'POST'
    });
  };

  this.closeJob = function (obj) {
    return http.request({
      url: `${basePath}/anomaly_detectors/${obj.jobId}/_close`,
      method: 'POST'
    });
  };

  this.forceCloseJob = function (obj) {
    return http.request({
      url: `${basePath}/anomaly_detectors/${obj.jobId}/_close?force=true`,
      method: 'POST'
    });
  };

  this.deleteJob = function (obj) {
    return http.request({
      url: `${basePath}/anomaly_detectors/${obj.jobId}`,
      method: 'DELETE'
    });
  };

  this.forceDeleteJob = function (obj) {
    return http.request({
      url: `${basePath}/anomaly_detectors/${obj.jobId}?force=true`,
      method: 'DELETE'
    });
  };

  this.updateJob = function (obj) {
    return http.request({
      url: `${basePath}/anomaly_detectors/${obj.jobId}/_update`,
      method: 'POST',
      data: obj.job
    });
  };

  this.datafeeds = function (obj) {
    const datafeedId = (obj && obj.datafeedId) ? `/${obj.datafeedId}` : '';
    return http.request({
      url: `${basePath}/datafeeds${datafeedId}`,
    });
  };

  this.datafeedStats = function (obj) {
    const datafeedId = (obj && obj.datafeedId) ? `/${obj.datafeedId}` : '';
    return http.request({
      url: `${basePath}/datafeeds${datafeedId}/_stats`,
    });
  };

  this.addDatafeed = function (obj) {
    return http.request({
      url: `${basePath}/datafeeds/${obj.datafeedId}`,
      method: 'PUT',
      data: obj.datafeedConfig
    });
  };

  this.updateDatafeed = function (obj) {
    return http.request({
      url: `${basePath}/datafeeds/${obj.datafeedId}/_update`,
      method: 'POST',
      data: obj.datafeedConfig
    });
  };

  this.deleteDatafeed = function (obj) {
    return http.request({
      url: `${basePath}/datafeeds/${obj.datafeedId}`,
      method: 'DELETE'
    });
  };

  this.forceDeleteDatafeed = function (obj) {
    return http.request({
      url: `${basePath}/datafeeds/${obj.datafeedId}?force=true`,
      method: 'DELETE'
    });
  };

  this.startDatafeed = function (obj) {
    const data = {};
    if(obj.start !== undefined) {
      data.start = obj.start;
    }
    if(obj.end !== undefined) {
      data.end = obj.end;
    }
    return http.request({
      url: `${basePath}/datafeeds/${obj.datafeedId}/_start`,
      method: 'POST',
      data
    });
  };

  this.stopDatafeed = function (obj) {
    return http.request({
      url: `${basePath}/datafeeds/${obj.datafeedId}/_stop`,
      method: 'POST'
    });
  };

  this.datafeedPreview = function (obj) {
    return http.request({
      url: `${basePath}/datafeeds/${obj.datafeedId}/_preview`,
      method: 'GET'
    });
  };

  this.validateDetector = function (obj) {
    return http.request({
      url: `${basePath}/anomaly_detectors/_validate/detector`,
      method: 'POST',
      data: obj.detector
    });
  };

  this.forecast = function (obj) {
    const data = {};
    if(obj.duration !== undefined) {
      data.duration = obj.duration;
    }

    return http.request({
      url: `${basePath}/anomaly_detectors/${obj.jobId}/_forecast`,
      method: 'POST',
      data
    });
  };

  this.overallBuckets = function (obj) {
    const data = pick(obj, [
      'topN',
      'bucketSpan',
      'start',
      'end'
    ]);
    return http.request({
      url: `${basePath}/anomaly_detectors/${obj.jobId}/results/overall_buckets`,
      method: 'POST',
      data
    });
  };

  this.checkPrivilege = function (obj) {
    return http.request({
      url: `${basePath}/_has_privileges`,
      method: 'POST',
      data: obj
    });
  };

  this.getNotificationSettings = function () {
    return http.request({
      url: `${basePath}/notification_settings`,
      method: 'GET'
    });
  };

  this.getIndices = function () {
    return http.request({
      url: `${basePath}/indices`,
      method: 'GET'
    });
  };

  this.recognizeIndex = function (obj) {
    return http.request({
      url: `${basePath}/modules/recognize/${obj.indexPatternTitle}`,
      method: 'GET'
    });
  };

  this.getDataRecognizerModule = function (obj) {
    return http.request({
      url: `${basePath}/modules/get_module/${obj.moduleId}`,
      method: 'GET'
    });
  };

  this.setupDataRecognizerConfig = function (obj) {
    const data = pick(obj, [
      'prefix',
      'groups',
      'indexPatternName'
    ]);

    return http.request({
      url: `${basePath}/modules/setup/${obj.moduleId}`,
      method: 'POST',
      data
    });
  };

  this.getVisualizerFieldStats = function (obj) {
    const data = pick(obj, [
      'query',
      'timeFieldName',
      'earliest',
      'latest',
      'samplerShardSize',
      'interval',
      'fields',
      'maxExamples'
    ]);

    return http.request({
      url: `${basePath}/data_visualizer/get_field_stats/${obj.indexPatternTitle}`,
      method: 'POST',
      data
    });
  };

  this.getVisualizerOverallStats = function (obj) {
    const data = pick(obj, [
      'query',
      'timeFieldName',
      'earliest',
      'latest',
      'samplerShardSize',
      'aggregatableFields',
      'nonAggregatableFields'
    ]);

    return http.request({
      url: `${basePath}/data_visualizer/get_overall_stats/${obj.indexPatternTitle}`,
      method: 'POST',
      data
    });
  };

  this.calendars = function (obj) {
    const calendarId = (obj && obj.calendarId) ? `/${obj.calendarId}` : '';
    return http.request({
      url: `${basePath}/calendars${calendarId}`,
      method: 'GET'
    });
  };


  this.addCalendar = function (obj) {
    return http.request({
      url: `${basePath}/calendars`,
      method: 'PUT',
      data: obj
    });
  };

  this.updateCalendar = function (obj) {
    const calendarId = (obj && obj.calendarId) ? `/${obj.calendarId}` : '';
    return http.request({
      url: `${basePath}/calendars${calendarId}`,
      method: 'PUT',
      data: obj
    });
  };

  this.deleteCalendar = function (obj) {
    return http.request({
      url: `${basePath}/calendars/${obj.calendarId}`,
      method: 'DELETE'
    });
  };

});
