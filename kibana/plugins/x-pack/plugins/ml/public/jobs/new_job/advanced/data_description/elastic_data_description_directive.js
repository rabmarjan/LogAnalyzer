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

import { uiModules } from 'ui/modules';
const module = uiModules.get('apps/ml');
import template from './elastic_data_description.html';
import { ML_JOB_FIELD_TYPES } from 'plugins/ml/../common/constants/field_types';

module.directive('mlElasticDataDescription', function () {
  return {
    restrict: 'AE',
    replace: true,
    scope: {
      ui: '=mlUi',
      properties: '=mlProperties',
      dateProperties: '=mlDateProperties',
      catProperties: '=mlCatProperties',
      indices: '=mlIndices',
      types: '=mlTypes',
      mode: '=mlMode',
      datafeed_config: '=mlDatafeedConfig',
      data_description: '=mlDataDescription',
      dataLoadedCallback: '=mlDataLoadedCallback',
      exposedFunctions: '=mlExposedFunctions',
      serverInfo: '=mlElasticServerInfo'
    },
    template,
    controller: function ($scope, $q, $location, mlJobService) {
      const MODE = {
        NEW: 0,
        EDIT: 1,
        CLONE: 2
      };
      const INDEX_INPUT_TYPE = {
        TEXT: 'TEXT',
        LIST: 'LIST'
      };
      $scope.INDEX_INPUT_TYPE = INDEX_INPUT_TYPE;

      $scope.saveLock = false;
      let keyPressTimeout = null;

      $scope.timeFormatGuessed = false;
      $scope.exampleTime = '';

      const nonInfluencerTypes = [
        'numeric',
        'long',
        'integer',
        'short',
        'byte',
        'double',
        'float',
        'date',
        'boolean',
        'binary',
        'geo_point',
        'geo_shape',
        'completion',
        'token_count',
        'murmur3',
        'attachment'
      ];

      function init() {
        // allow the container (new_job_controller) to call some functions
        // when the JSON has been changed
        if ($scope.exposedFunctions) {
          $scope.exposedFunctions.extractFields = $scope.extractFields;
          $scope.exposedFunctions.getMappings = getMappings;
        }
        // if this is a datafeed job being cloned
        // load the indices and types
        getMappings().then(() => {
          if ($scope.ui.datafeed.indicesText !== '') {
            // if the index pattern has been pre-populated from the url,
            // trigger the field extraction
            $scope.extractFields();
            if ($scope.ui.wizard.step < 2) {
              // skip to the final stage of the wizard
              $scope.ui.wizard.forward();
            }
          } else if ($scope.mode === MODE.CLONE && $scope.ui.isDatafeed) {
            // first load mappings, then extract types and fields.
            setUpClonedJob();
          }
        });
      }

      function setUpClonedJob() {
        // when cloning a job the types from the selected indices haven't
        // been loaded. load these first and pass in fromClone=true so
        // the new types aren't ticked by default
        extractTypesFromIndices(true);

        // create $scope.types by looping through the type names
        // in the cloning job object,
        _.each($scope.datafeed_config.types, (t) => {
          t = t.trim();
          $scope.types[t] = $scope.ui.types[t];
        });

        $scope.extractFields({ types: $scope.types });

        // callback once fields have been loaded
        // when cloning an elastic search based job, the callback is to a function to detect custom influencers
        if ($scope.dataLoadedCallback) {
          $scope.dataLoadedCallback();
        }
      }

      // quick function to get an array of type labels
      $scope.uiTypeKeys = function () {
        return Object.keys($scope.ui.types);
      };

      // function to delete an objects members
      // used rather than foo = {} as that destroys the reference in memory
      // $scope.properties is also bound to a different scope and references needs to
      // be retained
      function clear(obj) {
        Object.keys(obj).forEach((key) => { delete obj[key]; });
        if (Array.isArray(obj)) {
          obj.length = 0;
        }
      }

      $scope.extractFields = function (typesIn) {
        // typesIn gets passed in when types checkboxes get toggled
        // use this list, or empty the list entirely
        if (typesIn && typesIn.hasOwnProperty('types')) {
          if (Object.keys(typesIn.types).length === 0) {
            // if the types array is empty, set $scope.types to be all types
            $scope.types = $scope.ui.types;
          } else {
            $scope.types = typesIn.types;
          }
        } else {
          clear($scope.types);
        }

        // empty the full list of types if no types were passed in
        // so we can keep track of whether we've seen a type before and whether to add it to
        // the checkbox list pre-ticked
        if (typesIn === undefined) {
          clear($scope.ui.types);
        }

        clear($scope.properties);
        clear($scope.dateProperties);
        clear($scope.catProperties);
        clear($scope.ui.influencers);
        $scope.ui.indexTextOk = false;

        extractTypesFromIndices();

        if ($scope.uiTypeKeys().length) {
          // display a green tick for indices
          // display types selection
          $scope.ui.indexTextOk = true;
        }

        const ignoreFields = collectCopyToFields($scope.types);
        let flatFields = extractFlatFields($scope.types);

        // add text fields to list of fields used for the categorization field name
        _.each(flatFields, (prop, key) => {
          if (prop.type === ML_JOB_FIELD_TYPES.TEXT || prop.type === ML_JOB_FIELD_TYPES.KEYWORD) {
            $scope.catProperties[key] = prop;
          }
        });

        // rename multi-fields
        flatFields = renameMultiFields(flatFields);

        _.each(flatFields, (prop, key) => {
          if (ignoreFields[key]) {
            return;
          }
          // add property (field) to list
          $scope.properties[key] = prop;
          if (prop.type === ML_JOB_FIELD_TYPES.DATE) {
            // add date field to list of date fields
            $scope.dateProperties[key] = prop;
          }
        });

        const keys = Object.keys($scope.types);
        $scope.ui.datafeed.typesText  = keys.join(', ');

        // influencers is an array of property names.
        // properties of a certain type (nonInfluencerTypes) are rejected.
        _.each($scope.properties, (prop, key) => {
          if (prop.type && !_.findWhere(nonInfluencerTypes, prop.type)) {
            $scope.ui.influencers.push(key);
          }
        });

        if ($scope.mode === MODE.CLONE && $scope.ui.isDatafeed) {
          // when cloning a datafeed job, don't initially detect the time_field or format
          // just rely on the incoming settings
        } else {
          guessTimeField();
        }
      };


      // create $scope.ui.types based on the indices selected
      // called when extracting fields and when cloning a job
      function extractTypesFromIndices(fromClone) {
        if ($scope.ui.wizard.indexInputType === INDEX_INPUT_TYPE.TEXT) {
          clear($scope.indices);
          // parse comma separated list of indices
          const indices = $scope.ui.datafeed.indicesText.split(',');
          _.each(indices, (ind) => {
            ind = ind.trim();
            // catch wildcard text entry
            ind = ind.replace(/\*/g, '.*');
            const reg = new RegExp('^' + ind + '$');

            _.each($scope.ui.indices, (index, key) => {
              if (key.match(reg)) {
                $scope.indices[key] = index;
                _.each(index.types, (type, i) => {
                  if (!fromClone && $scope.ui.types[i] === undefined) {
                    // if we've never seen this type before add it to the ticked list
                    $scope.types[i] = type;
                  }
                  $scope.ui.types[i] = type;
                });
              }
            });
          });

        } else { // choose indices from tickbox list

          const keys = Object.keys($scope.indices);
          $scope.ui.datafeed.indicesText  = keys.join(', ');

          _.each($scope.indices, (index) => {
            _.each(index.types, (type, i) => {
              if (!fromClone && $scope.ui.types[i] === undefined) {
                // if we've never seen this type before add it to the ticked list
                $scope.types[i] = type;
              }
              $scope.ui.types[i] = type;
            });
          });
        }
      }

      $scope.getIndicesWithDelay = function () {
        $scope.ui.esServerOk = 2;
        window.clearTimeout(keyPressTimeout);
        keyPressTimeout = null;
        keyPressTimeout = window.setTimeout(() => {
          getMappings();
        }, 1000);
      };

      function getMappings() {
        const deferred = $q.defer();

        $scope.ui.validation.setTabValid(4, true);
        mlJobService.getESMappings()
          .then((indices) => {
            $scope.ui.indices  = indices;
            $scope.ui.esServerOk = 1;
            console.log('getMappings():', $scope.ui.indices);

            if ($scope.mode === MODE.CLONE) {
              setUpClonedJob();
            }

            deferred.resolve();

          })
          .catch((err) => {
            console.log('getMappings:', err);
            if (err.statusCode) {
              if (err.statusCode === 401) {
                $scope.ui.validation.setTabValid(4, false);
              } else if (err.statusCode === 403) {
                $scope.ui.validation.setTabValid(4, false);
              } else {
                clearMappings();
              }
              $scope.ui.esServerOk = -1;
            } else {
              clearMappings();
            }

            deferred.reject();
          });

        function clearMappings() {
          $scope.ui.indices = [];
          $scope.ui.esServerOk = -1;
          $scope.ui.datafeed.typesText = '';
          $scope.ui.datafeed.indicesText = '';
        }

        return deferred.promise;
      }

      $scope.toggleIndex = function (key, index) {
        const idx = $scope.indices[key];
        if (idx === undefined) {
          $scope.indices[key] = index;
        } else {
          delete $scope.indices[key];
        }

        $scope.extractFields();
        guessTimeField();
      };

      $scope.toggleTypes = function (key, index) {
        const idx = $scope.types[key];
        if (idx === undefined) {
          $scope.types[key] = index;
        } else {
          delete $scope.types[key];
        }

        $scope.extractFields({ types: $scope.types });
        guessTimeField();
      };

      $scope.toggleAllTypes = function () {
        // if all types are already selected, deselect all
        if ($scope.allTypesSelected()) {
          clear($scope.types);
        } else {
          // otherwise, select all
          $scope.uiTypeKeys().forEach((key) => {
            $scope.types[key] = $scope.ui.types[key];
          });
        }

        // trigger field extraction and time format guessing
        $scope.extractFields({ types: $scope.types });
        guessTimeField();
      };

      $scope.allTypesSelected = function () {
        return ($scope.uiTypeKeys().length === Object.keys($scope.types).length);
      };

      function collectCopyToFields(data) {
        const result = {};
        function recurse(node, name) {
          if (name === 'copy_to') {
            if (Array.isArray(node)) {
              for (const p in node) {
                if (node.hasOwnProperty(p)) {
                  result[node[p]] = true;
                }
              }
            } else {
              result[node] = true;
            }
          } else if (Object(node) === node || Array.isArray(node)) {
            for (const child in node) {
              if (node.hasOwnProperty(child)) {
                recurse(node[child], child);
              }
            }
          }
        }
        recurse(data, '');
        return result;
      }

      function extractFlatFields(types) {
        const result = {};
        let currentType;
        function recurse(node, name, parentNode, parentName) {
          if (node && node.type && typeof node.type === 'string') {
            // node contains a type which is of type string
            node.__type = currentType;
            result[name] = node;
          } else if (Object(node) !== node) {
            // node is not an object, therefore must be a leaf
            // so add its parent to the result if the parent has a type of type string
            if (parentNode.type && typeof parentNode.type === 'string') {
              parentNode.__type = currentType;
              result[parentName] = parentNode;
            }
          } else if (Array.isArray(node)) {
            // skip mapping array
            return;
          } else {
            let isEmpty = true;
            for (const field in node) {
              if (node.hasOwnProperty(field)) {
                isEmpty = false;
                if (field === 'properties') {
                  // enter properties object, but don't add 'properties' to the dot notation chain
                  recurse(node[field], name, parentNode, parentName);
                } else {
                  // enter object, building up a dot notation chain of names
                  recurse(node[field], name ? name + '.' + field : field, node, name);
                }
              }
              if (isEmpty && name) {
                result[name] = node;
              }
            }
          }
        }
        _.each(types, (type, i) => {
          currentType = i;
          recurse(type, '', '');
        });
        return result;
      }

      function guessTimeField() {
        let match = $scope.data_description.time_field;
        if ($scope.dateProperties[match] === undefined) {
          match = '';
          $scope.data_description.time_field = '';
        }
        _.each($scope.dateProperties, (prop, i) => {
          // loop through dateProperties and find the first item that matches 'time'
          if (match === '' && i.match('time')) {
            match = i;
          }
        });
        if (match !== '') {
          $scope.data_description.time_field = match;
          console.log('guessTimeField: guessed time fields: ', match);
        }
      }

      // modify the names of text fields which contain keyword sub-fields
      function renameMultiFields(fields) {
        const renamedFields = {};
        _.each(fields, (field, k) => {
          let name = k;
          if (field.type === ML_JOB_FIELD_TYPES.TEXT) {
            if(field.fields) {
              _.each(field.fields, (subField, sfk) => {
                if (subField.type === ML_JOB_FIELD_TYPES.KEYWORD) {
                  name = `${name}.${sfk}`;
                }
              });
            }
          }
          renamedFields[name] = field;
        });
        return renamedFields;
      }

      init();
    }
  };
}).filter('filterIndices', function () {
  return (idxs) => {
    const indices = {};
    const monitoringName = new RegExp('^\\.monitoring-.+');
    const dotName = new RegExp('^\\..+');
    _.each(idxs, (idx, key) => {
      // create a new collection only containing indices
      // which don't start with a dot, except monitoring ones
      if (key.match(monitoringName) || !key.match(dotName)) {
        indices[key] = idx;
      }
    });
    return indices;
  };
});
