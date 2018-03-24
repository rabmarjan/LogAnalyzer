import chrome from 'ui/chrome';
import { Notifier } from 'ui/notify/notifier';
import { uiModules } from 'ui/modules';
import { PathProvider } from 'plugins/xpack_main/services/path';
import { CONFIG_SHOW_BANNER, CONFIG_ALLOW_REPORT } from 'monitoring-constants';

function renderBanner($injector) {
  const config = $injector.get('config');
  const notify = new Notifier('X-Pack');
  const directive = {
    template: (`
      <div>
        <div class="euiText">
          <h3>X-Pack is installed</h3>
          <p>
            Sharing your cluster statistics with us helps us improve. Your data is never shared with anyone.
            <span ng-switch="welcome.allowReport">
              <span ng-switch-when="true">
                Not interested? <a ng-click="welcome.toggleOpt({ allowReport: false })">Opt out here</a>.
              </span>
              <span ng-switch-default>
                <a ng-click="welcome.toggleOpt({ allowReport: true })" class="euiLink euiLink--primary">Opt in here</a>.
              </span>
            </span>
          </p>
        </div>
        <div class="euiSpacer euiSpacer--m"></div>
      </div>
    `),
    controllerAs: 'welcome',
    controller() {
      this.allowReport = config.get(CONFIG_ALLOW_REPORT);

      this.toggleOpt = ({ allowReport }) => {
        this.allowReport = allowReport;
        config.set(CONFIG_ALLOW_REPORT, allowReport);
      };
    }
  };

  notify.directive(directive, {
    type: 'banner',
    lifetime: Infinity,
    actions: [{
      text: 'Dismiss',
      callback() {
        return config.set(CONFIG_SHOW_BANNER, false);
      }
    }]
  });
}

function customBanner($injector, _renderBanner = renderBanner) {
  const reportStats = $injector.get('reportStats');
  const Private = $injector.get('Private');
  const config = $injector.get('config');

  // no banner if the server config has telemetry disabled
  if (!reportStats) {
    return;
  }

  // and no banner for non-logged in users
  if (Private(PathProvider).isLoginOrLogout()) {
    return;
  }

  // and no banner on status page
  if (chrome.getApp().id === 'status_page') {
    return;
  }

  // read advanced settings - if setting has never been set (null), default to true and show it the first time
  if (config.get(CONFIG_SHOW_BANNER, true)) {
    return _renderBanner($injector);
  }
}

uiModules.get('monitoring/hacks').run(customBanner);
