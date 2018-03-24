import { connect } from 'react-redux';
import { getUrlParams } from '../../../store/urlParams';
import { loadApp, getService } from '../../../store/services';
import getComponentWithApp from './view';
import { getDisplayName } from '../HOCUtils';

function withService(WrappedComponent) {
  function mapStateToProps(state = {}, props) {
    return {
      service: getService(state),
      urlParams: getUrlParams(state),
      originalProps: props
    };
  }

  const mapDispatchToProps = {
    loadApp
  };

  const HOC = getComponentWithApp(WrappedComponent);
  HOC.displayName = `WithApp(${getDisplayName(WrappedComponent)})`;

  return connect(mapStateToProps, mapDispatchToProps)(HOC);
}

export default withService;
