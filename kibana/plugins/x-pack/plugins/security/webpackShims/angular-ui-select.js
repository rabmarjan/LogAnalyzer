/* eslint-disable no-var */
require('jquery');
require('angular');
require('angular-sanitize');
require('ui-select/dist/select');
require('ui-select/dist/select.css');

var uiModules = require('ui/modules').uiModules;
uiModules.get('kibana', ['ui.select', 'ngSanitize']);
