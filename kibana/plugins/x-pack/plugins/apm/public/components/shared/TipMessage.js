import React from 'react';
import styled from 'styled-components';
import { fontSize, unit, px } from '../../style/variables';
import { KuiTableInfo } from 'ui_framework/components';
import { Info } from './Icons';

const Container = styled(KuiTableInfo)`
  padding: ${px(unit)} 0 0;
  text-align: center;
  font-size: ${fontSize};
`;

function TipMessage({ children }) {
  return (
    <Container>
      <Info />
      {children}
    </Container>
  );
}

export default TipMessage;
