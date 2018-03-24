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


import { parseInterval } from 'ui/utils/parse_interval';

// ensure the displayed interval is never smaller than the bucketSpan
// otherwise the model plot bounds can be drawn in the wrong place.
// this only really affects small jobs when using sum
export function adjustIntervalDisplayed(formConfig) {
  let makeTheSame = false;
  const intervalSeconds = formConfig.chartInterval.getInterval().asSeconds();
  const bucketSpan = parseInterval(formConfig.bucketSpan);

  if (bucketSpan !== null) {
    if (bucketSpan.asSeconds() > intervalSeconds) {
      makeTheSame = true;
    }

    if (formConfig.agg.type !== undefined) {
      const mlName = formConfig.agg.type.mlName;
      if (mlName === 'count' ||
      mlName === 'low_count' ||
      mlName === 'high_count' ||
      mlName === 'distinct_count') {
        makeTheSame = true;
      }
    }

    if (makeTheSame) {
      formConfig.chartInterval.setInterval(formConfig.bucketSpan);
    }
  }
}
