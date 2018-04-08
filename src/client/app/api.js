import openSocket from 'socket.io-client';

const socket = openSocket('http://localhost:3332');

const subscribeToCurrentlyPlaying = (songInfoCallback, newSongCallback) => {
  socket.on('currentlyPlaying', data => songInfoCallback(data));
  socket.on('newSong', data => newSongCallback(data));
  socket.emit('subscribeToCurrentlyPlaying');
};

export { subscribeToCurrentlyPlaying };
