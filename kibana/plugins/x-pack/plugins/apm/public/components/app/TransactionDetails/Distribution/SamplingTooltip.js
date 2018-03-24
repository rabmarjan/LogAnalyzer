import React from 'react';
import styled from 'styled-components';
import { units, px } from '../../../../style/variables';
import { KuiInfoButton } from 'ui_framework/components';
import { Tooltip } from 'pui-react-tooltip';
import { OverlayTrigger } from 'pui-react-overlay-trigger';

const TooltipWrapper = styled.div`
  position: relative;
  display: inline-block;
  top: ${px(units.eighth / 2)};
  left: ${px(units.half)};
`;

const TooltipTitle = styled.div`
  font-weight: bold;
  margin-bottom: ${px(units.quarter)};
`;

const SamplingTooltip = () => (
  <TooltipWrapper>
    <OverlayTrigger
      placement="top"
      trigger="hover"
      overlay={
        <Tooltip>
          <TooltipTitle>Sampling</TooltipTitle>
          Each bucket will show a sample transaction. If there&apos;s no sample
          available,<br />
          it&apos;s most likely because of the sampling limit set in the agent
          configuration.
        </Tooltip>
      }
    >
      <KuiInfoButton />
    </OverlayTrigger>
  </TooltipWrapper>
);

export default SamplingTooltip;
