import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import style from '../styles/leaderboard.css';

class leaderboard extends React.Component {
  componentDidMount() {
    this.getTopSongs();
  }

  async getTopSongs() {
    const response = await axios.get('/songs/topSongs');
    this.props.addTopSongs(response.data.items);
  }

  render() {
    const songsAvailable = this.props.songsAvailable.map(song => (
      <tr key={song.id}>
        <td>{song.name}</td>
        <td>{song.artists[0].name}</td>
        <td>{song.votes}</td>
        <td><button onClick={this.props.vote}>Vote!</button></td>
      </tr>
    ));
    if (songsAvailable.length > 0) {
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
              {songsAvailable}
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
  songsAvailable: PropTypes.array.isRequired,
  addTopSongs: PropTypes.func.isRequired,
  vote: PropTypes.func.isRequired,
};


export default leaderboard;
