import React from 'react';
import { ChartTarget } from './chart_target';

export function TimeseriesContainer(props) {
  const container = {
    display: 'flex',
    rowDirection: 'column',
    flex: '1 0 auto',
    position: 'relative'
  };

  return (
    <div style={container}>
      <ChartTarget {...props}/>
    </div>
  );
}
