import React from 'react';
import axios from 'axios';
import style from './styles/app.css';
import Login from './components/login';
import NowPlaying from './components/nowPlaying';
import Leaderboard from './components/songLeaderboard';

class App extends React.Component {
  constructor(props) {
    super(props);
    // this.state = {
    //   loggedin: false,
    // };
    // this.loginClick = this.loginClick.bind(this);
  }

  // loginClick() {
  //   console.log('login clicked');
  //   axios.get('/authenticate/login');
  // };

  render() {
    const params = (new URL(document.location)).searchParams;
    if (params.get('authenticated')) {
      return (
        <div className="container">
          <h1>Request-It</h1>
          <div className={style.requestContainer}>
            <div className={style.descriptionDiv}>
              <p>Request what song you want to hear next!</p>
            </div>
            <div className={style.requestButtonDiv}>
              <button className={style.requestButton}>Request</button>
            </div>
          </div>
          <NowPlaying />
          <Leaderboard />
        </div>
      );
    }
    return (
      <Login loginClick={this.loginClick} />
    );
  }
}

export default App;
