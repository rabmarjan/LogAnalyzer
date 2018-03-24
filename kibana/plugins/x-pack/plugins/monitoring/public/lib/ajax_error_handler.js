import { contains } from 'lodash';

export function ajaxErrorHandlersProvider($injector) {
  const kbnUrl = $injector.get('kbnUrl');
  const Notifier = $injector.get('Notifier');
  const $window = $injector.get('$window');

  const notif = new Notifier({ location: 'Monitoring' });

  return (err) => {
    if (err.status === 403) {
      // redirect to error message view
      kbnUrl.redirect('access-denied');
    } else if (err.status === 404 && !contains($window.location.hash, 'no-data')) { // pass through if this is a 404 and we're already on the no-data page
      const config = {
        type: 'error',
        actions: [
          {
            text: 'Retry',
            callback() {
              $window.location.reload(); // do fullpage reload to let routeInit take over
            }
          },
          {
            text: 'Dismiss',
            callback() {} // close the notif
          }
        ]
      };
      notif.custom(err, config);
    } else {
      notif.error(err);
    }

    return Promise.reject(err);
  };
}
