/**
 * ELASTICSEARCH CONFIDENTIAL
 * _____________________________
 *
 *  [2014] Elasticsearch Incorporated All Rights Reserved.
 *
 * NOTICE:  All information contained herein is, and remains
 * the property of Elasticsearch Incorporated and its suppliers,
 * if any.  The intellectual and technical concepts contained
 * herein are proprietary to Elasticsearch Incorporated
 * and its suppliers and may be covered by U.S. and Foreign Patents,
 * patents in process, and are protected by trade secret or copyright law.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Elasticsearch Incorporated.
 */

import _ from 'lodash';

export const _vents = {};
export const vents = {
  vents: _vents,
  on: function (id, cb) {
    if (!_.isArray(_vents[id])) {
      _vents[id] = [];
    }
    _vents[id].push(cb);
  },
  clear: function (id) {
    delete _vents[id];
  },
  trigger: function () {
    const args = Array.prototype.slice.call(arguments);
    const id = args.shift();
    if (_vents[id]) {
      _.each(_vents[id], function (cb) {
        cb.apply(null, args);
      });
    }
  }
};