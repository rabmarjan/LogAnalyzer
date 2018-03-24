/* eslint-disable no-var */
require('jquery');
require('angular');
require('../../../node_modules/angular-paging/dist/paging');

var uiModules = require('ui/modules').uiModules;
uiModules.get('kibana', ['bw.paging']);
