import React from 'react';
import { px, units } from '../../style/variables';

export function Icon({ name, className, ...props }) {
  return <i className={`fa ${name} ${className}`} {...props} />;
}

export function Ellipsis({ horizontal, style, ...props }) {
  return (
    <Icon
      style={{
        transition: 'transform 0.1s',
        transform: `rotate(${horizontal ? 90 : 0}deg)`,
        ...style
      }}
      name="fa-ellipsis-v"
      {...props}
    />
  );
}

export function Info({ style, ...props }) {
  return (
    <Icon
      style={{
        marginRight: `${px(units.half)}`,
        ...style
      }}
      name="fa-info-circle"
      {...props}
    />
  );
}

export function Check({ ...props }) {
  return <Icon name="fa-check" {...props} />;
}

export function Close({ ...props }) {
  return <Icon name="fa-times" {...props} />;
}
