export function xpackUsage(client) {
  /*
   * Get an object over the Usage API that as available/enabled data and some
   * select metadata for each of the X-Pack UI plugins
   */
  return client.transport.request({
    method: 'GET',
    path: '/_xpack/usage'
  });
}
