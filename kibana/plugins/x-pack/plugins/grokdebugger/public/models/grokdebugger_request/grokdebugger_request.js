import { get, pick } from 'lodash';

export class GrokdebuggerRequest {
  constructor(props = {}) {
    this.rawEvent = get(props, 'rawEvent', '');
    this.pattern = get(props, 'pattern', '');
    this.customPatterns = get(props, 'customPatterns', {});
  }

  get upstreamJSON() {
    return pick(this, [ 'rawEvent', 'pattern', 'customPatterns' ]);
  }
}
