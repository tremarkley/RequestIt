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
      topSongs: [],
      topVotedSong: undefined,
      currentSong: undefined,
      currentPlaylist: undefined,
    };
    this.updateCurrentSong = this.updateCurrentSong.bind(this);
    this.updateTopSongs = this.updateTopSongs.bind(this);
    this.upVote = this.upVote.bind(this);
    this.createPlaylist = this.createPlaylist.bind(this);
  }

  async getTopSongs() {
    try {
      const response = await axios.get('/songs/topSongs');
      // add top songs to playlist
      const req = {
        url: '/songs/playlist/addSongs',
        method: 'PUT',
        data: {
          songs: response.data.items,
          playlist: this.state.currentPlaylist.id,
        },
      };
      await axios(req);
      this.updateTopSongs(response.data.items);
      alert(`Navigate to Created Playlist: ${this.state.currentPlaylist.name}`);
      // this.props.updateTopSongs(response.data.items);
    } catch (error) {
      console.log(`error adding top songs: ${error}`);
    }
  }

  async createPlaylist() {
    try {
      const newPlaylist = await axios.get('/songs/playlist');
      this.setState({ currentPlaylist: newPlaylist.data }, () => {
        this.getTopSongs();
      });
    } catch (error) {
      alert(`error trying to create playlist: ${error}`);
    }
  }

  updateCurrentSong(song) {
    this.setState({ currentSong: song });
  }

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
    this.setState(prevState => ({
      topSongs: topSongs.concat(prevState.topSongs),
      topVotedSong: topSongs[0],
    }));
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
            topSongs={this.state.topSongs}
            updateTopSongs={this.updateTopSongs}
            vote={this.upVote}
            createPlaylist={this.createPlaylist}
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
