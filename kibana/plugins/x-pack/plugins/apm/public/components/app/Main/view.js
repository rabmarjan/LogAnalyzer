import React, { Component } from 'react';
import styled from 'styled-components';
import { get } from 'lodash';
import { units, unit, px } from '../../../style/variables';

const MainContainer = styled.div`
  min-width: ${px(unit * 50)};
  padding: ${px(units.plus)};
`;
function fetchLicense(props) {
  if (!props.license.status) {
    props.loadLicense();
  }
}

class Main extends Component {
  componentDidMount() {
    fetchLicense(this.props);
  }

  componentWillReceiveProps(nextProps) {
    fetchLicense(nextProps);
  }

  render() {
    const { children, location } = this.props;
    const isActive = get(this.props, 'license.data.isActive');

    // Necessary to manually add location to child <Route>'s. See: https://github.com/ReactTraining/react-router/issues/4671
    const childrenWithLocation = React.Children.map(children, child =>
      React.cloneElement(child, { location })
    );

    return (
      <MainContainer>
        {isActive ? childrenWithLocation : 'No active license was found'}
      </MainContainer>
    );
  }
}

export default Main;
