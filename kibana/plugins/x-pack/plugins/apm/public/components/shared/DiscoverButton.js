import React from 'react';
import { KibanaLink } from '../../utils/url';
import { KuiButton, KuiButtonIcon } from 'ui_framework/components';

function DiscoverButton({ query, children }) {
  return (
    <KibanaLink pathname={'/app/kibana'} hash={'/discover'} query={query}>
      <KuiButton
        buttonType="secondary"
        icon={<KuiButtonIcon className="fa-compass" />}
      >
        {children || 'View in Discover'}
      </KuiButton>
    </KibanaLink>
  );
}

export default DiscoverButton;
