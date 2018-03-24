import React from 'react';
import { StatusIcon } from 'plugins/monitoring/components/status_icon';

export function KibanaStatusIcon({ status, availability = true }) {
  const type = (() => {
    if (!availability) {
      return StatusIcon.TYPES.GRAY;
    }

    const statusKey = status.toUpperCase();
    return StatusIcon.TYPES[statusKey] || StatusIcon.TYPES.YELLOW;
  })();

  return (
    <StatusIcon type={type} label={`Health: ${status}`} />
  );
}
