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

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});
app.use('/client', express.static(__dirname + '/client'));
app.use(express.static(__dirname));
serv.listen(process.env.PORT || 8567)//listen to port 8080

var io = require('socket.io')(serv, {});

//////////////////////////////////////////////

// connecting to the database

var mysql = require('mysql');
var con = mysql.createConnection({
    host: "sql240.main-hosting.eu",
    user: "u300478706_typing4speed",
    database: "u300478706_typing4speed",
    password: "g&:43rv5"
});

con.connect(function (err) {
    if (err)
        console.log("DB   " + err);
    else
        console.log("DB connected");
});

/////////////////////////////////

// adding to database

var fs = require('fs');
function TargetTextFileToDB(filename, type) {
    fs.readFile(filename, 'utf8', function (err, data) {
        var output = "";
        var lines = data.split('\n');
        for (var i = 0; i < lines.length; i++) {
            var line = lines[i];
            line = line.replace(/[\t]/, "    ");
            for (var j = 0; j < line.length; j++)
                output += line[j];
        }
        output = Buffer.from(data, 'ascii').toString('base64');
        var sql = "INSERT INTO texts (text, type) VALUES ('" + output + "', '" + type + "');";
        con.query(sql);
    });
}
//TargetTextFileToDB("code.txt", "code");

/////////////////////////////////

// Importing Files from Database
function StringToHTML(textid, callback)
 {
    var sql = "SELECT text FROM texts WHERE id=" + textid + ";";
    output = "";
    con.query(sql, function (err, result) {
        var data = result[0]["text"];
        data = Buffer.from(data, 'base64').toString('ascii');

        output = "<pre id='targetTypedText'>";
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
        return callback(output);
    });
}

function StringToString(textid, callback)
{
    var sql = "SELECT text FROM texts WHERE id=" + textid + ";";
    con.query(sql, function (err, result) {
        var data = result[0]["text"];
        data = Buffer.from(data, 'base64').toString('ascii');

        var output = "";
        var index = 0;
        while (data.indexOf("\r", index) >= 0) {
            var line = data.substr(index, data.indexOf("\r", index) - index);
            index = data.indexOf("\r", index) + 2;
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
    });
}

function RandomTextId(type, callback) {
    con.query("SELECT id FROM texts WHERE type='" + type + "' ORDER BY RAND();", function (err, result) {
        if(result.length>0)
            return callback(result[0]["id"]);
        else
            return callback(-1);
    });
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

class match 
{
    constructor(_textType, _textId, _players, _status, _totaltime, _timer, _lifetime, _random)
     {
        this.textType = _textType;
        this.textId = _textId;
        // socket and players
        this.SOCKET_LIST = {};
        this.players = _players;
        // Match Information
        this.status = _status;
        this.totaltime = _totaltime;
        this.timer = _timer;
        this.lifetime = _lifetime;
        // chat
        this.chats = [];
        this.random = _random;
    }

   
	BroadCast(title,data)
	{
		for(var i in this.SOCKET_LIST)
		{
			var socket = this.SOCKET_LIST[i];
			socket.emit(title,data);
		}
	}

	AcceptPlayer(player)
	{
		player.ready = true;
		player.socket.emit("JoinAccepted",true);
		this.inMatchPlayerCount++;
	}
	
	RejectPlayer(player)
	{
		player.socket.emit("JoinRejected",true);
	}

	HasPlayer(name)
	{
		for(let p in this.players)
		{
			if(name.localeCompare(this.players[p].name) == 0)
			return true;
		}
		return false;
	}

	AddPlayer(player,socket)
	{
		player.id = Math.random();
		socket.id = player.id;
		console.log(this.HasPlayer(player.name));
		if(player.name == null)
		{
			player.name = "Guest" + "(" + this.dummyNumber + ")";
			this.dummyNumber++;
		}
		else if(this.HasPlayer(player.name))
		{
			player.name = player.name + "(" + this.dummyNumber + ")";
			this.dummyNumber++;
		}

		socket.number = player.name;
		this.players[player.id] = player;
		this.SOCKET_LIST[player.id] = socket;
	}

	RemovePlayer(id)
	{
		delete this.SOCKET_LIST[id];
		delete this.players[id];
	}

	StartCountDown()
	{
		this.BroadCast('CountDown',true);
		this.status = WAITING;
		let x = 10;
		let count = setInterval(() => 
		{
			console.log(x);
			x--;
			if(x==-1)
			{
				this.StartMatch();
				clearInterval(count);
			}
		}, 1000);
	}

	StartMatch()
	{
		this.status = RUNNING;
		this.BroadCast('MatchStart',true);
		let x = this.timer;
		let count = setInterval(() => 
		{
			console.log("Match Will end in" + x);
			x--;
			if(x==-1)
			{
				this.FinishMatch();
				clearInterval(count);
			}
		}, 1000);
	}

	UpdateMatch()
	{

	}

	FinishMatch()
	{
		this.BroadCast('MatchEnd',true);
	}

    LifeTime()
    {
        setTimeout(() => 
        {
            delete this;
        }, this.lifetime);
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
        matchid = Date.now();
        matches[matchid] = new match(type, textid, {}, "waiting", 60, 60, 20, israndom);
        return callback(matchid);
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

        RandomTextId(data.type, function(textid){
            if(textid==-1)
                return;

            StringToHTML(textid, function(htmltext){
                socket.emit('ResponsePracticeHTML', {
                    text: htmltext
                });
            });
            StringToString(textid, function(stringtext){
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
            
        StringToHTML(matches[data.matchid].textId, function (result) {
            socket.emit('ResponseTextHTML', {
                html: result
            });
        });
    });

    socket.on('RequestTextString', function (data) {
        if(!(data.matchid in matches))
            return;

        StringToString(matches[data.matchid].textId, function (result) {
            socket.emit('ResponseTextString', {
                text: result
            });
        });
    });

    socket.on('SendPlayerData', function (data) {
        if(!(data.matchid in matches))
            return;

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
    });

    socket.on('ResuestAddChatToMatch', function(data){
        if(!(data.matchid in matches))
            return;

        matches[data.matchid].chats.push(new chat(data.playername, data.message));
    });

    socket.on('RequestMatchData', function (data) {
        if(!(data.matchid in matches))
            return;

        socket.emit('ResponseMatchData', {
            matchdata: matches[data.matchid]
        });
    });

    socket.on('SetPlayerReady', function (data) {
        if(!(data.matchid in matches))
            return;


        matches[data.matchid].players[socket.id].ready = true;
    });

    socket.on('disconnect', function () {
        console.log("player deleted");
        for (i in matches)
            delete matches[i].players[socket.id];
    });

});
