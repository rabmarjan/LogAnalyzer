/*
 * ELASTICSEARCH CONFIDENTIAL
 *
 * Copyright (c) 2017 Elasticsearch BV. All Rights Reserved.
 *
 * Notice: this software, and all information contained
 * therein, is the exclusive property of Elasticsearch BV
 * and its licensors, if any, and is protected under applicable
 * domestic and foreign law, and international treaties.
 *
 * Reproduction, republication or distribution without the
 * express written consent of Elasticsearch BV is
 * strictly prohibited.
 */

import chrome from 'ui/chrome';
import { FeatureCatalogueRegistryProvider, FeatureCatalogueCategory } from 'ui/registry/feature_catalogue';

if (chrome.getInjected('monitoringUiEnabled')) {
  FeatureCatalogueRegistryProvider.register(() => {
    return {
      id: 'monitoring',
      title: 'Monitoring',
      description: 'Track the real-time health and performance of your Elastic Stack.',
      icon: '/plugins/kibana/assets/app_monitoring.svg',
      path: '/app/monitoring',
      showOnHomePage: true,
      category: FeatureCatalogueCategory.ADMIN
    };
  });
}
