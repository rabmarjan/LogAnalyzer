import { uiModules } from 'ui/modules';
import { labels } from './lib/labels';
import { indicesByNodes } from './transformers/indicesByNodes';
import { nodesByIndices } from './transformers/nodesByIndices';
import template from './index.html';

const uiModule = uiModules.get('monitoring/directives', []);
uiModule.directive('monitoringShardAllocation', () => {
  return {
    restrict: 'E',
    template,
    scope: {
      view: '@',
      shards: '=',
      nodes: '=',
      shardStats: '=',
      showSystemIndices: '=',
      toggleShowSystemIndices: '='
    },
    link: (scope) => {

      const isIndexView = scope.view === 'index';
      const transformer = (isIndexView) ? indicesByNodes() : nodesByIndices();

      scope.isIndexView = isIndexView;

      scope.$watch('shards', (shards) => {
        let view = scope.view;
        scope.totalCount = shards.length;
        scope.showing = transformer(shards, scope.nodes);
        if (isIndexView && shards.some((shard) => shard.state === 'UNASSIGNED')) {
          view = 'indexWithUnassigned';
        }
        scope.labels = labels[view];
      });

    }
  };
});
