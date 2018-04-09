const request = require('request');
const querystring = require('querystring');
const token = require('../token');

const getOptions = (url, form = {}) => {
  const options = {
    url,
    headers: { Authorization: `Bearer ${token.accessToken}` },
    json: true,
    ...form,
  };
  return options;
};

const getCurrentlyPlaying = () => (
  new Promise((resolve, reject) => {
    const currentPlayUrl = 'https://api.spotify.com/v1/me/player/currently-playing';
    const options = getOptions(currentPlayUrl);
    // use the access token to access the Spotify Web API
    request.get(options, (err, responseAccess, bodyAccess) => {
      if (err) {
        reject(err);
      } else {
        resolve(bodyAccess);
      }
    });
  })
);

const requestNextSong = uri => (
  new Promise((resolve, reject) => {
    const form = {
      form: JSON.stringify({
        uris: [uri],
      }),
    };
    const playerUrl = 'https://api.spotify.com/v1/me/player/play';
    const options = getOptions(playerUrl, form);
    request.put(options, (err, responseAccess, bodyAccess) => {
      if (err) {
        reject(err);
      } else {
        resolve(bodyAccess);
      }
    });
  })
);

const getTopSongs = () => (
  new Promise((resolve, reject) => {
    const topSongsUrl = `https://api.spotify.com/v1/me/top/tracks?${querystring.stringify({
      limit: 10,
      time_range: 'short_term',
    })}`;
    const options = getOptions(topSongsUrl);
    request.get(options, (err, responseAccess, bodyAccess) => {
      if (err) {
        reject(err);
      } else {
        resolve(bodyAccess);
      }
    });
  })
);

module.exports = {
  getCurrentlyPlaying,
  requestNextSong,
  getTopSongs,
};
