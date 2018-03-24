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

import { get, sortBy } from 'lodash';
import React from 'react';
import { Shard } from './shard';
import { calculateClass } from '../lib/calculateClass';
import { generateQueryAndLink } from '../lib/generateQueryAndLink';
import { KuiKeyboardAccessible } from 'ui_framework/components';

function sortByName(item) {
  if (item.type === 'node') {
    return [ !item.master, item.name];
  }
  return [ item.name ];
}

export class Assigned extends React.Component {
  createShard = (shard) => {
    const type = shard.primary ? 'primary' : 'replica';
    const key = `${shard.index}.${shard.node}.${type}.${shard.state}.${shard.shard}`;
    return (
      <Shard shard={shard} key={key}/>
    );
  };

  createChild = (data) => {
    const key = data.id;
    const initialClasses = ['child'];
    const shardStats = get(this.props.shardStats.indices, key);
    if (shardStats) {
      initialClasses.push(shardStats.status);
    }

    const changeUrl = () => {
      this.props.changeUrl(generateQueryAndLink(data));
    };

    // TODO: redesign for shard allocation, possibly giving shard display the
    // ability to use the kuiLink CSS class (blue link text instead of white link text)
    const name = (
      <KuiKeyboardAccessible>
        <a onClick={changeUrl}>
          <span>{data.name}</span>
        </a>
      </KuiKeyboardAccessible>
    );
    const master = (data.node_type === 'master') ? <span className="fa fa-star" /> : null;
    const shards = sortBy(data.children, 'shard').map(this.createShard);
    return (
      <div
        className={calculateClass(data, initialClasses.join(' '))}
        key={key}
        data-test-subj={`clusterView-Assigned-${key}`}
        data-status={shardStats && shardStats.status}
      >
        <div className="title">{name}{master}</div>
        {shards}
      </div>
    );
  };

  render() {
    const data = sortBy(this.props.data, sortByName).map(this.createChild);
    return (
      <td>
        <div className="children">
          {data}
        </div>
      </td>
    );
  }
}
