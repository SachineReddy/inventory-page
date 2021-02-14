const express = require('express');

const app = express();

const pageServerMiddleWare = express.static('public');

app.use('/', pageServerMiddleWare);

app.listen(3000, () => {
    console.log("Server started on port 3000 ...");
})