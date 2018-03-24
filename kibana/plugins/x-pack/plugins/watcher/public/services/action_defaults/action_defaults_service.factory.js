import { uiModules } from 'ui/modules';
import { XpackWatcherActionDefaultsService } from './action_defaults_service';
import { ActionDefaultsRegistryProvider } from './registry';

import './actions/email_action';
import './actions/logging_action';
import './actions/slack_action';

uiModules.get('xpack/watcher')
  .factory('xpackWatcherActionDefaultsService', ($injector) => {
    const config = $injector.get('config');
    const Private = $injector.get('Private');
    const registry = Private(ActionDefaultsRegistryProvider);

    return new XpackWatcherActionDefaultsService(config, registry);
  });
