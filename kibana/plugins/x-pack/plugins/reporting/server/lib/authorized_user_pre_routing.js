import boom from 'boom';
import { getUserFactory } from './get_user';
import { oncePerServer } from './once_per_server';

const superuserRole = 'superuser';

function authorizedUserPreRoutingFn(server) {
  const getUser = getUserFactory(server);
  const config = server.config();

  return async function authorizedUserPreRouting(request, reply) {
    const xpackInfo = server.plugins.xpack_main.info;

    if (!xpackInfo || !xpackInfo.isAvailable()) {
      server.log(['reporting', 'authorizedUserPreRouting', 'debug'], 'Unable to authorize user before xpack info is available.');
      return reply(boom.notFound());
    }

    const security = xpackInfo.feature('security');
    if (!security.isEnabled() || !security.isAvailable()) {
      return reply(null);
    }

    const user = await getUser(request);

    if (!user) {
      return reply(boom.unauthorized(`Sorry, you aren't authenticated`));
    }

    const authorizedRoles = [ superuserRole, ...config.get('xpack.reporting.roles.allow') ];
    if(!user.roles.find(role => authorizedRoles.includes(role))) {
      return reply(boom.forbidden(`Sorry, you don't have access to Reporting`));
    }

    reply(user);
  };
}

export const authorizedUserPreRoutingFactory = oncePerServer(authorizedUserPreRoutingFn);

