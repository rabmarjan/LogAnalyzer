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

/*
 * Service for firing and registering for events in the
 * anomalies table component.
 */

import { uiModules } from 'ui/modules';
const module = uiModules.get('apps/ml');

import { listenerFactoryProvider } from 'plugins/ml/factories/listener_factory';

module.service('mlAnomaliesTableService', function () {

  const listenerFactory = listenerFactoryProvider();
  this.anomalyRecordMouseenter = listenerFactory();
  this.anomalyRecordMouseleave = listenerFactory();
  this.filterChange = listenerFactory();

});
