import fs from 'fs';
import os from 'os';
import path from 'path';
import { spawn } from 'child_process';
import rimraf from 'rimraf';
import Rx from 'rxjs/Rx';
import cdp from 'chrome-remote-interface';
import { HeadlessChromiumDriver } from '../driver';
import { args } from './args';
import { safeChildProcess } from '../../safe_child_process';

const compactWhitespace = (str) => {
  return str.replace(/\s+/, ' ');
};

export class HeadlessChromiumDriverFactory {
  constructor(binaryPath) {
    this.binaryPath = binaryPath;
  }

  type = 'chromium';

  create({ bridgePort, viewport, logger, config }) {
    return Rx.Observable.create(observer => {
      const driverFactoryLogger = logger.clone(['chromium-driver-factory']);

      const userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'chromium-'));
      const chromiumArgs = args({ userDataDir, bridgePort, viewport, disableSandbox: config.disableSandbox, proxyConfig: config.proxy });
      driverFactoryLogger.debug(`spawning chromium process at ${this.binaryPath} with arguments ${chromiumArgs}`);
      let chromium;
      try {
        chromium = spawn(this.binaryPath, chromiumArgs);
      } catch (err) {
        observer.error(new Error(`Caught error spawning Chromium`));
        return;
      }

      safeChildProcess(chromium, observer);

      const stderr$ = Rx.Observable.fromEvent(chromium.stderr, 'data').map(line => line.toString()).share();

      const [ consoleMessage$, message$ ] = stderr$.partition(msg => msg.match(/\[\d+\/\d+.\d+:\w+:CONSOLE\(\d+\)\]/));

      const driver$ = message$
        .first(line => line.indexOf(`DevTools listening on ws://127.0.0.1:${bridgePort}`) >= 0)
        .mergeMap(() => cdp({ port: bridgePort }))
        .map(client => new HeadlessChromiumDriver(client));

      const processError$ = Rx.Observable.fromEvent(chromium, 'error')
        .mergeMap(() => Rx.Observable.throw(new Error(`Unable to spawn Chromium`)));

      const processExit$ = Rx.Observable.fromEvent(chromium, 'exit')
        .mergeMap(code => Rx.Observable.throw(new Error(`Chromium exited with code: ${code}`)));

      const nssError$ = message$
        .filter(line => line.includes('error while loading shared libraries: libnss3.so'))
        .mergeMap(() => Rx.Observable.throw(new Error(`You must install nss for Reporting to work`)));

      const fontError$ = message$
        .filter(line => line.includes('Check failed: InitDefaultFont(). Could not find the default font'))
        .mergeMap(() => Rx.Observable.throw(new Error('You must install freetype and ttf-font for Reporting to work')));

      const noUsableSandbox$ = message$
        .filter(line => line.includes('No usable sandbox! Update your kernel'))
        .mergeMap(() => Rx.Observable.throw(new Error(compactWhitespace(`
          Unable to use Chromium sandbox. This can be disabled at your own risk with
          'xpack.reporting.capture.browser.chromium.disableSandbox'
        `))));

      const exit$ = Rx.Observable.merge(processError$, processExit$, nssError$, fontError$, noUsableSandbox$);

      observer.next({
        driver$,
        consoleMessage$,
        message$,
        exit$
      });

      // unsubscribe logic makes a best-effort attempt to delete the user data directory used by chromium
      return () => {
        driverFactoryLogger.debug(`deleting chromium user data directory at ${userDataDir}`);
        // the unsubscribe function isn't `async` so we're going to make our best effort at
        // deleting the userDataDir and if it fails log an error.
        rimraf(userDataDir, (err) => {
          if (err) {
            return driverFactoryLogger.error(`error deleting user data directory at ${userDataDir}: ${err}`);
          }
        });
      };
    });

  }
}

