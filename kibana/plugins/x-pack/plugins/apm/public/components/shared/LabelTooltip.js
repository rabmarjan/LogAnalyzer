import React from 'react';
import styled from 'styled-components';
import { fontFamilyCode } from '../../style/variables';
import { Tooltip } from 'pui-react-tooltip';
import { OverlayTrigger } from 'pui-react-overlay-trigger';

const TooltipFieldName = styled.span`
  font-family: ${fontFamilyCode};
`;

function LabelTooltip({ children, text }) {
  return (
    <OverlayTrigger
      placement="top"
      trigger="hover"
      delay={1000}
      overlay={<Tooltip>{text}</Tooltip>}
    >
      {children}
    </OverlayTrigger>
  );
}

export function fieldNameHelper(name) {
  return (
    <span>
      Field name: <br />
      <TooltipFieldName>{name}</TooltipFieldName>
    </span>
  );
}

export default LabelTooltip;
