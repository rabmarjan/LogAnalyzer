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

export function preConfiguredJobRedirect(Promise, $location, AppState) {
  return new Promise((resolve, reject) => {

    const stateDefaults = {
      mlJobSettings: {}
    };
    const appState = new AppState(stateDefaults);

    const redirectUrl = getRedirectUrl(appState);
    if (redirectUrl === null) {
      return resolve();
    } else {
      $location.path(redirectUrl);
      return reject();
    }
  });
}

function getRedirectUrl(appState) {
  if (appState.mlJobSettings !== undefined && Object.keys(appState.mlJobSettings).length) {
    let page = '';
    const jobSettings = appState.mlJobSettings;
    if (jobSettings.fields && jobSettings.fields.length) {
      if (jobSettings.fields.length > 1 || jobSettings.split !== undefined) {
        // multi-metric or population
        if (jobSettings.population !== undefined) {
          page = 'population';
        } else {
          page = 'multi_metric';
        }
      } else {
        // single metric
        page = 'single_metric';
      }
    }
    return `jobs/new_job/simple/${page}`;
  } else {
    return null;
  }
}
