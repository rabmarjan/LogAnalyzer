import { connect } from 'react-redux';
import ErrorGroupDetails from './view';
import { getUrlParams } from '../../../store/urlParams';
import { getErrorGroup, loadErrorGroup } from '../../../store/errorGroups';

function mapStateToProps(state = {}) {
  return {
    urlParams: getUrlParams(state),
    errorGroup: getErrorGroup(state)
  };
}

const mapDispatchToProps = {
  loadErrorGroup
};

export default connect(mapStateToProps, mapDispatchToProps)(ErrorGroupDetails);
