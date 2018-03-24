import { get } from 'lodash';
import { getMoment } from 'plugins/watcher/../common/lib/get_moment';
import { ActionStatus } from '../action_status';

export class WatchStatus {
  constructor(props = {}) {
    this.id = get(props, 'id');
    this.state = get(props, 'state');
    this.comment = get(props, 'comment');
    this.isActive = get(props, 'isActive');
    this.lastFired = getMoment(get(props, 'lastFired'));
    this.lastChecked = getMoment(get(props, 'lastChecked'));
    this.lastMetCondition = getMoment(this.lastMetCondition);

    if (this.lastFired) {
      this.lastFiredHumanized = this.lastFired.fromNow();
    }

    if (this.lastChecked) {
      this.lastCheckedHumanized = this.lastChecked.fromNow();
    }

    const actionStatuses = get(props, 'actionStatuses', []);
    this.actionStatuses = actionStatuses.map(actionStatus => ActionStatus.fromUpstreamJson(actionStatus));
  }

  static fromUpstreamJson(upstreamWatchStatus) {
    return new WatchStatus(upstreamWatchStatus);
  }
}
