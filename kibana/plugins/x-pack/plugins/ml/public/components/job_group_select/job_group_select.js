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

import _ from 'lodash';

import template from './job_group_select.html';

import { InitAfterBindingsWorkaround } from 'ui/compat';
import { uiModules } from 'ui/modules';
const module = uiModules.get('apps/ml');

module.directive('mlJobGroupSelect', function (es, ml, $timeout, mlJobService) {
  return {
    restrict: 'E',
    template,
    scope: {
      jobGroups: '=',
      disabled: '=',
      externalUpdateFunction: '='
    },
    controllerAs: 'mlGroupSelect',
    bindToController: true,
    controller: class MlGroupSelectController extends InitAfterBindingsWorkaround {
      initAfterBindings($scope) {
        this.$scope = $scope;
        this.selectedGroups = [];
        this.groups = [];

        // load the jobs, in case they've not been loaded before
        // in order to get the job groups
        mlJobService.loadJobs()
          .then(() => {
            const groups = mlJobService.getJobGroups();
            this.groups = groups.map(g => {
              return { id: g.id, count: g.jobs.length, isTag: false };
            });
            // if jobGroups hasn't been passed in or it isn't an array, create a new one
            // needed because advanced job configuration page may not have a jobs array. e.g. when cloning
            if (Array.isArray(this.jobGroups) === false) {
              this.jobGroups = [];
            }

            this.populateSelectedGroups(this.jobGroups);
          });

        // make the populateSelectedGroups function callable from elsewhere.
        // this is used in the advanced job configuration page, when the user has edited the
        // job's JSON, we need to force update the displayed selected groups
        if (this.externalUpdateFunction !== undefined) {
          this.externalUpdateFunction.update = (groups) => { this.populateSelectedGroups(groups); };
        }
      }

      // takes a list of groups ids
      // if the ids has already been used, add it to list of selected groups for display
      // if it hasn't, create the group
      populateSelectedGroups(groups) {
        this.selectedGroups = [];
        groups.forEach(gId => {
          const tempGroup = _.filter(this.groups, { id: gId });
          if (tempGroup.length) {
            this.selectedGroups.push(tempGroup[0]);
          } else {
            this.selectedGroups.push(this.createNewItem(gId));
          }
        });
      }

      onGroupsChanged() {
        // wipe the groups and add all of the selected ids
        this.jobGroups.length = 0;
        this.selectedGroups.forEach((group) => {
          this.jobGroups.push(group.id);
        });
      }

      createNewItem(groupId) {
        const gId = groupId.toLowerCase();
        return ({ id: gId, count: 0, isTag: true });
      }

      groupTypes(group) {
        if(group.isTag === false) {
          return 'Existing groups';
        }
      }
    }
  };
});
