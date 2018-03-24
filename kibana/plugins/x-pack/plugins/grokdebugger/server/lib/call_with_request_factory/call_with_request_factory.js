import { once } from 'lodash';

const callWithRequest = once((server) => {
  const cluster = server.plugins.elasticsearch.getCluster('data');
  return cluster.callWithRequest;
});

export const callWithRequestFactory = (server, request) => {
  return (...args) => {
    return callWithRequest(server)(request, ...args);
  };
};
