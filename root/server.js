
const express = require('express');
const server = express();

const hostname = 'localhost';
const port = 8000;

// Specifies EJS as the template engine for rendering
server.set("view engine", "ejs");

// Serve static files from the 'public' folder
server.use('/', express.static('public'));

// Parse URL-encoded data from POST requests
server.use(express.urlencoded());

// Server routes

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
