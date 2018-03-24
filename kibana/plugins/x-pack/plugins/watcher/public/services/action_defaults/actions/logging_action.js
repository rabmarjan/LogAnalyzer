import { merge } from 'lodash';
import { ACTION_TYPES, WATCH_TYPES } from 'plugins/watcher/../common/constants';
import { ActionDefaultsRegistryProvider } from '../registry';

const actionType = ACTION_TYPES.LOGGING;

function getActionDefaults() {
  return {};
}

ActionDefaultsRegistryProvider.register(() => {
  return {
    actionType,
    watchType: WATCH_TYPES.THRESHOLD,
    getDefaults: (config) => {
      const actionDefaults = getActionDefaults(config);
      const actionWatchComboDefaults = {
        text: 'Watch [{{ctx.metadata.name}}] has exceeded the threshold'
      };

      return merge(actionDefaults, actionWatchComboDefaults);
    }
  };
});
