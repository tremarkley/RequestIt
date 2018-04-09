const express = require('express');
const path = require('path');
// const cors = require('cors');
const morgan = require('morgan');
const spotify = require('./router/spotifyHandler');
const authentication = require('./router/spotifyAuthentication');
const { logErrors, errorHandler } = require('./errorHandler');
require('./sockets/socketHandlers');

const app = express();
const port = process.env.REQUEST_PORT || 3333;
const staticPath = path.join(__dirname, '../client');

// app.use(cors());
app.use(morgan('dev'));

app.use(express.static(staticPath));

app.use('/authenticate', authentication);

app.use('/songs', spotify);

app.use(logErrors);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`app listening on ${port}`);
});
