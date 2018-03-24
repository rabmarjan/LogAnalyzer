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

//  Calendar ID requires the same format as a Job ID, therefore isJobIdValid can be used

import { isJobIdValid } from 'plugins/ml/../common/util/job_utils';
import _ from 'lodash';

export function validateCalendarId(calendarId, checks) {
  let valid = true;

  _.each(checks, item => item.valid = true);

  if (calendarId === '' || calendarId === undefined) {
    checks.calendarId.valid = false;
  } else if (isJobIdValid(calendarId) === false) {
    checks.calendarId.valid = false;
    let msg = 'Calendar ID can contain lowercase alphanumeric (a-z and 0-9), hyphens or underscores; ';
    msg += 'must start and end with an alphanumeric character';
    checks.calendarId.message = msg;
  }

  _.each(checks, (item) => {
    if (item.valid === false) {
      valid = false;
    }
  });

  return valid;
}
