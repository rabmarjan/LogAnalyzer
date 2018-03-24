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
    id: 'ml',
    title: 'Machine Learning',
    description: 'Automatically model the normal behavior of your time series data to detect anomalies.',
    icon: '/plugins/ml/assets/app_ml.svg',
    path: '/app/ml',
    showOnHomePage: true,
    category: FeatureCatalogueCategory.DATA
  };
});
