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

import { FeatureCatalogueRegistryProvider, FeatureCatalogueCategory } from 'ui/registry/feature_catalogue';

FeatureCatalogueRegistryProvider.register(() => {
  return {
    id: 'grokdebugger',
    title: 'Grok Debugger',
    description: 'Simulate and debug grok patterns for data transformation on ingestion.',
    icon: '/plugins/grokdebugger/assets/app_grok.svg',
    path: '/app/kibana#/dev_tools/grokdebugger',
    showOnHomePage: false,
    category: FeatureCatalogueCategory.ADMIN
  };
});
