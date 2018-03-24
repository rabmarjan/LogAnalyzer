import React from 'react';
import styled from 'styled-components';
import { KuiButton } from 'ui_framework/components';
import { px, unit, units, colors, fontSizes } from '../../../style/variables';
import { RelativeLink } from '../../../utils/url';

const CompleteSetupWrapper = styled.div`
  padding: ${px(unit)} ${px(units.plus)};
  margin-bottom: ${px(unit * 4)};
  padding-bottom: ${px(unit * 2)};
`;

const Description = styled.div`
  margin: ${px(unit)} 0;
`;

const LaunchLink = styled(RelativeLink)`
  margin-top: ${px(unit)};
`;

const LaunchButton = styled(KuiButton)`
  background-color: ${colors.blue1};
  color: ${colors.white};
`;

const Title = styled.h2`
  margin: ${px(units.plus)} 0;
  font-size: ${fontSizes.xlarge};
`;

function CompleteSetup({ results }) {
  const stepsCompleted =
    (results.server.completed && results.agent.completed) || false;

  return (
    <CompleteSetupWrapper className="kuiPanel">
      <Title>Complete setup</Title>
      <Description>
        {!stepsCompleted
          ? 'Once all steps are completed, you are ready to explore your data.'
          : "You're all set up and can continue on to APM."}
      </Description>

      <LaunchLink path="/" disabled={!stepsCompleted}>
        <LaunchButton disabled={!stepsCompleted}>
          Complete setup and launch APM
        </LaunchButton>
      </LaunchLink>
    </CompleteSetupWrapper>
  );
}

export default CompleteSetup;
