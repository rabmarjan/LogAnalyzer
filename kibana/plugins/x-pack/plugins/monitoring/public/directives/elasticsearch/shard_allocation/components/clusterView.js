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
import { TableHead } from './tableHead';
import { TableBody } from './tableBody';

export class ClusterView extends React.Component {
  static displayName = 'ClusterView';

  constructor(props) {
    super(props);
    const scope = props.scope;
    const kbnChangePath = props.kbnUrl.changePath;

    this.state = {
      labels: props.scope.labels || [],
      showing: props.scope.showing || [],
      shardStats: props.shardStats,
      showSystemIndices: props.showSystemIndices,
      toggleShowSystemIndices: props.toggleShowSystemIndices,
      angularChangeUrl: (url) => {
        scope.$evalAsync(() => kbnChangePath(url));
      }
    };
  }

  setShowing = (data) => {
    if (data) {
      this.setState({ showing: data });
    }
  };

  setShardStats = (stats) => {
    this.setState({ shardStats: stats });
  };

  componentWillMount() {
    this.props.scope.$watch('showing', this.setShowing);
    this.props.scope.$watch('shardStats', this.setShardStats);
  }

  hasUnassigned = () => {
    return this.state.showing.length &&
      this.state.showing[0].unassigned &&
      this.state.showing[0].unassigned.length;
  };

  render() {
    return (
      <table cellPadding="0" cellSpacing="0" className="table">
        <TableHead
          hasUnassigned={this.hasUnassigned()}
          scope={this.props.scope}
          toggleShowSystemIndices={this.state.toggleShowSystemIndices}
        />
        <TableBody
          filter={this.props.scope.filter}
          totalCount={this.props.scope.totalCount}
          rows={this.state.showing}
          cols={this.state.labels.length}
          shardStats={this.state.shardStats}
          changeUrl={this.state.angularChangeUrl}
        />
      </table>
    );
  }
}
