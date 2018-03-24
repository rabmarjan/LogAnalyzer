import React from 'react';
import { render } from 'react-dom';
import { uiModules } from 'ui/modules';
import { PipelineViewer } from 'plugins/monitoring/components/logstash/pipeline_viewer';
import { PipelineState } from 'plugins/monitoring/components/logstash/pipeline_viewer/models/pipeline_state';

const uiModule = uiModules.get('monitoring/directives', []);
uiModule.directive('monitoringLogstashPipelineViewer', () => {
  return {
    restrict: 'E',
    scope: {
      pipeline: '='
    },
    link: function (scope, $el) {
      const pipelineState = new PipelineState(scope.pipeline);

      scope.$watch('pipeline', (updatedPipeline) => {
        pipelineState.update(updatedPipeline);
        const pipelineViewer = <PipelineViewer pipelineState={pipelineState} />;
        render(pipelineViewer, $el[0]);
      });
    }
  };
});
