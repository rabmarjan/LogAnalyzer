import React from 'react';
import styled from 'styled-components';
import { RelativeLink } from '../../../../utils/url';
import { KuiTableRow, KuiTableRowCell } from 'ui_framework/components';
import { fontSizes, truncate } from '../../../../style/variables';
import LabelTooltip from '../../../shared/LabelTooltip';
import { RIGHT_ALIGNMENT } from '@elastic/eui';
import { asMillisWithDefault } from '../../../../utils/formatters';
import numeral from '@elastic/numeral';

const ServiceNameCell = styled(KuiTableRowCell)`
  width: 40%;
`;

const ServiceCell = styled(KuiTableRowCell)`
  width: 15%;
`;

const AppLink = styled(RelativeLink)`
  font-size: ${fontSizes.large};
  ${truncate('100%')};
`;

function formatString(value) {
  return value || 'N/A';
}

function formatNumber(value) {
  if (value === 0) {
    return '0';
  }
  const formatted = numeral(value).format('0.0');
  return formatted <= 0.1 ? '< 0.1' : formatted;
}

function ListItem({ service }) {
  const {
    serviceName,
    agentName,
    transactionsPerMinute,
    errorsPerMinute,
    avgResponseTime
  } = service;

  return (
    <KuiTableRow>
      <ServiceNameCell>
        <LabelTooltip text={formatString(serviceName)}>
          <AppLink path={`${serviceName}/transactions`}>
            {formatString(serviceName)}
          </AppLink>
        </LabelTooltip>
      </ServiceNameCell>
      <ServiceCell>{formatString(agentName)}</ServiceCell>
      <ServiceCell align={RIGHT_ALIGNMENT}>
        {asMillisWithDefault(avgResponseTime)}
      </ServiceCell>
      <ServiceCell align={RIGHT_ALIGNMENT}>
        {formatNumber(transactionsPerMinute)} tpm
      </ServiceCell>
      <ServiceCell align={RIGHT_ALIGNMENT}>
        {formatNumber(errorsPerMinute)} err.
      </ServiceCell>
    </KuiTableRow>
  );
}

export default ListItem;
