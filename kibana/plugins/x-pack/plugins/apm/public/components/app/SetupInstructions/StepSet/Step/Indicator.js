import React from 'react';
import styled from 'styled-components';

import {
  px,
  unit,
  units,
  colors,
  fontSize,
  fontSizes
} from '../../../../../style/variables';

import { Check } from '../../../../shared/Icons';

const IndicatorWrapper = styled.div`
  margin: 0 ${px(unit)} 0 0;
  height: 100%;
`;

const Number = styled.div`
  position: relative;
  z-index: 1;
  width: ${px(units.double)};
  height: ${px(units.double)};
  border-radius: 100%;
  line-height: ${px(units.double - units.eighth)};
  text-align: center;
  color: ${colors.white};
  background-color: ${colors.blue1};
  border: 1px solid ${colors.blue1};
  box-shadow: 0px 0px 0px 8px #fff;
`;

const Checkmark = styled(Check)`
  color: ${colors.white};
`;

const Icon = Number.extend`
  font-size: ${props => (props.isCompleted ? fontSizes.large : fontSize)};
  background-color: ${props =>
    props.isCompleted ? colors.blue1 : colors.white};

  ${Checkmark} {
    color: ${props => (props.isCompleted ? colors.white : null)};
  }
`;

const Line = styled.div`
  border-left: 1px solid ${colors.gray3};
  height: 100%;
  margin: 0 0 0 ${px(unit)};
`;

function Indicator({ step, isLastStep, result }) {
  return (
    <IndicatorWrapper>
      {step.isStatusStep ? (
        <Icon key={step.indicatorNumber} isCompleted={result.completed}>
          <Checkmark />
        </Icon>
      ) : (
        <Number key={step.indicatorNumber}>{step.indicatorNumber}</Number>
      )}

      {!isLastStep && <Line />}
    </IndicatorWrapper>
  );
}

export default Indicator;
