export function initLogoutView(server) {
  const logout = server.getHiddenUiAppById('logout');

  server.route({
    method: 'GET',
    path: '/logout',
    handler(request, reply) {
      return reply.renderAppWithDefaultConfig(logout);
    },
    config: {
      auth: false
    }
  });
}
