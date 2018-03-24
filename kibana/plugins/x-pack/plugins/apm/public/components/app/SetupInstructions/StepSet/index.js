import React from 'react';
import styled from 'styled-components';
import { KuiTabs, KuiTab } from 'ui_framework/components';
import { px, units, fontSizes } from '../../../../style/variables';

import Step from './Step';

const StepSetWrapper = styled.div`
  margin-bottom: ${px(units.double)};
`;

const Title = styled.h2`
  margin: ${px(units.plus)};
  font-size: ${fontSizes.xlarge};
`;

const Tabs = styled(KuiTabs)`
  padding-left: ${px(units.plus)};
`;

class StepSet extends React.Component {
  constructor(props) {
    super(props);

    const { instructions } = this.props;

    this.tabs = instructions;

    this.state = {
      selectedTabId: instructions[0].id
    };
  }

  onSelectedTabChanged = id => {
    this.setState({
      selectedTabId: id
    });
  };

  renderTabs() {
    return this.tabs.map((tab, index) => (
      <KuiTab
        onClick={() => this.onSelectedTabChanged(tab.id)}
        isSelected={tab.id === this.state.selectedTabId}
        key={index}
      >
        {tab.name}
      </KuiTab>
    ));
  }

  render() {
    const { instructions, type, checkStatus, result } = this.props;
    const { selectedTabId } = this.state;

    const selectedInstructionSet = instructions.find(
      instruction => instruction.id === selectedTabId
    );

    const stepSetId = type.replace(/\s+/g, '-').toLowerCase();

    return (
      <StepSetWrapper className="kuiPanel" data-stepset-id={stepSetId}>
        <Title>Install and set up {type}</Title>
        <Tabs>{this.renderTabs()}</Tabs>

        {selectedInstructionSet.steps.map((step, i) => {
          const isLastStep = i + 1 === selectedInstructionSet.steps.length;

          return (
            <Step
              key={step.indicatorNumber}
              type={type}
              step={step}
              stepSetId={stepSetId}
              isLastStep={isLastStep}
              checkStatus={checkStatus}
              result={result}
            />
          );
        })}
      </StepSetWrapper>
    );
  }
}

export default StepSet;
