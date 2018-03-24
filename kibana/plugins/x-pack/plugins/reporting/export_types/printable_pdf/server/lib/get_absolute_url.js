import url from 'url';
import { oncePerServer } from '../../../../server/lib/once_per_server';

function getAbsoluteUrlFn(server) {
  const config = server.config();

  return function getAbsoluteUrl(urlHash) {
    return url.format({
      protocol: config.get('xpack.reporting.kibanaServer.protocol') || server.info.protocol,
      hostname: config.get('xpack.reporting.kibanaServer.hostname') || config.get('server.host'),
      port: config.get('xpack.reporting.kibanaServer.port') || config.get('server.port'),
      pathname: config.get('server.basePath') + config.get('xpack.reporting.kibanaApp'),
      hash: urlHash
    });
  };
}

export const getAbsoluteUrlFactory = oncePerServer(getAbsoluteUrlFn);