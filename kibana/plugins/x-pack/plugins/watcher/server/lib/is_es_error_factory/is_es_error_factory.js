import { memoize } from 'lodash';

const esErrorsFactory = memoize((server) => {
  return server.plugins.elasticsearch.getCluster('admin').errors;
});

export function isEsErrorFactory(server) {
  const esErrors = esErrorsFactory(server);
  return function isEsError(err) {
    return err instanceof esErrors._Abstract;
  };
}