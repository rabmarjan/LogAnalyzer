import { get } from 'lodash';
import { ajaxErrorHandlersProvider } from 'plugins/monitoring/lib/ajax_error_handler';

export function getPageData($injector) {
  const $http = $injector.get('$http');
  const globalState = $injector.get('globalState');
  const url = `../api/monitoring/v1/clusters/${globalState.cluster_uuid}/elasticsearch/nodes`;
  const showCgroupMetricsElasticsearch = $injector.get('showCgroupMetricsElasticsearch');
  const timefilter = $injector.get('timefilter');
  const timeBounds = timefilter.getBounds();

  const cpuListingMetrics = (() => {
    if (showCgroupMetricsElasticsearch) {
      return [
        'node_cgroup_quota',
        'node_cgroup_throttled'
      ];
    }
    return [
      'node_cpu_utilization',
      'node_load_average'
    ];
  })();
  const createRow = rowData => {
    if (!rowData) {
      return null;
    }
    return {
      nodeName: get(rowData, 'node.name'),
      status: rowData.online ? 'Online' : 'Offline',
      ...rowData
    };
  };

  return $http.post(url, {
    ccs: globalState.ccs,
    timeRange: {
      min: timeBounds.min.toISOString(),
      max: timeBounds.max.toISOString()
    },
    listingMetrics: [
      ...cpuListingMetrics,
      'node_jvm_mem_percent',
      'node_free_space'
    ]
  })
    .then(response => {
      return {
        ...response.data,
        rows: response.data.rows.map(createRow)
      };
    })
    .catch((err) => {
      const Private = $injector.get('Private');
      const ajaxErrorHandlers = Private(ajaxErrorHandlersProvider);
      return ajaxErrorHandlers(err);
    });
}
