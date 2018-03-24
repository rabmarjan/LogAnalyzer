import { LicenseStatus as PresentationComponent } from './license_status';
import { connect } from 'react-redux';
import { getLicense, getExpirationDateFormatted, isExpired } from '../../../store/reducers/licenseManagement';

const mapStateToProps = (state) => {
  const { isActive, type } = getLicense(state);
  return {
    status: isActive ? 'Active' : 'Inactive',
    type,
    isExpired: isExpired(state),
    expiryDate: getExpirationDateFormatted(state)
  };
};

export const LicenseStatus = connect(mapStateToProps)(PresentationComponent);
