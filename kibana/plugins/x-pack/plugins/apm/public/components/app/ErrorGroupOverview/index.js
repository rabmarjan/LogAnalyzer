import { connect } from 'react-redux';
import ErrorGroupOverview from './view';
import { getUrlParams } from '../../../store/urlParams';
import {
  getErrorGroupList,
  loadErrorGroupList,
  getErrorGroupListArgs
} from '../../../store/errorGroupLists';
import { getKey } from '../../../store/apiHelpers';

function mapStateToProps(state = {}) {
  const listArgs = getErrorGroupListArgs(state);
  const key = getKey(listArgs);

  return {
    listArgs,
    urlParams: getUrlParams(state),
    errorGroupList: getErrorGroupList(state, key)
  };
}

const mapDispatchToProps = {
  loadErrorGroupList
};

export default connect(mapStateToProps, mapDispatchToProps)(ErrorGroupOverview);
