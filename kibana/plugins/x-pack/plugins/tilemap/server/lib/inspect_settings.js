export function inspectSettings(xpackInfo) {

  if (!xpackInfo || !xpackInfo.isAvailable()) {
    return {
      message: 'You cannot use the Tilemap Plugin because license information is not available at this time.'
    };
  }

  /**
   *Propagate these settings to the client
   */
  return {
    license: {
      uid: xpackInfo.license.getUid(),
      active: xpackInfo.license.isActive(),
      valid: xpackInfo.license.isOneOf(['trial', 'standard', 'basic', 'gold', 'platinum'])
    }
  };

}
