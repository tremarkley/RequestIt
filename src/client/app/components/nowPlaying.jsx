import React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import style from '../styles/nowPlaying.css';

class nowPlaying extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
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
    this.props.updateCurrentSong(response.data);
  }

  async checkCurrentSong() {
    console.log('checking current song...');
    const response = await axios.get('/songs/currentlyPlaying');
    if (this.props.currentSong.item.name !== response.data.item.name ||
      this.props.currentSong.item.artists[0].name !== response.data.item.artists[0].name) {
      console.log('new song detected');
      this.props.updateCurrentSong(response.data);
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
    if (this.props.currentSong === undefined) {
      return (
        <p>Loading Song...</p>
      );
    }
    return (
      <div className={style.currentSongDiv}>
        <div className={style.currentSongText}>
          <p>
          Currently Playing: {this.props.currentSong.item.name} by {this.props.currentSong.item.artists[0].name}
          </p>
        </div>
        <div className={style.timeLeft}>
          <p className={style.timeLeft}>Remaining: {this.state.timeRemaining}</p>
        </div>
        <div className={style.clear} />
      </div>
    );
  }
}

nowPlaying.propTypes = {
  updateCurrentSong: PropTypes.func.isRequired,
  currentSong: PropTypes.object.isRequired,
};

export default nowPlaying;
