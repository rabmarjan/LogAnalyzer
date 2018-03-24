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

import { ML_JOB_FIELD_TYPES } from 'plugins/ml/../common/constants/field_types';
import { EVENT_RATE_COUNT_FIELD } from 'plugins/ml/jobs/new_job/simple/components/constants/general';

import { uiModules } from 'ui/modules';
const module = uiModules.get('apps/ml');

module.filter('filterAggTypes', function () {
  return (aggTypes, field) => {
    return aggTypes.filter(type => {
      if (field.id === EVENT_RATE_COUNT_FIELD) {
        if(type.isCountType) {
          return true;
        }
      } else {
        if(!type.isCountType) {
          if (field.mlType === ML_JOB_FIELD_TYPES.KEYWORD || field.mlType === ML_JOB_FIELD_TYPES.IP) {
            // keywords and ips can't have the full list of aggregations.
            // currently limited to Distinct count only
            if (type.isAggregatableStringType) {
              return true;
            }
          } else {
            return true;
          }
        }
      }
      return false;
    });
  };
});
