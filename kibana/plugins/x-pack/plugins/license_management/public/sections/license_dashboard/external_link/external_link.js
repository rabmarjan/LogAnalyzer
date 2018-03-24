import React from 'react';

export const ExternalLink = ({ children, ...rest }) => {
  return (
    <a {...rest} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
};