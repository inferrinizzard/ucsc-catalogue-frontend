import * as React from 'react';
import * as ReactDOM from 'react-dom';

import './services/api'; // TODO: remove it

import App from './App';

const root = document.querySelector('#root');
ReactDOM.render(<App />, root);
