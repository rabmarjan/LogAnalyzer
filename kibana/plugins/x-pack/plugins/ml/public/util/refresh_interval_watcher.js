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

/*
 * Watches for changes to the refresh interval of the page time filter,
 * so that listeners can be notified when the auto-refresh interval has elapsed.
 */

export function refreshIntervalWatcher($rootScope, $timeout) {

  let refresher;

  function init(listener) {

    $rootScope.$watchCollection('timefilter.refreshInterval', (interval) => {
      if (refresher) {
        $timeout.cancel(refresher);
      }
      if (interval.value > 0 && !interval.pause) {
        function startRefresh() {
          refresher = $timeout(() => {
            startRefresh();
            listener();
          }, interval.value);
        }
        startRefresh();
      }
    });
  }

  function cancel() {
    $timeout.cancel(refresher);
  }

  return {
    init,
    cancel
  };
}
