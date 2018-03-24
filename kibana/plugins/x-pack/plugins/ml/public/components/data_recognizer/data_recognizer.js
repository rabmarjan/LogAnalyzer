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

import PropTypes from 'prop-types';

import React, { Component } from 'react';
import { RecognizedResult } from './recognized_result';

export function dataRecognizerProvider(ml) {

  class DataRecognizer extends Component {
    constructor(props) {
      super(props);

      this.state = {
        results: []
      };

      this.indexPattern = props.indexPattern;
      this.className = props.className;
      this.results = props.results;
    }

    componentDidMount() {
      // once the mount is complete, call the recognize endpoint to see if the index format is known to us,
      ml.recognizeIndex({ indexPatternTitle: this.indexPattern.title })
        .then((resp) => {
          const results = resp.map((r) => (
            <RecognizedResult
              key={r.id}
              config={r}
              indexPattern={this.indexPattern}
            />
          ));
          if (typeof this.results === 'object') {
            this.results.count = results.length;
          }

          this.setState({
            results
          });
        });
    }

    render() {
      return (
        <div className={this.className}>
          {this.state.results}
        </div>
      );
    }
  }

  DataRecognizer.propTypes = {
    indexPattern: PropTypes.object,
    className: PropTypes.string,
    results: PropTypes.object,
  };

  return DataRecognizer;
}
