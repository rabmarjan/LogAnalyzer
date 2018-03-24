import React from 'react';
import styled from 'styled-components';
import { px, unit, units, colors, fontSizes } from '../../../style/variables';

import { EuiText } from '@elastic/eui';

const Title = styled.h1`
  display: inline-block;
`;

const Subtitle = styled.h2`
  font-size: ${fontSizes.large};
  margin: ${px(units.half)} 0;
  color: ${colors.gray1};
`;

const IntroductionWrapper = styled.div`
  padding: 0 ${px(units.plus)};
  margin-bottom: ${px(units.double)};

  ${Title} {
    margin-top: ${px(unit)};
  }

  ${Subtitle} {
    margin-top: ${px(unit)};
  }
`;

const Icon = styled.div`
  display: inline-block;
  width: ${px(units.double)};
  height: ${px(units.double)};
  object-fit: contain;
  background-size: ${px(units.double)} ${px(units.double)};
  background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMTAwIiBoZWlnaHQ9IjkyIiB2aWV3Qm94PSIwIDAgMTAwIDkyIj4gICAgPGRlZnM+ICAgICAgICA8cGF0aCBpZD0iYSIgZD0iTTAgMGgxMDB2MTAwSDB6Ii8+ICAgIDwvZGVmcz4gICAgPGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwIC00KSI+ICAgICAgICA8bWFzayBpZD0iYiIgZmlsbD0iI2ZmZiI+ICAgICAgICAgICAgPHVzZSB4bGluazpocmVmPSIjYSIvPiAgICAgICAgPC9tYXNrPiAgICAgICAgPHBhdGggZmlsbD0iIzEzQTdERiIgZD0iTTE3IDMwaDY2YTcgNyAwIDEgMSAwIDE0SDE3YTcgNyAwIDEgMSAwLTE0eiIgbWFzaz0idXJsKCNiKSIvPiAgICAgICAgPHBhdGggZmlsbD0iIzAwQkZCMyIgZD0iTTY3IDgyaDI2YTcgNyAwIDEgMSAwIDE0SDY3YTcgNyAwIDAgMSAwLTE0ek03IDRoMzZhNyA3IDAgMSAxIDAgMTRIN0E3IDcgMCAxIDEgNyA0ek0xNyA1NmgzNmE3IDcgMCAwIDEgMCAxNEgxN2E3IDcgMCAwIDEgMC0xNHoiIG1hc2s9InVybCgjYikiLz4gICAgPC9nPjwvc3ZnPg==);
  margin-right: ${px(unit)};
`;

const Description = styled.div`
  margin: ${px(unit)} 0;
`;

function Introduction() {
  return (
    <IntroductionWrapper>
      <EuiText>
        <Icon />
        <Title>APM</Title>
        <Subtitle>
          APM (Application Performance Monitoring) automatically collects
          in-depth performance metrics and errors from inside your applications.
        </Subtitle>
        <Description>
          APM consists of three components - the Agents, the Server, and the UI:
          <br />
          <br />
          <ul>
            <li>
              The Agents are libraries in your application that run inside of
              your application process.
            </li>
            <li>
              The Server processes data from agents and stores the application
              data in Elasticsearch.
            </li>
            <li>
              The UI is this dedicated Kibana APM plugin and customizable
              dashboards.
            </li>
          </ul>
          For more information,{' '}
          <a href="https://www.elastic.co/guide/en/apm/get-started/6.2/index.html">
            please see our documentation.
          </a>{' '}
          To get started, follow the steps below.
        </Description>
      </EuiText>
    </IntroductionWrapper>
  );
}

export default Introduction;
