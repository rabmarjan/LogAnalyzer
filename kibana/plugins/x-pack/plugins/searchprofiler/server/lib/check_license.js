export function checkLicense(xpackLicenseInfo) {

  if (!xpackLicenseInfo || !xpackLicenseInfo.isAvailable()) {
    return {
      showAppLink: true,
      enableAppLink: false,
      message: 'Search Profiler is unavailable - license information is not available at this time.'
    };
  }

  const isLicenseActive = xpackLicenseInfo.license.isActive();
  let message;
  if (!isLicenseActive) {
    message = `Search Profiler is unavailable - license has expired.`;
  }

  if (xpackLicenseInfo.license.isOneOf([ 'trial', 'basic', 'standard', 'gold', 'platinum' ])) {
    return {
      showAppLink: true,
      enableAppLink: isLicenseActive,
      message
    };
  }

  message = `Search Profiler is unavailable for the current ${xpackLicenseInfo.license.getType()} license. Please upgrade your license.`;
  return {
    showAppLink: false,
    enableAppLink: false,
    message
  };
}
