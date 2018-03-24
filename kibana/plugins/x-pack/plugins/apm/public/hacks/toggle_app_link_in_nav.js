import chrome from 'ui/chrome';

const apmUiEnabled = chrome.getInjected('apmUiEnabled');
if (apmUiEnabled === false && chrome.navLinkExists('apm')) {
  chrome.getNavLinkById('apm').hidden = true;
}
