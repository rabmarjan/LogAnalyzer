import { KIBANA_REPORTING_TYPE } from '../../../common/constants';
import { getReportingUsage } from '../../../../reporting';

export function getReportingCollector(server, callCluster) {
  return {
    type: KIBANA_REPORTING_TYPE,
    fetch() {
      return getReportingUsage(callCluster, server);
    }
  };
}
