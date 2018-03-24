import React, { Component } from 'react';
import Clipboard from 'react-clipboard.js';
import styled from 'styled-components';

import { px, units } from '../../../../../style/variables';

const Button = styled(Clipboard)`
  position: absolute;
  top: -${px(units.double + units.half)};
  right: 0;
`;

class CopyButton extends Component {
  state = { copied: false };

  constructor() {
    super();
    this.onSuccess = this.onSuccess.bind(this);
  }

  onSuccess() {
    this.setState({ copied: true });
  }

  render() {
    const { target } = this.props;
    const { copied } = this.state;

    return (
      <Button
        className="kuiButton kuiButton--hollow"
        data-clipboard-target={target}
        onSuccess={this.onSuccess}
      >
        {copied ? 'Copied!' : 'Copy snippet'}
      </Button>
    );
  }
}

export default CopyButton;
