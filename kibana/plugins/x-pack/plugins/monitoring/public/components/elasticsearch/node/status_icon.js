import React from 'react';
import { StatusIcon } from 'plugins/monitoring/components/status_icon';

export function NodeStatusIcon({ status }) {
  const type = (status === 'Online') ? StatusIcon.TYPES.GREEN : StatusIcon.TYPES.GRAY;

  return (
    <StatusIcon type={type} label={`Health: ${status}`} />
  );
}
