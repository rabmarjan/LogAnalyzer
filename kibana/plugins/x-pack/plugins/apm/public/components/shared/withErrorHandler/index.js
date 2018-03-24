import React from 'react';
import { STATUS } from '../../../constants';
import ErrorHandler from './view';
import { getDisplayName } from '../HOCUtils';
import { isEmpty } from 'lodash';

function withErrorHandler(WrappedComponent, dataNames) {
  function HOC(props) {
    const unavailableNames = dataNames.filter(
      name => props[name].status === STATUS.FAILURE
    );

    if (!isEmpty(unavailableNames)) {
      return <ErrorHandler names={unavailableNames} />;
    }

    return <WrappedComponent {...props} />;
  }

  HOC.displayName = `WithErrorHandler(${getDisplayName(WrappedComponent)})`;

  return HOC;
}

export default withErrorHandler;
