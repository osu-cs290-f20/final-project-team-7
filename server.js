const express = require('express');
const cookieParser = require('cookie-parser');

const crypto = require('crypto');
const fs = require('fs');

const SESSION_COOKIE = "session";
const SESSION_LEN = 32; // The number of bytes in a session token.
const PLAYERS_DIR = './data/players';

const app = express();
const port = process.env.PORT || 3000;

var players = {};

// Load datafiles (synchronously so that we don't
// start the server until we're finished)
fs.mkdirSync(PLAYERS_DIR, {recursive: true});
var files = fs.readdirSync(PLAYERS_DIR);
for (var i = 0; i < files.length; i++) {
    if (files[i].endsWith('.json')) {
        var path = PLAYERS_DIR + '/' + files[i];
        console.log("Loading", files[i]);

        var json = fs.readFileSync(PLAYERS_DIR + '/' + files[i]);
        var player = JSON.parse(json);
        var session = files[i].substr(0, files[i].length - '.json'.length);
        players[session] = JSON.parse(json);
    }
}

// Initializes a player.
function newPlayer() {
    return {
        requests: 0
    };
}

/// Gets the player information using the sesion cookie.
/// The provided callback function takes two parameters:
///     the error message (if unsuccessful) and the player object (if successful).
///     After the callback returns, the updated player information
///     is automatically saved.
/// The third argument (`create`) is optional. If present and `true`, a new
///     session is created for players with a missing or invalid session cookie.
///     In this case, the callback will never recieve an error.
function getPlayer(req, res, callback, create) {
    var session = req.cookies[SESSION_COOKIE];
    var player;
    if (session !== undefined) player = players[session];

    // Make sure the session is valid
    if (player === undefined) {
        if (create === true) {
            // Create a new session
            session = crypto.randomBytes(SESSION_LEN).toString('hex');
            player = newPlayer();
        } else {
            callback("invalid session cookie");
            return;
        }
    }

    // Include the cookie in the response
    res.cookie(SESSION_COOKIE, session);
    callback(null, player);

    // Save the (potentially-updated) player state
    players[session] = player;
    var json = JSON.stringify(player);
    fs.writeFile(`${PLAYERS_DIR}/${session}.json`, json, (err) => {
        if (err) console.log(`Failed to write player data: ${err}`);
    });
}

app.use(cookieParser());

app.get('/', (req, res) => {
    getPlayer(req, res, (err, player) => {
        player.requests += 1;
        res.send(`You have made ${player.requests} requests.`);
    }, true);
});

app.listen(port, () => {
    console.log(`Server listening http://localhost:${port}`);
});
