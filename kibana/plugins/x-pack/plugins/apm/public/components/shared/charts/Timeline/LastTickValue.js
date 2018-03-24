import React from 'react';

export default function LastTickValue({ x, marginTop, value }) {
  return (
    <g transform={`translate(${x}, ${marginTop})`}>
      <text textAnchor="middle" dy="0" transform="translate(0, -8)">
        {value}
      </text>
    </g>
  );
}

LastTickValue.requiresSVG = true;
