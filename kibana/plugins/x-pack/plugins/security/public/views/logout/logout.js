import chrome from 'ui/chrome';
import 'plugins/security/views/logout/logout.less';

chrome
  .setVisible(false)
  .setRootController('logout', ($window) => {
    $window.sessionStorage.clear();

    // Redirect user to the server logout endpoint to complete logout.
    $window.location.href = chrome.addBasePath(`/api/security/v1/logout${$window.location.search}`);
  });
