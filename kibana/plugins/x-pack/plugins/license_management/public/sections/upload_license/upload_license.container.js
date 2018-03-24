import { connect } from 'react-redux';
import { uploadLicense, uploadLicenseStatus } from "../../store/actions/upload_license";
import { addUploadErrorMessage } from "../../store/actions/add_error_message";

import {
  getUploadErrorMessage,
  getLicenseType,
  isInvalid,
  isApplying,
  needsAcknowledgement,
  uploadMessages
} from "../../store/reducers/licenseManagement";
import { UploadLicense as PresentationComponent } from './upload_license';


const mapStateToProps = (state) => {
  return {
    isInvalid: isInvalid(state),
    needsAcknowledgement: needsAcknowledgement(state),
    messages: uploadMessages(state),
    errorMessage: getUploadErrorMessage(state),
    applying: isApplying(state),
    currentLicenseType: getLicenseType(state) || ''
  };
};
const mapDispatchToProps = {
  addUploadErrorMessage,
  uploadLicense,
  uploadLicenseStatus,
};

export const UploadLicense = connect(mapStateToProps, mapDispatchToProps)(PresentationComponent);
