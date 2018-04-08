import React from 'react';
import PropTypes from 'prop-types';
import style from '../styles/nowPlaying.css';
import { subscribeToCurrentlyPlaying } from '../api';

class nowPlaying extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      timeRemaining: undefined,
    };
    this.songRemaining = this.songRemaining.bind(this);
    subscribeToCurrentlyPlaying(this.songRemaining, this.props.updateCurrentSong);
  }

  songRemaining(song) {
    if (song !== undefined) {
      const totalSeconds = (song.item.duration_ms
        - song.progress_ms) / 1000;
      const minutes = Math.floor(totalSeconds / 60);
      let seconds = Math.floor(totalSeconds - (minutes * 60));
      if (seconds < 10) {
        seconds = `0${seconds}`;
      }
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
  currentSong: PropTypes.object
};

nowPlaying.defaultProps = {
  currentSong: undefined,
}

export default nowPlaying;
