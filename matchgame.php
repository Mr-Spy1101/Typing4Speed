<?php
    require 'functions.php';
    if(!isset($_GET["matchid"]) || !isset($_GET["playerid"]))
      exit("match id or player id not set");
    $matchId = $_GET["matchid"];
    $playerId = $_GET["playerid"];
    if(!MatchExists($matchId))
      exit("match does not exist");
      
    if(!PlayerExistInMatch($matchId, $playerId))
      AddPlayerToMatch($matchId, $playerId);
    $textId = GetMatchTextId($matchId);
    $maxTime = GetMaxTime($matchId);
    session_start();
    $_SESSION["textid"] = $textId;
    $_SESSION["matchid"] = $matchId;
    $_SESSION["playerid"] = $playerId;
    $_SESSION["maxtime"] = $maxTime;
?>

<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="ie=edge" />

  <link rel="stylesheet" href="main.css">
  <link rel="stylesheet" href="Gameplay.css">
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
  <title>Match Game</title>
</head>

<body>
<div>
    <div id="Container">
      <div id="Header-wide">
        <h1 id="Title">Typing<span style="color: white">4</span>Speed</h1>

        <h2 id="User">How Fast are your fingers?</h2>

        <!-- show this when 2 or more joins the match-->
        <div id="matchState" class="mytable">
          <h2>Join to start</h2>
        </div>

        <!-- show this when the match is played-->
        <div class="mytable">
          <ul id="Score">
            <li>
              <h1 id="WPM">0</h1>
              <P class="Green">WPM</P>
            </li>
            <li>
              <h1 id="timerText">0.0</h1>
              <P class="Green">Time</P>
            </li>
            <li>
              <h1 id="maxtime">0.0</h1>
              <P class="Green">Round Time</P>
            </li>
            <li>
              <h1 id="Accuracy">0</h1>
              <P class="Green">Accuracy</P>
            </li>
          </ul>
        </div>
      </div>

      <div id="gradient">
      </div>

      <!-- side lists -->
      <div class="side-box left ">
        <div class="side-top">
          <h2 class="mytable" style="margin-top: 5px">Chat</h2>
        </div>
        <div id="chatbox">
          <ul id="chat">
          </ul>
        </div>
        <br>
        <input class="mytable" type="text">
      </div>

      <div class="side-box right ">
        <div class="side-top-right">
        </tr>
          <ul class="aligned-list mytable" style="padding-left: 22px; ">
            <li>
              <h3>Rank</h3>
            </li>
            <li>
              <h3> &nbsp; &nbsp; &nbsp;</h3>
            </li>
            <li>
              <h3>Name</h3>
            </li>
            <li>
              <h3> &nbsp; &nbsp; &nbsp;</h3>
            </li>
            <li>
              <h3>WPM</h3>
            </li>
          </ul>
          <div id="scorebox">
            <ol id="scoreboxcontainer">
            </ol>
          </div>
          <br>
          <button class="mytable">Close</button>
        </div>
      </div>

      <div id="CodeBox" onclick="$('#CodeInput').focus();">
        <?php
          echo TargetTextFileToHTML($textId);
        ?>
      </div>
      <div id="InputBox" class="mytable">
        <textarea onkeypress="addKeyTyped(event)" onkeydown="DeleteKeyTyped(event)" value=""
          placeholder="Type The Code Here" class="Center" id="CodeInput"></textarea>
        <button id="join" class="mytable">Join The Race</button>
      </div>

      <br>
      <button id="viewRecordBtn" disabled=true onclick="ViewRecord()">View Recording</button>

      <br>

    </div>
</body>

<script src="matchgame.js"></script>

</html>