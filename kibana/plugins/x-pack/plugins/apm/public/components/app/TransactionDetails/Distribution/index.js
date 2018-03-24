import { connect } from 'react-redux';
import Distribution from './view';
import { getUrlParams } from '../../../../store/urlParams';
import {
  loadTransactionDistribution,
  getTransactionDistribution
} from '../../../../store/transactionDistributions';

function mapStateToProps(state = {}) {
  return {
    urlParams: getUrlParams(state),
    distribution: getTransactionDistribution(state)
  };
}

const mapDispatchToProps = {
  loadTransactionDistribution
};
export default connect(mapStateToProps, mapDispatchToProps)(Distribution);
