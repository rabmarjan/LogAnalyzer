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
import './styles/main.less';
import template from './messagebar.html';

import { uiModules } from 'ui/modules';
const module = uiModules.get('apps/ml');

module.service('mlMessageBarService', function () {
  const MSG_STYLE = { INFO: 'ml-message-info', WARNING: 'ml-message-warning', ERROR: 'ml-message-error' };

  this.messages = [];

  this.addMessage = function (msg) {
    if (!_.findWhere(this.messages, msg)) {
      this.messages.push(msg);
    }
  };

  this.removeMessage = function (index) {
    this.messages.splice(index, 1);
  };

  this.clear = function () {
    this.messages.length = 0;
  };

  this.info = function (text) {
    this.addMessage({ text: text, style: MSG_STYLE.INFO });
  };

  this.warning = function (text) {
    this.addMessage({ text: text, style: MSG_STYLE.WARNING });
  };

  this.error = function (text, resp) {
    const txt = text + ' ' + expandErrorMessageObj(resp);
    this.addMessage({ text: txt, style: MSG_STYLE.ERROR });
  };

  function expandErrorMessageObj(resp) {
    let txt = '';
    if (resp !== undefined && typeof resp === 'object') {
      try {
        const respObj = JSON.parse(resp.response);
        if (typeof respObj === 'object' && respObj.error !== undefined) {
          txt = respObj.error.reason;
        }
      } catch(e) {
        txt = resp.message;
      }
    }
    return txt;
  }
})

  .controller('MlMessageBarController', function ($scope, mlMessageBarService) {
    $scope.messages = mlMessageBarService.messages;
    $scope.removeMessage = mlMessageBarService.removeMessage;
  })

  .directive('mlMessageBar', function () {
    return {
      restrict: 'AE',
      template
    };

  });

