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
        var session = files[i].substr(0, files[i].length - '.json'.length);
        players[session] = JSON.parse(json);
    }
}

/// Performs an in-place Fisher-Yates shuffle. Also returns the array.
function shuffle(array) {
    for (var i = 0; i < array.length; i++) {
        // Grab a random element from the unshuffled portion
        // of the array and swap it with this index.
        var targetIndex = i + Math.floor(Math.random() * (array.length - i));
        var old = array[i];
        array[i] = array[targetIndex];
        array[targetIndex] = old;
    }

    return array;
}

// Initializes a player.
function newPlayer() {
    var level1Heroes = [...HERO_CARDS.keys()].filter((index) => HERO_CARDS[index].cost == 1);
    var level2Heroes = [...HERO_CARDS.keys()].filter((index) => HERO_CARDS[index].cost == 2);

    var player = {
        // The currently active hero cards. Each element 
        // is an object with integer properties 'index' and 'level'.
        heroes: [],

        // The currently active villain cards. Each element
        // is an object with one integer property, 'index'.
        villains: [],

        // An array of indices in HERO_CARDS.
        level1Deck: shuffle(level1Heroes),
        level2Deck: shuffle(level2Heroes),

        // An array of indices in VILLAIN_CARDS.
        villainDeck: shuffle([...VILLAIN_CARDS.keys()])
    };
    player.heroes.push({
        index: player.level1Deck.pop(),
        level: 0
    });
    for (var i = 0; i < 3; i++) {
        player.villains.push({
            index: player.villainDeck.pop()
        });
    }
    return player;
}

/// A middleware that looks up the player's session information.
/// The session token is stored in req.session, and the player
/// information is stored in req.player. After the request is processed,
/// the session cookie is set on the response and the player is saved to disk.
function getPlayerMiddleware(req, res, next) {
    req.session = req.cookies[SESSION_COOKIE];
    if (req.session !== undefined) req.player = players[req.session];

    next();
    // Include the cookie in the response
    if (req.session !== undefined) {
        res.cookie(SESSION_COOKIE, session);
    }

    // Save the (potentially-updated) player state
    if (req.player !== undefined) {
        players[session] = req.player;
        var json = JSON.stringify(req.player);
        fs.writeFile(`${PLAYERS_DIR}/${session}.json`, json, (err) => {
            if (err) console.log(`Failed to write player data: ${err}`);
        });
    }
}

/// Creates a new session for the given request.
function createNewSession(req) {
    req.session = crypto.randomBytes(SESSION_LEN).toString('hex');
    req.player = newPlayer();
}

/// Looks up cards for a given player (converting from the indexes
///     in the player object to the names and stats).
function getCardInfo(player) {
    console.log(player);
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
app.use(getPlayerMiddleware);

app.engine('handlebars', exphbs({ defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(express.static('public'));

app.get('/', (req, res) => {
    if (req.player === undefined) createNewSession(req);
    res.status(200).render('game', getCardInfo(req.player));
});

app.post('/play', (req, res) => {
    var player = req.player;
    if (player === undefined) {
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

app.listen(port, () => {
    console.log(`Server listening http://localhost:${port}`);
});
