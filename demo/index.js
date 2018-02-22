import React from 'react';
import ReactDOM from 'react-dom';

import { Merkaba } from '../src/index.js';

const root = document.getElementById('app');

root.classList.add('merkaba-wrapper');

const merkaba = ReactDOM.render(
  <Merkaba />,
  root
);
