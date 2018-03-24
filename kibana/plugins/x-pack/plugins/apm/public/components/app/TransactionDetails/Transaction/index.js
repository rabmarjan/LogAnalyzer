import { connect } from 'react-redux';
import Transaction from './view';
import { getUrlParams } from '../../../../store/urlParams';
import {
  loadTransaction,
  getTransaction,
  getTransactionNext
} from '../../../../store/transactions';

function mapStateToProps(state = {}) {
  return {
    urlParams: getUrlParams(state),
    transactionNext: getTransactionNext(state),
    transaction: getTransaction(state)
  };
}

const mapDispatchToProps = {
  loadTransaction
};
export default connect(mapStateToProps, mapDispatchToProps)(Transaction);
