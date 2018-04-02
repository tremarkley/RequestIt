import React from 'react';
import axios from 'axios';
import style from '../styles/nowPlaying.css';

class nowPlaying extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentSong: undefined,
      timeRemaining: undefined,
    };
    this.checkCurrentSong = this.checkCurrentSong.bind(this);
    this.songRemaining = this.songRemaining.bind(this);
    setInterval(() => {
      this.checkCurrentSong();
    }, 1000);
  }

  async componentDidMount() {
    const response = await axios.get('/songs/currentlyPlaying');
    this.updateSong(response.data);
  }

  updateSong(song) {
    this.setState({ currentSong: song });
  }

  async checkCurrentSong() {
    console.log('checking current song...');
    const response = await axios.get('/songs/currentlyPlaying');
    if (this.state.currentSong.item.name !== response.data.item.name ||
      this.state.currentSong.item.artists[0].name !== response.data.item.artists[0].name) {
      console.log('new song detected');
      this.updateSong(response.data);
    }
    this.songRemaining(response.data);
  }

  songRemaining(song) {
    if (song !== undefined) {
      const totalSeconds = (song.item.duration_ms
        - song.progress_ms) / 1000;
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = Math.floor(totalSeconds - (minutes * 60));
      const newTimeRemaining = `${minutes}:${seconds}`;
      if (this.state.timeRemaining !== newTimeRemaining) {
        this.setState({ timeRemaining: `${minutes}:${seconds}` });
      }
    }
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
        <div className={style.timeLeft}>
          <span>Remaining: {this.state.timeRemaining}</span>
        </div>
      </p>
    );
  }
}

export default nowPlaying;
