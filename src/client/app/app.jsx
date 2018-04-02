import React from 'react';
import style from './styles/app.css';
import Login from './components/login';
import NowPlaying from './components/nowPlaying';
import Leaderboard from './components/songLeaderboard';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      topSongs: [],
    };
    this.updateTopSongs = this.updateTopSongs.bind(this);
    this.upVote = this.upVote.bind(this);
    // this.loginClick = this.loginClick.bind(this);
  }

  // loginClick() {
  //   console.log('login clicked');
  //   axios.get('/authenticate/login');
  // };

  upVote(index) {
    this.setState((prevState) => {
      const newTopSongs = prevState.topSongs.slice();
      newTopSongs[index].votes += 1;
      return { topSongs: newTopSongs };
    });
  }

  updateTopSongs(songs) {
    const topSongs = [];
    for (let i = 0; i < songs.length; i += 1) {
      const newSong = songs[i];
      newSong.votes = 0;
      topSongs.push(newSong);
    }
    this.setState(prevState => ({ topSongs: topSongs.concat(prevState.topSongs) }));
  }

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
          <Leaderboard
            topSongs={this.state.topSongs}
            updateTopSongs={this.updateTopSongs}
            vote={this.upVote}
          />
        </div>
      );
    }
    return (
      <Login loginClick={this.loginClick} />
    );
  }
}

export default App;
