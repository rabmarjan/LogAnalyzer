import React from 'react';

import {
  KuiButton,
  KuiConfirmModal,
  KuiModalOverlay
} from 'ui_framework/components';

export class UploadLicense extends React.PureComponent {
  getFile = () => {
    return this.fileInput.files[0];
  }
  send = (acknowledge) => {
    const file = this.getFile();
    const fr = new FileReader();
    fr.onload = ({ target: { result } }) => {
      this.props.uploadLicense(result, this.props.currentLicenseType, acknowledge);
    };
    fr.readAsText(file);
  }

  cancel = () => {
    this.props.uploadLicenseStatus({});
  }

  acknowledgeModal() {
    const { needsAcknowledgement, messages: [firstLine, ...messages] = [] } = this.props;
    if (!needsAcknowledgement) {
      return null;
    }
    return (
      <KuiModalOverlay>
        <KuiConfirmModal
          title="Confirm License Upload"
          onCancel={this.cancel}
          onConfirm={() => this.send(true)}
          cancelButtonText="Cancel"
          confirmButtonText="Confirm"
        >
          <div>
            <p>{ firstLine }</p>
            <ul>
              { messages.map((message) => (<li key={message}>{ message }</li>)) }
            </ul>
          </div>
        </KuiConfirmModal>
      </KuiModalOverlay>
    );
  }
  errorMessage() {
    const { errorMessage } = this.props;
    if (!errorMessage) {
      return null;
    }
    return (
      <div className="kuiInfoPanel kuiInfoPanel--error kuiVerticalRhythm">
        <div className="kuiInfoPanelHeader">
          <span
            className="kuiInfoPanelHeader__icon kuiIcon kuiIcon--error fa-warning"
            aria-label="Warning"
            role="img"
          />
          <span className="kuiInfoPanelHeader__title">
            {errorMessage}
          </span>
        </div>
      </div>
    );
  }
  checkForFile = () => {
    if (this.getFile()) {
      this.props.addUploadErrorMessage('');
    }
  }
  submit = (event) => {
    event.preventDefault();
    if (this.getFile()) {
      this.send();
    } else {
      this.props.addUploadErrorMessage('You must select a license file.');
    }
  }

  render() {
    const { currentLicenseType, applying } = this.props;
    return (
      <div className="kuiNotice">
        <div className="kuiPanel">
          { this.acknowledgeModal() }
          <div className="kuiPanelHeader">
            <div className="kuiPanelHeader__title">
              Upload a license
            </div>
          </div>
          <div className="kuiPanelBody">
            <p>Your license key is a JSON file with a signature attached.</p>
            <p>Uploading a license will replace your current <b>{ currentLicenseType.toUpperCase() }</b> license.</p>
            <form>
              { this.errorMessage() }
              <div className="kuiVerticalRhythm">
                <p>
                  <input
                    ref={(input) => { this.fileInput = input; }}
                    type="file"
                    onChange={this.checkForFile}
                    name="licenseFile"
                  />
                </p>
              </div>
              <KuiButton
                isLoading={applying}
                disabled={applying}
                buttonType="primary"
                onClick={this.submit}
              >
                {applying ? 'Uploading...' : 'Upload'}
              </KuiButton>
            </form>
          </div>
        </div>
      </div>
    );
  }
}
