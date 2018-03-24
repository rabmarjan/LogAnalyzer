import { putLicense } from '../../../lib/license';
import { wrapEsError } from '../../../lib/wrap_es_error';

export function registerLicenseRoute(server) {
  const xpackInfo = server.plugins.xpack_main.info;
  server.route({
    path: '/api/license',
    method: 'PUT',
    handler: (request, reply) => {
      return putLicense(request, xpackInfo)
        .then(reply, e => reply(wrapEsError(e)));
    }
  });
}
