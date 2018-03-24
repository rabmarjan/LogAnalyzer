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
 * Service for firing and registering for events across the different
 * components in the Explorer dashboard.
 */

import { uiModules } from 'ui/modules';
const module = uiModules.get('apps/ml');

import { listenerFactoryProvider } from 'plugins/ml/factories/listener_factory';

module.service('mlExplorerDashboardService', function () {
  this.allowCellRangeSelection = false;

  const listenerFactory = listenerFactoryProvider();
  const dragSelect = this.dragSelect = listenerFactory();
  const swimlaneCellClick = this.swimlaneCellClick = listenerFactory();
  const swimlaneDataChange = this.swimlaneDataChange = listenerFactory();
  const swimlaneRenderDone = this.swimlaneRenderDone = listenerFactory();
  this.anomalyDataChange = listenerFactory();

  this.init = function () {
    // Clear out any old listeners.
    dragSelect.unwatchAll();
    swimlaneCellClick.unwatchAll();
    swimlaneDataChange.unwatchAll();
    swimlaneRenderDone.unwatchAll();
  };

});
