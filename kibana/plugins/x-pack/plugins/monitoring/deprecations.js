import { get, has, set } from 'lodash';

/**
 * Re-writes deprecated user-defined config settings and logs warnings as a
 * result of any rewrite operations.
 *
 * Important: Do not remove any deprecation warning until at least the next
 * major version!
 * @param rename {Function} config rename function from Kibana
 * @return {Array} array of rename operations and callback function for rename logging
 */
export const deprecations = ({ rename }) => {
  return [
    rename('elasticsearch.ssl.ca', 'elasticsearch.ssl.certificateAuthorities'),
    rename('elasticsearch.ssl.cert', 'elasticsearch.ssl.certificate'),
    (settings, log) => {
      if (!has(settings, 'elasticsearch.ssl.verify')) {
        return;
      }

      const verificationMode = get(settings, 'elasticsearch.ssl.verify') ? 'full' : 'none';
      set(settings, 'elasticsearch.ssl.verificationMode', verificationMode);
      delete settings.elasticsearch.ssl.verify;

      log('Config key "xpack.monitoring.elasticsearch.ssl.verify" is deprecated. ' +
          'It has been replaced with "xpack.monitoring.elasticsearch.ssl.verificationMode"');
    },
    (settings, log) => {
      if (has(settings, 'node_resolver')) {
        log('Config key "xpack.monitoring.node_resolver" is deprecated. ' +
            'The only possible value is "uuid". This config key will be removed in 7.0.');
      }
    }
  ];
};
