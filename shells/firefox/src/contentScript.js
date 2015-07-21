/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */
'use strict';

if (Object.keys(unsafeWindow.__REACT_DEVTOOLS_GLOBAL_HOOK__._renderers).length) {
  self.port.emit('hasReact', true);
  injectBackend();
} else {
  self.port.emit('hasReact', false);
}

function injectBackend() {
  var node = document.createElement('script');

  node.onload = function () {
    window.postMessage({source: 'react-devtools-reporter'}, '*');

    self.port.on('message', function (payload) {
      window.postMessage({
        source: 'react-devtools-reporter',
        payload: payload
      }, '*');
    });

    window.addEventListener('message', function (evt) {
      if (!evt.data || evt.data.source !== 'react-devtools-bridge') {
        return;
      }

      self.port.emit('message', evt.data.payload);
    });
    node.parentNode.removeChild(node);
  };

  node.src = 'resource://react-devtools/data/build/backend.js';
  document.documentElement.appendChild(node);
}
