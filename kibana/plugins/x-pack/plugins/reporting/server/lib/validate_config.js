import crypto from 'crypto';

export function validateConfig(config, log) {
  const encryptionKey = config.get('xpack.reporting.encryptionKey');
  if (encryptionKey === null || encryptionKey === undefined) {
    log('Generating a random key for xpack.reporting.encryptionKey. To prevent pending reports from failing on ' +
      'restart, please set xpack.reporting.encryptionKey in kibana.yml');
    config.set('xpack.reporting.encryptionKey', crypto.randomBytes(16).toString('hex'));
  }
}
