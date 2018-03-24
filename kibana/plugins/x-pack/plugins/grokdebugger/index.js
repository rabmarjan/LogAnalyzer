import { resolve } from 'path';
import { registerGrokdebuggerRoutes } from './server/routes/api/grokdebugger';

export const grokdebugger = (kibana) => new kibana.Plugin({
  id: 'grokdebugger',
  publicDir: resolve(__dirname, 'public'),
  require: ['kibana', 'elasticsearch', 'xpack_main'],
  configPrefix: 'xpack.grokdebugger',
  config(Joi) {
    return Joi.object({
      enabled: Joi.boolean().default(true)
    }).default();
  },
  uiExports: {
    devTools: ['plugins/grokdebugger/sections/grokdebugger'],
    hacks: ['plugins/grokdebugger/sections/grokdebugger/register'],
    home: ['plugins/grokdebugger/register_feature'],
  },
  init: (server) => {
    registerGrokdebuggerRoutes(server);
  }
});
