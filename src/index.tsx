import * as React from 'react';
import * as ReactDOM from 'react-dom';

import API from './services/api'; // TODO: remove it

import App from './App';

const root = document.querySelector('#root');
ReactDOM.render(<App />, root);
// API.courses('2190').then(console.log);
// API.tracking(42674, '2190').then(console.log);
