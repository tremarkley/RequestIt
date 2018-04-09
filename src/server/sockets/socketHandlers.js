const io = require('socket.io')();
const { getCurrentlyPlaying } = require('../spotifyAPIController/controller');

const socketPort = process.env.SOCKET_PORT || 3332;

const monitorCurrentSong = (client, interval) => {
  let currentSong;
  let waitingForResponse = false;
  let newSongRequested = false;
  //  set up monitoring interval
  setInterval(() => {
    if (!waitingForResponse) {
      waitingForResponse = true;
      getCurrentlyPlaying()
        .then((data) => {
          waitingForResponse = false;
          //  song has changed
          if (data.item.id !== currentSong) {
            currentSong = data.item.id;
            client.emit('newSong', data);
          }
          const msRemaining = data.item.duration - data.progress_ms;
          //  put in request for new song if current song has less than 5 seconds remaing
          if (msRemaining < 5000 && !newSongRequested) {
            newSongRequested = true;
            setTimeout(() => {
              client.emit('requestNewSong', data);
            }, msRemaining);
          }
          client.emit('currentlyPlaying', data);
        })
        .catch((error) => {
          waitingForResponse = false;
          console.log(`error getting currently playing ${error}`);
        });
    }
  }, interval);
};

io.on('connect', (client) => {
  client.on('subscribeToCurrentlyPlaying', () => {
    console.log('client subscribing to currently playing song');
    monitorCurrentSong(client, 1000);
  });
});

io.listen(socketPort);

module.exports = io;
