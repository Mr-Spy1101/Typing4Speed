<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="ie=edge" />

  <link rel="stylesheet" href="main.css">
  <title>Coding Practice</title>
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
              <h1 id="Accuracy">100%</h1>
              <P class="Green">Accuracy</P>
            </li>
          </ul>
        </div>


      </div>
      <div id="CodeBox" onclick="document.getElementById('CodeInput').focus();">
      <?php
        require 'functions.php';
        $textid = "";
        if(isset($_GET["id"]))
          $textid = $_GET["id"];
        else
        {
          require 'dbconnection.php';
          $res = "";
          if(isset($_GET["type"]))
          {
            $type = $_GET["type"];
            $res = $conn->query("SELECT id FROM texts where type='$type' ORDER BY RAND()");
          }
          else
            $res = $conn->query("SELECT id FROM texts ORDER BY RAND()");
          foreach ($res as $row)
          {
            $textid = $row["id"];
            break;
          } 
        }
        session_start();
        $_SESSION["textid"] = $textid;
        echo TargetTextFileToHTML($_SESSION["textid"]);

        //TargetTextFileToDB("code.txt", "code");
      ?>
      </div>
      <div id="InputBox" class="table">
        <textarea onkeypress="addKeyTyped(event)" onkeydown="DeleteKeyTyped(event)" value=""
          placeholder="Type The Code Here" class="Center" id="CodeInput" autofocus></textarea>
      </div>

      <br>
      <button id="viewRecordBtn" disabled=true onclick="ViewRecord()">View Recording</button>
      <br>

    </div>
</body>

<script src="main.js"></script>

</html>