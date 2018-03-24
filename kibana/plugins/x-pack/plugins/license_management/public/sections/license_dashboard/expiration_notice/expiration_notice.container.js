import { connect } from 'react-redux';
import { ExpirationNotice as PresentationComponent } from './expiration_notice';
import { isExpired, getExpirationDateFormatted, getLicenseType } from '../../../store/reducers/licenseManagement';

const mapStateToProps = (state) => {
  return {
    isExpired: isExpired(state),
    expiryDate: getExpirationDateFormatted(state),
    licenseType: getLicenseType(state)
  };
};

export const ExpirationNotice = connect(mapStateToProps)(PresentationComponent);
