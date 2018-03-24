import React from 'react';
import moment from 'moment-timezone';
import { capitalize } from 'lodash';

import {
  EuiCallOut,
  EuiLink,
  EuiSpacer,
} from '@elastic/eui';

export function LicenseText(props) {
  const formatDateLocal = input => moment.tz(input, moment.tz.guess()).format('LL');
  const goToLicense = () => props.changeUrl('/license');

  const message = (
    <EuiLink onClick={goToLicense} >
      Your { capitalize(props.license.type) } license will expire on { formatDateLocal(props.license.expiry_date) }.
    </EuiLink>
  );

  if (props.license && props.showLicenseExpiration) {
    return (
      <div>
        <EuiCallOut color="warning" title={message} />
        <EuiSpacer size="m" />
      </div>
    );
  }

  return null;
}
