/* eslint-disable indent */
const port = 8000;
const ip_address = '0.0.0.0';

const app = require('express')();
const server = require('http').createServer(app);

const io = require('socket.io')(server);

io.origins('*:*'); // for latest version
module.exports = {
    app,
    io,
};

const GameLobby = require('./lobby');
// number of rows, number of columns, keep a ratio of 9:16
const dim = [9, 16];
// time per tick in ms
const tickLength = 4000;
// list of possible square states. define a css class for each of these in the frontend


const gameLobby = new GameLobby(dim[0], dim[1], tickLength);

io.on('connection', (client) => {
    console.log(`client ${client.id} has connected`);

    client.on('join', () => {
        if (gameLobby.logged_in_users[client.id] !== undefined) {
            gameLobby.addPlayer(client);
        }
    });
    client.on('disconnect', () => {
        gameLobby.logoutPlayer(client.id);
        console.log(`client ${client.id} has disconnected`);
    });
    client.on('leave', () => {
        gameLobby.removePlayer(client.id);
    });
});

server.listen(port, ip_address);

console.log('listening on port ', port);

// Init express
require('../api/api_calls');
