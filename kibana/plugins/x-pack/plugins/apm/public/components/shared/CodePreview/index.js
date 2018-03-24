import React, { PureComponent } from 'react';
import styled from 'styled-components';
import {
  unit,
  units,
  px,
  colors,
  fontFamily,
  fontFamilyCode,
  borderRadius
} from '../../../style/variables';

import { get, isEmpty } from 'lodash';
import { Ellipsis } from '../../shared/Icons';
import { PropertiesTable } from '../../shared/PropertiesTable';

import SyntaxHighlighter, {
  registerLanguage
} from 'react-syntax-highlighter/dist/light';
import { xcode } from 'react-syntax-highlighter/dist/styles';

import javascript from 'react-syntax-highlighter/dist/languages/javascript';
import python from 'react-syntax-highlighter/dist/languages/python';
import ruby from 'react-syntax-highlighter/dist/languages/ruby';

registerLanguage('javascript', javascript);
registerLanguage('python', python);
registerLanguage('ruby', ruby);

const FileDetails = styled.div`
  color: ${colors.gray3};
  padding: ${px(units.half)};
  border-bottom: 1px solid ${colors.gray4};
  border-radius: ${borderRadius} ${borderRadius} 0 0;
`;

const FileDetail = styled.span`
  font-weight: bold;
`;

const Container = styled.div`
  margin: 0 0 ${px(units.plus)} 0;
  position: relative;
  font-family: ${fontFamilyCode};
  border: 1px solid ${colors.gray4};
  border-radius: ${borderRadius};
  background: ${props => (props.isLibraryFrame ? colors.white : colors.gray5)};

  ${FileDetails} {
    ${props => (!props.hasContext ? 'border-bottom: 0' : null)};
  }

  ${FileDetail} {
    color: ${props => (props.isLibraryFrame ? colors.gray1 : colors.black)};
  }
`;

const ContextContainer = styled.div`
  position: relative;
  border-radius: 0 0 ${borderRadius} ${borderRadius};
`;

const LineHighlight = styled.div`
  position: absolute;
  width: 100%;
  height: ${px(units.eighth * 9)};
  top: ${props =>
    props.lineNumber ? px(props.lineNumber * (units.eighth * 9)) : '0'};
  pointer-events: none;
  background-color: ${colors.yellow};
`;

const LineNumberContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  border-radius: 0 0 0 ${borderRadius};
  background: ${props => (props.isLibraryFrame ? colors.white : colors.gray5)};
`;

const LineNumber = styled.div`
  position: relative;
  min-width: ${px(units.eighth * 21)};
  padding-left: ${px(units.half)};
  padding-right: ${px(units.quarter)};
  color: ${colors.gray3};
  line-height: ${px(unit + units.eighth)};
  text-align: right;
  border-right: 1px solid ${colors.gray4};
  ${props => (props.marked ? `background-color: ${colors.yellow}` : null)};

  &:last-of-type {
    border-radius: 0 0 0 ${borderRadius};
  }
`;

const LineContainer = styled.div`
  overflow: auto;
  margin: 0 0 0 ${px(units.eighth * 21)};
  padding: 0;
  background-color: ${colors.white};

  &:last-of-type {
    border-radius: 0 0 ${borderRadius} 0;
  }
`;

const Line = styled.pre`
  // Override all styles
  margin: 0;
  color: inherit;
  background: inherit;
  border: 0;
  border-radius: 0;
  overflow: initial;
  padding: 0 ${px(units.eighth * 9)};
  line-height: ${px(units.eighth * 9)};
`;

const Code = styled.code`
  position: relative;
  padding: 0;
  margin: 0;
  white-space: pre;
  z-index: 2;
`;

const VariablesContainer = styled.div`
  background: ${colors.white};
  border-top: 1px solid ${colors.gray4};
  border-radius: 0 0 ${borderRadius} ${borderRadius};
  padding: ${px(units.half)} ${px(unit)};
  font-family: ${fontFamily};
`;

const VariablesToggle = styled.a`
  display: block;
  cursor: pointer;
  user-select: none;
`;

const VariablesTableContainer = styled.div`
  padding: ${px(units.plus)} ${px(unit)} 0;
`;

const getStackframeLines = stackframe => {
  if (!(stackframe.context || stackframe.line.context)) {
    return [];
  }

  const preContext = stackframe.context
    ? get(stackframe, 'context.pre', [])
    : [];
  const postContext = stackframe.context
    ? get(stackframe, 'context.post', [])
    : [];
  return [...preContext, stackframe.line.context, ...postContext];
};

const getStartLineNumber = stackframe => {
  const preLines = stackframe.context ? stackframe.context.pre.length : 0;
  return stackframe.line.number - preLines;
};

class CodePreview extends PureComponent {
  state = {
    variablesVisible: false
  };

  toggleVariables = () =>
    this.setState(() => {
      return { variablesVisible: !this.state.variablesVisible };
    });

  render() {
    const { stackframe, codeLanguage, isLibraryFrame } = this.props;
    const hasContext = !(
      isEmpty(stackframe.context) && isEmpty(stackframe.line.context)
    );
    const hasVariables = !isEmpty(stackframe.vars);

    return (
      <Container hasContext={hasContext} isLibraryFrame={isLibraryFrame}>
        <FileDetails>
          <FileDetail>{stackframe.filename}</FileDetail> in{' '}
          <FileDetail>{stackframe.function}</FileDetail> at{' '}
          <FileDetail>line {stackframe.line.number}</FileDetail>
        </FileDetails>

        {hasContext && (
          <Context
            stackframe={stackframe}
            codeLanguage={codeLanguage}
            isLibraryFrame={isLibraryFrame}
          />
        )}

        {hasVariables && (
          <Variables
            vars={stackframe.vars}
            visible={this.state.variablesVisible}
            onClick={this.toggleVariables}
          />
        )}
      </Container>
    );
  }
}

function Context({ stackframe, codeLanguage, isLibraryFrame }) {
  const lines = getStackframeLines(stackframe);
  const startLineNumber = getStartLineNumber(stackframe);
  const lineIndex = stackframe.context ? stackframe.context.pre.length : 0;
  const language = codeLanguage || 'javascript'; // TODO: Add support for more languages

  return (
    <ContextContainer>
      <LineHighlight lineNumber={lineIndex} />
      <LineNumberContainer isLibraryFrame={isLibraryFrame}>
        {lines.map((line, i) => (
          <LineNumber key={line + i} marked={lineIndex === i}>
            {i + startLineNumber}.
          </LineNumber>
        ))}
      </LineNumberContainer>
      <LineContainer>
        {lines.map((line, i) => (
          <SyntaxHighlighter
            key={line + i}
            language={language}
            style={xcode}
            PreTag={Line}
            CodeTag={Code}
            customStyle={{ padding: null, overflowX: null }}
          >
            {line || '\n'}
          </SyntaxHighlighter>
        ))}
      </LineContainer>
    </ContextContainer>
  );
}

function Variables({ vars, visible, onClick }) {
  return (
    <VariablesContainer>
      <VariablesToggle onClick={onClick}>
        <Ellipsis horizontal={visible} style={{ marginRight: units.half }} />{' '}
        Local variables
      </VariablesToggle>
      {visible && (
        <VariablesTableContainer>
          <PropertiesTable propData={vars} propKey={'custom'} />
        </VariablesTableContainer>
      )}
    </VariablesContainer>
  );
}

export default CodePreview;
