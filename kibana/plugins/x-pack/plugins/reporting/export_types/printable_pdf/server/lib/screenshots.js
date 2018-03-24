import Rx from 'rxjs/Rx';
import path from 'path';
import fs from 'fs';
import moment from 'moment';
import getPort from 'get-port';
import { promisify } from 'bluebird';
import { LevelLogger } from './level_logger';

const fsp = {
  readFile: promisify(fs.readFile, fs)
};

export function screenshotsObservableFactory(server) {
  const config = server.config();
  const logger = LevelLogger.createForServer(server, ['reporting', 'screenshots']);

  const browserDriverFactory = server.plugins.reporting.browserDriverFactory;
  const captureConfig = config.get('xpack.reporting.capture');
  const browserDriverConfig = captureConfig.browser[browserDriverFactory.type];

  const dataDirectory = config.get('path.data');

  const asyncDurationLogger = async (description, promise) => {
    const start = new Date();
    const result = await promise;
    logger.debug(`${description} took ${new Date() - start}ms`);
    return result;
  };

  const startRecording = (browser) => {
    if (captureConfig.record) {
      if (!browser.record) {
        throw new Error('Unable to record capture with current browser');
      }

      browser.record(path.join(dataDirectory, `recording-${moment().utc().format().replace(/:/g, '_')}`));
    }
  };

  const openUrl = async (browser, url, headers) => {
    const waitForSelector = '.application';

    await browser.open(url, {
      headers,
      waitForSelector,
    });
  };

  const injectCustomCss = async (browser, layout) => {
    const filePath = layout.getCssOverridesPath();
    const buffer = await fsp.readFile(filePath);
    await browser.evaluate({
      fn: function (css) {
        const node = document.createElement('style');
        node.type = "text/css";
        node.innerHTML = css;
        document.getElementsByTagName('head')[0].appendChild(node);
      },
      args: [buffer.toString()],
    });
  };

  const waitForElementOrItemsCountAttribute = async (browser, layout) => {
    // the dashboard is using the `itemsCountAttribute` attribute to let us
    // know how many items to expect since gridster incrementally adds panels
    // we have to use this hint to wait for all of them
    await browser.waitForSelector(`${layout.selectors.renderComplete},[${layout.selectors.itemsCountAttribute}]`);
  };

  const getNumberOfItems = async (browser, layout) => {
    // returns the value of the `itemsCountAttribute` if it's there, otherwise
    // we just count the number of `itemSelector`
    const itemsCount = await browser.evaluate({
      fn: function (selector, countAttribute) {
        const elementWithCount = document.querySelector(`[${countAttribute}]`);
        if (elementWithCount) {
          return parseInt(elementWithCount.getAttribute(countAttribute));
        }

        return document.querySelectorAll(selector).length;
      },
      args: [layout.selectors.renderComplete, layout.selectors.itemsCountAttribute],
    });
    return itemsCount;
  };

  const waitForElementsToBeInDOM = async (browser, itemsCount, layout) => {
    await browser.waitFor({
      fn: function (selector) {
        return document.querySelectorAll(selector).length;
      },
      args: [layout.selectors.renderComplete],
      toEqual: itemsCount
    });
  };

  const setViewport = async (browser, itemsCount, layout) => {
    const viewport = layout.getViewport(itemsCount);
    await browser.setViewport(viewport);
  };

  const positionElements = async (browser, layout) => {
    if (layout.positionElements) {
      await layout.positionElements(browser);
    }
  };

  const waitForRenderComplete = async (browser, layout) => {
    await browser.evaluate({
      fn: function (selector, visLoadDelay) {
        // wait for visualizations to finish loading
        const visualizations = document.querySelectorAll(selector);
        const visCount = visualizations.length;
        const renderedTasks = [];

        function waitForRender(visualization) {
          return new Promise(function (resolve) {
            visualization.addEventListener('renderComplete', () => resolve());
          });
        }

        function waitForRenderDelay() {
          return new Promise(function (resolve) {
            setTimeout(resolve, visLoadDelay);
          });
        }

        for (let i = 0; i < visCount; i++) {
          const visualization = visualizations[i];
          const isRendered = visualization.getAttribute('data-render-complete');

          if (isRendered === 'disabled') {
            renderedTasks.push(waitForRenderDelay());
          } else if (isRendered === 'false') {
            renderedTasks.push(waitForRender(visualization));
          }
        }

        return Promise.all(renderedTasks);
      },
      args: [layout.selectors.renderComplete, captureConfig.loadDelay],
      awaitPromise: true,
    });
  };

  const getIsTimepickerEnabled = async (browser, layout) => {
    const isTimepickerEnabled = await browser.evaluate({
      fn: function (selector) {
        return document.querySelector(selector) !== null;
      },
      args: [layout.selectors.isTimepickerEnabled]
    });
    return isTimepickerEnabled;
  };

  const getElementPositionAndAttributes = async (browser, layout) => {
    const elementsPositionAndAttributes = await browser.evaluate({
      fn: function (selector, attributes) {
        const elements = document.querySelectorAll(selector);

        // NodeList isn't an array, just an iterator, unable to use .map/.forEach
        const results = [];
        for (const element of elements) {
          const boundingClientRect = element.getBoundingClientRect();
          results.push({
            position: {
              boundingClientRect: {
                // modern browsers support x/y, but older ones don't
                top: boundingClientRect.y || boundingClientRect.top,
                left: boundingClientRect.x || boundingClientRect.left,
                width: boundingClientRect.width,
                height: boundingClientRect.height,
              },
              scroll: {
                x: window.scrollX,
                y: window.scrollY
              }
            },
            attributes: Object.keys(attributes).reduce((result, key) => {
              const attribute = attributes[key];
              result[key] = element.getAttribute(attribute);
              return result;
            }, {})
          });
        }
        return results;

      },
      args: [layout.selectors.screenshot, { title: 'data-title', description: 'data-description' }],
      returnByValue: true,
    });
    return elementsPositionAndAttributes;
  };

  const getScreenshots = async ({ browser, elementsPositionAndAttributes }) => {
    const screenshots = [];
    for (const item of elementsPositionAndAttributes) {
      const base64EncodedData = await asyncDurationLogger('screenshot', browser.screenshot(item.position));

      screenshots.push({
        base64EncodedData,
        title: item.attributes.title,
        description: item.attributes.description
      });
    }
    return screenshots;
  };

  return function screenshotsObservable(url, headers, layout) {

    return Rx.Observable
      .defer(async () => {
        return await getPort();
      })
      .mergeMap(bridgePort => {
        return browserDriverFactory.create({
          bridgePort,
          viewport: layout.getBrowserViewport(),
          zoom: layout.getBrowserZoom(),
          logger,
          config: browserDriverConfig
        });
      })
      .mergeMap(({ driver$, exit$, message$, consoleMessage$ }) => {

        message$.subscribe(line => {
          logger.debug(line, ['browser']);
        });

        consoleMessage$.subscribe(line => {
          logger.debug(line, ['browserConsole']);
        });


        const screenshot$ = driver$
          .do(browser => startRecording(browser))
          .do(() => logger.debug(`opening ${url}`))
          .mergeMap(
            browser => openUrl(browser, url, headers),
            browser => browser
          )
          .do(() => logger.debug('injecting custom css'))
          .mergeMap(
            browser => injectCustomCss(browser, layout),
            browser => browser
          )
          .do(() => logger.debug('waiting for elements or items count attribute'))
          .mergeMap(
            browser => waitForElementOrItemsCountAttribute(browser, layout),
            browser => browser
          )
          .do(() => logger.debug('determining how many items we have'))
          .mergeMap(
            browser => getNumberOfItems(browser, layout),
            (browser, itemsCount) => ({ browser, itemsCount })
          )
          .do(({ itemsCount }) => logger.debug(`waiting for ${itemsCount} to be in the DOM`))
          .mergeMap(
            ({ browser, itemsCount }) => waitForElementsToBeInDOM(browser, itemsCount, layout),
            ({ browser, itemsCount }) => ({ browser, itemsCount })
          )
          .do(() => logger.debug('setting viewport'))
          .mergeMap(
            ({ browser, itemsCount }) => setViewport(browser, itemsCount, layout),
            ({ browser }) => browser
          )
          .do(() => logger.debug('positioning elements'))
          .mergeMap(
            browser => positionElements(browser, layout),
            browser => browser
          )
          .do(() => logger.debug('waiting for rendering to complete'))
          .mergeMap(
            browser => waitForRenderComplete(browser, layout),
            browser => browser
          )
          .do(() => logger.debug('rendering is complete'))
          .mergeMap(
            browser => getIsTimepickerEnabled(browser, layout),
            (browser, isTimepickerEnabled) => ({ browser, isTimepickerEnabled })
          )
          .do(({ isTimepickerEnabled }) => logger.debug(`the time picker ${isTimepickerEnabled ? 'is' : `isn't`} enabled`))
          .mergeMap(
            ({ browser }) => getElementPositionAndAttributes(browser, layout),
            ({ browser, isTimepickerEnabled }, elementsPositionAndAttributes) => {
              return { browser, isTimepickerEnabled, elementsPositionAndAttributes };
            }
          )
          .do(() => logger.debug(`taking screenshots`))
          .mergeMap(
            ({ browser, elementsPositionAndAttributes }) => getScreenshots({ browser, elementsPositionAndAttributes }),
            ({ isTimepickerEnabled }, screenshots) => ({ isTimepickerEnabled, screenshots })
          );

        return Rx.Observable.race(screenshot$, exit$);
      })
      .first();
  };
}
