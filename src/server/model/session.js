class Session {
  constructor() {
    this.songs = [];
  }

  addSong(song) {
    this.songs.push(song);
  }
}

module.exports = Session;
