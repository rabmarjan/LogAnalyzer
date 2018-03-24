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

import { XPackInfoProvider } from 'plugins/xpack_main/services/xpack_info';
import chrome from 'ui/chrome';
import { uiModules } from 'ui/modules';

uiModules.get('xpack/ml').run((Private) => {
  const xpackInfo = Private(XPackInfoProvider);
  if (!chrome.navLinkExists('ml')) return;

  const navLink = chrome.getNavLinkById('ml');
  // hide by default, only show once the xpackInfo is initialized
  navLink.hidden = true;
  const showAppLink = xpackInfo.get('features.ml.showLinks', false);
  navLink.hidden = !showAppLink;
  if (showAppLink) {
    navLink.disabled = !xpackInfo.get('features.ml.isAvailable', false);
  }
});
