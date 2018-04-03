const express = require('express');
const request = require('request');
const bodyparser = require('body-parser');
const querystring = require('querystring');
const token = require('../token');

const router = express.Router();
let userId;

router.use(bodyparser.json());
router.use(bodyparser.urlencoded({ extended: false }));

const getOptions = function getOptions(url) {
  const options = {
    url,
    headers: { Authorization: `Bearer ${token.accessToken}` },
    json: true,
  };
  return options;
};

const getUserProfile = function getUserProfile() {
  return new Promise((resolve, reject) => {
    const myProfileUrl = 'https://api.spotify.com/v1/me';
    const myProfileOptions = getOptions(myProfileUrl);
    request.get(myProfileOptions, (err, responseAccess, bodyAccess) => {
      if (err) {
        reject(err);
      }
      resolve(bodyAccess.id);
    });
  });
};

router.get('/currentlyPlaying', (req, res, next) => {
  const currentPlayUrl = 'https://api.spotify.com/v1/me/player/currently-playing';
  const options = getOptions(currentPlayUrl);
  // use the access token to access the Spotify Web API
  request.get(options, (err, responseAccess, bodyAccess) => {
    if (err) {
      next(err);
    } else {
      res.send(bodyAccess);
    }
  });
});

// router.get('/currentlyPlaying', (req, res, next) => {
//   const refresh = {
//     url: `http://localhost:3333/authenticate/refresh_token?${querystring.stringify({
//       refresh_token: token.refreshToken,
//     })}`,
//   };
//   request.get(refresh, (err, response, body) => {
//     const currentPlayUrl = 'https://api.spotify.com/v1/me/player/currently-playing';
//     const options = getOptions(currentPlayUrl);
//     // use the access token to access the Spotify Web API
//     request.get(options, (error, responseAccess, bodyAccess) => {
//       if (err) {
//         next(err);
//       } else {
//         // res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
//         res.send(bodyAccess);
//       }
//     });
//   });
// });

router.get('/topSongs', (req, res, next) => {
  const topSongsUrl = `https://api.spotify.com/v1/me/top/tracks?${querystring.stringify({
    limit: 10,
    time_range: 'short_term',
  })}`;
  const options = getOptions(topSongsUrl);
  request.get(options, (err, responseAccess, bodyAccess) => {
    if (err) {
      next(err);
    } else {
      res.send(bodyAccess);
    }
  });
});

router.post('/playlist/create', async (req, res, next) => {
  if (userId === undefined) {
    try {
      userId = await getUserProfile();
    } catch (error) {
      next(error);
    }
  }
  const playListOptions = {
    url: `https://api.spotify.com/v1/users/${userId}/playlists`,
    headers: { Authorization: `Bearer ${token.accessToken}`, 'Content-Type': 'application/json' },
    form: JSON.stringify({
      name: `Request-It ${new Date().getTime()}`,
      public: false,
      description: 'auto-generated playlist by Request-It',
    }),
  };
  request.post(playListOptions, (error, response, body) => {
    if (!error && (response.statusCode === 200 || response.statusCode === 201)) {
      res.send(body);
    } else {
      console.log(`unsuccessful post when creating playlist: ${JSON.stringify(response.body)}`);
      if (error) {
        next(error);
      } else {
        next(response.body);
      }
    }
  });
});

router.put('/turnOffShuffle', (req, res, next) => {
  const shuffleUrl = `https://api.spotify.com/v1/me/player/shuffle?${querystring.stringify({
    state: false,
  })}`;
  const shuffleOptions = getOptions(shuffleUrl);
  request.put(shuffleOptions, (error, response) => {
    if (!error && response.statusCode === 204) {
      res.send('successfully toggled off shuffle');
    } else if (error) {
      next(error);
    } else {
      res.send('device temporarily unavailable');
    }
  });
});

router.put('/playlist/addSongs', (req, res) => {
  const uris = [];
  for (let i = 0; i < req.body.songs.length; i += 1) {
    uris.push(req.body.songs[i].uri);
  }
  const songOptions = {
    url: `https://api.spotify.com/v1/users/${userId}/playlists/${req.body.playlist}/tracks`,
    headers: { Authorization: `Bearer ${token.accessToken}`, 'Content-Type': 'application/json' },
    form: JSON.stringify({
      uris,
    }),
  };
  request.post(songOptions, (error, response) => {
    if (!error && response.statusCode === 201) {
      res.send('successfully added songs to playlist');
    }
  });
});

router.put('/playlist/reorder', (req, res, next) => {
  const url = `https://api.spotify.com/v1/users/${userId}/playlists/${req.body.playlist}/tracks`;
  const reorderOptions = {
    url,
    headers: { Authorization: `Bearer ${token.accessToken}`, 'Content-Type': 'application/json' },
    form: JSON.stringify({
      insert_before: req.body.currentIndex + 1,
      range_start: req.body.rangeStart,
    }),
  };
  request.put(reorderOptions, (error, response) => {
    if (!error && response.statusCode === 200) {
      res.send('successfully reorderd');
    } else if (error) {
      next(error);
    } else {
      res.send('unable to reorder');
    }
  });
});

module.exports = router;
