import { connect } from 'react-redux';
import TransactionOverview from './view';
import { getUrlParams } from '../../../store/urlParams';
import sorting, { changeTransactionSorting } from '../../../store/sorting';
import {
  getTransactionList,
  loadTransactionList
} from '../../../store/transactionLists';

function mapStateToProps(state = {}) {
  return {
    urlParams: getUrlParams(state),
    transactionList: getTransactionList(state),
    transactionSorting: sorting(state, 'transaction').sorting.transaction
  };
}

const mapDispatchToProps = {
  loadTransactionList,
  changeTransactionSorting
};

export default connect(mapStateToProps, mapDispatchToProps)(
  TransactionOverview
);
