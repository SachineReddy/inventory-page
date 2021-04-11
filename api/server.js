/* eslint linebreak-style: ["error", "windows"] */
const express = require('express');
const { connectToDb } = require('./db');
const { installHandler } = require('./api_handler.js');

const app = express();

const pageServerMiddleWare = express.static('public');
app.use('/', pageServerMiddleWare);

installHandler(app);

const port = process.env.API_SERVER_PORT || 3000;

(async function start() {
  try {
    await connectToDb();
    app.listen(port, () => {
      console.log(`API server started on port ${port}`);
    });
  } catch (err) {
    console.log('ERROR:', err);
  }
}());
