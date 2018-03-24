import { resolve } from 'path';
import Boom from 'boom';

import { initServer } from './server';
import mappings from './mappings.json';

export function graph(kibana) {
  return new kibana.Plugin({
    id: 'graph',
    configPrefix: 'xpack.graph',
    publicDir: resolve(__dirname, 'public'),
    require: ['kibana', 'elasticsearch', 'xpack_main'],
    uiExports: {
      app: {
        title: 'Graph',
        order: 9000,
        icon: 'plugins/graph/icon.png',
        description: 'Graph exploration',
        main: 'plugins/graph/app',
        injectVars(server, options) {
          const config = server.config();
          return {
            esApiVersion: config.get('elasticsearch.apiVersion'),
            esShardTimeout: config.get('elasticsearch.shardTimeout'),
            graphSavePolicy: config.get('xpack.graph.savePolicy'),
            canEditDrillDownUrls: config.get('xpack.graph.canEditDrillDownUrls')
          };
        },
        uses: [
          'fieldFormats',
          'savedObjectTypes',
        ]
      },
      hacks: ['plugins/graph/hacks/toggle_app_link_in_nav'],
      home: ['plugins/graph/register_feature'],
      mappings
    },

    config(Joi) {
      return Joi.object({
        enabled: Joi.boolean().default(true),
        canEditDrillDownUrls: Joi.boolean().default(true),
        savePolicy: Joi.string().valid(['config', 'configAndDataWithConsent', 'configAndData', 'none']).default('configAndData'),
      }).default();
    },

    init(server) {
      initServer(server);
    },
  });
}
