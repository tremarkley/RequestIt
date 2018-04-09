class Session {
  constructor() {
    this.songs = [];
  }

  addSong(song) {
    const songObj = song;
    songObj.votes = 0;
    this.songs.push(songObj);
  }
}

module.exports = Session;
