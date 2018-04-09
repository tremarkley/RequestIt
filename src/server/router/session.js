const express = require('express');
const bodyparser = require('body-parser');
const path = require('path');
const { getTopSongs } = require('../spotifyAPIController/controller');
const Session = require('../model/session');
const currentSessions = require('../model/sessionData');

const staticPath = path.join(__dirname, '../../client');

const router = express.Router();

router.use(bodyparser.json());
router.use(bodyparser.urlencoded({ extended: false }));
router.use('/client/:id', express.static(staticPath));

router.get('/start', async (req, res, next) => {
  try {
    const newSession = new Session();
    const response = await getTopSongs();
    const songs = response.items;
    for (let i = 0; i < songs.length; i += 1) {
      newSession.addSong(songs[i]);
    }
    const id = 1;
    currentSessions[id] = newSession;
    // res.send('started session');
    res.redirect(`http://localhost:3333/session/client/${id}`);
  } catch (error) {
    console.log('error creating session');
    next(error);
  }
});

router.get('/client/:id/songs/topSongs', (req, res) => {
  const sessionId = req.params.id;
  if (currentSessions[sessionId]) {
    res.send(currentSessions[sessionId]);
  } else {
    res.status(500).send('Session not available');
  }
});

module.exports = router;
