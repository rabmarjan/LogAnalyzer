import { get } from 'lodash';
import React from 'react';
import { formatNumber } from '../../../lib/format_number';
import { KuiTableRowCell } from 'ui_framework/components';

function OfflineCell() {
  return (
    <KuiTableRowCell>
      <div className="monitoringTableCell__number monitoringTableCell__offline">
        N/A
      </div>
    </KuiTableRowCell>
  );
}

function formatMetric(metric, key) {
  const meta = metric.metric;
  const value = get(metric, key);
  if (!meta.format) { return value; }

  if (Boolean(value) || value === 0) {
    return formatNumber(value, meta.format) + ' ' + meta.units;
  }

  // N/A would show if the API returned no data at all, since the API filters out null from the data
  return 'N/A';

}

function slopeArrow(metric) {
  if (metric.slope > 0) {
    return 'up';
  }
  return 'down';
}

function MetricCell(props) {
  if (props.isOnline) {
    return (
      <KuiTableRowCell>
        <div className="monitoringTableCell__MetricCell__metric">
          { formatMetric(props.metric, 'last') }
        </div>
        <span className={`monitoringTableCell__MetricCell__slopeArrow fa fa-long-arrow-${slopeArrow(props.metric)}`} />
        <div className="monitoringTableCell__MetricCell__minMax">
          <div>
            { formatMetric(props.metric, 'max') } max
          </div>
          <div>
            { formatMetric(props.metric, 'min') } min
          </div>
        </div>
      </KuiTableRowCell>
    );
  }

  return <OfflineCell/>;
}

export {
  OfflineCell,
  MetricCell
};
