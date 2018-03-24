import { get } from 'lodash';
import React from 'react';
import { render } from 'react-dom';
import { uiModules } from 'ui/modules';
import {
  KuiKeyboardAccessible,
  KuiTableRowCell,
  KuiTableRow
} from 'ui_framework/components';
import { MonitoringTable } from 'plugins/monitoring/components/table';
import { SORT_ASCENDING } from 'monitoring-constants';
import {
  formatNumber,
  formatPercentageUsage
} from '../../../lib/format_number';

const filterFields = [ 'logstash.name', 'logstash.host', 'logstash.http_address' ];
const columns = [
  { title: 'Name', sortKey: 'logstash.name', sortOrder: SORT_ASCENDING },
  { title: 'CPU Usage', sortKey: 'process.cpu.percent' },
  { title: 'Load Average', sortKey: 'os.cpu.load_average.1m', },
  { title: 'JVM Heap Used', sortKey: 'jvm.mem.heap_used_percent' },
  { title: 'Events Ingested', sortKey: 'events.out' },
  { title: 'Config Reloads' },
  { title: 'Version', sortKey: 'logstash.version' }
];
const nodeRowFactory = (scope, kbnUrl) => {
  const goToNode = uuid => {
    scope.$evalAsync(() => {
      kbnUrl.changePath(`/logstash/node/${uuid}`);
    });
  };

  return function NodeRow(props) {
    return (
      <KuiTableRow>
        <KuiTableRowCell>
          <div className="monitoringTableCell__name">
            <KuiKeyboardAccessible>
              <a className="kuiLink" onClick={goToNode.bind(null, get(props, 'logstash.uuid'))}>
                { get(props, 'logstash.name') }
              </a>
            </KuiKeyboardAccessible>
          </div>
          <div className="monitoringTableCell__transportAddress">{ get(props, 'logstash.http_address') }</div>
        </KuiTableRowCell>
        <KuiTableRowCell>
          <div className="monitoringTableCell__number">
            { formatPercentageUsage(props.process.cpu.percent, 100) }
          </div>
        </KuiTableRowCell>
        <KuiTableRowCell>
          <div className="monitoringTableCell__number">
            { formatNumber(get(props, 'os.cpu.load_average["1m"]'), '0.00') }
          </div>
        </KuiTableRowCell>
        <KuiTableRowCell>
          <div className="monitoringTableCell__number">
            { formatPercentageUsage(props.jvm.mem.heap_used_percent, 100) }
          </div>
        </KuiTableRowCell>
        <KuiTableRowCell>
          <div className="monitoringTableCell__number">
            { formatNumber(props.events.out, '0.[0]a') }
          </div>
        </KuiTableRowCell>
        <KuiTableRowCell>
          <div className="monitoringTableCell__splitNumber">{ props.reloads.successes } successes</div>
          <div className="monitoringTableCell__splitNumber">{ props.reloads.failures } failures</div>
        </KuiTableRowCell>
        <KuiTableRowCell>
          <div className="monitoringTableCell__version">
            { formatNumber(get(props, 'logstash.version')) }
          </div>
        </KuiTableRowCell>
      </KuiTableRow>
    );
  };
};

const uiModule = uiModules.get('monitoring/directives', []);
uiModule.directive('monitoringLogstashNodeListing', kbnUrl => {
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
    link: function (scope, $el) {

      scope.$watch('nodes', (nodes = []) => {
        const nodesTable = (
          <MonitoringTable
            className="logstashNodesTable"
            rows={nodes}
            pageIndex={scope.pageIndex}
            filterText={scope.filterText}
            sortKey={scope.sortKey}
            sortOrder={scope.sortOrder}
            onNewState={scope.onNewState}
            placeholder="Filter Nodes..."
            filterFields={filterFields}
            columns={columns}
            rowComponent={nodeRowFactory(scope, kbnUrl)}
          />
        );
        render(nodesTable, $el[0]);
      });

    }
  };
});
