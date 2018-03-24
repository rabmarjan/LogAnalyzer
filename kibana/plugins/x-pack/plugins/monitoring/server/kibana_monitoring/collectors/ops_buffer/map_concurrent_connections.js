import _ from 'lodash';

export function mapConcurrentConnections(concurrents) {
  return _.reduce(_.values(concurrents), (result, value) => {
    return result + value;
  }, 0);
}
