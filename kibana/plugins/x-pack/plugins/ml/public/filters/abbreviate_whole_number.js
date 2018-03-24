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
 * AngularJS filter to abbreviate large whole numbers with metric prefixes.
 * Uses numeral.js to format numbers longer than the specified number of
 * digits with metric abbreviations e.g. 12345 as 12k, or 98000000 as 98m.
*/
import numeral from 'numeral';

import { uiModules } from 'ui/modules';
const module = uiModules.get('apps/ml');

module.filter('abbreviateWholeNumber', function () {
  return function (value, maxDigits) {
    const maxNumDigits = (maxDigits !== undefined ? maxDigits : 3);
    if (Math.abs(value) < Math.pow(10, maxNumDigits)) {
      return value;
    } else {
      return numeral(value).format('0a');
    }
  };
});

