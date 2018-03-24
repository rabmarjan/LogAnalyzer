import { once } from 'lodash';
import esShield from './elasticsearch-shield-js/elasticsearch-shield';

export const getClient = once((server) => {
  const config = {
    plugins: [esShield],
    ...server.config().get('elasticsearch')
  };
  const cluster = server.plugins.elasticsearch.createCluster('security', config);

  return cluster;
});
