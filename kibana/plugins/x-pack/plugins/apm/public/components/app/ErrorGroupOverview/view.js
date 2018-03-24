import React, { Component } from 'react';
import withErrorHandler from '../../shared/withErrorHandler';
import { PageHeader } from '../../shared/UIComponents';
import TabNavigation from '../../shared/TabNavigation';
import List from './List';

function maybeLoadList(props) {
  const { serviceName, start, end } = props.listArgs;

  if (serviceName && start && end && !props.errorGroupList.status) {
    props.loadErrorGroupList(props.listArgs);
  }
}

class ErrorGroupOverview extends Component {
  componentDidMount() {
    maybeLoadList(this.props);
  }

  componentWillReceiveProps(nextProps) {
    maybeLoadList(nextProps);
  }

  render() {
    const { serviceName } = this.props.urlParams;

    return (
      <div>
        <PageHeader>{serviceName}</PageHeader>
        <TabNavigation />

        <List
          urlParams={this.props.urlParams}
          items={this.props.errorGroupList.data}
        />
      </div>
    );
  }
}

export default withErrorHandler(ErrorGroupOverview, ['errorGroupList']);
