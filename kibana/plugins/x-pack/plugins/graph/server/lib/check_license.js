export function checkLicense(xpackLicenseInfo) {

  if (!xpackLicenseInfo || !xpackLicenseInfo.isAvailable()) {
    return {
      showAppLink: true,
      enableAppLink: false,
      message: 'Graph is unavailable - license information is not available at this time.'
    };
  }

  const graphFeature = xpackLicenseInfo.feature('graph');
  if (!graphFeature.isEnabled()) {
    return {
      showAppLink: false,
      enableAppLink: false,
      message: 'Graph is unavailable'
    };
  }

  const isLicenseActive = xpackLicenseInfo.license.isActive();
  let message;
  if (!isLicenseActive) {
    message = `Graph is unavailable - license has expired.`;
  }

  if (xpackLicenseInfo.license.isOneOf([ 'trial', 'platinum' ])) {
    return {
      showAppLink: true,
      enableAppLink: isLicenseActive,
      message
    };
  }

  message = `Graph is unavailable for the current ${xpackLicenseInfo.license.getType()} license. Please upgrade your license.`;
  return {
    showAppLink: false,
    enableAppLink: false,
    message
  };
}
