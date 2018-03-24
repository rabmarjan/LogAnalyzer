export const getCallClusterPre = {
  assign: 'callCluster',
  method(request, reply) {
    const cluster = request.server.plugins.elasticsearch.getCluster('data');
    reply((...args) => cluster.callWithRequest(request, ...args));
  }
};
