import { connect } from 'react-redux';
import Distribution from './view';
import { getUrlParams } from '../../../../store/urlParams';
import {
  loadErrorDistribution,
  getErrorDistribution
} from '../../../../store/errorDistributions';

function mapStateToProps(state = {}) {
  return {
    urlParams: getUrlParams(state),
    distribution: getErrorDistribution(state)
  };
}

const mapDispatchToProps = {
  loadErrorDistribution
};
export default connect(mapStateToProps, mapDispatchToProps)(Distribution);
