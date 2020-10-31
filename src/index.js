import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {AppProvider} from './Context';
import App from "./App";
import { StateInspector } from 'reinspect'

ReactDOM.render(
  <StateInspector name="Chat">
    <AppProvider>
    <App />
  </AppProvider>
  </StateInspector>,
  document.getElementById('root')
);
