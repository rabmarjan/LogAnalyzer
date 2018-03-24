import { once } from 'lodash';

const callWithRequest = once((server) => {
  const pipeline = server.config().get('elasticsearch');
  const cluster = server.plugins.elasticsearch.createCluster('logstash', pipeline);
  return cluster.callWithRequest;
});

export const callWithRequestFactory = (server, request) => {
  return (...args) => {
    return callWithRequest(server)(request, ...args);
  };
};
