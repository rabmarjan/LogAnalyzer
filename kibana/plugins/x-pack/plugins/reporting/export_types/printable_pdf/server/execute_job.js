import Rx from 'rxjs/Rx';
import { omit } from 'lodash';
import { UI_SETTINGS_CUSTOM_PDF_LOGO } from '../../../common/constants';
import { oncePerServer } from '../../../server/lib/once_per_server';
import { generatePdfObservableFactory } from './lib/generate_pdf';
import { cryptoFactory } from '../../../server/lib/crypto';

const KBN_SCREENSHOT_HEADER_BLACKLIST = [
  'accept-encoding',
  'content-length',
  'content-type',
  'host',
];

function executeJobFn(server) {
  const { callWithRequest } = server.plugins.elasticsearch.getCluster('data');
  const generatePdfObservable = generatePdfObservableFactory(server);
  const crypto = cryptoFactory(server);

  const decryptJobHeaders = async (job) => {
    const decryptedHeaders = await crypto.decrypt(job.headers);
    return { job, decryptedHeaders };
  };

  const omitBlacklistedHeaders = ({ job, decryptedHeaders }) => {
    const filteredHeaders = omit(decryptedHeaders, KBN_SCREENSHOT_HEADER_BLACKLIST);
    return { job, filteredHeaders };
  };

  const getCustomLogo = async ({ job, filteredHeaders }) => {
    const fakeRequest = {
      headers: filteredHeaders,
    };

    const callEndpoint = (endpoint, clientParams = {}, options = {}) => {
      return callWithRequest(fakeRequest, endpoint, clientParams, options);
    };
    const savedObjectsClient = server.savedObjectsClientFactory({
      callCluster: callEndpoint
    });
    const uiSettings = server.uiSettingsServiceFactory({
      savedObjectsClient
    });

    const logo = await uiSettings.get(UI_SETTINGS_CUSTOM_PDF_LOGO);

    return { job, filteredHeaders, logo };
  };

  return function executeJob(jobToExecute, cancellationToken) {

    const process$ = Rx.Observable.of(jobToExecute)
      .mergeMap(decryptJobHeaders)
      .catch(() => Rx.Observable.throw('Failed to decrypt report job data. Please re-generate this report.'))
      .map(omitBlacklistedHeaders)
      .mergeMap(getCustomLogo)
      .mergeMap(({ job, filteredHeaders, logo }) => {
        return generatePdfObservable(job.title, job.objects, job.query, filteredHeaders, job.browserTimezone, job.layout, logo);
      })
      .map(buffer => ({
        content_type: 'application/pdf',
        content: buffer.toString('base64')
      }));

    const stop$ = Rx.Observable.fromEventPattern(cancellationToken.on);

    return process$.takeUntil(stop$).toPromise();
  };
}

export const executeJobFactory = oncePerServer(executeJobFn);
