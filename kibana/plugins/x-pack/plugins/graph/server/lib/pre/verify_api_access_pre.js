import Boom from 'boom';

export function verifyApiAccessPre(request, reply) {
  const xpackInfo = request.server.plugins.xpack_main.info;
  const graph = xpackInfo.feature('graph');
  const licenseCheckResults = graph.getLicenseCheckResults();

  if (licenseCheckResults.showAppLink && licenseCheckResults.enableAppLink) {
    reply();
  } else {
    reply(Boom.forbidden(licenseCheckResults.message));
  }
}
