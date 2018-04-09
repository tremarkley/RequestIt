const express = require('express');
const bodyparser = require('body-parser');
const { getTopSongs } = require('../spotifyAPIController/controller');
const Session = require('../model/session');
const currentSessions = require('../model/sessionData');

const router = express.Router();

router.use(bodyparser.json());
router.use(bodyparser.urlencoded({ extended: false }));

router.post('/start', async (req, res, next) => {
  try {
    const newSession = new Session();
    const response = await getTopSongs();
    const songs = response.items;
    for (let i = 0; i < songs.length; i += 1) {
      newSession.addSong(songs[i]);
    }
    const id = 1;
    currentSessions[id] = newSession;
    res.send('started session');
  } catch (error) {
    console.log('error creating session')
    next(error);
  }
});

module.exports = router;
