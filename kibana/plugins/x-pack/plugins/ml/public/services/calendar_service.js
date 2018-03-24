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

import { uiModules } from 'ui/modules';
const module = uiModules.get('apps/ml');

module.service('mlCalendarService', function ($q, ml, mlJobService, mlMessageBarService) {
  const msgs = mlMessageBarService;
  this.calendars = [];
  // list of calendar ids per job id
  this.jobCalendars = {};

  this.loadCalendars = function (jobs) {
    return $q((resolve, reject) => {
      let calendars = [];
      jobs.forEach((j) => {
        this.jobCalendars[j.job_id] = [];
      });
      const groups = {};
      mlJobService.getJobGroups().forEach((g) => {
        groups[g.id] = g;
      });

      ml.calendars()
        .then((resp) => {
          calendars = resp;
          // loop through calendars and their job_ids and create jobCalendars
          // if a group is found, expand it out to its member jobs
          calendars.forEach((cal) => {
            cal.job_ids.forEach((id) => {
            // the job_id could be either a job id or a group id
              if (this.jobCalendars[id] !== undefined) {
                this.jobCalendars[id].push(cal.calendar_id);
              } else if (groups[id] !== undefined) {
              // expand out the group into its jobs and add each job
                groups[id].jobs.forEach((j) => {
                  this.jobCalendars[j.job_id].push(cal.calendar_id);
                });
              }
            });
          });

          // deduplicate as group expansion may have added dupes.
          _.each(this.jobCalendars, (cal, id) => {
            this.jobCalendars[id] = _.uniq(cal);
          });

          this.calendars = calendars;
          resolve({ calendars });
        })
        .catch((err) => {
          msgs.error('Calendars list could not be retrieved');
          msgs.error('', err);
          reject({ calendars, err });
        });
    });
  };
});
