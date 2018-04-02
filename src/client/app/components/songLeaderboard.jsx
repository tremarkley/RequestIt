import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import style from '../styles/leaderboard.css';

class leaderboard extends React.Component {
  constructor(props) {
    super(props);
    this.getTopSongs = this.getTopSongs.bind(this);
  }

  async componentDidMount() {
    this.getTopSongs();
  }

  async getTopSongs() {
    const response = await axios.get('/songs/topSongs');
    this.props.updateTopSongs(response.data.items);
  }

  render() {
    const topSongs = this.props.topSongs.map((song, index) => (
      <tr key={song.id}>
        <td>{song.name}</td>
        <td>{song.artists[0].name}</td>
        <td>{song.votes}</td>
        <td><button onClick={() => this.props.vote(index)}>Vote!</button></td>
      </tr>
    ));
    if (topSongs.length > 0) {
      return (
        <div className={style.leaderboardContainer}>
          <table>
            <thead>
              <tr>
                <th>Song</th>
                <th>Artist</th>
                <th>Votes</th>
              </tr>
            </thead>
            <tbody>
              {topSongs}
            </tbody>
          </table>
        </div>
      );
    }
    return (
      <p>Request Songs!</p>
    );
  }
}

leaderboard.propTypes = {
  topSongs: PropTypes.array.isRequired,
  updateTopSongs: PropTypes.func.isRequired,
  vote: PropTypes.func.isRequired,
};


export default leaderboard;
