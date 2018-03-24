import React from 'react';

export class BasicLicenseRegistration extends React.PureComponent {
  render() {
    const { shouldShowBasicRegistration } = this.props;
    if (!shouldShowBasicRegistration) {
      return null;
    }
    return (
      <div className="kuiCard">
        <div className="kuiCard__description">
          <div className="kuiCard__descriptionTitle">
            Register for a Basic License
          </div>
          <div className="kuiCard__descriptionText">
            Monitoring is available for free with a Basic License. Simply register, check your inbox, and enjoy!
          </div>
        </div>
        <div className="kuiCard__footer">
          <a
            className="kuiButton kuiButton--secondary"
            href="https://register.elastic.co/xpack_register"
            target="_blank"
            rel="noopener noreferrer"
          >
            Get Basic
          </a>
        </div>
      </div>
    );
  }
}
