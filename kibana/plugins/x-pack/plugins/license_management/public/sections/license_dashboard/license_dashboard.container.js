import { connect } from 'react-redux';
import { LicenseDashboard as PresentationComponent } from './license_dashboard';
import { isExpired } from '../../store/reducers/licenseManagement';

const mapStateToProps = (state) => {
  return {
    isExpired: isExpired(state)
  };
};

export const LicenseDashboard = connect(mapStateToProps)(PresentationComponent);
