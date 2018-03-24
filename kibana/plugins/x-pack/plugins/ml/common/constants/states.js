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


export const DATAFEED_STATE = {
  STARTED: 'started',
  STARTING: 'starting',
  STOPPED: 'stopped',
  STOPPING: 'stopping'
};

export const FORECAST_REQUEST_STATE = {
  FAILED: 'failed',
  FINISHED: 'finished',
  SCHEDULED: 'scheduled',
  STARTED: 'started',
  STOPPED: 'stopped'
};

export const JOB_STATE = {
  CLOSED: 'closed',
  CLOSING: 'closing',
  FAILED: 'failed',
  OPENED: 'opened',
  OPENING: 'opening'
};
