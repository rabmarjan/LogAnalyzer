import { pick } from 'lodash';

import { getSearchValue } from 'plugins/logstash/lib/get_search_value';
import { getMoment } from 'plugins/logstash/../common/lib/get_moment';
/**
 * Represents the model for listing pipelines in the UI
 * @param {string} props.id Named Id of the pipeline
 * @param {string} props.description Description for the pipeline
 * @param {string} props.lastModified Timestamp when the config was last modified
 * @param {string} props.username User who created or updated the pipeline
 */
export class PipelineListItem {
  constructor(props) {
    this.id = props.id;
    this.description = props.description;
    this.lastModified = getMoment(props.lastModified);
    this.username = props.username;

    if (this.lastModified) {
      this.lastModifiedHumanized = this.lastModified.fromNow();
    }
  }

  get searchValue() {
    return getSearchValue(this, ['id']);
  }

  static fromUpstreamJSON(pipelineListItem) {
    const props = pick(pipelineListItem, [ 'id', 'description', 'username' ]);
    props.lastModified = pipelineListItem.last_modified;
    return new PipelineListItem(props);
  }
}
