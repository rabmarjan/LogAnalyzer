import { get, set } from 'lodash';
import { WATCH_TYPES } from 'plugins/watcher/../common/constants';
import { JsonWatch } from './json_watch';
import { ThresholdWatch } from './threshold_watch';
import { MonitoringWatch } from './monitoring_watch';

const WatchTypes = {};
set(WatchTypes, WATCH_TYPES.JSON, JsonWatch);
set(WatchTypes, WATCH_TYPES.THRESHOLD, ThresholdWatch);
set(WatchTypes, WATCH_TYPES.MONITORING, MonitoringWatch);

export class Watch {

  static getWatchTypes = () => {
    return WatchTypes;
  }

  static fromUpstreamJson(upstreamWatch) {
    const type = get(upstreamWatch, 'type');
    const WatchType = WatchTypes[type];

    Object.assign(upstreamWatch, {
      isNew: false
    });

    return WatchType.fromUpstreamJson(upstreamWatch);
  }

}
