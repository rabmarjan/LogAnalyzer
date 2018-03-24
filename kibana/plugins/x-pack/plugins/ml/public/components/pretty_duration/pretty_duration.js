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

// a copy of Kibana's pretty duration directive
// adding extra zoom in / zoom out buttons to the left of the timepicker.


import _ from 'lodash';
import dateMath from '@elastic/datemath';
import moment from 'moment';
import angular from 'angular';
import $ from 'jquery';

import 'ui/timepicker/time_units';
import './styles/main.less';

import { uiModules } from 'ui/modules';
const module = uiModules.get('apps/ml');

module.directive('prettyDuration', function (config, timeUnits, $compile, timefilter) {
  return {
    restrict: 'E',
    priority: 1,
    terminal: true,
    scope: {
      from: '=',
      to: '='
    },
    link: function ($scope, $elem) {
      const quickRanges = config.get('timepicker:quickRanges');
      const dateFormat = config.get('dateFormat');

      const lookupByRange = {};
      _.each(quickRanges, function (frame) {
        lookupByRange[frame.from + ' to ' + frame.to] = frame;
      });

      function setText(text) {
        $elem.text(text);
        $elem.attr('aria-label', `Current time range is ${text}`);
      }

      function stringify() {
        let text;
        // If both parts are date math, try to look up a reasonable string
        if ($scope.from && $scope.to && !moment.isMoment($scope.from) && !moment.isMoment($scope.to)) {
          const tryLookup = lookupByRange[$scope.from.toString() + ' to ' + $scope.to.toString()];
          if (tryLookup) {
            setText(tryLookup.display);
          } else {
            const fromParts = $scope.from.toString().split('-');
            if ($scope.to.toString() === 'now' && fromParts[0] === 'now' && fromParts[1]) {
              const rounded = fromParts[1].split('/');
              text = 'Last ' + rounded[0];
              if (rounded[1]) {
                text = text + ' rounded to the ' + timeUnits[rounded[1]];
              }
              setText(text);
            } else {
              cantLookup();
            }
          }
        // If at least one part is a moment, try to make pretty strings by parsing date math
        } else {
          cantLookup();
        }
      }

      function cantLookup() {
        const display = {};
        _.each(['from', 'to'], function (time) {
          if (moment($scope[time]).isValid()) {
            display[time] = moment($scope[time]).format(dateFormat);
          } else {
            if ($scope[time] === 'now') {
              display[time] = 'now';
            } else {
              const tryParse = dateMath.parse($scope[time], { roundUp: time === 'to' });
              display[time] = moment.isMoment(tryParse) ? '~ ' + tryParse.fromNow() : $scope[time];
            }
          }
        });
        setText(`${display.from} to ${display.to}`);
      }

      // add the zoom elements to the page outside the <pretty_duration>'s parent anchor element
      // however, they are given <pretty_duration>'s scope to allow access to the zoom functions
      function addZoomButtons() {
        const zoomOutButton = angular.element('<button class="kuiLocalMenuItem" ng-click="zoomOut()" aria-label="Zoom out time">' +
          '<span class="kuiIcon fa-search-minus" aria-hidden="true" tooltip="Zoom out time"></span></button>');
        const zoomInButton = angular.element('<button class="kuiLocalMenuItem" ng-click="zoomIn()" aria-label="Zoom in time">' +
          '<span class="kuiIcon fa-search-plus" aria-hidden="true" tooltip="Zoom in time"></span></button>');
        const separator = angular.element('<div class="ml-time-button-separator" ></div>');

        $($elem.parent()[0].previousElementSibling).before(zoomInButton);
        $($elem.parent()[0].previousElementSibling).before(zoomOutButton);
        $($elem.parent()[0].previousElementSibling).before(separator);
        // compile the new html and attach this scope to allow access to the zoom functions
        $compile(zoomInButton)($scope);
        $compile(zoomOutButton)($scope);
      }

      // find the from and to values from the timefilter
      // if a quick or relative mode has been selected, work out the
      // absolute times and then change the mode to absolute
      function getFromTo() {
        if (timefilter.time.mode === 'absolute') {
          return {
            to: moment(timefilter.time.to),
            from: moment(timefilter.time.from)
          };
        } else {
          timefilter.time.mode = 'absolute';
          return {
            to: dateMath.parse(timefilter.time.to, { roundUp: true }),
            from: dateMath.parse(timefilter.time.from)
          };
        }
      }

      // zoom out, doubling the difference between start and end, keeping the same time range center
      $scope.zoomOut = function () {
        const time = getFromTo();
        const from = time.from.unix() * 1000;
        const to = time.to.unix() * 1000;

        const diff = Math.floor((to - from) / 2);

        timefilter.time.from = moment(from - diff).toISOString();
        timefilter.time.to = moment(to + diff).toISOString();
      };

      // zoom in, halving the difference between start and end, keeping the same time range center
      $scope.zoomIn = function () {
        const time = getFromTo();
        const from = time.from.unix() * 1000;
        const to = time.to.unix() * 1000;

        const diff = Math.floor((to - from) / 4);

        timefilter.time.from = moment(from + diff).toISOString();
        timefilter.time.to = moment(to - diff).toISOString();
      };

      $scope.$watch('from', stringify);
      $scope.$watch('to', stringify);

      addZoomButtons();
    }
  };
});
