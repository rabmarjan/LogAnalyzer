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
export function privilegesProvider(Promise, ml) {

  function getPrivileges() {
    const privileges = {
      canGetJobs: false,
      canCreateJob: false,
      canDeleteJob: false,
      canForecastJob: false,
      canGetDatafeeds: false,
      canStartStopDatafeed: false,
      canUpdateJob: false,
      canUpdateDatafeed: false
    };

    return new Promise((resolve, reject) => {
      const priv = {
        cluster: [
          'cluster:monitor/xpack/ml/job/get',
          'cluster:monitor/xpack/ml/job/stats/get',
          'cluster:monitor/xpack/ml/datafeeds/get',
          'cluster:monitor/xpack/ml/datafeeds/stats/get',
          'cluster:admin/xpack/ml/job/put',
          'cluster:admin/xpack/ml/job/delete',
          'cluster:admin/xpack/ml/job/update',
          'cluster:admin/xpack/ml/job/open',
          'cluster:admin/xpack/ml/job/close',
          'cluster:admin/xpack/ml/job/forecast',
          'cluster:admin/xpack/ml/datafeeds/put',
          'cluster:admin/xpack/ml/datafeeds/delete',
          'cluster:admin/xpack/ml/datafeeds/start',
          'cluster:admin/xpack/ml/datafeeds/stop',
          'cluster:admin/xpack/ml/datafeeds/update'
        ]
      };

      ml.checkPrivilege(priv)
        .then((resp) => {

        // if security has been disabled, securityDisabled is returned from the endpoint
        // therefore set all privileges to true
          if (resp.securityDisabled) {
            _.each(privileges, (p, k) => {
              privileges[k] = true;
            });
          } else {
            if (resp.cluster['cluster:monitor/xpack/ml/job/get'] &&
              resp.cluster['cluster:monitor/xpack/ml/job/stats/get']) {
              privileges.canGetJobs = true;
            }

            if (resp.cluster['cluster:monitor/xpack/ml/datafeeds/get'] &&
              resp.cluster['cluster:monitor/xpack/ml/datafeeds/stats/get']) {
              privileges.canGetDatafeeds = true;
            }

            if (resp.cluster['cluster:admin/xpack/ml/job/put'] &&
              resp.cluster['cluster:admin/xpack/ml/job/open'] &&
              resp.cluster['cluster:admin/xpack/ml/datafeeds/put']) {
              privileges.canCreateJob = true;
            }

            if (resp.cluster['cluster:admin/xpack/ml/job/update']) {
              privileges.canUpdateJob = true;
            }

            if (resp.cluster['cluster:admin/xpack/ml/job/forecast']) {
              privileges.canForecastJob = true;
            }

            if (resp.cluster['cluster:admin/xpack/ml/job/delete'] &&
              resp.cluster['cluster:admin/xpack/ml/datafeeds/delete']) {
              privileges.canDeleteJob = true;
            }

            if (resp.cluster['cluster:admin/xpack/ml/job/open'] &&
              resp.cluster['cluster:admin/xpack/ml/datafeeds/start'] &&
              resp.cluster['cluster:admin/xpack/ml/datafeeds/stop']) {
              privileges.canStartStopDatafeed = true;
            }

            if (resp.cluster['cluster:admin/xpack/ml/datafeeds/update']) {
              privileges.canUpdateDatafeed = true;
            }

          }

          return resolve(privileges);
        })
        .catch(() => {
          return reject(privileges);
        });
    });
  }

  return {
    getPrivileges
  };
}
