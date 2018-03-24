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

class IndexLabel extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      showSystemIndices: props.scope.showSystemIndices
    };
    this.toggleShowSystemIndicesState = this.toggleShowSystemIndicesState.bind(this);
  }

  // See also public/directives/index_listing/index
  toggleShowSystemIndicesState(e) {
    const isChecked = e.target.checked;
    this.setState({ showSystemIndices: isChecked });
    this.props.scope.$evalAsync(() => {
      this.props.toggleShowSystemIndices(isChecked);
    });
  }

  render() {
    return (
      <div className="pull-left filter-member">
        Indices

        <label className="kuiCheckBoxLabel">
          <input
            onChange={this.toggleShowSystemIndicesState}
            checked={this.state.showSystemIndices}
            className="kuiCheckBox"
            data-test-subj="shardShowSystemIndices"
            type="checkbox"
          />
          <span className="kuiCheckBoxLabel__text">
            Show system indices
          </span>
        </label>
      </div>
    );
  }

}

export class TableHead extends React.Component { // eslint-disable-line react/no-multi-comp

  constructor(props) {
    super(props);
  }

  createColumn({ key, content }) {
    return (
      <th scope="col" key={key} colSpan={1}>{ content }</th>
    );
  }

  render() {
    const propLabels = this.props.scope.labels || [];
    const labelColumns = propLabels.map((label) => {
      const column = {
        key: label.content.toLowerCase()
      };

      if (label.showToggleSystemIndicesComponent) {
        // override text label content with a JSX component
        column.content = (
          <IndexLabel scope={this.props.scope} toggleShowSystemIndices={this.props.toggleShowSystemIndices} />
        );
      } else {
        column.content = label.content;
      }

      return column;
    })
      .map(this.createColumn);


    return (
      <thead>
        <tr>{ labelColumns }</tr>
      </thead>
    );
  }

}
