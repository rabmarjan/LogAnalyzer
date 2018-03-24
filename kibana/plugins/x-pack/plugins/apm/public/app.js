import { uiModules } from 'ui/modules'; // eslint-disable-line no-unused-vars
import chrome from 'ui/chrome';
import React from 'react';
import ReactDOM from 'react-dom';
import 'ui/autoload/styles';
import 'react-vis/dist/style.css';
import './style/global_overrides.css';

import template from './templates/index.html';
import ReactRoot from './reactRoot';
import 'ui/autoload/all';

import { initTimepicker } from './utils/timepicker';
import configureStore from './store/config/configureStore';
import createHistory from 'history/createHashHistory';

chrome.setRootTemplate(template);

const store = configureStore();
const history = createHistory();

initTimepicker(history, store.dispatch, () => {
  ReactDOM.render(
    <ReactRoot history={history} store={store} />,
    document.getElementById('react-apm-root')
  );
});
