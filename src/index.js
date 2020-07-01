import React from 'react';
import ReactDOM from 'react-dom';
<<<<<<< HEAD
import './index.css';
=======
import './index.scss';
>>>>>>> 234d8095946a2c7f3c43866e1505d72173c5d6ba
import App from './App';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
