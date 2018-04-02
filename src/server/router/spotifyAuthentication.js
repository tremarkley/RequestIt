const express = require('express');
const request = require('request');
const querystring = require('querystring');
const cookieParser = require('cookie-parser');
const path = require('path');
const { clientId, clientSecret, redirectUri } = require('../../../spotify.config');
const tokens = require('../token');

console.log(JSON.stringify(require('../../../spotify.config')));

const router = express.Router();

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
const generateRandomString = function generateRandomString(length) {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i += 1) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

const stateKey = 'spotify_auth_state';

// router.use(express.static(path.join(__dirname, '../../client/public/authentication')))
//   .use(cookieParser());
router.use(cookieParser());

router.get('/login', (req, res) => {
  const state = generateRandomString(16);
  res.cookie(stateKey, state);

  // your application requests authorization
  const scope = 'streaming playlist-modify-public user-read-playback-state user-modify-playback-state user-read-currently-playing user-top-read playlist-modify-private';
  res.redirect(`https://accounts.spotify.com/authorize?${querystring.stringify({
    response_type: 'code',
    client_id: clientId,
    scope,
    redirect_uri: redirectUri,
    state,
  })}`);
});

router.get('/callback', (req, res) => {
  const code = req.query.code || null;
  const state = req.query.state || null;
  const storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    res.redirect(`/#${querystring.stringify({
      error: 'state_mismatch',
    })}`);
  } else {
    res.clearCookie(stateKey);
    const authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      },
      headers: {
        Authorization: `Basic ${(new Buffer(`${clientId}:${clientSecret}`).toString('base64'))}`,
      },
      json: true,
    };

    request.post(authOptions, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        const accessToken = body.access_token;
        const refreshToken = body.refresh_token;
        console.log(`auth response: ${JSON.stringify(body)}`);

        tokens.accessToken = accessToken;
        tokens.refreshToken = refreshToken;
        tokens.expiration = body.expires_in;
        res.redirect('http://localhost:3333?authenticated=true');

        // res.send({ accessToken, refreshToken });

        // const options = {
        //   url: 'https://api.spotify.com/v1/me',
        //   headers: { Authorization: `Bearer ${accessToken}` },
        //   json: true,
        // };

        // // use the access token to access the Spotify Web API
        // request.get(options, (err, responseAccess, bodyAccess) => {
        //   console.log(`spotify web api: ${bodyAccess}`);
        // });

      // we can also pass the token to the browser to make requests from there
      //       res.redirect(`/#
      //         ${querystring.stringify({
      //   access_token: accessToken,
      //   refresh_token: refreshToken,
      // })}`);
      } else {
        res.redirect(`/#
          ${querystring.stringify({
    error: 'invalid_token',
  })}`);
      }
    });
  }
});

router.get('/refresh_token', (req, res) => {
  // requesting access token from refresh token
  const refreshToken = req.query.refresh_token;
  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: { Authorization: `Basic ${(Buffer.from(`${clientId}: ${clientSecret}`).toString('base64'))}` },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    },
    json: true,
  };

  request.post(authOptions, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      const accessToken = body.access_token;
      res.send({
        access_token: accessToken,
      });
    }
  });
});

module.exports = router;

