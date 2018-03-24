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

import template from './item_select.html';

import { InitAfterBindingsWorkaround } from 'ui/compat';
import { uiModules } from 'ui/modules';
const module = uiModules.get('apps/ml');

module.directive('mlItemSelect', function () {
  return {
    restrict: 'E',
    template,
    scope: {
      itemIds: '=',
      allItems: '=',
      disabled: '=',
      placeholder: '=',
      externalUpdateFunction: '='
    },
    controllerAs: 'mlItemSelect',
    bindToController: true,
    controller: class MlItemSelectController extends InitAfterBindingsWorkaround {
      initAfterBindings($scope) {
        this.$scope = $scope;
        this.selectedItems = [];

        this.populateSelectedItems(this.itemIds);

        // make the populateSelectedItems function callable from elsewhere.
        if (this.externalUpdateFunction !== undefined) {
          this.externalUpdateFunction.update = (itemIds) => { this.populateSelectedItems(itemIds); };
        }
      }

      // populate selectedItems based on a list of ids
      populateSelectedItems(ids) {
        this.selectedItems = ids.map(id => this.allItems.find((i) => i.id === id));
      }

      onItemsChanged() {
        // wipe the groups and add all of the selected ids
        this.itemIds.length = 0;
        this.itemIds = this.selectedItems.map((i) => i.id);
      }
    }
  };
});
