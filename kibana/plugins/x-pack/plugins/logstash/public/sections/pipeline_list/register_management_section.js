import { management } from 'ui/management';
import { FeatureCatalogueRegistryProvider, FeatureCatalogueCategory } from 'ui/registry/feature_catalogue';

management.getSection('logstash').register('pipelines', {
  display: 'Pipelines',
  order: 10,
  url: '#/management/logstash/pipelines/'
});

management.getSection('logstash/pipelines').register('pipeline', {
  visible: false
});

management.getSection('logstash/pipelines/pipeline').register('edit', {
  display: 'Edit',
  order: 1,
  visible: false
});

management.getSection('logstash/pipelines/pipeline').register('new', {
  display: 'New Pipeline',
  order: 1,
  visible: false
});

FeatureCatalogueRegistryProvider.register(() => {
  return {
    id: 'pipeline_management',
    title: 'Pipeline Management',
    description: 'Manage and automatically orchestrate your Logstash deployment.',
    icon: '/plugins/logstash/assets/app_pipeline.svg',
    path: '/app/kibana#/management/logstash/pipelines',
    showOnHomePage: false,
    category: FeatureCatalogueCategory.ADMIN
  };
});
