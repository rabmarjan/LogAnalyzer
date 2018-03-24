import React from 'react';
import { formatBytesUsage, formatPercentageUsage } from 'plugins/monitoring/lib/format_number';

import {
  EuiSpacer,
  EuiFlexItem,
  EuiFlexGroup,
  EuiTitle,
  EuiIcon,
  EuiHealth,
  EuiText,
} from '@elastic/eui';

export function HealthStatusIndicator(props) {

  const statusColorMap = {
    green: 'success',
    yellow: 'warning',
    red: 'danger'
  };

  const statusColor = statusColorMap[props.status];

  return (
    <EuiHealth color={statusColor} data-test-subj="statusIcon">
      Health is {props.status}
    </EuiHealth>
  );
}

export function ClusterItemContainer(props) {
  const iconMap = {
    elasticsearch: 'logoElasticSearch',
    kibana: 'logoKibana',
    logstash: 'logoLogstash',
    beats: 'logoBeats',
  };
  const icon = iconMap[props.url];

  return (
    <div data-test-subj={`clusterItemContainer${props.title}`}>
      <EuiFlexGroup gutterSize="m" alignItems="center">
        <EuiFlexItem grow={false}>
          <EuiFlexGroup gutterSize="m" alignItems="center">
            <EuiFlexItem grow={false}>
              <EuiIcon type={icon} size="l" />
            </EuiFlexItem>
            <EuiFlexItem>
              <EuiTitle>
                <h2>
                  { props.title }
                </h2>
              </EuiTitle>
            </EuiFlexItem>
          </EuiFlexGroup>
        </EuiFlexItem>
        <EuiFlexItem grow={false}>
          { props.statusIndicator }
        </EuiFlexItem>
      </EuiFlexGroup>
      <EuiSpacer size="m" />
      { props.children }

      <EuiSpacer size="xxl" />
    </div>
  );
}

export function BytesUsage({ usedBytes, maxBytes }) {
  if (usedBytes && maxBytes) {
    return (
      <span>
        <EuiText>
          { formatPercentageUsage(usedBytes, maxBytes) }
        </EuiText>
        <EuiText color="subdued" size="s">
          { formatBytesUsage(usedBytes, maxBytes) }
        </EuiText>
      </span>
    );
  }

  return null;
}

export function BytesPercentageUsage({ usedBytes, maxBytes }) {
  if (usedBytes && maxBytes) {
    return (
      <span>
        <EuiText>
          { formatPercentageUsage(usedBytes, maxBytes) }
        </EuiText>
        <EuiText color="subdued" size="s">
          { formatBytesUsage(usedBytes, maxBytes) }
        </EuiText>
      </span>
    );
  }

  return null;
}
