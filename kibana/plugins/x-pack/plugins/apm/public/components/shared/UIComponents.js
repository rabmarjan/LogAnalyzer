import styled from 'styled-components';
import {
  unit,
  units,
  px,
  fontSizes,
  colors,
  truncate
} from '../../style/variables';
import { RelativeLink } from '../../utils/url';

export const PageHeader = styled.h1`
  font-size: ${fontSizes.xxlarge};
  margin: 0 0 ${px(units.plus)} 0;
  height: ${px(unit * 2.5)};
  line-height: ${px(unit * 2.5)};
  ${truncate('100%')};
`;

export const SectionHeader = styled.h2`
  margin: ${px(units.plus)} 0;
  font-size: ${fontSizes.xlarge};
`;

export const GraphHeader = styled.h3`
  margin: ${px(units.plus)} 0;
  font-size: ${fontSizes.large};
`;

export const Tab = styled.div`
  display: inline-block;
  font-size: ${fontSizes.large};
  padding: ${px(unit)} ${px(unit + units.quarter)};
  text-align: center;
  cursor: pointer;

  border-bottom: ${props =>
    props.selected && `${units.quarter / 2}px solid ${colors.blue1}`};
`;

export const TabLink = Tab.withComponent(RelativeLink);
