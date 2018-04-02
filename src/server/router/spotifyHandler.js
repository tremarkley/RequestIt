const express = require('express');
const axios = require('axios');
const spotifyConfig = require('../../../spotify.config');

const router = express.Router();

router.get('/currentlyPlaying', async (req, res, next) => {
  const config = { Authorization: spotifyConfig };
  try {
    const response = await axios.get('https://api.spotify.com/v1/me/player/currently-playing', config);
    res.send(response);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
