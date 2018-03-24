import { set } from 'lodash';
import moment from 'moment-timezone';
import { uiModules } from 'ui/modules';
import uiRoutes from 'ui/routes';
import 'ui/autoload/all';
import 'plugins/monitoring/less/main.less';
import 'plugins/monitoring/filters';
import 'plugins/monitoring/services/clusters';
import 'plugins/monitoring/services/features';
import 'plugins/monitoring/services/executor';
import 'plugins/monitoring/services/license';
import 'plugins/monitoring/services/title';
import 'plugins/monitoring/services/breadcrumbs';
import 'plugins/monitoring/directives/all';
import 'plugins/monitoring/views/all';

const uiModule = uiModules.get('kibana');
uiModule.run((uiSettings, config) => {
  // Allow UTC times to be entered for Absolute Time range in timepicker
  moment.tz.setDefault(config.get('dateFormat:tz'));

  set(uiSettings, 'defaults.timepicker:timeDefaults.value', JSON.stringify({
    from: 'now-1h',
    to: 'now',
    mode: 'quick'
  }));

  set(uiSettings, 'defaults.timepicker:refreshIntervalDefaults.value', JSON.stringify({
    display: '10 seconds',
    pause: false,
    value: 10000
  }));
});

// Enable Angular routing
uiRoutes.enable();
