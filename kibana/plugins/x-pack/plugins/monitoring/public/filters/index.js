import _ from 'lodash';
import moment from 'moment-timezone';
import { uiModules } from 'ui/modules';
import { formatNumber, formatMetric } from 'plugins/monitoring/lib/format_number';
import { extractIp } from 'plugins/monitoring/lib/extract_ip';

const uiModule = uiModules.get('monitoring/filters', []);
uiModule.filter('localizedDate', function () {
  return function (input) {
    return moment.tz(input, moment.tz.guess()).format('LLL z');
  };
});

uiModule.filter('capitalize', function () {
  return function (input) {
    return _.capitalize(input.toLowerCase());
  };
});

uiModule.filter('formatNumber', function () {
  return formatNumber;
});

uiModule.filter('formatMetric', function () {
  return formatMetric;
});

uiModule.filter('extractIp', function () {
  return extractIp;
});
