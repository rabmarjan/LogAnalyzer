import React from 'react';

import { BASE_PATH } from '../../../common/constants';
import { ExpirationNotice } from './expiration_notice';
import { LicenseStatus } from './license_status';
import { BasicLicenseRegistration } from './basic_license_registration';
import { SubscriptionRegistration } from './subscription_registration';

export class LicenseDashboard extends React.PureComponent {
  render() {
    const { isExpired } = this.props;
    return (
      <div className="kuiViewContent kuiViewContent--constrainedWidth">
        <div className="kuiNotice">
          <ExpirationNotice />
          <LicenseStatus />
          <div className="kuiCardGroup kuiCardGroup--united kuiVerticalRhythm">
            <BasicLicenseRegistration />
            <SubscriptionRegistration />
          </div>
          <p className="kuiText kuiVerticalRhythm text-center">
            { `${isExpired ? 'Already have your' : 'Have a newer' } license? Splendid! `}
            <a href={`#${BASE_PATH}upload_license`}>Install it now.</a>
          </p>
        </div>
      </div>
    );
  }
}
