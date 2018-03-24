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


import 'ngreact';
import { dataRecognizerProvider } from './data_recognizer';

import { uiModules } from 'ui/modules';
const module = uiModules.get('apps/ml', ['react']);
module.directive('mlDataRecognizer', function (reactDirective, Private) {
  const DataRecognizer = Private(dataRecognizerProvider);
  return reactDirective(DataRecognizer, undefined, { restrict: 'AE' });
});
