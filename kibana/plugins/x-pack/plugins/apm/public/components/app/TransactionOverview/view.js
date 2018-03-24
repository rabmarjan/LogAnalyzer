import React, { Component } from 'react';
import withErrorHandler from '../../shared/withErrorHandler';
import { PageHeader, SectionHeader } from '../../shared/UIComponents';
import TabNavigation from '../../shared/TabNavigation';
import Charts from './Charts';
import List from './List';

function loadTransactionList(props) {
  const { serviceName, start, end, transactionType } = props.urlParams;

  if (
    serviceName &&
    start &&
    end &&
    transactionType &&
    !props.transactionList.status
  ) {
    props.loadTransactionList({ serviceName, start, end, transactionType });
  }
}

export class TransactionOverview extends Component {
  componentDidMount() {
    loadTransactionList(this.props);
  }

  componentWillReceiveProps(nextProps) {
    loadTransactionList(nextProps);
  }

  render() {
    const { serviceName, transactionType } = this.props.urlParams;
    const { changeTransactionSorting, transactionSorting } = this.props;
    return (
      <div>
        <PageHeader>{serviceName}</PageHeader>
        <TabNavigation />
        <Charts />
        <SectionHeader>{transactionTypeLabel(transactionType)}</SectionHeader>
        <List
          serviceName={serviceName}
          type={transactionType}
          items={this.props.transactionList.data}
          changeTransactionSorting={changeTransactionSorting}
          transactionSorting={transactionSorting}
        />
      </div>
    );
  }
}

function transactionTypeLabel(type) {
  return type === 'request' ? 'Request' : type;
}

export default withErrorHandler(TransactionOverview, ['transactionList']);
