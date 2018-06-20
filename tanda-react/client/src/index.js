import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import styles from './styles.module.css';
import LoginField from './components/LoginField'

ReactDOM.render(
  <div className={styles.app}>
      <LoginField/>
  </div>,
  document.getElementById('root')
);

registerServiceWorker();
