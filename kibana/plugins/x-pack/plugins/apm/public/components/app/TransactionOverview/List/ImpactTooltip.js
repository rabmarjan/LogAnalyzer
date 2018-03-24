import React from 'react';
import styled from 'styled-components';
import { units, px } from '../../../../style/variables';
import { KuiInfoButton } from 'ui_framework/components';
import { Tooltip } from 'pui-react-tooltip';
import { OverlayTrigger } from 'pui-react-overlay-trigger';

const TooltipWrapper = styled.div`
  position: relative;
  display: inline-block;
  top: 1px;
  left: ${px(units.half)};
  margin-right: ${px(units.quarter * 3)};
`;

const ImpactTooltip = () => (
  <TooltipWrapper>
    <OverlayTrigger
      placement="top"
      trigger="hover"
      overlay={
        <Tooltip>
          Impact shows the most used and<br />slowest endpoints in your service.
        </Tooltip>
      }
    >
      <KuiInfoButton
        onClick={e => {
          // TODO: Remove this handler once issue with pui-react-overlay-trigger has been resolved
          e.stopPropagation();
          return false;
        }}
      />
    </OverlayTrigger>
  </TooltipWrapper>
);

export default ImpactTooltip;
