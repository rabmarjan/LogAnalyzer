import { pluginDefinition } from './plugin_definition';

export const watcher = (kibana) => new kibana.Plugin(pluginDefinition);
