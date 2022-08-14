import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { registerSW } from './serviceWorker';

// Registration of a service worker
registerSW('/background.js');

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root'),
);
