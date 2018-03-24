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

import React from 'react';
import PropTypes from 'prop-types';

export const RecognizedResult = ({
  config,
  indexPattern,
}) => {
  const href = `#/jobs/new_job/simple/recognize?id=${config.id}&index=${indexPattern.id}`;
  let logo = null;
  // if a logo is available, use that, otherwise display the id
  // the logo should be a base64 encoded image
  if (config.logo && config.logo.src) {
    logo = <div><img src={config.logo.src}/></div>;
  } else {
    logo = <h3 className="euiTitle euiTitle--small">{config.id}</h3>;
  }

  return (
    <div className="euiFlexItem euiFlexItem--flexGrowZero euiPanel euiPanel--paddingMedium recognizer-result">
      <div className="euiFlexGroup euiFlexGroup--gutterLarge">
        <div className="euiFlexItem euiFlexItem--flexGrowZero ml-data-recognizer-logo">
          {logo}
        </div>
        <div className="euiFlexItem euiText">
          <h4>
            <a href={href} className="euiLink">{config.title}</a>
          </h4>
          <p className="euiTextColor euiTextColor--subdued">
            {config.description}
          </p>
        </div>
      </div>
    </div>
  );
};

RecognizedResult.propTypes = {
  config: PropTypes.object,
  indexPattern: PropTypes.object,
};
