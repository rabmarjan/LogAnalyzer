import { management } from 'ui/management';

export function updateLogstashSections(pipelineId) {
  const editSection = management.getSection('logstash/pipelines/pipeline/edit');
  const newSection = management.getSection('logstash/pipelines/pipeline/new');

  newSection.hide();
  editSection.hide();

  if (pipelineId) {
    editSection.url = `#/management/logstash/pipelines/pipeline/${pipelineId}/edit`;
    editSection.show();
  } else {
    newSection.show();
  }
}
