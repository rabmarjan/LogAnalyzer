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

import uiRoutes from 'ui/routes';
import uiChrome from 'ui/chrome';
import template from './index.html';

uiRoutes.when('/access-denied', {
  template,
  controllerAs: 'accessDenied',
  controller($window, kbnUrl, kbnBaseUrl) {
    this.goToKibana = () => {
      $window.location.href = uiChrome.getBasePath() + kbnBaseUrl;
    };

    this.retry = () => {
      return kbnUrl.redirect('/jobs');
    };
  }
});
