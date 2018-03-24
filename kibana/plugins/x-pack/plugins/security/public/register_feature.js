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
    id: 'security',
    title: 'Security Settings',
    description: 'Protect your data and easily manage who has access to what with users and roles.',
    icon: '/plugins/kibana/assets/app_security.svg',
    path: '/app/kibana#/management/security',
    showOnHomePage: true,
    category: FeatureCatalogueCategory.ADMIN
  };
});
