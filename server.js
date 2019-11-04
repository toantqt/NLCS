const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const hbs = require('hbs')

var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var port = 9999;

hbs.registerPartials(__dirname + '/views/partial');

app.use(express.static("./public"));
app.set('view engine', 'hbs');
app.set("views", "./views");

var players = {},
    unmatched;

function joinGame(socket) {

    // Add the player to our object of players
    players[socket.id] = {

        // The opponent will either be the socket that is
        // currently unmatched, or it will be null if no
        // players are unmatched
        opponent: unmatched,

        // The symbol will become 'O' if the player is unmatched
        symbol: 'X',

        // The socket that is associated with this player
        socket: socket
    };

    // Every other player is marked as 'unmatched', which means
    // there is no another player to pair them with yet. As soon
    // as the next socket joins, the unmatched player is paired with
    // the new socket and the unmatched variable is set back to null
    if (unmatched) {
        players[socket.id].symbol = 'O';
        players[unmatched].opponent = socket.id;
        unmatched = null;
    } else {
        unmatched = socket.id;
    }
}

// Returns the opponent socket
function getOpponent(socket) {
    if (!players[socket.id].opponent) {
        return;
    }
    return players[
        players[socket.id].opponent
    ].socket;
}

io.on('connection', function (socket) {
    console.log("Connection established...", socket.id);
    joinGame(socket);

    // Once the socket has an opponent, we can begin the game
    if (getOpponent(socket)) {
        socket.emit('game.begin', {
            symbol: players[socket.id].symbol
        });
        getOpponent(socket).emit('game.begin', {
            symbol: players[getOpponent(socket).id].symbol
        });
    }

    socket.on('client-send-username', (data) => {
        console.log(data);
        //server send username
        socket.emit('server-send-username', data);
        socket.Username = data;

    });


    // Listens for a move to be made and emits an event to both
    // players after the move is completed
    socket.on('client-send-move', function (data) {
        if (!getOpponent(socket)) {
            return;
        }
        console.log("Move made by : ", data);
        socket.emit('server-send-move', data);
        getOpponent(socket).emit('server-send-move', data);
    });

    //event client send message
    socket.on('client-send-msg', (data) => {
        console.log('message: '+data);
        io.sockets.emit('server-send-msg', {
            name: socket.Username,
            msg: data
        });
    });



});

app.get('/computer', (req, res) => {
    res.render('computer');
});

app.get('/multiplayer', (req, res) => {
    res.render('home-multiplayer')
})

app.get('/online', (req, res) => {
    res.render('online');
});

app.get('/offline', (req, res) => {
    res.render('offline');
});

app.get('/', (req, res) => {
    res.render('home');
});

server.listen(port, () => {
    console.log('Server on port '+port);
});