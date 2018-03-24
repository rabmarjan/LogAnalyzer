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
import 'plugins/ml/jobs/new_job/advanced/detectors_list_directive';
import './styles/main.less';
import angular from 'angular';
import { calculateDatafeedFrequencyDefaultSeconds } from 'plugins/ml/../common/util/job_utils';
import { parseInterval } from 'ui/utils/parse_interval';

import { uiModules } from 'ui/modules';
const module = uiModules.get('apps/ml');

module.controller('MlEditJobModal', function ($scope, $modalInstance, $modal, params, mlJobService, mlMessageBarService) {
  const msgs = mlMessageBarService;
  msgs.clear();
  $scope.saveLock = false;
  const refreshJob = params.pscope.refreshJob;

  $scope.job = angular.copy(params.job);

  const bucketSpan = parseInterval($scope.job.analysis_config.bucket_span);

  $scope.ui = {
    title: 'Edit ' + $scope.job.job_id,
    currentTab: 0,
    tabs: [
      { index: 0, title: 'Job Details', hidden: false },
      { index: 1, title: 'Detectors', hidden: false },
      { index: 2, title: 'Datafeed', hidden: true },
      { index: 3, title: 'Custom URLs', hidden: false }
    ],
    changeTab: function (tab) {
      $scope.ui.currentTab = tab.index;
    },
    isDatafeed: false,
    datafeedStopped: false,
    datafeed: {
      scrollSizeDefault: 1000,
      queryDelayDefault: '60s',
      frequencyDefault: calculateDatafeedFrequencyDefaultSeconds(bucketSpan.asSeconds()) + 's',
    },
    stoppingDatafeed: false,
    validation: {
      tabs: [
        { index: 0, valid: true, checks: { categorizationFilters: { valid: true } } }
      ]
    },
    editingNewCustomUrl: false
  };

  // extract datafeed settings
  if ($scope.job.datafeed_config) {
    const datafeedConfig = $scope.job.datafeed_config;
    $scope.ui.isDatafeed = true;
    $scope.ui.tabs[2].hidden = false;
    $scope.ui.datafeedStopped = (!$scope.job.datafeed_config || $scope.job.datafeed_config.state === 'stopped');

    $scope.ui.datafeed.queryText = angular.toJson(datafeedConfig.query, true);
    $scope.ui.datafeed.queryDelayText = datafeedConfig.query_delay;
    $scope.ui.datafeed.frequencyText = datafeedConfig.frequency;
    $scope.ui.datafeed.scrollSizeText = datafeedConfig.scroll_size;
  }

  $scope.editNewCustomUrl = function () {
    $scope.ui.editingNewCustomUrl = true;
  };

  $scope.addCustomUrl = function (customUrl) {
    if (!$scope.job.custom_settings) {
      $scope.job.custom_settings = {};
    }
    if (!$scope.job.custom_settings.custom_urls) {
      $scope.job.custom_settings.custom_urls = [];
    }

    $scope.job.custom_settings.custom_urls.push(customUrl);

    $scope.ui.editingNewCustomUrl = false;
  };

  $scope.removeCustomUrl = function (index) {
    $scope.job.custom_settings.custom_urls.splice(index, 1);
  };

  // add new categorization filter
  $scope.addCategorizationFilter = function () {
    if ($scope.job.analysis_config) {
      if (!$scope.job.analysis_config.categorization_filters) {
        $scope.job.analysis_config.categorization_filters = [];
      }

      $scope.job.analysis_config.categorization_filters.push('');
    }
  };

  // remove selected categorization filter
  $scope.removeCategorizationFilter = function (index) {
    if ($scope.job.analysis_config && $scope.job.analysis_config.categorization_filters) {
      $scope.job.analysis_config.categorization_filters.splice(index, 1);
    }
  };

  // convenient function to stop the datafeed from inside the edit dialog
  $scope.stopDatafeed = function () {
    const datafeedId = $scope.job.datafeed_config.datafeed_id;
    const jobId = $scope.job.job_id;
    $scope.ui.stoppingDatafeed = true;
    mlJobService.stopDatafeed(datafeedId, jobId)
      .then((resp) => {
        if (resp.stopped === true) {
          $scope.ui.datafeedStopped = true;
        }
      });
  };

  function validateJob() {
    let valid = true;
    const tabs = $scope.ui.validation.tabs;
    // reset validations
    _.each(tabs,  (tab) => {
      tab.valid = true;
      _.each(tab.checks, (check, c) => {
        tab.checks[c].valid = true;
        tab.checks[c].message = '';
      });
    });

    if ($scope.job.analysis_config.categorization_filters) {
      let v = true;
      _.each($scope.job.analysis_config.categorization_filters, (d) => {
        try {
          new RegExp(d);
        } catch (e) {
          v = false;
        }

        if (d === '' || v === false) {
          tabs[0].checks.categorization_filters.valid = false;
          valid = false;
        }
      });
    }
    return valid;
  }

  $scope.save = function () {
    msgs.clear();

    if (!validateJob()) {
      return;
    }

    $scope.saveLock = true;

    const jobId = $scope.job.job_id;
    const jobData = {};
    const datafeedData = {};

    // if the job description has changed, add it to the jobData json
    if ($scope.job.description !== params.job.description) {
      jobData.description = $scope.job.description;
    }

    // if groups exist, add it to the jobData json
    if (Array.isArray($scope.job.groups)) {
      jobData.groups = $scope.job.groups;
    }

    // check each detector. if the description or filters have changed, add it to the jobData json
    _.each($scope.job.analysis_config.detectors, (d, i) => {
      let changes = 0;

      const obj = {
        detector_index: i,
      };

      if (d.detector_description !== params.job.analysis_config.detectors[i].detector_description) {
        obj.description = d.detector_description;
        changes++;
      }

      if (changes > 0) {
        if (jobData.detectors === undefined) {
          jobData.detectors = [];
        }
        jobData.detectors.push(obj);
      }
    });

    // check each categorization filter. if any have changed, add all to the jobData json
    if ($scope.job.analysis_config.categorization_filters) {
      let doUpdate = false;

      // array lengths are different
      if ($scope.job.analysis_config.categorization_filters.length !== params.job.analysis_config.categorization_filters.length) {
        doUpdate = true;
      }

      _.each($scope.job.analysis_config.categorization_filters, (d, i) => {
        if (d !== params.job.analysis_config.categorization_filters[i]) {
          doUpdate = true;
        }
      });

      if (doUpdate) {
        jobData.categorization_filters = $scope.job.analysis_config.categorization_filters;
      }
    }

    // check custom settings
    if ($scope.job.custom_settings) {
      if ($scope.job.custom_settings.custom_urls &&
         $scope.job.custom_settings.custom_urls.length) {

        let doUpdate = false;

        if (!params.job.custom_settings ||
           !params.job.custom_settings.custom_urls ||
           !params.job.custom_settings.custom_urls.length) {
          // custom urls did not originally exist
          doUpdate = true;
        }
        else if ($scope.job.custom_settings.custom_urls.length !== params.job.custom_settings.custom_urls.length) {
          // if both existed but now have different lengths
          doUpdate = true;
        } else {
          // if lengths are the same, check the contents match.
          _.each($scope.job.custom_settings.custom_urls, (url, i) => {
            if (url.url_name !== params.job.custom_settings.custom_urls[i].url_name ||
               url.url_value !== params.job.custom_settings.custom_urls[i].url_value) {
              doUpdate = true;
            }
          });
        }


        if (doUpdate) {
          jobData.custom_settings = $scope.job.custom_settings;
        }
      } else {
        if (params.job.custom_settings ||
           params.job.custom_settings.custom_urls ||
           params.job.custom_settings.custom_urls.length) {
          // if urls orginally existed, but now don't
          // clear the custom settings completely
          jobData.custom_settings = {};
        }
      }
    }

    // check datafeed
    if ($scope.job.datafeed_config && $scope.ui.datafeedStopped) {
      const sch = $scope.ui.datafeed;

      // set query text
      if (sch.queryText === '') {
        sch.queryText = '{"match_all":{}}';
      }
      let query = sch.queryText;
      try {
        query = JSON.parse(query);
      } catch (e) {
        console.log('save(): could not parse query JSON');
      }

      const orginalQueryText = angular.toJson($scope.job.datafeed_config.query, true);
      // only update if it has changed from the original
      if (orginalQueryText !== sch.queryText) {
        datafeedData.query = query;
      }

      // only update fields if they have changed from the original
      if (sch.queryDelayText !== $scope.job.datafeed_config.query_delay) {
        datafeedData.query_delay = ((sch.queryDelayText === '' || sch.queryDelayText === null || sch.queryDelayText === undefined)
          ? sch.queryDelayDefault : sch.queryDelayText);
      }

      if (sch.frequencyText !== $scope.job.datafeed_config.frequency) {
        datafeedData.frequency = ((sch.frequencyText === '' || sch.frequencyText === null || sch.frequencyText === undefined)
          ? sch.frequencyDefault : sch.frequencyText);
      }

      if (sch.scrollSizeText !== $scope.job.datafeed_config.scroll_size) {
        datafeedData.scroll_size = ((sch.scrollSizeText === '' || sch.scrollSizeText === null || sch.scrollSizeText === undefined)
          ? sch.scrollSizeDefault : sch.scrollSizeText);
      }
    }

    // if anything has changed, post the changes
    if (Object.keys(jobData).length) {
      mlJobService.updateJob(jobId, jobData)
        .then((resp) => {
          if (resp.success) {
            saveDatafeed();
          } else {
            saveFail(resp);
          }
        });
    } else {
      saveDatafeed();
    }

    function saveDatafeed() {
      if (Object.keys(datafeedData).length) {
        const datafeedId = $scope.job.datafeed_config.datafeed_id;
        mlJobService.updateDatafeed(datafeedId, datafeedData)
          .then((resp) => {
            if (resp.success) {
              saveComplete();
            } else {
              saveFail(resp);
            }
          });
      } else {
        saveComplete();
      }
    }

    function saveComplete() {
      $scope.saveLock = false;
      msgs.clear();
      refreshJob(jobId);

      $modalInstance.close();
    }

    function saveFail(resp) {
      $scope.saveLock = false;
      msgs.error(resp.message);
    }

  };

  $scope.cancel = function () {
    msgs.clear();
    $modalInstance.close();
  };
});
