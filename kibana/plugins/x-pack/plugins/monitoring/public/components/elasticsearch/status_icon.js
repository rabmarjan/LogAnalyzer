import React from 'react';
import { StatusIcon } from 'plugins/monitoring/components/status_icon';

export function ElasticsearchStatusIcon({ status }) {
  const type = (() => {
    const statusKey = status.toUpperCase();
    return StatusIcon.TYPES[statusKey] || StatusIcon.TYPES.GRAY;
  })();

  return (
    <StatusIcon type={type} label={`Health: ${status}`} />
  );
}
