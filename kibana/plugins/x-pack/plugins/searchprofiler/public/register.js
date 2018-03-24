import { DevToolsRegistryProvider } from 'ui/registry/dev_tools';

DevToolsRegistryProvider.register(() => ({
  order: 5,
  name: 'searchprofiler',
  display: 'Search Profiler',
  url: '#/dev_tools/searchprofiler'
}));
