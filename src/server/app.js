const express = require('express');
const path = require('path');
const io = require('socket.io')();
// const cors = require('cors');
const morgan = require('morgan');
const spotify = require('./router/spotifyHandler');
const authentication = require('./router/spotifyAuthentication');
const { logErrors, errorHandler } = require('./errorHandler');
const { getCurrentlyPlaying } = require('./spotifyAPIController/controller');

const app = express();
const port = process.env.REQUEST_PORT || 3333;
const socketPort = process.env.SOCKET_PORT || 3332;
const staticPath = path.join(__dirname, '../client');

// app.use(cors());
app.use(morgan('dev'));

app.use(express.static(staticPath));

app.use('/authenticate', authentication);

app.use('/songs', spotify);

app.use(logErrors);
app.use(errorHandler);

io.on('connect', (client) => {
  client.on('subscribeToCurrentlyPlaying', () => {
    console.log('client subscribing to currently playing song');
    let currentSong;
    setInterval(() => {
      getCurrentlyPlaying()
        .then((data) => {
          if (data.item.id !== currentSong) {
            currentSong = data.item.id;
            client.emit('newSong', data);
          }
          client.emit('currentlyPlaying', data);
        })
        .catch((error) => {
          console.log(`error getting currently playing ${error}`);
        });
    }, 1000);
  });
});

io.listen(socketPort);
app.listen(port, () => {
  console.log(`app listening on ${port}`);
});
