const Boom = require('boom');

export function routePreCheckLicense(server) {
  const xpackMainPlugin = server.plugins.xpack_main;
  const pluginId = 'security';
  return function forbidApiAccess(request, reply) {
    const licenseCheckResults = xpackMainPlugin.info.feature(pluginId).getLicenseCheckResults();
    if (!licenseCheckResults.showLinks) {
      reply(Boom.forbidden(licenseCheckResults.linksMessage));
    } else {
      reply();
    }
  };
}
