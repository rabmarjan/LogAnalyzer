import { notify } from 'ui/notify';
import chrome from 'ui/chrome';
import { uiModules } from 'ui/modules';
import { addSystemApiHeader } from 'ui/system_api';
import { get } from 'lodash';
import {
  API_BASE_URL
} from '../../common/constants';
import 'plugins/reporting/services/job_queue';
import 'plugins/reporting/services/job_completion_notifications';
import { PathProvider } from 'plugins/xpack_main/services/path';
import { XPackInfoProvider } from 'plugins/xpack_main/services/xpack_info';
import { Poller } from '../../../../common/poller';

uiModules.get('kibana')
  .run(($http, reportingJobQueue, Private, reportingPollConfig, reportingJobCompletionNotifications, $rootScope) => {
    const { jobCompletionNotifier } = reportingPollConfig;

    const xpackInfo = Private(XPackInfoProvider);
    const showLinks = xpackInfo.get('features.reporting.management.showLinks');
    if (Private(PathProvider).isLoginOrLogout() || !showLinks) return;

    async function showCompletionNotification(job) {
      const reportObjectTitle = job._source.payload.title;
      const reportObjectType = job._source.payload.type;
      let notificationMessage;
      let notificationType;

      // Define actions for notification
      const actions = [
        {
          text: 'OK',
          dataTestSubj: 'reportCompleteOkToastButton'
        }
      ];

      const isJobSuccessful = get(job, '_source.status') === 'completed';
      const maxSizeReached = get(job, '_source.output.max_size_reached');
      if (isJobSuccessful) {
        actions.push({
          text: 'Download',
          dataTestSubj: 'downloadCompletedReportButton',
          callback: downloadReport(job._id)
        });

        if (maxSizeReached) {
          notificationType = 'warning';
          notificationMessage = `Your report for the "${reportObjectTitle}" ${reportObjectType} is ready;` +
          `however, it reached the max size and contains partial data.`;
        } else {
          notificationType = 'info';
          notificationMessage = `Your report for the "${reportObjectTitle}" ${reportObjectType} is ready!`;
        }
        if (chrome.navLinkExists('kibana:management')) {
          const managementUrl = chrome.getNavLinkById('kibana:management').url;
          const reportingSectionUrl = `${managementUrl}/kibana/reporting`;
          notificationMessage += ` Pick it up from [Management > Kibana > Reporting](${reportingSectionUrl})`;
        }
      } else {
        const errorDoc = await reportingJobQueue.getContent(job._id);
        const error = errorDoc.content;
        notificationMessage = `There was an error generating your report for the "${reportObjectTitle}" ${reportObjectType}: ${error}`;
        notificationType = 'error';
      }

      $rootScope.$evalAsync(function () {
        notify.custom(notificationMessage, {
          type: notificationType,
          lifetime: 0,
          actions
        });
      });
    }

    const poller = new Poller({
      functionToPoll: async () => {
        const jobIds = reportingJobCompletionNotifications.getAll();
        if (!jobIds.length) {
          return;
        }
        const jobs = await getJobs($http, jobIds);
        jobIds.forEach(async jobId => {
          const job = jobs.find(j => j._id === jobId);
          if (!job) {
            reportingJobCompletionNotifications.remove(jobId);
            return;
          }

          if (job._source.status === 'completed' || job._source.status === 'failed') {
            await showCompletionNotification(job);
            reportingJobCompletionNotifications.remove(job.id);
            return;
          }
        });
      },
      pollFrequencyInMillis: jobCompletionNotifier.interval,
      trailing: true,
      continuePollingOnError: true,
      pollFrequencyErrorMultiplier: jobCompletionNotifier.intervalErrorMultiplier
    });
    poller.start();
  });

async function getJobs($http, jobs) {
  // Get all jobs in "completed" status since last check, sorted by completion time
  const apiBaseUrl = chrome.addBasePath(API_BASE_URL);

  // Only getting the first 10, to prevent URL overflows
  const url = `${apiBaseUrl}/jobs/list?ids=${jobs.slice(0, 10).join(',')}`;
  const headers = addSystemApiHeader({});
  const response = await $http.get(url, { headers });
  return response.data;
}

function downloadReport(jobId) {
  const apiBaseUrl = chrome.addBasePath(API_BASE_URL);
  const downloadLink = `${apiBaseUrl}/jobs/download/${jobId}`;
  return () => window.open(downloadLink);
}

