var express = require('express');
var app = express();
var serv = require('http').Server(app);

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});
app.use('/client', express.static(__dirname + '/client'));
app.use(express.static(__dirname));
serv.listen(8080);//listen to port 8080

//////////////////////////////////////////////

class player {
    constructor(_playerName, _ready, _wpm, _accuracy, _characterreaches, _recordscount) {
        this.playerName = _playerName;
        this.ready = _ready;
        this.wpm = _wpm;
        this.accuracy = _accuracy;
        this.characterreaches = _characterreaches;
        this.recordscount = _recordscount;
    }
}

class match {
    constructor(_textType, _textId, _players, _status, _totaltime, _timer, _lifetime) {
        this.textType = _textType;
        this.textId = _textId;
        this.players = _players;
        this.status = _status;
        this.totaltime = _totaltime;
        this.timer = _timer;
        this.lifetime = _lifetime;
    }
}

var io = require('socket.io')(serv, {});
var matches = {};
var sockets = {};

matches["ppu"] = new match('code', '1', [], 'waiting', 100, 100, 10);

setInterval(() => {
    for (var i in matches) {
        matches[i].lifetime -= 1 / 25;
        if (matches[i].lifetime < 0) {
            delete matches[i];
            continue;
        }
        if (matches[i].status == 'running' || matches[i].status == 'gameover')
            matches[i].timer -= 1 / 25;
        if (matches[i].status == 'running' && matches[i].timer <= 0) {
            matches[i].status = 'gameover';
            matches[i].timer = 5;
        }
        if (matches[i].status == 'gameover' && matches[i].timer <= 0) {
            matches[i].status = 'waiting';
            matches[i].timer = matches[i].totaltime;
            matches[i].textid = RandomTextId(matches[i].type);
            for (var j in matches[i].players)
                io.sockets.socket(j).emit('RefreshPage');
            matches[i].players = {};
        }

        if (matches[i].status == 'waiting') {
            var readyplayers = 0;
            for (var j in matches[i].players) {
                if (matches[i].players[j].ready == true)
                    readyplayers++;
            }

            if (readyplayers >= 2) {
                matches[i].status = 'running';
                for (var j in matches[i].players)
                    io.sockets.socket(j).emit('GameStarts');
            }
        }
    }
}, 1000 / 25);

var mysql = require('mysql');
var con = mysql.createConnection({
    host: "sql12.freemysqlhosting.net",
    user: "sql12300455",
    password: "T82huA8lPE"
});

function StringToHTML(textid) {
    //get text from database
    var data = "";
    con.connect(function (err) {
        if (err) {
            console.log("DB error");
            return;
        }
        con.query("SELECT text FROM texts WHERE id='" + textid + "';", function (err, result) {
            data = result[0].text;
        });
    });
    //////////////////////////
    let buff = new Buffer(data, 'base64');
    data = buff.toString('ascii');
    //data = window.atob(data);//for base64 decoding
    var output = "<pre id='targetTypedText'>";
    var index = 0;
    var firstchar = true;
    while (data.indexOf("\r", index) >= 0) {
        var line = data.substr(index, data.indexOf("\r", index) - index);
        index = data.indexOf("\r", index) + 2;
        isNotSpace = false;
        len = line.length;
        for (var i = 0; i < len; i++) {
            if (isNotSpace == false) {
                if (line[i] != ' ')//if not space
                {
                    isNotSpace = true;
                    if (firstchar) {
                        output += "<span class='normal-color active'>" + line[i] + "</span>";
                        firstchar = false;
                    }
                    else
                        output += "<span class='normal-color'>" + line[i] + "</span>";
                }
                else
                    output += " ";
            }
            else {
                if (line[i] == ' ')
                    output += "<span class='normal-color'>" + "<span class='space'>" + line[i] + "</span></span>";
                else
                    output += "<span class='normal-color'>" + line[i] + "</span>";
            }
        }
        if (len > 1)
            output += "<span class='normal-color enter'><span class='enter'>&#9661;</span></span>";
        output += "\r";
    }
    output += '</pre>';
    return output;
}

function StringToString(textid) {
    var data = "";
    con.connect(function (err) {
        if (err) {
            console.log("DB error");
            return;
        }
        con.query("SELECT text FROM texts WHERE id='" + textid + "';", function (err, result) {
            data = result[0].text;
        });
    });

    let buff = new Buffer(data, 'base64');
    data = buff.toString('ascii');
    console.log(data);
    //data = window.atob(data);//for base64 decoding

    var output = "";
    var index = 0;
    while (data.indexOf("\r", index) >= 0) {
        var line = data.substr(index, data.indexOf("\r", index) - index);
        index = strpos(data, "\r", index) + 2;
        var isNotSpace = false;
        var len = line.length;
        for (var i = 0; i < len; i++) {
            if (isNotSpace == false) {
                if (line[i] != ' ')//if not space
                {
                    isNotSpace = true;
                    output += $line[$i];
                }
            }
            else
                output += $line[$i];
        }
        if (len > 1)
            output += "\r";
    }
    return output;
}

function RandomTextId(type) {
    var data;
    con.connect(function (err) {
        con.query("SELECT id FROM texts WHERE type='" + type + "' ORDER BY RAND();", function (err, result) {
            if (err) throw err;
            data = result[0].id;
        });
    });
    return data;
}

io.sockets.on('connection', function (socket) {
    console.log('socket connection ' + socket.id);
    sockets[socket.id] = socket;

    socket.on('RequestJoinPlayerToMatch', function (data) {
        newplayer = new player(data.playername, false, 0, 0, 0, 0);
        console.log(Object.keys(matches).length);
        for (var x in matches)
            console.log(x);
        matches[data.matchid].players[socket.id] = newplayer;
        socket.emit('ResponseJoinPlayerToMatch');
    });

    socket.on('RequestTextHTML', function (data) {
        socket.emit('ResponseTextHTML', {
            html: StringToHTML(matches[data.matchid].textId)
        });
    });

    socket.on('RequestTextString', function (data) {
        socket.emit('ResponseTextHTML', {
            text: StringToString(matches[data.matchid].textid)
        });
    });

    socket.on('SendPlayerData', function (data) {
        matches[data.matchid].lifetime = 10;
        console.log(matches[data.matchid].players[socket.id].wpm);
        matches[data.matchid].players[socket.id].characterreaches = data.characterreaches;
        matches[data.matchid].players[socket.id].recordscount = data.recordscount;
        if (matches[data.matchid].totaltime - matches[data.matchdata].timer > 0)
            matches[data.matchid].players[socket.id].wpm = index * 60 / 4 / (matches[data.matchid].totaltime - matches[data.matchdata].timer);
        else
            matches[data.matchid].players[socket.id].wpm = 0;
        if (data.recordscount > 0)
            matches[data.matchid].players[socket.id].accuracy = data.characterreaches / data.recordscount * 100;
        else
            matches[data.matchid].players[socket.id].accuracy = 0;
    });

    socket.on('RequestMatchData', function (data) {
        socket.emit('ResponseMatchData', {
            matchdata: matches[data.matchid]
        });
    });

    socket.on('GetPlayerReady', function (data) {
        matches[data.matchid].players[socket.id].ready = true;
    });

    socket.on('disconnect', function (socket) {
        delete sockets[socket.id];
        for (i in matches)
            delete matches[i].players[socket.id];
    });

    //io.sockets.socket(id).emit('hello');


});


