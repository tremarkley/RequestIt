const express = require('express');
const request = require('request');
const querystring = require('querystring');
const token = require('../token');

const router = express.Router();

const getOptions = function getOptions(url) {
  const options = {
    url,
    headers: { Authorization: `Bearer ${token.accessToken}` },
    json: true,
  };
  return options;
};

router.get('/currentlyPlaying', (req, res, next) => {
  const currentPlayUrl = 'https://api.spotify.com/v1/me/player/currently-playing';
  const options = getOptions(currentPlayUrl);
  // use the access token to access the Spotify Web API
  request.get(options, (err, responseAccess, bodyAccess) => {
    if (err) {
      next(err);
    }
    res.send(bodyAccess);
  });
});

router.get('/topSongs', (req, res, next) => {
  const topSongsUrl = `https://api.spotify.com/v1/me/top/tracks?${querystring.stringify({
    limit: 10,
    time_range: 'short_term',
  })}`;
  const options = getOptions(topSongsUrl);
  request.get(options, (err, responseAccess, bodyAccess) => {
    if (err) {
      next(err);
    }
    res.send(bodyAccess);
  });
});

module.exports = router;
