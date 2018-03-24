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

import React from 'react';
import { Unassigned } from './unassigned';
import { Assigned } from './assigned';

const ShardRow = props => {
  let unassigned;
  if (props.data.unassigned && props.data.unassigned.length) {
    unassigned = (
      <Unassigned shards={props.data.unassigned}/>
    );
  } else {
    if (props.cols === 3) {
      unassigned = (<td />);
    }
  }
  return (
    <tr>
      { unassigned }
      <Assigned
        shardStats={props.shardStats}
        data={props.data.children}
        changeUrl={props.changeUrl}
      />
    </tr>
  );
};

export class TableBody extends React.Component {
  static displayName = 'TableBody';

  createRow = (data, index) => {
    return (
      <ShardRow
        key={`shardRow-${index}`}
        data={data}
        {...this.props}
        changeUrl={this.props.changeUrl}
      />
    );
  };

  render() {
    if (this.props.totalCount === 0) {
      return (
        <tbody>
          <tr>
            <td colSpan={this.props.cols}>
              <div>
                <p style={{ margin: '10px 0' }} className="text-center lead">
                  There are no shards allocated.
                </p>
              </div>
            </td>
          </tr>
        </tbody>
      );
    }

    if (this.props.shardStats) {
      if (this.props.rows.length) {
        return (
          <tbody>
            { this.props.rows.map(this.createRow) }
          </tbody>
        );
      }
    }

    return (
      <tbody>
        <tr>
          <td colSpan={this.props.cols} />
        </tr>
      </tbody>
    );

  }
}
