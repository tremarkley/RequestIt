const express = require('express');
const path = require('path');

const app = express();
const port = process.env.REQUEST_PORT || 3333;
const staticPath = path.join(__dirname, '../client');

app.use(express.static(staticPath));

app.listen(port, () => {
  console.log(`app listening on ${port}`);
});
