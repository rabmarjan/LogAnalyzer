import React from 'react';
import {
  getTitle,
  getUnits,
  MonitoringTimeseries,
  InfoTooltip,
} from 'plugins/monitoring/components/chart';
import { Tooltip } from 'pui-react-tooltip';
import { OverlayTrigger } from 'pui-react-overlay-trigger';
import { KuiInfoButton } from 'ui_framework/components';
import { formatMetric } from 'plugins/monitoring/lib/format_number';

function renderTransportAddress(summary) {
  let output = null;
  if (summary.name !== summary.transportAddress) {
    output = (
      <div>
        Host: <strong data-test-subj="host">{summary.transportAddress}</strong>
      </div>
    );
  }
  return output;
}

function renderChart(series,  { onBrush }) {
  const units = getUnits(series);
  return (
    <div className="monitoring-chart__container">
      <h2 className="euiTitle">
        { getTitle(series) }{ units ? ` (${units})` : '' }
        <OverlayTrigger
          placement="left"
          trigger="click"
          overlay={<Tooltip><InfoTooltip series={series}/></Tooltip>}
        >
          <span className="monitoring-chart-tooltip__trigger overlay-trigger">
            <KuiInfoButton />
          </span>
        </OverlayTrigger>
      </h2>
      <MonitoringTimeseries
        series={series}
        onBrush={onBrush}
      />
    </div>
  );
}

export function Beat({ summary, metrics, ...props }) {
  return (
    <div>
      <div className="monitoring-summary-status">
        <div
          className="monitoring-summary-status__content"
          data-test-subj="beatSummaryStatus01"
        >
          <div>
            <strong data-test-subj="name">{summary.name}</strong>
          </div>
          <div>
            Version: <strong data-test-subj="version">{summary.version}</strong>
          </div>
          <div>
            Beat Type: <strong data-test-subj="type">{summary.type}</strong>
          </div>
          { renderTransportAddress(summary) }
          <div>
            Output: <strong data-test-subj="output">{summary.output}</strong>
          </div>
          <div>
            Config Reloads: <strong data-test-subj="configReloads">{formatMetric(summary.configReloads, 'int_commas')}</strong>
          </div>
          <div>
            Uptime: <strong data-test-subj="uptime">{formatMetric(summary.uptime, 'time_since')}</strong>
          </div>
        </div>
      </div>

      <div className="monitoring-summary-status">
        <div
          className="monitoring-summary-status__content"
          data-test-subj="beatSummaryStatus02"
        >
          <div>
            Events Total: <strong data-test-subj="eventsTotal">{formatMetric(summary.eventsTotal, 'int_commas')}</strong>
          </div>
          <div>
            Events Emitted: <strong data-test-subj="eventsEmitted">{formatMetric(summary.eventsEmitted, 'int_commas')}</strong>
          </div>
          <div>
            Events Dropped: <strong data-test-subj="eventsDropped">{formatMetric(summary.eventsDropped, 'int_commas')}</strong>
          </div>
          <div>
            Bytes Sent: <strong data-test-subj="bytesWritten">{formatMetric(summary.bytesWritten, 'bytes')}</strong>
          </div>
        </div>
      </div>

      <div className="page-row">
        <div className="row">
          <div className="col-md-6">{renderChart(metrics.beat_event_rates, props)}</div>
          <div className="col-md-6">{renderChart(metrics.beat_fail_rates, props)}</div>
          <div className="col-md-6">{renderChart(metrics.beat_throughput_rates, props)}</div>
          <div className="col-md-6">{renderChart(metrics.beat_output_errors, props)}</div>
          <div className="col-md-6">{renderChart(metrics.beat_memory, props)}</div>
          <div className="col-md-6">{renderChart(metrics.beat_os_load, props)}</div>
        </div>
      </div>
    </div>
  );
}
