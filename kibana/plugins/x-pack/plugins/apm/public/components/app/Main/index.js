import { connect } from 'react-redux';
import Main from './view';
import { loadLicense } from '../../../store/license';

function mapStateToProps(state = {}) {
  return {
    license: state.license,
    location: state.location // Must be passed for the component and router to update correctly. See: https://reacttraining.com/react-router/web/guides/dealing-with-update-blocking
  };
}

const mapDispatchToProps = {
  loadLicense
};
export default connect(mapStateToProps, mapDispatchToProps)(Main);
