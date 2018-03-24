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

module.service('mlESMappingService', function ($q, mlJobService) {

  this.indices = {};

  this.getMappings = function () {
    const deferred = $q.defer();

    mlJobService.getESMappings()
      .then(indices => {
        this.indices = indices;
        deferred.resolve(indices);

      }).catch(err => {
        console.log('getMappings:', err);
      });

    return deferred.promise;
  };

  this.getTypesFromMapping = function (index) {
    let types = [];
    let ind = index.trim();

    if (ind.match(/\*/g)) {
      // use a regex to find all the indices that match the name
      ind = ind.replace(/\*/g, '.*');
      const reg = new RegExp(`^${ind}$`);
      const tempTypes = {};

      _.each(this.indices, (idx, key) => {
        if (key.match(reg)) {
          _.each(idx.types, (t, tName) => {
            tempTypes[tName] = {};
          });
        }
      });
      types = Object.keys(tempTypes);
    } else {
      if (this.indices[index] !== undefined) {
        types = Object.keys(this.indices[index].types);
      }
    }

    return types;
  };

  // using the field name, find out what mapping type it is from
  this.getMappingTypeFromFieldName = function (index, fieldName) {
    let found = false;
    let type = '';
    let ind = index.trim();

    if (ind.match(/\*/g)) {
      // use a regex to find all the indices that match the name
      ind = ind.replace(/\*/g, '.+');
      const reg = new RegExp(`^${ind}$`);

      _.each(this.indices, (idx, key) => {
        if (key.match(reg)) {
          _.each(idx.types, (t, tName) => {
            if (!found && t && _.has(t.properties, fieldName)) {
              found = true;
              type = tName;
            }
          });
        }
      });
    } else {
      _.each(this.indices[index].types, (t, tName) => {
        if (!found && t && _.has(t.properties, fieldName)) {
          found = true;
          type = tName;
        }
      });
    }

    return type;
  };

  // Returns the mapping type of the specified field.
  // Accepts fieldName containing dots representing a nested sub-field.
  // An optional list of types may also be supplied to limit the search.
  this.getFieldTypeFromMapping = function (index, fieldName, types) {
    let found = false;
    let fieldType = undefined;
    let ind = index.trim();
    const checkTypes = types && types.length;

    // Convert to the supplied fieldName string into an array, to handle the use of dot notation
    // in field names in job configurations which to refer to object or nested sub-fields
    // e.g. 'message.keyword' or 'nginx.access.geoip.region_name'.
    const splitFieldsList = fieldName.split('.');

    if (ind.match(/\*/g)) {
      // use a regex to find all the indices that match the supplied index pattern
      ind = ind.replace(/\*/g, '.+');
      const reg = new RegExp(`^${ind}$`);

      _.each(this.indices, (idx, key) => {
        if (key.match(reg)) {
          _.each(idx.types, (t, typeName) => {
            if (!found && t && (!checkTypes || _.indexOf(types, typeName) > -1)) {
              fieldType = getLastFieldType(t, splitFieldsList);
              if (fieldType !== undefined) {
                found = true;
              }
            }
          });
        }
      });
    } else {
      _.each(this.indices[index].types, (t, typeName) => {
        if (!found && t && (!checkTypes || _.indexOf(types, typeName) > -1)) {
          fieldType = getLastFieldType(t, splitFieldsList);
          if (fieldType !== undefined) {
            found = true;
          }
        }
      });
    }

    return fieldType;
  };

  function getLastFieldType(node, fieldList) {
    // Recurses down a properties node to obtain the mapping type of the
    // last item in the supplied list of fields.
    // Handles a single item list for an un-nested field, and multi-item lists
    // of sub-fields where the original field name passed to the mapping service
    // used dot notation to refer to the nested object field
    // e.g. 'message.keyword' or 'nginx.access.geoip.region_name'.
    let fieldType = undefined;

    let memo = node;
    for (let i = 0; i < fieldList.length; i++) {
      if (memo === undefined) {
        // Cannot match parent node in object properties.
        return fieldType;
      }

      if (i < (fieldList.length - 1)) {
        if (memo.hasOwnProperty('properties')) {
          memo = memo.properties[fieldList[i]];
        } else {
          // No properties object in parent node.
          return fieldType;
        }
      } else {
        if (memo.hasOwnProperty('properties')) {
          const nodeForField = memo.properties[fieldList[i]];
          if (nodeForField !== undefined) {
            fieldType = nodeForField.type;
          }
        } else {
          if (memo.type === 'text' && memo.hasOwnProperty('fields')) {
            // For text fields, check for keyword type subfields.
            const nodeForField = memo.fields[fieldList[i]];
            if (nodeForField !== undefined) {
              fieldType = nodeForField.type;
            }
          }
        }
      }
    }

    return fieldType;
  }


});
