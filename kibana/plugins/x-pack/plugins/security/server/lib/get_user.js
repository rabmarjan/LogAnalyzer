import { getClient } from '../../../../server/lib/get_client_shield';

export function getUserProvider(server) {
  const callWithRequest = getClient(server).callWithRequest;

  server.expose('getUser', async (request) => {
    const xpackInfo = server.plugins.xpack_main.info;
    if (xpackInfo && xpackInfo.isAvailable() && !xpackInfo.feature('security').isEnabled()) {
      return Promise.resolve(null);
    }
    return await callWithRequest(request, 'shield.authenticate');
  });
}
