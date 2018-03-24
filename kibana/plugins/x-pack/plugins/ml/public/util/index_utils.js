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

import { notify } from 'ui/notify';
import { SavedObjectsClientProvider } from 'ui/saved_objects';

export function getIndexPatterns(Private) {
  const savedObjectsClient = Private(SavedObjectsClientProvider);
  return savedObjectsClient.find({
    type: 'index-pattern',
    fields: ['title'],
    perPage: 10000
  }).then(response => response.savedObjects);
}

export function getIndexPattern(courier, $route) {
  return courier.indexPatterns.get($route.current.params.index);
}

export function getSavedSearch(courier, $route, savedSearches) {
  return savedSearches.get($route.current.params.savedSearchId);
}

// returns true if the index passed in is time based
// an optional flag will trigger the display a notification at the top of the page
// warning that the index is not time based
export function timeBasedIndexCheck(indexPattern, showNotification = false) {
  if (indexPattern.isTimeBased() === false) {
    if (showNotification) {
      const message = `The index pattern ${indexPattern.title} is not time series based. \
        Anomaly detection can only be run over indices which are time based.`;
      notify.warning(message, { lifetime: 0 });
    }
    return false;
  } else {
    return true;
  }
}
