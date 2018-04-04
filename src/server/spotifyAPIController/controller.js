const request = require('request');
const token = require('../token');

const getOptions = function getOptions(url) {
  const options = {
    url,
    headers: { Authorization: `Bearer ${token.accessToken}` },
    json: true,
  };
  return options;
};

const getCurrentlyPlaying = function getCurrentlyPlaying() {
  return new Promise((resolve, reject) => {
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
  });
};

module.exports = {
  getCurrentlyPlaying,
};
