
const db = require('./Modules/database');
const match = require('./Modules/room');
// Data 
let WAITING = "waiting";
let COUNTING = "counting";
let RUNNING = "running";
let GAMEOVER = "gameover";
let MatchTimeOut = 100000;

// server information
var express = require('express');
var app = express();
var serv = require('http').Server(app);

app.use(express.static(__dirname + '/public'));
// routing 
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/lobby', function (req, res) {
    res.sendFile(__dirname + '/public/gamepage.html');
});

app.get('/practice', function (req, res) {
    res.sendFile(__dirname + '/public/practice.html');
});

app.get('/game', function (req, res) {
    res.sendFile(__dirname + '/public/matchgame.html');
});


serv.listen(process.env.PORT || 8000)//listen to port 8080

var io = require('socket.io')(serv, {});


// Importing Files from Database
function StringToHTML(data, callback)
 {
    output = "<pre id='targetTypedText'>";
    var index = 0;
    var firstchar = true;
    while (data.indexOf("\n", index) >= 0) {
        var line = data.substr(index, data.indexOf("\n", index) - index);
        index = data.indexOf("\n", index) + 1;
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
        output += "\n";
    }
    output += '</pre>';
    return callback(output);
}

function StringToString(data, callback)
{
    var output = "";
    var index = 0;
    while (data.indexOf("\n", index) >= 0) {
        var line = data.substr(index, data.indexOf("\n", index) - index);
        index = data.indexOf("\n", index) + 1;
        var isNotSpace = false;
        var len = line.length;
        for (var i = 0; i < len; i++) {
            if (isNotSpace == false) {
                if (line[i] != ' ')//if not space
                {
                    isNotSpace = true;
                    output += line[i];
                }
            }
            else
                output += line[i];
        }
        if (len > 1)
            output += "\r";
    }
    return callback(output);
}

function RandomTextId(type, callback) 
{
    return callback(Math.floor(Math.random() * (db[type].length)));
}

/////////////////////////////////

// Classes

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

class chat {
    constructor(_playername, _message)
    {
        this.data = Date.now();
        this.playername = _playername;
        this.message = _message;
    }
}


/////////////////////////////////

var matches = {};

setInterval(() => {
    for (var i in matches) 
    {
        matches[i].lifetime -= 0.1;
        if (matches[i].lifetime < 0) {
            delete matches[i];
            continue;
        }
        if (matches[i].status == 'running' || matches[i].status == 'gameover' || matches[i].status=="counting")
            matches[i].timer -= 0.1;

        if (matches[i].status == 'running' && matches[i].timer <= 0) {
            matches[i].status = 'gameover';
            matches[i].timer = 5;
        }
        if (matches[i].status == 'gameover' && matches[i].timer <= 0) {
            RandomTextId(matches[i].textType, function (result) {
                matches[i].textId = result;

                matches[i].status = 'waiting';
                matches[i].timer = matches[i].totaltime;
                for (var j in matches[i].players) {
                    matches[i].players[j].ready = false;
                    io.to(j).emit('RefreshPage');
                }
            });
        }

        if (matches[i].status == 'waiting') {
            var readyplayers = 0;
            for (var j in matches[i].players) {
                if (matches[i].players[j].ready == true)
                    readyplayers++;
            }

            if (readyplayers >= 2) 
            {
                matches[i].timer = 5;
                matches[i].status = 'counting';
                for (var j in matches[i].players)
                    io.to(j).emit('counting');

                setTimeout(() => 
                {
                    matches[i].timer = matches[i].totaltime;
                    matches[i].status = 'running';

                    for (var j in matches[i].players)
                        io.to(j).emit('GameStarts');
                }, 5000);
            }
        }

    
    }
}, 100);


function CreateNewMatch(type, israndom, callback)
{
    RandomTextId(type, function(textid){
        m = new match(type, textid, 60, israndom);
        matches[m.id] = m;
        return callback(m.id);
    });
}

io.sockets.on('connection', function (socket) 
{
    console.log('socket connection ' + socket.id);
    socket.emit('ResponsePlayerId', { playerid: socket.id });

    socket.on('RequestJoinPlayerToMatch', function (data) {
        var joinstatus = data.matchid in matches;
        var matchstatus = "waiting";
        if (joinstatus == true) {
            newplayer = new player(data.playername, false, 0, 0, 0, 0);
            matches[data.matchid].players[socket.id] = newplayer;
            matchstatus = matches[data.matchid].status;
        }
        socket.emit('ResponseJoinPlayerToMatch', {
            matchstatus: matchstatus,
            joinstatus: joinstatus
        });
    });

    socket.on('PracticeRequestData', function(data){
        if(data.type!="plain" && data.type!="cpp" && data.type!="python" && data.type!="java")
            return;

        RandomTextId(data.type, function(textid)
        {
            if(textid==-1)
                return;

            StringToHTML(db[data.type][textid], function(htmltext){
                socket.emit('ResponsePracticeHTML', {
                    text: htmltext
                });
            });
            StringToString(db[data.type][textid], function(stringtext){
                socket.emit('ResponsePracticeString', {
                    text: stringtext
                });
            });
        });
    });

    socket.on('RequestJoinToRandomMatch', function(data){
        var matchid = -1;
        for(i in matches)
        {
            if(matches[i].textType == data.type && matches[i].random==true && Object.keys(matches[i].players).length < 4)
                matchid = i;
        }

        if(matchid!=-1)
        {
            socket.emit('ResponseJoinToRandomMatch', {
                matchid: matchid
            });
            return;
        }
        
        CreateNewMatch(data.type, true, function(result){
            socket.emit('ResponseJoinToRandomMatch', {
                matchid: result
            });
        });
    });

    socket.on('RequestCreateNonRandomMatch', function(data){
        CreateNewMatch(data.type, false, function(matchid){
            socket.emit('ResponseCreateNonRandomMatch', {
                matchid: matchid
            });
        });
    });

    socket.on('RequestTextHTML', function (data) {
        if(!(data.matchid in matches))
            return;

        StringToHTML(db[matches[data.matchid].textType][matches[data.matchid].textId], function (result) {
            socket.emit('ResponseTextHTML', {
                html: result
            });
        });
    });

    socket.on('RequestTextString', function (data) {
        if(!(data.matchid in matches))
            return;
           
            StringToString(db[matches[data.matchid].textType][matches[data.matchid].textId], function (result) {
                console.log(result);
            socket.emit('ResponseTextString', {
                text: result
            });
        });
    });

    socket.on('SendPlayerData', function (data) {
        if(!(data.matchid in matches))
            return;

        try
        {
            matches[data.matchid].lifetime = 10;
            if (matches[data.matchid].status == "running")
            {
                matches[data.matchid].players[socket.id].characterreaches = data.characterreaches;
                matches[data.matchid].players[socket.id].recordscount = data.recordscount;
                if (matches[data.matchid].totaltime - matches[data.matchid].timer > 0)
                    matches[data.matchid].players[socket.id].wpm = data.characterreaches * 60 / 5 / (matches[data.matchid].totaltime - matches[data.matchid].timer);
                else
                    matches[data.matchid].players[socket.id].wpm = 0;
                if (data.recordscount > 0)
                    matches[data.matchid].players[socket.id].accuracy = data.characterreaches / data.recordscount * 100;
                else
                    matches[data.matchid].players[socket.id].accuracy = 0;
            }
        }
        catch(err)
        {

        }
    });

    socket.on('ResuestAddChatToMatch', function(data){
        if(!(data.matchid in matches))
            return;

        try
        {
            matches[data.matchid].chats.push(new chat(data.playername, data.message));
        }
        catch(err)
        {

        }
    });

    socket.on('RequestMatchData', function (data) {
        if(!(data.matchid in matches))
            return;

            try
            {
                socket.emit('ResponseMatchData', {
                    matchdata: matches[data.matchid]
                });
            }
            catch(err)
            {

            }
    });

    socket.on('SetPlayerReady', function (data) {
        if(!(data.matchid in matches))
            return;

        try
        {
            matches[data.matchid].players[socket.id].ready = true;
        }
        catch(err)
        {

        }
    });

    socket.on('disconnect', function () {
        console.log("player deleted");

        try
        {
            for (i in matches)
                delete matches[i].players[socket.id];
        }
        catch(err)
        {

        }
    });
    
});
