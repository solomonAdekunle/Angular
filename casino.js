var argv = require('yargs').argv;

var username = argv.username || 'SOLOMON2014';
var password = argv.password || 'London01';
var gameName = argv.gameName || 'Roulette Express Premium';
var gameMode = argv.gameMode || 'cash';

exports.config = {

    credentials: {
        username: username,
        password: password
    },
    gameName: gameName,
    gameMode: gameMode
}