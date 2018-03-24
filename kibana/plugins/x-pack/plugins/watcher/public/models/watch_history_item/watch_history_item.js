import 'moment-duration-format';
import { get } from 'lodash';
import { getMoment } from 'plugins/watcher/../common/lib/get_moment';
import { WatchStatus } from '../watch_status';

export class WatchHistoryItem {
  constructor(props = {}) {
    this.id = props.id;
    this.watchId = props.watchId;
    this.details = props.details;
    this.startTime = getMoment(props.startTime);
    this.watchStatus = WatchStatus.fromUpstreamJson(get(props, 'watchStatus'));
  }

  static fromUpstreamJson(upstreamHistory) {
    return new WatchHistoryItem(upstreamHistory);
  }
}
