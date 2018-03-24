import React from 'react';

export class ExpirationNotice extends React.PureComponent {
  render() {
    const { licenseType, expiryDate, isExpired } = this.props;
    if (!isExpired) {
      return null;
    }
    return (
      <div className="kuiVerticalRhythm">
        <h1 className="kuiTitle kuiVerticalRhythmSmall">
          <span className="kuiIcon fa-warning kuiIcon--error" />
          Your {licenseType} license has expired
        </h1>

        <p className="kuiText kuiVerticalRhythmSmall">
          Your license expired on {expiryDate}.
        </p>
      </div>
    );
  }
}


