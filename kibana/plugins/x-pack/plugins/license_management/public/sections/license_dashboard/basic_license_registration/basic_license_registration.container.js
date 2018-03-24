import { connect } from 'react-redux';

import { BasicLicenseRegistration as PresentationComponent } from './basic_license_registration';
import { showBasicRegistration } from '../../../store/reducers/licenseManagement';

const mapStateToProps = (state) => {
  return {
    shouldShowBasicRegistration: showBasicRegistration(state)
  };
};

export const BasicLicenseRegistration = connect(mapStateToProps)(PresentationComponent);
