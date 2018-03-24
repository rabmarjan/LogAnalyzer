import React from 'react';
import PropTypes from 'prop-types';

function SingleRect({ innerHeight, marginTop, style, x, width }) {
  return (
    <rect
      style={style}
      height={innerHeight}
      width={width}
      rx={'2px'}
      ry={'2px'}
      x={x}
      y={marginTop}
    />
  );
}

SingleRect.requiresSVG = true;
SingleRect.propTypes = {
  x: PropTypes.number.isRequired
};

export default SingleRect;
