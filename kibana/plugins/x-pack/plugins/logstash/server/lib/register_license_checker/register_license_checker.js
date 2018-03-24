import { mirrorPluginStatus } from '../../../../../server/lib/mirror_plugin_status';
import { checkLicense } from '../check_license';
import { PLUGIN } from '../../../common/constants';

export function registerLicenseChecker(server) {
  const xpackMainPlugin = server.plugins.xpack_main;
  const logstashPlugin = server.plugins.logstash;

  mirrorPluginStatus(xpackMainPlugin, logstashPlugin);
  xpackMainPlugin.status.once('green', () => {
    // Register a function that is called whenever the xpack info changes,
    // to re-compute the license check results for this plugin
    xpackMainPlugin.info.feature(PLUGIN.ID).registerLicenseCheckResultsGenerator(checkLicense);
  });
}
