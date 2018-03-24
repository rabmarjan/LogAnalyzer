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

import { isJobIdValid } from 'plugins/ml/../common/util/job_utils';
import _ from 'lodash';

export function validateJobId(jobId, groups, checks) {
  let valid = true;

  _.each(checks, (item) => {
    item.valid = true;
  });

  if (jobId === '' || jobId === undefined) {
    checks.jobId.valid = false;
  } else if (isJobIdValid(jobId) === false) {
    checks.jobId.valid = false;
    let msg = 'Job name can contain lowercase alphanumeric (a-z and 0-9), hyphens or underscores; ';
    msg += 'must start and end with an alphanumeric character';
    checks.jobId.message = msg;
  }

  groups.forEach((group) => {
    if (isJobIdValid(group) === false) {
      checks.groupIds.valid = false;
      let msg = 'Job group names can contain lowercase alphanumeric (a-z and 0-9), hyphens or underscores; ';
      msg += 'must start and end with an alphanumeric character';
      checks.groupIds.message = msg;
    }
  });

  _.each(checks, (item) => {
    if (item.valid === false) {
      valid = false;
    }
  });

  return valid;
}
