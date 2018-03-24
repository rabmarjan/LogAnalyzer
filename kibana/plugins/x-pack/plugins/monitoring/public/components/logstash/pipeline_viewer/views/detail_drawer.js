import React from 'react';
import {
  EuiTitle,
  EuiText,
  EuiFlyout,
  EuiFlyoutHeader,
  EuiFlyoutBody,
  EuiTable,
  EuiTableBody,
  EuiTableRow,
  EuiTableRowCell,
  EuiCodeBlock,
  EuiFlexGroup,
  EuiFlexItem,
  EuiButtonIcon,
  EuiSpacer
} from '@elastic/eui';
import { formatMetric } from '../../../../lib/format_number';
import { LOGSTASH } from 'monitoring-constants';

function renderIcon(vertex) {
  return (
    <img
      src={vertex.icon}
      width={LOGSTASH.PIPELINE_VIEWER.ICON.WIDTH_PX}
      height={LOGSTASH.PIPELINE_VIEWER.ICON.HEIGHT_PX}
      className="lspvDetailDrawerIcon"
    />
  );
}

function renderPluginBasicStats(vertex) {
  const eventsLatencyRow = vertex.pluginType === 'input'
    ? null
    : (
      <EuiTableRow key="events_latency">
        <EuiTableRowCell>Events Latency</EuiTableRowCell>
        <EuiTableRowCell>{ formatMetric(vertex.stats.millis_per_event, '0.[00]a', 'ms/e') }</EuiTableRowCell>
      </EuiTableRow>
    );

  const eventsOutRateRow = (
    <EuiTableRow key="events_out_rate">
      <EuiTableRowCell>Events Emitted Rate</EuiTableRowCell>
      <EuiTableRowCell>{ formatMetric(vertex.eventsPerSecond, '0.[00]a', 'e/s') }</EuiTableRowCell>
    </EuiTableRow>
  );

  const eventsInRow = vertex.pluginType === 'input'
    ? null
    : (
      <EuiTableRow key="events_in">
        <EuiTableRowCell>Events Received</EuiTableRowCell>
        <EuiTableRowCell>{ formatMetric(vertex.stats.events_in, '0.[0]a', 'events') }</EuiTableRowCell>
      </EuiTableRow>
    );

  const eventsOutRow = (
    <EuiTableRow key="events_out">
      <EuiTableRowCell>Events Emitted</EuiTableRowCell>
      <EuiTableRowCell>{ formatMetric(vertex.stats.events_out, '0.[0]a', 'events') }</EuiTableRowCell>
    </EuiTableRow>
  );

  return (
    <EuiTable>
      <EuiTableBody>
        { eventsLatencyRow }
        { eventsOutRateRow }
        { eventsInRow }
        { eventsOutRow }
      </EuiTableBody>
    </EuiTable>
  );
}

function renderIfBasicStats(_vertex) {
  return (
    <p>There are currently no metrics to show for this if condition.</p>
  );
}

function renderQueueBasicStats(_vertex) {
  return (
    <p>There are currently no metrics to show for the queue.</p>
  );
}

function renderBasicStats(vertex) {
  switch (vertex.typeString) {
    case 'plugin':
      return renderPluginBasicStats(vertex);
      break;
    case 'if':
      return renderIfBasicStats(vertex);
      break;
    case 'queue':
      return renderQueueBasicStats(vertex);
      break;
  }
}

function renderPluginBasicInfo(vertex) {
  if (vertex.hasExplicitId) {
    return (
      <p>This {vertex.typeString}&#39;s ID is <strong>{ vertex.id }</strong>.</p>
    );
  }

  return (
    <div>
      <p>
        This {vertex.typeString} does not have an ID explicitly specified. Specifying an ID allows you to track differences
        across pipeline changes. You can explicitly specify an ID for this plugin like so:
      </p>
      <EuiCodeBlock>
        {vertex.name} {`{
  id => "mySpecialId"
}`}
      </EuiCodeBlock>
      <EuiSpacer />
    </div>
  );
}

function renderIfBasicInfo(vertex) {
  const ifCode = `if (${vertex.subtitle.complete}) {
  ...
}`;

  return (
    <div>
      <p>
        This is a conditional statement in your pipeline.
      </p>
      <EuiCodeBlock>{ ifCode }</EuiCodeBlock>
      <EuiSpacer />
    </div>
  );
}

function renderQueueBasicInfo(_vertex) {
  return (
    <p>
      This is an internal structure used by Logstash to buffer events between
      inputs and the rest of the pipeline.
    </p>
  );
}

function renderBasicInfo(vertex) {
  switch (vertex.typeString) {
    case 'plugin':
      return renderPluginBasicInfo(vertex);
      break;
    case 'if':
      return renderIfBasicInfo(vertex);
      break;
    case 'queue':
      return renderQueueBasicInfo(vertex);
      break;
  }
}

function renderTitle(vertex) {
  switch (vertex.typeString) {
    case 'plugin':
      return `${vertex.title} ${vertex.pluginType}`;
      break;
    case 'if':
    case 'queue':
      return vertex.title;
      break;
  }
}

export function DetailDrawer({ vertex, onHide }) {
  return (
    <EuiFlyout
      size="s"
      onClose={onHide}
    >
      <EuiFlyoutHeader>
        <EuiFlexGroup
          alignItems="center"
        >
          <EuiFlexItem>
            <EuiTitle>
              <h2>{ renderIcon(vertex) }{ renderTitle(vertex) }</h2>
            </EuiTitle>
          </EuiFlexItem>
          <EuiFlexItem grow={false}>
            <EuiButtonIcon
              onClick={onHide}
              iconType="cross"
              aria-label="Close"
            />
          </EuiFlexItem>
        </EuiFlexGroup>
      </EuiFlyoutHeader>
      <EuiFlyoutBody>
        <EuiText>
          { renderBasicInfo(vertex) }
          { renderBasicStats(vertex) }
        </EuiText>
      </EuiFlyoutBody>
    </EuiFlyout>
  );
}
