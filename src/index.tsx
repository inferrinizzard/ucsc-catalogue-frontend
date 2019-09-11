import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import store from './store/index';
(window as any)['store'] = store;

import App from './App';
import './index.css';

const root = document.querySelector('#root');
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  root
);
