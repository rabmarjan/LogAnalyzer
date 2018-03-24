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

// A refactor of the original ML listener (three separate functions) into
// an object providing them as methods.

export function listenerFactoryProvider() {
  return function () {
    const listeners = [];
    return {
      changed(...args) {
        listeners.forEach((listener) => listener(...args));
      },
      watch(listener) {
        listeners.push(listener);
      },
      unwatch(listener) {
        const index = listeners.indexOf(listener);
        if (index > -1) {
          listeners.splice(index, 1);
        }
      },
      unwatchAll() {
        listeners.splice(0);
      }
    };
  };
}
