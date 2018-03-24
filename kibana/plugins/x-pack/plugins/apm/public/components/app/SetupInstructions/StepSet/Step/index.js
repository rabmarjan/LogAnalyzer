import React from 'react';
import { STATUS } from '../../../../../constants';

import styled from 'styled-components';
import { KuiButton, KuiButtonIcon } from 'ui_framework/components';
import {
  px,
  unit,
  units,
  fontSize,
  fontSizes,
  fontFamilyCode,
  colors
} from '../../../../../style/variables';

import Indicator from './Indicator';
import StatusCheckText from './StatusCheckText';
import CopyButton from './CopyButton';
import MarkdownRenderer from 'react-markdown-renderer';

import SyntaxHighlighter, {
  registerLanguage
} from 'react-syntax-highlighter/dist/light';
import { xcode } from 'react-syntax-highlighter/dist/styles';

import bash from 'react-syntax-highlighter/dist/languages/bash';
import javascript from 'react-syntax-highlighter/dist/languages/javascript';
import python from 'react-syntax-highlighter/dist/languages/python';

registerLanguage('bash', bash);
registerLanguage('javascript', javascript);
registerLanguage('python', python);

import { EuiText } from '@elastic/eui';

const StepWrapper = styled.div`
  display: flex;
  margin: ${px(units.plus)} 0;
  padding: 0 ${px(units.double)};
`;

const Timeline = styled.div``;

const Content = styled.div`
  width: 80%;
`;

const Title = styled.h3`
  margin: ${px(units.quarter)} 0 ${px(unit)} 0;
  font-size: ${fontSizes.xlarge};
`;

const DownloadButton = styled(KuiButton)`
  margin: ${px(units.half)} 0;
`;

const Description = styled.div`
  max-width: 80%;

  // Markdown code blocks
  p code {
    font-family: ${fontFamilyCode};
    white-space: pre-wrap;
    font-size: ${fontSize};
    background: ${colors.gray5};
    padding: ${px(units.quarter)} ${px(units.half)};
  }
`;

const CheckStatusButton = styled(KuiButton)`
  margin: ${px(unit)} 0;
  float: left; // IE fix
`;

const CodeWrapper = styled.div`
  position: relative;
  margin: ${px(unit)} 0 ${px(unit)} 0;
`;

function Step({ step, stepSetId, isLastStep, checkStatus, result, type }) {
  return (
    <StepWrapper data-step-id={step.indicatorNumber}>
      <Timeline>
        <Indicator step={step} isLastStep={isLastStep} result={result} />
      </Timeline>
      <Content>
        <Title>{step.title || ''}</Title>
        {step.textPre && (
          <Description>
            <EuiText>
              <MarkdownRenderer markdown={step.textPre || ''} />
            </EuiText>
          </Description>
        )}
        {step.downloadButton && (
          <a
            href="https://www.elastic.co/downloads/apm/apm-server"
            target="_blank"
            rel="noopener noreferrer"
          >
            <DownloadButton
              buttonType="secondary"
              icon={<KuiButtonIcon className="fa-external-link" />}
            >
              Download APM Server on Elastic.co
            </DownloadButton>
          </a>
        )}

        {step.code && (
          <CodeWrapper>
            <CopyButton
              target={`[data-stepset-id="${stepSetId}"] [data-step-id="${
                step.indicatorNumber
              }"] pre code`}
            >
              Copy snippet
            </CopyButton>

            <SyntaxHighlighter
              language={step.codeLanguage || 'bash'}
              style={xcode}
              customStyle={{
                color: null,
                padding: px(unit),
                lineHeight: px(unit * 1.5),
                fontFamily: fontFamilyCode,
                background: colors.gray5,
                overflowX: 'scroll'
              }}
            >
              {step.code || ''}
            </SyntaxHighlighter>
          </CodeWrapper>
        )}

        {step.textPost && (
          <Description>
            <EuiText>
              <MarkdownRenderer markdown={step.textPost || ''} />
            </EuiText>
          </Description>
        )}

        {step.isStatusStep && (
          <CheckStatusButton buttonType="secondary" onClick={checkStatus}>
            Check {type} status
          </CheckStatusButton>
        )}

        {step.isStatusStep && <StatusCheckInformation result={result} />}
      </Content>
    </StepWrapper>
  );
}

function StatusCheckInformation({ result }) {
  if (result.status === STATUS.LOADING) {
    return <StatusCheckText type="info" icon="info" text="Loading..." />;
  }
  if (result.completed) {
    return <StatusCheckText type="success" icon="check" text="Success" />;
  }
  if (result.completed === false) {
    return <StatusCheckText type="warning" icon="bolt" text="No data found" />;
  }

  return null;
}

export default Step;
