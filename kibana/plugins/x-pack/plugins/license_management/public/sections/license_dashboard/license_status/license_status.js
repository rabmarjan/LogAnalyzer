import React from 'react';

export class LicenseStatus extends React.PureComponent {
  render() {
    const { isExpired, status, type, expiryDate } = this.props;

    const panelClasses = (status === 'Active') ? 'kuiInfoPanel--success' : 'kuiInfoPanel--error';
    const iconClasses = (status === 'Active') ? 'kuiIcon--success fa-check' : 'kuiInfoPanel--error fa-warning';
    if (isExpired) {
      return null;
    }
    return (
      <div className={'kuiInfoPanel kuiVerticalRhythm ' + panelClasses}>
        <div className="kuiInfoPanelHeader__title kuiVerticalRhythmSmall">
          <span
            className={'kuiInfoPanelHeader__icon kuiIcon ' + iconClasses}
            aria-label="Check"
            role="img"
          />
          Your { type } license is { status }
        </div>

        <div className="kuiInfoPanelBody">
          <div className="kuiInfoPanelBody__message">
            Your license will expire on <strong>{ expiryDate }</strong>.
          </div>
        </div>
      </div>
    );
  }
}
