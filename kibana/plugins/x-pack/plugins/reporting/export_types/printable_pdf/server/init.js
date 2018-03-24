import { ExtractError } from './lib/extract';
import { installBrowser } from './lib/browsers';

export function initFactory(server) {
  const config = server.config();

  const browserType = config.get('xpack.reporting.capture.browser.type');

  return async function init() {
    // Setup BrowserDriverFactory
    let browserDriverFactory;
    try {
      browserDriverFactory = await installBrowser(browserType, config.get('path.data'));
    } catch(err) {
      server.log(['reporting', 'error'], err);

      if (!err instanceof ExtractError) {
        return {
          success: false,
          message: 'Failed to install browser. See kibana logs for more details.'
        };
      }

      server.log(['reporting', 'error'], err.cause);

      if (['EACCES', 'EEXIST'].includes(err.cause.code)) {
        return {
          success: false,
          message: 'Insufficient permissions for extracting the browser archive. ' +
          'Make sure the Kibana data directory (path.data) is owned by the same user that is running Kibana.'
        };
      } else {
        return {
          success: false,
          message: 'Failed to extract the browser archive. See kibana logs for more details.'
        };
      }
    }

    server.log(['reporting', 'debug'], `Browser installed at ${browserDriverFactory.binaryPath}`);

    // intialize and register application components
    server.expose('browserDriverFactory', browserDriverFactory);

    return { success: true };
  };
}
