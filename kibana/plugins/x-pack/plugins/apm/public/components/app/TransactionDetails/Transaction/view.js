import React, { Component } from 'react';
import styled from 'styled-components';
import { STATUS } from '../../../../constants';
import { units, colors, px, borderRadius } from '../../../../style/variables';
import { Tab, SectionHeader } from '../../../shared/UIComponents';
import { isEmpty, capitalize, get } from 'lodash';

import { ContextProperties } from '../../../shared/ContextProperties';
import {
  PropertiesTable,
  getLevelOneProps
} from '../../../shared/PropertiesTable';
import Spans from './Spans';
import DiscoverButton from '../../../shared/DiscoverButton';
import {
  TRANSACTION_ID,
  PROCESSOR_EVENT,
  SERVICE_AGENT_NAME
} from '../../../../../common/constants';
import { fromQuery, toQuery } from '../../../../utils/url';
import { withRouter } from 'react-router-dom';
import { asTime } from '../../../../utils/formatters';
import EmptyMessage from '../../../shared/EmptyMessage';

function loadTransaction(props) {
  const { serviceName, start, end, transactionId } = props.urlParams;
  if (
    serviceName &&
    start &&
    end &&
    transactionId &&
    !props.transactionNext.status
  ) {
    props.loadTransaction({ serviceName, start, end, transactionId });
  }
}

const Container = styled.div`
  position: relative;
  border: 1px solid ${colors.gray4};
  border-radius: ${borderRadius};
  margin-top: ${px(units.plus)};
`;

const TabContainer = styled.div`
  padding: 0 ${px(units.plus)};
  border-bottom: 1px solid ${colors.gray4};
`;

const TabContentContainer = styled.div`
  border-radius: 0 0 ${borderRadius} ${borderRadius};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  padding: ${px(units.plus)} ${px(units.plus)} 0;
`;

const Title = styled(SectionHeader)`
  margin-top: ${px(units.quarter)};
`;

const PropertiesTableContainer = styled.div`
  padding: ${px(units.plus)} ${px(units.plus)} 0;
`;

const DEFAULT_TAB = 'timeline';

// Ensure the selected tab exists or use the default
function getCurrentTab(tabs = [], detailTab) {
  return tabs.includes(detailTab) ? detailTab : DEFAULT_TAB;
}

function getTabs(transactionData) {
  const dynamicProps = Object.keys(transactionData.context || {});
  return getLevelOneProps(dynamicProps);
}

class Transaction extends Component {
  componentDidMount() {
    loadTransaction(this.props);
  }

  componentWillReceiveProps(nextProps) {
    loadTransaction(nextProps);
  }

  render() {
    const { transaction, history, location } = this.props;
    const { transactionId } = this.props.urlParams;

    if (transaction.status !== STATUS.SUCCESS) {
      return null;
    }

    if (isEmpty(transaction.data)) {
      return <EmptyMessage heading="No transaction sample." />;
    }

    const timestamp = get(transaction, 'data.@timestamp');
    const url = get(transaction.data, 'context.request.url.full', 'N/A');

    const stickyProperties = [
      {
        name: 'Duration',
        fieldName: 'transaction.duration.us',
        val: (() => {
          const duration = get(transaction.data, 'transaction.duration.us');
          return duration ? asTime(duration) : 'N/A';
        })()
      },
      {
        name: 'Result',
        fieldName: 'transaction.result',
        val: get(transaction.data, 'transaction.result', 'N/A')
      },
      {
        name: 'User ID',
        fieldName: 'context.user.id',
        val: get(transaction.data, 'context.user.id', 'N/A')
      }
    ];

    const agentName = get(transaction.data, SERVICE_AGENT_NAME);

    const tabs = getTabs(transaction.data);
    const currentTab = getCurrentTab(tabs, this.props.urlParams.detailTab);

    const discoverQuery = {
      _a: {
        interval: 'auto',
        query: {
          language: 'lucene',
          query: `${PROCESSOR_EVENT}:transaction AND ${TRANSACTION_ID}:${transactionId}`
        },
        sort: { '@timestamp': 'desc' }
      }
    };

    return (
      <Container>
        <Header>
          <Title>Transaction sample</Title>
          <DiscoverButton query={discoverQuery}>
            {`View transaction in Discover`}
          </DiscoverButton>
        </Header>

        <ContextProperties
          timestamp={timestamp}
          url={url}
          stickyProperties={stickyProperties}
        />

        <TabContainer>
          {[DEFAULT_TAB, ...tabs].map(key => {
            return (
              <Tab
                onClick={() => {
                  history.replace({
                    ...location,
                    search: fromQuery({
                      ...toQuery(location.search),
                      detailTab: key
                    })
                  });
                }}
                selected={currentTab === key}
                key={key}
              >
                {capitalize(key)}
              </Tab>
            );
          })}
        </TabContainer>

        <TabContentContainer>
          {currentTab === DEFAULT_TAB ? (
            <Spans
              agentName={agentName}
              droppedSpans={get(
                transaction.data,
                'transaction.spanCount.dropped.total',
                0
              )}
            />
          ) : (
            <PropertiesTableContainer>
              <PropertiesTable
                propData={get(transaction.data.context, currentTab)}
                propKey={currentTab}
                agentName={agentName}
              />
            </PropertiesTableContainer>
          )}
        </TabContentContainer>
      </Container>
    );
  }
}

export default withRouter(Transaction);
