import { uiModules } from 'ui/modules';
import { createHtmlIdGenerator } from './html_id_generator_service';

uiModules.get('xpack/watcher')
  .factory('xpackWatcherHtmlIdGeneratorFactory', () => {
    return {
      create(...args) {
        return createHtmlIdGenerator(...args);
      }
    };
  });
