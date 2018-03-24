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
import { hasPrimaryChildren } from '../lib/hasPrimaryChildren';
import { decorateShards } from '../lib/decorateShards';

export function nodesByIndices() {
  return function nodesByIndicesFn(shards, nodes) {

    const getNodeType = function (node) {
      const attrs = node.attributes || {};
      return attrs.master === 'true' ? 'master' : 'normal';
    };

    // NOTE: this seems to be used, but has no discrenable effect in the UI
    function createNode(obj, node, id) {
      node.type = 'node';
      node.children = [];
      const nodeType = getNodeType(node);
      if (nodeType === 'normal' || nodeType === 'data') {
        obj[id] = node;
      }
      return obj;
    }

    function createIndexAddShard(obj, shard) {
      const node = shard.resolver || 'unassigned';
      const index = shard.index;
      if (!obj[node]) {
        createNode(obj, nodes[node], node);
      }
      let indexObj = _.find(obj[node].children, { id: index });
      if (!indexObj) {
        indexObj = {
          id: index,
          name: index,
          type: 'index',
          children: []
        };
        obj[node].children.push(indexObj);
      }
      indexObj.children.push(shard);
      return obj;
    }

    function isUnassigned(shard) {
      return shard.state === 'UNASSIGNED';
    }

    let data = {};
    if (_.some(shards, isUnassigned)) {
      data.unassigned = {
        name: 'Unassigned',
        master: false,
        type: 'node',
        children: []
      };
    }

    data = _.reduce(decorateShards(shards, nodes), createIndexAddShard, data);

    return _(data)
      .values()
      .sortBy(function (node) {
        return [ node.name !== 'Unassigned', !node.master, node.name ];
      })
      .map(function (node) {
        if (node.name === 'Unassigned') {
          node.unassignedPrimaries = node.children.some(hasPrimaryChildren);
        }
        return node;
      })
      .value();
  };
}
