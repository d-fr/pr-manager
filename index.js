const config = require("./config");
const process = require("./package.json");
const express = require("express");
const bodyparser = require("body-parser");

console.log(`Starting "\x1b[33m${process.name}\x1b[0m" app.\n\x1b[32mVersion:\x1b[0m ${process.version}\n\x1b[32mAuthor:\x1b[0m ${process.author}`);

console.log("Loading express server...");
let app = express();
let router = express.Router();

// Export the router for requiring through the app
module.exports = { router, config };

// Requires the endpoints of the app
require("./src/prListener");

// Setup the API to parse request bodies as urlencoded or json
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

// Start the API Server
app.use(router);
app.listen(config.PORT, () => {
    console.log("Express server listening on port " + config.PORT);
});
