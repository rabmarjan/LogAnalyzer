import nodeCrypto from '@elastic/node-crypto';
import { oncePerServer } from './once_per_server';

function cryptoFn(server) {
  const encryptionKey = server.config().get('xpack.reporting.encryptionKey');
  return nodeCrypto({ encryptionKey });
}

export const cryptoFactory = oncePerServer(cryptoFn);
