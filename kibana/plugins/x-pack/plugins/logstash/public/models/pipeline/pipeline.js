import { get, pick, omit } from 'lodash';

// This config template is presented to the user for the 'new pipeline' workflow
const emptyPipeline = 'input {\n' +
  '}\n' +
  'filter {\n' +
  '}\n' +
  'output {\n' +
  '}';

export class Pipeline {
  /**
   * Represents the pipeline for the client side editing/creating workflow
   * @param {object} props An object used to instantiate a pipeline instance
   * @param {string} props.id Named Id of the pipeline
   * @param {string} props.description Optional description for the pipeline
   * @param {object} props.pipeline The actual LS configuration as a string blob
   * @param {string} props.username User who created or updated the pipeline
   */
  constructor(props) {
    this.id = get(props, 'id');
    this.description = get(props, 'description', '');
    this.pipeline = get(props, 'pipeline', emptyPipeline);
    this.username = get(props, 'username');
  }

  get clone() {
    return new Pipeline({
      ...omit(this, [ 'id', 'username' ])
    });
  }

  get upstreamJSON() {
    return pick(this, [ 'id', 'description', 'pipeline', 'username' ]);
  }

  static fromUpstreamJSON(pipeline) {
    return new Pipeline(pipeline);
  }
}
