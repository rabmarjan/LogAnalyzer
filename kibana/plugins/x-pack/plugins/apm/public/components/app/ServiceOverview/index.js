import { connect } from 'react-redux';
import ServiceOverview from './view';
import { loadServiceList, getServiceList } from '../../../store/serviceLists';
import { getUrlParams } from '../../../store/urlParams';
import sorting, { changeServiceSorting } from '../../../store/sorting';

function mapStateToProps(state = {}) {
  return {
    serviceList: getServiceList(state),
    urlParams: getUrlParams(state),
    serviceSorting: sorting(state, 'service').sorting.service
  };
}

const mapDispatchToProps = {
  loadServiceList,
  changeServiceSorting
};
export default connect(mapStateToProps, mapDispatchToProps)(ServiceOverview);
