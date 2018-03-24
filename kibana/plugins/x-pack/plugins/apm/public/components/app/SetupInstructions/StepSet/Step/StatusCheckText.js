import React from 'react';
import styled from 'styled-components';

import { px, unit, units } from '../../../../../style/variables';

function StatusCheckText({ type, icon, text }) {
  const StatusElm = styled.div`
    display: inline-block;
    margin: ${px(unit)};
    padding: ${px(units.quarter)} ${px(unit)};
  `;
  const typeClass = `kuiStatusText kuiStatusText--${type}`;
  const iconClass = `kuiStatusText__icon kuiIcon fa-${icon}`;

  return (
    <StatusElm className="kuiText">
      <span className={typeClass}>
        <span className={iconClass} />
        {text}
      </span>
    </StatusElm>
  );
}

export default StatusCheckText;
