import { uiModules } from 'ui/modules';
import uiChrome from 'ui/chrome';
import { PathProvider } from 'plugins/xpack_main/services/path';
import 'plugins/monitoring/services/clusters';
import { Telemetry } from './telemetry';

function telemetryStart($injector) {
  const Private = $injector.get('Private');
  // no telemetry for non-logged in users
  if (Private(PathProvider).isLoginOrLogout()) { return; }

  const sender = new Telemetry($injector, uiChrome.getBasePath());
  sender.start();
}

uiModules.get('monitoring/hacks').run(telemetryStart);
