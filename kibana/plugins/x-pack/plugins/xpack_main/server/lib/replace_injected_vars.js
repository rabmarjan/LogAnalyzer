export async function replaceInjectedVars(originalInjectedVars, request, server) {
  const xpackInfo = server.plugins.xpack_main.info;
  const withXpackInfo = () => ({
    ...originalInjectedVars,
    xpackInitialInfo: xpackInfo.isAvailable() ? xpackInfo.toJSON() : undefined
  });

  // security feature is disabled
  if (!server.plugins.security) {
    return withXpackInfo();
  }

  // not enough license info to make decision one way or another
  if (!xpackInfo.isAvailable() || !xpackInfo.feature('security').getLicenseCheckResults()) {
    return originalInjectedVars;
  }

  // authentication is not a thing you can do
  if (xpackInfo.license.isOneOf('basic')) {
    return withXpackInfo();
  }

  // request is not authenticated
  if (!await server.plugins.security.isAuthenticated(request)) {
    return originalInjectedVars;
  }

  // plugin enabled, license is appropriate, request is authenticated
  return withXpackInfo();
}
