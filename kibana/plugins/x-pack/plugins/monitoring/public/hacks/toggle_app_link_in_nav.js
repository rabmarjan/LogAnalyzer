import chrome from 'ui/chrome';
import { uiModules } from 'ui/modules';

uiModules.get('monitoring/hacks').run((monitoringUiEnabled) => {
  if (monitoringUiEnabled || !chrome.navLinkExists('monitoring')) {
    return;
  }

  chrome.getNavLinkById('monitoring').hidden = true;
});
