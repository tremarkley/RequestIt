import React from 'react';
import style from './styles/app.css';

const App = () => (
  <div className="container">
    <h1>Request-It</h1>
    <div className={style.requestContainer}>
      <div className={style.descriptionDiv}><p>Request what song you want to hear next!</p></div>
      <div className={style.requestButtonDiv}>
        <button className={style.requestButton}>Request</button>
      </div>
    </div>
  </div>
);

export default App;
