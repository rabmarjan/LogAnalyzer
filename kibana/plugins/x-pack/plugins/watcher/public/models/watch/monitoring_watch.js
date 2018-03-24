import { BaseWatch } from './base_watch';
import { WATCH_TYPES } from 'plugins/watcher/../common/constants';

/**
 * {@code MonitoringWatch} system defined watches created by the Monitoring plugin.
 */
export class MonitoringWatch extends BaseWatch {
  constructor(props = {}) {
    props.type = WATCH_TYPES.MONITORING;
    super(props);
  }

  get upstreamJson() {
    const result = super.upstreamJson;
    Object.assign(result, {
      watch: this.watch
    });

    return result;
  }

  static fromUpstreamJson(upstreamWatch) {
    return new MonitoringWatch(upstreamWatch);
  }

  static isCreatable = false;
}
