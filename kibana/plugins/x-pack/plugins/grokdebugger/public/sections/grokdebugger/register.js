import { DevToolsRegistryProvider } from 'ui/registry/dev_tools';

DevToolsRegistryProvider.register(() => ({
  order: 6,
  name: 'grokdebugger',
  display: 'Grok Debugger',
  url: '#/dev_tools/grokdebugger'
}));
