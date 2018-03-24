import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import withErrorHandler from '../../shared/withErrorHandler';
import { STATUS } from '../../../constants';
import { isEmpty } from 'lodash';
import { loadAgentStatus } from '../../../services/rest';
import { RelativeLink } from '../../../utils/url';

import styled from 'styled-components';
import { px, units } from '../../../style/variables';
import { KuiButton } from 'ui_framework/components';
import List from './List';
import { PageHeader } from '../../shared/UIComponents';

function fetchData(props) {
  const { start, end } = props.urlParams;
  if (start && end && !props.serviceList.status) {
    props.loadServiceList({ start, end });
  }
}

function redirectIfNoData({ serviceList, history }) {
  if (serviceList.status === STATUS.SUCCESS && isEmpty(serviceList.data)) {
    loadAgentStatus().then(result => {
      if (!result.dataFound) {
        history.push({
          pathname: '/setup-instructions'
        });
      }
    });
  }
}

const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

const SetupInstructionsLink = styled(RelativeLink)`
  margin-top: ${px(units.minus)};
`;

class ServiceOverview extends Component {
  componentDidMount() {
    fetchData(this.props);
    redirectIfNoData(this.props);
  }

  componentWillReceiveProps(nextProps) {
    fetchData(nextProps);
    redirectIfNoData(nextProps);
  }

  render() {
    const { serviceList, changeServiceSorting, serviceSorting } = this.props;

    return (
      <div>
        <HeaderWrapper>
          <PageHeader>Services</PageHeader>
          <SetupInstructionsLink path="/setup-instructions">
            <KuiButton buttonType="secondary">Setup Instructions</KuiButton>
          </SetupInstructionsLink>
        </HeaderWrapper>

        <List
          items={serviceList.data}
          changeServiceSorting={changeServiceSorting}
          serviceSorting={serviceSorting}
        />
      </div>
    );
  }
}

export default withErrorHandler(withRouter(ServiceOverview), ['serviceList']);
