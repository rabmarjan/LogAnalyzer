import { uiModules } from 'ui/modules';
import { XpackWatcherIntervalService } from './xpack_watcher_interval_service';
import { TimeBucketsProvider } from 'ui/time_buckets';

uiModules.get('xpack/watcher')
  .factory('xpackWatcherIntervalService', ($injector) => {
    const Private = $injector.get('Private');
    const TimeBuckets = Private(TimeBucketsProvider);
    const timeBuckets = new TimeBuckets();

    return new XpackWatcherIntervalService(timeBuckets);
  });
