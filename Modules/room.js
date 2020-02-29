module.exports = class Room 
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
