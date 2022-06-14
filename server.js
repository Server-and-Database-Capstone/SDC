
const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const reviewRouter = require('./routes');
require('dotenv').config();

app.use('/reviews', reviewRouter)

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
