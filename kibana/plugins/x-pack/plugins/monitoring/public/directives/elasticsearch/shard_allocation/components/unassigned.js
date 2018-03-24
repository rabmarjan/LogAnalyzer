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
import React from 'react';
import { Shard } from './shard';

export class Unassigned extends React.Component {
  static displayName = 'Unassigned';

  createShard = (shard) => {
    const type = shard.primary ? 'primary' : 'replica';
    const additionId = shard.state === 'UNASSIGNED' ? Math.random() : '';
    const key = shard.index + '.' + shard.node + '.' + type + '.' + shard.state + '.' + shard.shard + additionId;
    return (<Shard shard={shard} key={key} />);
  };

  render() {
    const shards = _.sortBy(this.props.shards, 'shard').map(this.createShard);
    return (
      <td className="unassigned" data-test-subj="clusterView-Unassigned">
        <div className="children">{shards}</div>
      </td>
    );
  }
}
