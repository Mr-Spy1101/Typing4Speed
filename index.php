<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="ie=edge" />

  <link rel="stylesheet" href="assets/bootstrap/css/bootstrap.min.css">
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
  <link rel="stylesheet" href="HomePage.css">
  <link rel="stylesheet" href="main.css">

  <title>Home</title>
</head>

<body>

  <div>
    <div id="Container">
      <div id="Header">
        <h1 id="Title">Typing<span style="color: white">4</span>Speed</h1>
        <h2 id="Greating">How Fast are your fingers?</h2>
      </div>

      <img src="1.png" height="120%" width="100%">

      <div id="mainrow" class="row">
        <div class="col-md-6"></div>
        <div id="mainText" class="col-md-6">
          <h2>Typing Practice for Programmers</h2>
          <p>
            <code>
            Practice typing the awkward characters in code.
              No drills — type through open source code in 
              JavaScript, Ruby, C, C++, Java, PHP, Perl, Haskell, Scala, 
              and more.
              Eliminate the mistyped keys delaying every edit-
              compile-test iteration.
            </code>
          </p>
          <br>
          <br>
          <br>
          <br>
          <br>
          <div class="col-md-2"></div>
          <a href="#features" style="text-decoration: none;" id="EnterButton" class="col-lg-2 offset-lg-10"> Get Started </a>
        </div>


      </div>



      <div id="features">
        <ul>
          <li class="img-title row">
            <a href="practice.php">
              <img class="col-sm-4" src="codeSpeed.png">
              <div class="col-sm-2 "></div>
              <div class="col-sm-6 text-box">
                <h2>Improve your coding speed</h2> <br>
                <p>large code collections for variey of languages</p>
              </div>
            </a>
          </li>
          <li class="img-title row">
            <div class="col-sm-2 ">

            </div>
            <div class="col-sm-6 text-box">
              <h2>Join to room</h2>
              <br>
              <p>have fun challenging other coders </p><br>
              <input placeholder="Room Name" id="joinmatchidinputtext"><br>
              <input placeholder="Your Name" id="joinplayeridinputtext">
              <input type="button" value="Join" id="matchjoinbtn">
            </div>
            <img class="col-sm-4" src="race.png"> </p>
          </li>
          <li class="img-title row">
            <img class="col-sm-4" src="friends.png">
            <div class="col-sm-1 "> </div>
            <div class="col-sm-6 text-box">
              <h2>create your own room</h2> <br>
              <p>you can create a room and invite whoever you want</p><br>
              <input placeholder="Room Name" id="matchidinputtext"><br>
              <input placeholder="Your Name" id="playeridinputtext">
              <input type="button" value="Create" id="matchcreatebtn">
            </div>
          </li>
        </ul>
      </div>

      <footer>
        <div class="mytable">
          <br>
          <ul id="Score">
            <li>
              <a>About Us</a>
            <li>
              <a>Terms <code style="background: transparent">&</code> Privacy</a>
            </li>
            <li>
              <a>Contact</a>
            </li>
          </ul>
          <br>
        </div>

      </footer>

</body>

<script src="homepage.js"></script>

</html>