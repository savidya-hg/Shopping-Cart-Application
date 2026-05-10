import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.js'; // This imports the App.js file we wrote earlier

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);