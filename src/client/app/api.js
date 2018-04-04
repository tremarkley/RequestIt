import openSocket from 'socket.io-client';

const socket = openSocket('http://localhost:3332');

const subscribeToCurrentlyPlaying = function subscribeToCurrentlyPlaying(callback) {
  socket.on('currentlyPlaying', data => callback(data));
  socket.emit('subscribeToCurrentlyPlaying');
};

export { subscribeToCurrentlyPlaying };
