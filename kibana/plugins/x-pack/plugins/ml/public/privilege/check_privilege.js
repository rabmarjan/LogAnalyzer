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

import { privilegesProvider } from 'plugins/ml/privilege/get_privileges';

export function checkGetJobsPrivilege(Private, Promise, kbnUrl) {
  const mlPrivilegeService = Private(privilegesProvider);

  return new Promise((resolve, reject) => {
    mlPrivilegeService.getPrivileges()
      .then((privileges) => {
      // the minimum privilege for using ML is being able to get the jobs list.
      // all other functionality is controlled by the return privileges object
        if (privileges.canGetJobs) {
          return resolve(privileges);
        } else {
          kbnUrl.redirect('/access-denied');
          return reject();
        }
      });
  });
}

export function checkCreateJobsPrivilege(Private, Promise, kbnUrl) {
  const mlPrivilegeService = Private(privilegesProvider);

  return new Promise((resolve, reject) => {
    mlPrivilegeService.getPrivileges()
      .then((privileges) => {
        if (privileges.canCreateJob) {
          return resolve(privileges);
        } else {
        // if the user has no permission to create a job,
        // redirect them back to the Jobs Management page
          kbnUrl.redirect('/jobs');
          return reject();
        }
      });
  });
}
