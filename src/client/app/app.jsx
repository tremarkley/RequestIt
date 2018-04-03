import React from 'react';
import axios from 'axios';
import style from './styles/app.css';
import Login from './components/login';
import NowPlaying from './components/nowPlaying';
import Leaderboard from './components/songLeaderboard';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      songsAvailable: [],
      topVotedSong: undefined,
      currentSong: undefined,
    };
    this.updateCurrentSong = this.updateCurrentSong.bind(this);
    this.addTopSongs = this.addTopSongs.bind(this);
    this.upVote = this.upVote.bind(this);
  }

  async getTopSongs() {
    try {
      const response = await axios.get('/songs/topSongs');
      this.addTopSongs(response.data.items);
    } catch (error) {
      console.log(`error adding top songs: ${error}`);
    }
  }

  updateCurrentSong(song) {
    this.setState({ currentSong: song });
  }

  upVote(index) {
    this.setState((prevState) => {
      const nextState = {};
      const newTopSongs = prevState.topSongs.slice();
      newTopSongs[index].votes += 1;
      if (newTopSongs[index].votes > prevState.topVotedSong.votes) {
        nextState.topVotedSong = newTopSongs[index];
      }
      nextState.topSongs = newTopSongs;
      return nextState;
    });
  }

  addTopSongs(songs) {
    const topSongs = [];
    for (let i = 0; i < songs.length; i += 1) {
      const newSong = songs[i];
      newSong.votes = 0;
      topSongs.push(newSong);
    }
    this.setState((prevState) => {
      const nextState = {};
      if (prevState.topVotedSong === undefined) {
        [nextState.topVotedSong] = topSongs;
      }
      nextState.songsAvailable = topSongs.concat(prevState.songsAvailable);
      return nextState;
    });
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
            {/* <div className={style.requestButtonDiv}>
              <button className={style.requestButton}>Request</button>
            </div> */}
          </div>
          <NowPlaying
            currentSong={this.state.currentSong}
            updateCurrentSong={this.updateCurrentSong}
          />
          <Leaderboard
            songsAvailable={this.state.songsAvailable}
            addTopSongs={this.addTopSongs}
            vote={this.upVote}
          />
        </div>
      );
    }
    return (
      <Login />
    );
  }
}

export default App;
