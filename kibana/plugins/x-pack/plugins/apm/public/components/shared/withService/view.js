import React, { Component } from 'react';

function loadApp(props) {
  const { serviceName, start, end } = props.urlParams;
  if (serviceName && start && end && !props.service.status) {
    props.loadApp({ serviceName, start, end });
  }
}

function getComponentWithApp(WrappedComponent) {
  return class extends Component {
    componentDidMount() {
      loadApp(this.props);
    }

    componentWillReceiveProps(nextProps) {
      loadApp(nextProps);
    }

    render() {
      return (
        <WrappedComponent
          {...this.props.originalProps}
          service={this.props.service}
        />
      );
    }
  };
}

export default getComponentWithApp;
