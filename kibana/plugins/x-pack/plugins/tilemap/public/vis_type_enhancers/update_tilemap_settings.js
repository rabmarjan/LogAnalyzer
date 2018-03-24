import uiRoutes from 'ui/routes';
import { XPackInfoProvider } from 'plugins/xpack_main/services/xpack_info';
import 'ui/vis/map/service_settings';

uiRoutes.addSetupWork(function (Private, serviceSettings) {

  const xpackInfo = Private(XPackInfoProvider);
  const tileMapPluginInfo = xpackInfo.get('features.tilemap');

  if (!tileMapPluginInfo) {
    return;
  }

  if (!tileMapPluginInfo.license.active || !tileMapPluginInfo.license.valid) {
    return;
  }
  serviceSettings.addQueryParams({ license: tileMapPluginInfo.license.uid });

});
