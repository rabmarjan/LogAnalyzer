import PropTypes from 'prop-types';
import React from 'react';

function SelectionMarker({ innerHeight, marginTop, start, end }) {
  const width = Math.abs(end - start);
  const x = start < end ? start : end;
  return (
    <rect
      pointerEvents="none"
      fill="black"
      fillOpacity="0.1"
      x={x}
      y={marginTop}
      width={width}
      height={innerHeight}
    />
  );
}

SelectionMarker.requiresSVG = true;
SelectionMarker.propTypes = {
  start: PropTypes.number,
  end: PropTypes.number
};

export default SelectionMarker;
