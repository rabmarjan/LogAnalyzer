import { map } from 'lodash';
import { uiModules } from 'ui/modules';
import template from './action_type_select.html';
import 'angular-ui-select';
import { Action } from 'plugins/watcher/models/action';
import './action_type_select.less';
import 'plugins/watcher/services/settings';

const app = uiModules.get('xpack/watcher');

app.directive('actionTypeSelect', function ($injector) {
  const watcherSettingsService = $injector.get('xpackWatcherSettingsService');

  return {
    restrict: 'E',
    template: template,
    scope: {
      onChange: '='
    },
    controllerAs: 'actionTypeSelect',
    bindToController: true,
    controller: class ActionTypeSelectController {
      constructor() {
        this.selectedItem = { value: null };

        this.loadActionTypes()
          .then(actionTypes => {
            this.actionTypes = actionTypes;
          });
      }

      loadActionTypes() {
        const allActionTypes = Action.getActionTypes();

        // load the configuration settings to determine which actions are enabled
        return watcherSettingsService.getSettings()
          .then(settings => {
            const result = map(allActionTypes, ({ typeName, iconClass, selectMessage }, type) => {
              const isEnabled = settings.actionTypes[type].enabled;

              return {
                type,
                typeName,
                iconClass,
                selectMessage,
                isEnabled
              };
            });

            return result;
          });
      }

      onSelect(actionType) {
        this.selectedItem = { value: null };

        if (actionType.isEnabled) {
          this.onChange(actionType.type);
        }
      }
    }
  };
});
