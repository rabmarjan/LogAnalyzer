import Rx from 'rxjs/Rx';
import { capitalize, some } from 'lodash';
import { getTimeFilterRange } from './get_time_filter_range';
import { pdf } from './pdf';
import { oncePerServer } from '../../../../server/lib/once_per_server';
import { screenshotsObservableFactory } from './screenshots';
import { getAbsoluteUrlFactory } from './get_absolute_url';
import { getLayoutFactory } from './layouts';

function generatePdfObservableFn(server) {
  const getAbsoluteUrl = getAbsoluteUrlFactory(server);
  const screenshotsObservable = screenshotsObservableFactory(server);
  const config = server.config();
  const captureConcurrency = config.get('xpack.reporting.capture.concurrency');
  const getLayout = getLayoutFactory(server);

  const getUrl = (savedObj) => {
    if (savedObj.urlHash) {
      return getAbsoluteUrl(savedObj.urlHash);
    }

    if (savedObj.url.startsWith(getAbsoluteUrl())) {
      return savedObj.url;
    }

    throw new Error(`Unable to generate report for url ${savedObj.url}, it's not a Kibana URL`);
  };

  const savedObjectsScreenshotsObservable = (savedObjects, headers, layout) => {
    return Rx.Observable
      .from(savedObjects)
      .mergeMap(
        savedObject => {
          if (savedObject.isMissing) {
            return Rx.Observable.of({ savedObject });
          }

          return screenshotsObservable(getUrl(savedObject), headers, layout);
        },
        (savedObject, { isTimepickerEnabled, screenshots }) => ({ savedObject, isTimepickerEnabled, screenshots }),
        captureConcurrency
      );
  };


  const createPdfWithScreenshots = async ({ title, query, objects, browserTimezone, layout, logo }) => {
    const pdfOutput = pdf.create(layout, logo);

    if (title) {
      const timeRange = some(objects, { isTimepickerEnabled: true }) ? getTimeFilterRange(browserTimezone, query) : null;
      title += (timeRange) ? ` — ${timeRange.from} to ${timeRange.to}` : '';
      pdfOutput.setTitle(title);
    }

    objects.forEach(({ savedObject, screenshots }) => {
      if (savedObject.isMissing) {
        pdfOutput.addHeading(`${capitalize(savedObject.type)} with id '${savedObject.id}' not found`, {
          styles: 'warning'
        });
      } else {
        screenshots.forEach(screenshot => {
          pdfOutput.addImage(screenshot.base64EncodedData, {
            title: screenshot.title,
            description: screenshot.description,
          });
        });
      }
    });

    pdfOutput.generate();
    const buffer = await pdfOutput.getBuffer();
    return buffer;
  };

  return function generatePdfObservable(title, savedObjects, query, headers, browserTimezone, layoutParams, logo) {
    const layout = getLayout(layoutParams);
    const screenshots$ = savedObjectsScreenshotsObservable(savedObjects, headers, layout);

    return screenshots$
      .toArray()
      .mergeMap(objects => createPdfWithScreenshots({ title, query, browserTimezone, objects, layout, logo }));

  };
}

export const generatePdfObservableFactory = oncePerServer(generatePdfObservableFn);
