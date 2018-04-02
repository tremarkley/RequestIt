import React from 'react';
import axios from 'axios';
import style from '../styles/nowPlaying.css';

class nowPlaying extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentSong: undefined,
    };
  }

  async componentDidMount() {
    const response = await axios.get('/songs/currentlyPlaying');
    this.updateSong(response.data);
  }

  updateSong(song) {
    this.setState({ currentSong: song });
  }

  render() {
    if (this.state.currentSong === undefined) {
      return (
        <p>Loading Song...</p>
      );
    }
    return (
      <p className={style.currentSongText}>
      Currently Playing: {this.state.currentSong.item.name} by {this.state.currentSong.item.artists[0].name}
      </p>
    );
  }
}

export default nowPlaying;
