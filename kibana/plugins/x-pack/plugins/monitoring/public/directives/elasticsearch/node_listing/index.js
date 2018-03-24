import { get } from 'lodash';
import React from 'react';
import { render } from 'react-dom';
import { uiModules } from 'ui/modules';
import {
  KuiKeyboardAccessible,
  KuiTableRowCell,
  KuiTableRow
} from 'ui_framework/components';
import { MetricCell, OfflineCell } from 'plugins/monitoring/components/elasticsearch/node_listing/cells';
import { NodeStatusIcon } from 'plugins/monitoring/components/elasticsearch/node/status_icon';
import { Tooltip } from 'plugins/monitoring/components/tooltip';
import { MonitoringTable } from 'plugins/monitoring/components/table';
import { extractIp } from 'plugins/monitoring/lib/extract_ip';
import { SORT_ASCENDING } from 'monitoring-constants';

const filterFields = [ 'nodeName', 'status', 'type', 'transport_address' ];
const getColumns = showCgroupMetricsElasticsearch => {
  const cols = [];
  cols.push({ title: 'Name', sortKey: 'nodeName', sortOrder: SORT_ASCENDING });
  cols.push({ title: 'Status', sortKey: 'online' });
  if (showCgroupMetricsElasticsearch) {
    cols.push({ title: 'CPU Usage', sortKey: 'metrics.node_cgroup_quota.last' });
    cols.push({ title: 'CPU Throttling', sortKey: 'metrics.node_cgroup_throttled.last' });
  } else {
    cols.push({ title: 'CPU Usage', sortKey: 'metrics.node_cpu_utilization.last' });
    cols.push({ title: 'Load Average', sortKey: 'metrics.node_load_average.last' });
  }
  cols.push({ title: 'JVM Memory', sortKey: 'metrics.node_jvm_mem_percent.last' });
  cols.push({ title: 'Disk Free Space', sortKey: 'metrics.node_free_space.last' });
  cols.push({ title: 'Shards', sortKey: 'metrics.shard_count' });
  return cols;
};
const nodeRowFactory = (scope, kbnUrl, showCgroupMetricsElasticsearch) => {
  return class NodeRow extends React.Component {
    constructor(props) {
      super(props);
      this.goToNode = this.goToNode.bind(this);
    }
    goToNode() {
      scope.$evalAsync(() => {
        kbnUrl.changePath(`/elasticsearch/nodes/${this.props.resolver}`);
      });
    }
    isOnline() {
      return this.props.status === 'Online';
    }
    getCpuComponents() {
      const isOnline = this.isOnline();
      if (showCgroupMetricsElasticsearch) {
        return [
          <MetricCell key="cpuCol1" isOnline={isOnline} metric={get(this.props, 'metrics.node_cgroup_quota')} />,
          <MetricCell key="cpuCol2" isOnline={isOnline} metric={get(this.props, 'metrics.node_cgroup_throttled')} />,
        ];
      }
      return [
        <MetricCell key="cpuCol1" isOnline={isOnline} metric={get(this.props, 'metrics.node_cpu_utilization')} />,
        <MetricCell key="cpuCol2" isOnline={isOnline} metric={get(this.props, 'metrics.node_load_average')} />,
      ];
    }
    getShardCount() {
      if (this.isOnline()) {
        return (
          <KuiTableRowCell>
            <div className="monitoringTableCell__number">
              {get(this.props, 'metrics.shard_count')}
            </div>
          </KuiTableRowCell>
        );
      }
      return <OfflineCell />;
    }
    render() {
      const isOnline = this.isOnline();
      return (
        <KuiTableRow>
          <KuiTableRowCell>
            <div className="monitoringTableCell__name">
              <Tooltip text={this.props.node.nodeTypeLabel} trigger="hover" placement="bottom">
                <span className={`fa ${this.props.node.nodeTypeClass}`} />
              </Tooltip>
              &nbsp;
              <KuiKeyboardAccessible>
                <a
                  className="kuiLink"
                  onClick={this.goToNode}
                  data-test-subj={`nodeLink-${this.props.resolver}`}
                >
                  {this.props.node.name}
                </a>
              </KuiKeyboardAccessible>
            </div>
            <div className="monitoringTableCell__transportAddress">{extractIp(this.props.node.transport_address)}</div>
          </KuiTableRowCell>
          <KuiTableRowCell>
            <div title={`Node status: ${this.props.status}`} className="monitoringTableCell__status">
              <NodeStatusIcon status={this.props.status} />&nbsp;
              {this.props.status}
            </div>
          </KuiTableRowCell>
          {this.getCpuComponents()}
          <MetricCell isOnline={isOnline} metric={get(this.props, 'metrics.node_jvm_mem_percent')} />
          <MetricCell isOnline={isOnline} metric={get(this.props, 'metrics.node_free_space')} />
          {this.getShardCount()}
        </KuiTableRow>
      );
    }
  };
};

// change the node to actually display the name
const uiModule = uiModules.get('monitoring/directives', []);
uiModule.directive('monitoringNodesListing', ($injector) => {
  const kbnUrl = $injector.get('kbnUrl');
  const showCgroupMetricsElasticsearch = $injector.get('showCgroupMetricsElasticsearch');
  const columns = getColumns(showCgroupMetricsElasticsearch);

  return {
    restrict: 'E',
    scope: {
      nodes: '=',
      pageIndex: '=',
      filterText: '=',
      sortKey: '=',
      sortOrder: '=',
      onNewState: '=',
    },
    link(scope, $el) {

      scope.$watch('nodes', (nodes = []) => {
        const nodesTable = (
          <MonitoringTable
            className="nodesTable"
            rows={nodes}
            pageIndex={scope.pageIndex}
            filterText={scope.filterText}
            sortKey={scope.sortKey}
            sortOrder={scope.sortOrder}
            onNewState={scope.onNewState}
            placeholder="Filter Nodes..."
            filterFields={filterFields}
            columns={columns}
            rowComponent={nodeRowFactory(scope, kbnUrl, showCgroupMetricsElasticsearch)}
          />
        );
        render(nodesTable, $el[0]);
      });

    }
  };
});
