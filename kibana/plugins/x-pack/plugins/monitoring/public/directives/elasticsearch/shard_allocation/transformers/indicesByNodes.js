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
import { decorateShards } from '../lib/decorateShards';

export function indicesByNodes() {
  return function indicesByNodesFn(shards, nodes) {

    function createIndex(obj, shard) {
      const id = shard.index;
      if (obj[id]) {
        return obj;
      }
      obj[id] = {
        id: id,
        name: id,
        children: [],
        unassigned: [],
        unassignedPrimaries: false,
        type: 'index'
      };
      return obj;
    }

    function createNodeAddShard(obj, shard) {
      const node = shard.resolver;
      const index = shard.index;

      // If the node is null then it's an unassigned shard and we need to
      // add it to the unassigned array.
      if (shard.node === null) {
        obj[index].unassigned.push(shard);
        // if the shard is a primary we need to set the unassignedPrimaries flag
        if (shard.primary) {
          obj[index].unassignedPrimaries = true;
        }
        return obj;
      }

      let nodeObj = _.find(obj[index].children, { id: node });
      if (!nodeObj) {
        nodeObj = {
          id: node,
          type: 'node',
          name: nodes[node].name,
          node_type: nodes[node].type,
          ip_port: nodes[node].transport_address,
          children: []
        };
        obj[index].children.push(nodeObj);
      }
      nodeObj.children.push(shard);
      return obj;
    }

    const data = _.reduce(decorateShards(shards, nodes), function (obj, shard) {
      obj = createIndex(obj, shard);
      obj = createNodeAddShard(obj, shard);
      return obj;
    }, {});

    return _(data)
      .values()
      .sortBy(index => [ !index.unassignedPrimaries, /^\./.test(index.name), index.name ])
      .value();
  };
}

