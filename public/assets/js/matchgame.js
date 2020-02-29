
var joined = false;
var playerId;
var targetString;
var targetTypedText;
var incorrectclicks;
var records;
var index;
var gameOver;
var PlayerConnected = false;
var playerName = "Guest";
var MatchStatus = "waiting";
var TopPlayer;
var linesDown = 0;

function ShowEnd(state)
{
  $("#Winner").html( TopPlayer.name);
  if(state == true)
    $("#end").css("display","block");
  else
    $("#end").css("display","none");
}

function FirstFunctionToCall() {
  linesDown = 0;
  incorrectclicks = 0;
  records = [];
  index = 0;
  gameOver = false;
  document.getElementById("chatinputbox")
    .addEventListener("keyup", function (e) {
      if (!PlayerConnected)
        return;
      var keycode = e.KeyCode || e.which;
      message = document.getElementById("chatinputbox").value;
      if (keycode == 13 && message != "") {
        if (message.length < 50) {
          socket.emit("ResuestAddChatToMatch", {
            matchid: matchId,
            playername: playerName,
            message: document.getElementById("chatinputbox").value
          });
        }
        document.getElementById("chatinputbox").value = "";
      }
    });
}

function addKeyTyped(e) {
  if (MatchStatus == 'waiting' || MatchStatus == 'gameover' || MatchStatus == 'counting')
    return;
  if (index >= targetString.length || gameOver)
    return;
  if (incorrectclicks >= 4)
    return;
  if (index == 0)
    timer = 0;

  
  var keycode = e.keycode || e.which;
  if (keycode == targetString.charCodeAt(index) && incorrectclicks == 0) {
    if(keycode == 13)
    {
      linesDown++;
      // make it gets down
    }
    targetTypedText.children[index].classList = [];
    targetTypedText.children[index].classList.add("correct-color");
    if (index + 1 < targetString.length) {
      targetTypedText.children[index + 1].classList = [];
      targetTypedText.children[index + 1].classList.add("active");
    }
  }
  else {
    incorrectclicks++;
    targetTypedText.children[index].classList = [];
    targetTypedText.children[index].classList.add("incorrect-color");
    if (index + 1 < targetString.length) {
      targetTypedText.children[index + 1].classList = [];
      targetTypedText.children[index + 1].classList.add("active");
    }
  }
  records.push({ KeyCode: keycode, time: Date.now() });
  index++;
  if (index == targetString.length && incorrectclicks == 0) {
    gameOver = true;
    document.getElementById("viewRecordBtn").disabled = false;
  }
}

function DeleteKeyTyped(e) {
  if (MatchStatus == 'waiting' || MatchStatus == 'gameover' || MatchStatus == 'counting' )
    return;
  e.target.value = "";//always clear textarea
  var keycode = e.keycode || e.which;
  if (index == 0)
    return;
  if (gameOver)
    return;
  if (keycode != 8)
    return;
  if (incorrectclicks > 0)
    incorrectclicks--;
  if (index == 1)
    timer = 0;
  records.push({ KeyCode: keycode, time: Date.now() });
  if (index < targetString.length) {
    targetTypedText.children[index].classList = [];
    targetTypedText.children[index].classList.add("normal-color");
  }
  index--;
  targetTypedText.children[index].classList = [];
  targetTypedText.children[index].classList.add("active");
}

function ShowDiv() {
  ShowEnd(true);
  
 
}
FirstFunctionToCall();


/////////////////////


var socket = io();

var url = new URL(window.location.href);
matchId = url.searchParams.get("matchid");
playerName = url.searchParams.get("playername");
if (matchId == null || matchId == "") 
{
  alert("match does not exist");
  window.stop();
}

if (playerName == null || playerName == "")
  playerName = "Guest";

socket.on('ResponsePlayerId', function (data)
 {
  playerId = data.playerid;
})

socket.emit('RequestJoinPlayerToMatch', 
{
  matchid: matchId,
  playername: playerName
});

socket.on('ResponseJoinPlayerToMatch', function (data) {
  if (data.joinstatus == false) {
    alert("match does not exist");
    window.stop();
  }

  PlayerConnected = true;
  MatchStatus = data.matchstatus;
  if (MatchStatus == "running")
    JoinRace();
  socket.emit('RequestTextHTML', {
    matchid: matchId
  });

  socket.emit('RequestTextString', {
    matchid: matchId
  });
});

socket.on('ResponseTextHTML', function (data) {
  document.getElementById("CodeBox").innerHTML = data.html;
  targetTypedText = document.getElementById("targetTypedText");
});

socket.on('ResponseTextString', function (data) {

  targetString = data.text;
});

socket.on('counting',()=>{
    matchstatus = 'counting';
});
setInterval(() => {
  if (PlayerConnected == false)
    return;
  socket.emit('SendPlayerData', {
    matchid: matchId,
    characterreaches: index,
    recordscount: records.length
  });

  socket.emit('RequestMatchData', {
    matchid: matchId,
  });
}, 100);

socket.on('ResponseMatchData', function (data) 
{
  MatchStatus = data.matchdata.status;
  if (MatchStatus == "gameover") {
    ShowDiv();
  }
  if(MatchStatus == "running")
  {
      $("#ScoreTable").css("display","table");
      $("#matchState").css("display","none");
  }
  else if(MatchStatus == "waiting" || MatchStatus == "counting")
  {
      $("#ScoreTable").css("display","none"); 
      $("#matchState").css("display","table");

      if(MatchStatus == "waiting")
      {
        if(!joined)
          $("#matchState").html("<h2>"+"Join to Start"+"</h2>");
        else
          $("#matchState").html("<h2>"+"Waiting for players"+"</h2>");
      } 
      else
        $("#matchState").html("<h2>"+"the match will start in " + data.matchdata.timer.toFixed(0)+"</h2>");
  }
  else
  {
      $("#ScoreTable").css("display","none");
      $("#matchState").css("display","table");
      $("#matchState").html("<h2>"+"The game will refresh in "+ data.matchdata.timer.toFixed(0) +"</h2>");
  }

  document.getElementById("WPM").innerHTML = (data.matchdata.players[playerId].wpm).toFixed(0);
  document.getElementById("Accuracy").innerHTML = data.matchdata.players[playerId].accuracy.toFixed(0);
  document.getElementById("timerText").innerHTML = data.matchdata.timer.toFixed(1);
  if (data.matchdata.status == "gameover")
    document.getElementById("timerText").style.color = "#f00";

  //////////
 
    var players = [];
    for (var i in data.matchdata.players)
      players.push({ wpm: data.matchdata.players[i].wpm, name: data.matchdata.players[i].playerName });
    players.sort(function (a, b) {
      return b.wpm - a.wpm;
    });
    TopPlayer = { name: players[0].name, wpm: players[0].wpm };
    var output = "";
    for (var i in players)
     {
      if (i != 0)
        output += "<li style='color: white;'>&nbsp; &nbsp;<h4>" + players[i].name + "</h4> &nbsp; &nbsp; &nbsp;<h4>" + players[i].wpm.toFixed(0) + "</h4></li>";
      else
        output += "<li style='color: green;'>&nbsp; &nbsp;<h4>" + players[i].name + "</h4> &nbsp; &nbsp; &nbsp;<h4>" + players[i].wpm.toFixed(0) + "</h4></li>";
    }
    document.getElementById("scoreboxcontainer").innerHTML = output;
    document.getElementById("endScore").innerHTML = output;
  //////////
  output = "";
  var chats = data.matchdata.chats;
  chats.sort(function (a, b) {
    return a.date - b.date;
  });
  for (var i = Math.max(0, chats.length - 12); i < chats.length; i++) {
    if (i != chats.length - 1)
      output += "<li style='color: #888;' class='messageli'><strong>" + chats[i].playername + ":</strong> " + chats[i].message + "</li>";
    else
      output += "<li style='color: #fff;' class='messageli'><strong>" + chats[i].playername + ":</strong> " + chats[i].message + "</li>";
  }
  document.getElementById("chat").innerHTML = output;
});

socket.on('RefreshPage', function (data)
{
  ShowEnd(false);
  socket.emit('RequestTextHTML', {
    matchid: matchId
  });

  socket.emit('RequestTextString', {
    matchid: matchId
  });
  FirstFunctionToCall();
  $("#join").removeClass('joinFade');
  $("#join").css("display", "inherit");
  $("#CodeInput").css("display", "none");
  MatchStatus = "waiting"
  characterreaches = 0;
  document.getElementById("timerText").style.color = "#ffffff";
});

socket.on('GameStarts', function () {
  JoinRace();
});


function JoinRace(){
  joined = true;
  if (PlayerConnected)
    socket.emit('SetPlayerReady', { matchid: matchId });
  $("#join").addClass('joinFade');
  setTimeout(() => {
    $("#join").css("display", "none");
    $("#CodeInput").css("display", "inherit");
  }, 200);

  setTimeout(() => {
    $('#CodeInput').focus();
  }, 350);
}

