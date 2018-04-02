const express = require('express');
const request = require('request');
const token = require('../token');

const router = express.Router();

router.get('/currentlyPlaying', async (req, res, next) => {
  const options = {
    url: 'https://api.spotify.com/v1/me/player/currently-playing',
    headers: { Authorization: `Bearer ${token.accessToken}` },
    json: true,
  };

  // use the access token to access the Spotify Web API
  request.get(options, (err, responseAccess, bodyAccess) => {
    if (err) {
      next(err);
    }
    res.send(bodyAccess);
  });
});

module.exports = router;
