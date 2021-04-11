/* eslint-disable react/prefer-stateless-function */
/* eslint linebreak-style: ["error", "windows"] */
/* eslint "react/react-in-jsx-scope": "off" */
/* eslint "react/jsx-no-undef": "off" */
/* eslint "react/no-multi-comp": "off" */
/* eslint-disable react/no-array-index-key */
/* eslint-disable max-len */
/* eslint "no-alert": "off" */

import 'whatwg-fetch';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import Page from './Page.jsx';

const element = (
  <Router>
    <Page />
  </Router>
);

ReactDOM.render(element, document.getElementById('inventory'));

if (module.hot) {
  module.hot.accept();
}
