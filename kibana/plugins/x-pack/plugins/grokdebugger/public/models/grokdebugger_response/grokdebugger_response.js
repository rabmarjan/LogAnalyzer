import { get } from 'lodash';

export class GrokdebuggerResponse {
  constructor(props) {
    this.structuredEvent = get(props, 'structuredEvent', {});
    this.error = get(props, 'error', {});
  }

  static fromUpstreamJSON(grokdebuggerResponse) {
    return new GrokdebuggerResponse(grokdebuggerResponse);
  }
}
