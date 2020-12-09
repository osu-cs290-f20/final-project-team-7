const express = require('express');
const exphbs = require('express-handlebars');
const cookieParser = require('cookie-parser');

const crypto = require('crypto');
const fs = require('fs');

const HERO_CARDS = require('./heroCards.json');
const VILLAIN_CARDS = require('./villainCards.json');

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
        heroes: [
            {index: 0, level: 0}
        ],
        villains: [
            {index: 0},
            {index: 1},
            {index: 2}
        ]
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

/// Looks up cards for a given player (converting from the indexes
///     in the player object to the names and stats).
function getCardInfo(player) {
    return {
            heroes: player.heroes.map((card) => HERO_CARDS[card.index].levels[card.level]),
            villains: player.villains.map((card) => VILLAIN_CARDS[card.index])
    };
}

/// Returns the stat boost the first card gets when fighting the second.
function checkStats(first, second) {
    function checkStat(firstStat, secondStat) {
        if (firstStat === undefined || secondStat === undefined) return 0;
        else return firstStat;
    }
    return checkStat(first.tech, second.power) +
        checkStat(first.power, second.brawn) +
        checkStat(first.brawn, second.tech);
}

app.use(cookieParser());
app.use(express.json());

app.engine('handlebars', exphbs({ defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(express.static('public'));

app.get('/', (req, res) => {
    getPlayer(req, res, (err, player) => {
        res.status(200).render('game', getCardInfo(player));
    }, true);
});

app.post('/play', (req, res) => {
    getPlayer(req, res, (err, player) => {
        if (err) {
            res.redirect(303, '/');
            return;
        }
        if (req.body && req.body.hero && req.body.villain) {
            // Get the index of the selected cards in the player's hand
            var heroIndex = player.heroes.findIndex((card) => HERO_CARDS[card.index].levels[card.level].name === req.body.hero);
            var villainIndex  = player.villains.findIndex((card) => VILLAIN_CARDS[card.index].name === req.body.villain);
            if (heroIndex == -1 || villainIndex == -1) {
                res.status(404).send("You don't have that card.");
                return;
            }

            var hero = HERO_CARDS[player.heroes[heroIndex].index].levels[player.heroes[heroIndex].level];
            var villain = VILLAIN_CARDS[player.villains[villainIndex].index];

            while (true) {
                var heroDice = Math.floor(Math.random() * 6) + 1;
                var villDice = Math.floor(Math.random() * 6) + 1;
                var heroBoost = checkStats(hero, villain);
                var villBoost = checkStats(villain, hero);
                var heroScore = heroDice + hero.attack + heroBoost;
                var villScore = villDice + villain.attack + villBoost;

                if (heroScore == villScore) continue; // Tie; roll again.

                var win = (heroScore > villScore);
                res.status(200).send({
                    win: win,
                    hero: {
                        dice: heroDice,
                        attack: hero.attack,
                        boost: heroBoost,
                        total: heroScore
                    },
                    villain: {
                        dice: villDice,
                        attack: villain.attack,
                        boost: villBoost,
                        total: villScore
                    }
                });
                break;
            }
        } else {
            res.status(400).send('Invalid request');
        }
    });
});

app.listen(port, () => {
    console.log(`Server listening http://localhost:${port}`);
});
