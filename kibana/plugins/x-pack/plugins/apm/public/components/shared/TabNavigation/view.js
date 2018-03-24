import React from 'react';
import { TabLink } from '../UIComponents';
import styled from 'styled-components';
import withService from '../withService';
import {
  unit,
  units,
  px,
  colors,
  fontSizes,
  truncate
} from '../../../style/variables';
import { isEmpty } from 'lodash';

import LabelTooltip from '../../shared/LabelTooltip';

const Container = styled.div`
  display: flex;
  box-shadow: 0 1px 0 ${colors.gray4};
  margin: 0 0 ${px(units.double)} 0;
`;

const Divider = styled.div`
  border-left: 1px solid ${colors.gray4};
  height: ${px(units.double)};
  margin: ${px(units.half + units.eighth)} ${px(unit)} ${px(units.half)};
  display: inline-block;
  vertical-align: middle;
`;

const EmptyMessage = styled.div`
  display: inline-block;
  font-size: ${fontSizes.large};
  color: ${colors.gray3};
  padding: ${px(unit)} ${px(unit + units.quarter)};
  border-bottom: 2px solid transparent;
`;

const NavLink = styled(TabLink)`
  ${truncate(px(units.half * 27))};
`;

function transactionTypeLabel(type) {
  return type === 'request' ? 'Request' : type;
}

function TabNavigation({ urlParams, location, service }) {
  const { serviceName, transactionType } = urlParams;
  const errorsSelected = location.pathname.includes('/errors');
  const { types } = service.data;

  return (
    <Container>
      {types.map(type => {
        const label = transactionTypeLabel(type);
        return (
          <LabelTooltip
            text={
              <span>
                Transaction type:<br />
                {label}
              </span>
            }
            key={type}
          >
            <NavLink
              path={`${serviceName}/transactions/${encodeURIComponent(type)}`}
              selected={transactionType === type && !errorsSelected}
            >
              {label}
            </NavLink>
          </LabelTooltip>
        );
      })}
      {isEmpty(types) && <EmptyMessage>No transactions available</EmptyMessage>}
      <Divider />
      <TabLink path={`${serviceName}/errors`} selected={errorsSelected}>
        Errors
      </TabLink>
    </Container>
  );
}

export default withService(TabNavigation);
