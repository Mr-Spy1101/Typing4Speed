<?php
    require 'functions.php';
    if(!isset($_GET["matchid"]) || !isset($_GET["playerid"]))
      exit("match id or player id not set");
    $matchId = $_GET["matchid"];
    $playerId = $_GET["playerid"];
    if(!MatchExists($matchId))
    {
      //exit("match does not exist");
      AddNewMatch($matchId, 'code', 100);
    }
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
  <title>Match Game</title>
</head>

<body>
  <div>
    <div id="Container">
      <div id="Header">
        <h1 id="Title">Typing<span style="color: white">4</span>Speed</h1>
        <div id="User">
          <h2>How Fast are your fingers?</h2>
        </div>

        <div class="table">
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
              <P class="Green">Max Time</P>
            </li>
            <li>
              <h1 id="Accuracy">100%</h1>
              <P class="Green">Accuracy</P>
            </li>
          </ul>
        </div>


      </div>
      <div id="CodeBox" onclick="document.getElementById('CodeInput').focus();">
      <?php
        echo TargetTextFileToHTML($_SESSION["textid"]);
      ?>
      </div>
      <div id="InputBox" class="table">
        <textarea onkeypress="addKeyTyped(event)" onkeydown="DeleteKeyTyped(event)" value=""
          placeholder="Type The Code Here" class="Center" id="CodeInput" autofocus></textarea>
      </div>
    </div>
</body>

<script src="matchgame.js"></script>

</html>