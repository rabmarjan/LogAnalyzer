import React from 'react';
import styled from 'styled-components';
import Legend from '../../../../shared/charts/Legend';
import {
  fontSizes,
  colors,
  unit,
  units,
  px,
  truncate
} from '../../../../../style/variables';

import LabelTooltip from '../../../../shared/LabelTooltip';

const TimelineHeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  padding: ${px(unit * 1.5)} ${px(units.plus)} 0 ${px(units.plus)};
  line-height: 1.5;
`;

const Heading = styled.div`
  font-size: ${fontSizes.large};
  color: ${colors.gray2};
  ${truncate('90%')};
`;

const Legends = styled.div`
  display: flex;
`;

export default function TimelineHeader({ legends, transactionName }) {
  return (
    <TimelineHeaderContainer>
      <LabelTooltip text={transactionName || 'N/A'}>
        <Heading>{transactionName || 'N/A'}</Heading>
      </LabelTooltip>
      <Legends>
        {legends.map(({ color, label }) => (
          <Legend clickable={false} key={color} color={color} text={label} />
        ))}
      </Legends>
    </TimelineHeaderContainer>
  );
}
