import { resolve } from 'path';
import {
  XPACK_DEFAULT_ADMIN_EMAIL_UI_SETTING,
  XPACK_INFO_API_DEFAULT_POLL_FREQUENCY_IN_MILLIS
} from '../../server/lib/constants';
import { mirrorPluginStatus } from '../../server/lib/mirror_plugin_status';
import { replaceInjectedVars } from './server/lib/replace_injected_vars';
import { setupXPackMain } from './server/lib/setup_xpack_main';
import { xpackInfoRoute, kibanaStatsRoute } from './server/routes/api/v1';

export { callClusterFactory } from './server/lib/call_cluster_factory';

export const xpackMain = (kibana) => {
  return new kibana.Plugin({
    id: 'xpack_main',
    configPrefix: 'xpack.xpack_main',
    publicDir: resolve(__dirname, 'public'),
    require: ['elasticsearch'],

    config(Joi) {
      return Joi.object({
        enabled: Joi.boolean().default(true),
        xpack_api_polling_frequency_millis: Joi.number().default(XPACK_INFO_API_DEFAULT_POLL_FREQUENCY_IN_MILLIS),
      }).default();
    },

    uiExports: {
      uiSettingDefaults: {
        [XPACK_DEFAULT_ADMIN_EMAIL_UI_SETTING]: {
          // TODO: change the description when email address is used for more things?
          description: 'Recipient email address for X-Pack admin operations, such as Cluster Alert email notifications from Monitoring.',
          type: 'string', // TODO: Any way of ensuring this is a valid email address?
          value: null
        }
      },
      hacks: [
        'plugins/xpack_main/hacks/check_xpack_info_change',
      ],
      replaceInjectedVars
    },

    init(server) {
      mirrorPluginStatus(server.plugins.elasticsearch, this, 'yellow', 'red');

      setupXPackMain(server);

      // register routes
      xpackInfoRoute(server);
      kibanaStatsRoute(server);
    }
  });
};
