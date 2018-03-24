import { connect } from 'react-redux';
import Spans from './view';
import { getUrlParams } from '../../../../../store/urlParams';
import { loadSpans, getSpans, getSpansNext } from '../../../../../store/spans';

function mapStateToProps(state = {}) {
  return {
    urlParams: getUrlParams(state),
    spansNext: getSpansNext(state),
    spans: getSpans(state)
  };
}

const mapDispatchToProps = {
  loadSpans
};
export default connect(mapStateToProps, mapDispatchToProps)(Spans);
