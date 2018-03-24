import React from 'react';
import styled from 'styled-components';
import { fontSizes } from '../../../style/variables';

function ErrorHandler({ names }) {
  const ErrorWrap = styled.div`
    font-size: ${fontSizes.large};
  `;

  return (
    <ErrorWrap>
      <h1>Error</h1>
      <p>Failed to load data for: {names.join('\n')}</p>
      <p>Please check the console or the server output.</p>
    </ErrorWrap>
  );
}

export default ErrorHandler;
