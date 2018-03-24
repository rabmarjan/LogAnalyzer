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
import { capitalize, find, get, includes } from 'lodash';

export function decorateShards(shards, nodes) {
  function getTooltipMessage(shard) {
    const isRelocating = (node) => includes(node.node_ids, shard.relocating_node);
    const nodeName = get(find(nodes, (n) => isRelocating(n)), 'name');

    // messages for relocating node
    if (nodeName) {
      if (shard.state === 'INITIALIZING') {
        return `Relocating from ${nodeName}`;
      }
      if (shard.state === 'RELOCATING') {
        return `Relocating to ${nodeName}`;
      }
    }
    return capitalize(shard.state.toLowerCase());
  }

  return shards.map((shard) => {
    const node = nodes[shard.resolver];
    shard.nodeName = (node && node.name) || null;
    shard.type = 'shard';
    shard.tooltip_message = getTooltipMessage(shard);
    return shard;
  });
}
