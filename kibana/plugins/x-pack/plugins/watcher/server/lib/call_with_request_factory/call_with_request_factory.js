import { once } from 'lodash';
import { elasticsearchJsPlugin } from '../elasticsearch_js_plugin';

const callWithRequest = once((server) => {
  const config = {
    plugins: [ elasticsearchJsPlugin ],
    ...server.config().get('elasticsearch')
  };
  const cluster = server.plugins.elasticsearch.createCluster('watcher', config);

  return cluster.callWithRequest;
});

export const callWithRequestFactory = (server, request) => {
  return (...args) => {
    return callWithRequest(server)(request, ...args);
  };
};
