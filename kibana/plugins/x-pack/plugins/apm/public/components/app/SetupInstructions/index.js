import { connect } from 'react-redux';
import SetupInstructions from './view';
import { getUrlParams } from '../../../store/urlParams';

function mapStateToProps(state = {}) {
  return {
    urlParams: getUrlParams(state)
  };
}

const mapDispatchToProps = {};
export default connect(mapStateToProps, mapDispatchToProps)(SetupInstructions);
