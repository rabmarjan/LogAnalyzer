import React from 'react';
import { LatestActive } from './latest_active';
import { LatestVersions } from './latest_versions';
import { LatestTypes } from './latest_types';
import { Stats } from '../';
import {
  getTitle,
  getUnits,
  MonitoringTimeseries,
  InfoTooltip,
} from 'plugins/monitoring/components/chart';
import { Tooltip } from 'pui-react-tooltip';
import { OverlayTrigger } from 'pui-react-overlay-trigger';
import { KuiInfoButton } from 'ui_framework/components';
import { EuiCallOut } from '@elastic/eui';

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

function renderLatestActive(latestActive, latestTypes, latestVersions) {
  if (latestTypes && latestTypes.length > 0) {
    return (
      <div className="page-row">
        <div className="row">
          <div className="col-md-4">
            <h2 className="euiTitle">Active Beats in Last Day</h2>
            <LatestActive latestActive={latestActive} />
          </div>

          <div className="col-md-4">
            <h2 className="euiTitle">Top 5 Beat Types in Last Day</h2>
            <LatestTypes latestTypes={latestTypes} />
          </div>

          <div className="col-md-4">
            <h2 className="euiTitle">Top 5 Versions in Last Day</h2>
            <LatestVersions latestVersions={latestVersions} />
          </div>
        </div>
      </div>
    );
  }

  const calloutMsg = (
    `Hi there! This area is where your latest Beats activity would show
up, but you don't seem to have any activity within the last day.`
  );

  return (
    <EuiCallOut
      title={calloutMsg}
      iconType="gear"
      data-test-subj="noRecentActivityMessage"
    />
  );
}

export function BeatsOverview({ latestActive, latestTypes, latestVersions, stats, metrics, ...props }) {
  return (
    <div>

      {renderLatestActive(latestActive, latestTypes, latestVersions)}

      <Stats stats={stats} />

      <div className="page-row">
        <div className="row">
          <div className="col-md-6">{renderChart(metrics.beat_event_rates, props)}</div>
          <div className="col-md-6">{renderChart(metrics.beat_fail_rates, props)}</div>
          <div className="col-md-6">{renderChart(metrics.beat_throughput_rates, props)}</div>
          <div className="col-md-6">{renderChart(metrics.beat_output_errors, props)}</div>
        </div>
      </div>

    </div>
  );
}
