import { Notifier } from 'ui/notify/notifier';

export function GateKeeperProvider(kbnUrl, esDataIsTribe) {
  const notifier = new Notifier();

  return {
    redirectAndNotifyIfTribe(message = 'Not available when using a Tribe node', path = '/management') {
      this.assertOrRedirectToPathWithMessage(!esDataIsTribe, message, path);
    },

    assertOrRedirectToPathWithMessage(assertion, message, path) {
      if (assertion) {
        return;
      }

      this.redirectToPathWithMessage(path, message);
    },

    redirectToPathWithMessage(path, message) {
      notifier.error(message);
      kbnUrl.redirect(path);
    }
  };
}
