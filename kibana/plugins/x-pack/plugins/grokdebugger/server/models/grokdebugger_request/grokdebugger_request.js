import { get } from 'lodash';

/**
 * Model to capture Grokdebugger request with upstream (ES) helpers.
 */
export class GrokdebuggerRequest {
  constructor(props) {
    this.rawEvent = get(props, 'rawEvent', "");
    this.pattern = get(props, 'pattern', "");
    this.customPatterns = get(props, 'customPatterns', {});
  }

  get upstreamJSON() {
    return {
      pipeline: {
        description: 'this is a grokdebugger simulation',
        processors: [
          {
            grok: {
              field: 'rawEvent',
              pattern_definitions: this.customPatterns,
              patterns: [
                this.pattern.toString()
              ]
            }
          }
        ]
      },
      docs: [
        {
          _index: 'grokdebugger',
          _type: 'grokdebugger',
          _id: 'grokdebugger',
          _source: {
            rawEvent: this.rawEvent.toString()
          }
        }
      ]
    };
  }

  // generate GrokdebuggerRequest object from kibana
  static fromDownstreamJSON(downstreamGrokdebuggerRequest) {
    const opts = {
      rawEvent: downstreamGrokdebuggerRequest.rawEvent,
      pattern: downstreamGrokdebuggerRequest.pattern,
      customPatterns: downstreamGrokdebuggerRequest.customPatterns
    };

    return new GrokdebuggerRequest(opts);
  }
}
