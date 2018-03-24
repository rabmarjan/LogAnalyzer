import { once } from 'lodash';

const _callWithInternalUser = once((server) => {
  const { callWithInternalUser } = server.plugins.elasticsearch.getCluster('admin');
  return callWithInternalUser;
});

export const callWithInternalUserFactory = (server) => {
  return (...args) => {
    return _callWithInternalUser(server)(...args);
  };
};
