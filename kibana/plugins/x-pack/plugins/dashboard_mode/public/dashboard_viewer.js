// Copied largely from plugins/kibana/public/kibana.js. The dashboard viewer includes just the dashboard section of
// the standard kibana plugin.  We don't want to include code for the other links (visualize, dev tools, etc)
// since it's view only, but we want the urls to be the same, so we are using largely the same setup.

// preloading (for faster webpack builds)
import chrome from 'ui/chrome';
import routes from 'ui/routes';
import { uiModules } from 'ui/modules';

import 'ui/autoload/all';
import 'plugins/kibana/dashboard';
import 'ui/vislib';
import 'ui/agg_response';
import 'ui/agg_types';
import 'ui/timepicker';
import 'leaflet';

import { Notifier } from 'ui/notify/notifier';
import { DashboardConstants } from 'plugins/kibana/dashboard/dashboard_constants';
import { KibanaRootController } from 'plugins/kibana/kibana_root_controller';

uiModules.get('kibana')
  .config(dashboardConfigProvider => dashboardConfigProvider.turnHideWriteControlsOn());

routes.enable();
routes.otherwise({ redirectTo: DashboardConstants.LANDING_PAGE_PATH });

chrome
  .setRootController('kibana', function ($controller, $scope, courier, config) {
    chrome.showOnlyById('kibana:dashboard');
    $controller(KibanaRootController, { $scope, courier, config });
  });

uiModules.get('kibana').run(Notifier.pullMessageFromUrl);
