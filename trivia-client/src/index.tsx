import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { AppContext } from './context/app.context';
import reportWebVitals from './reportWebVitals';

const token = sessionStorage.getItem('token');
const username = sessionStorage.getItem('username');

ReactDOM.render(
  <React.StrictMode>
    <AppContext.Provider value={{ token, username }}> 
      <App />
    </AppContext.Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
