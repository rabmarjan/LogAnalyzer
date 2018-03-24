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

// calculates the size of the model memory limit used in the job config
// based on the cardinality of the field being used to split the data.
// the limit should be 10MB plus 20kB per series, rounded up to the nearest MB.
import { FieldsServiceProvider } from 'plugins/ml/services/fields_service';

export function CalculateModelMemoryLimitProvider(Private) {
  const fieldsService = Private(FieldsServiceProvider);

  return function calculateModelMemoryLimit(
    indexPattern,
    splitFieldName,
    query,
    fieldNames,
    influencerNames,
    timeFieldName,
    earliestMs,
    latestMs) {
    return new Promise((response, reject) => {

      // find the cardinality of the split field
      function splitFieldCardinality() {
        return fieldsService.getCardinalityOfFields(
          indexPattern,
          [],
          [splitFieldName],
          query,
          timeFieldName,
          earliestMs,
          latestMs
        );
      }

      // find the cardinality of an influencer field
      function influencerCardinality(influencerName) {
        return fieldsService.getCardinalityOfFields(
          indexPattern,
          [],
          [influencerName],
          query,
          timeFieldName,
          earliestMs,
          latestMs
        );
      }

      const calculations = [
        splitFieldCardinality(),
        ...(influencerNames.map(inf => influencerCardinality(inf)))
      ];

      Promise.all(calculations).then((responses) => {
        let mmlMB = 0;
        const MB = 1000;
        responses.forEach((resp, i) => {
          let mmlKB = 0;
          if (i === 0) {
            // first in the list is the basic calculation.
            // a base of 10MB plus 32KB per series per detector
            // i.e. 10000KB + (32KB * cardinality of split field * number or detectors)
            const cardinality = resp[splitFieldName];
            mmlKB = 10000;
            const SERIES_MULTIPLIER = 32;
            const numberOfFields = fieldNames.length;

            if (cardinality !== undefined) {
              mmlKB += ((SERIES_MULTIPLIER * cardinality) * numberOfFields);
            }

          } else {
            // the rest of the calculations are for influencers fields
            // 10KB per series of influencer field
            // i.e. 10KB * cardinality of influencer field
            const cardinality = resp[splitFieldName];
            mmlKB = 0;
            const SERIES_MULTIPLIER = 10;
            if (cardinality !== undefined) {
              mmlKB = (SERIES_MULTIPLIER * cardinality);
            }
          }
          // convert the total to MB, rounding up.
          mmlMB += Math.ceil(mmlKB / MB);
        });

        response(`${mmlMB}MB`);
      })
        .catch((error) => {
          reject(error);
        });
    });
  };

}
