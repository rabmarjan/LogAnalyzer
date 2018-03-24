import moment from 'moment';
import { badRequest } from 'boom';
import { get } from 'lodash';

/**
 * This model deals with a pipeline object from ES and converts it to Kibana downstream
 */
export class Pipeline {
  constructor(props) {
    this.id = props.id;
    this.description = props.description;
    this.username = props.username;
    this.pipeline = props.pipeline;
  }

  get downstreamJSON() {
    const json = {
      id: this.id,
      description: this.description,
      username: this.username,
      pipeline: this.pipeline
    };

    return json;
  }

  /**
   * Returns the JSON schema for the pipeline doc that Elasticsearch expects
   * For now, we hard code pipeline_metadata since we don't use it yet
   * pipeline_metadata.version is the version of the Logstash config stored in
   * pipeline field.
   * pipeline_metadata.type is the Logstash config type (future: LIR, json, etc)
   * @return {[JSON]} [Elasticsearch JSON]
   */
  get upstreamJSON() {
    return {
      description: this.description,
      last_modified: moment().toISOString(),
      pipeline_metadata: {
        version: 1,
        type: 'logstash_pipeline',
      },
      username: this.username,
      pipeline: this.pipeline
    };
  }

  // generate Pipeline object from kibana response
  static fromDownstreamJSON(downstreamPipeline) {
    const opts = {
      id: downstreamPipeline.id,
      description: downstreamPipeline.description,
      username: downstreamPipeline.username,
      pipeline: downstreamPipeline.pipeline
    };

    return new Pipeline(opts);
  }

  // generate Pipeline object from elasticsearch response
  static fromUpstreamJSON(upstreamPipeline) {
    if (!upstreamPipeline._id) {
      throw badRequest('upstreamPipeline argument must contain an id property');
    }
    const id = get(upstreamPipeline, '_id');
    const description = get(upstreamPipeline, '_source.description');
    const username = get(upstreamPipeline, '_source.username');
    const pipeline = get(upstreamPipeline, '_source.pipeline');

    const opts = { id, description, username, pipeline };

    return new Pipeline(opts);
  }
}
