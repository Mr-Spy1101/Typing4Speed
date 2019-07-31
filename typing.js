var targetString;
var textId;
var targetTypedText;
var records;
var incorrectclicks;
var index;
var gameOver;
var timer;
var playingrecord;

FirstFunctionToCall();

function FirstFunctionToCall() {
  textId = 45;

  var request = new XMLHttpRequest();
  request.open('GET', 'api.php?mode=session&sessionkey=textid', true);
  request.send();
  request.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      textId = this.responseText;

      var xrequest = new XMLHttpRequest();
      xrequest.open('GET', 'api.php?mode=plain&id=' + textId, true);
      xrequest.send();
      xrequest.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
          targetString = this.responseText;
        }
      };
    }
  };


  targetTypedText = document.getElementById("targetTypedText");
  records = [];
  incorrectclicks = 0;
  index = 0;
  gameOver = false;
  timer = 0;
  playingrecord = false;

  setInterval(() => {
    DecrementTimer();
    ViewTimerAndWPM();
  }, 100);
}

function addKeyTyped(e) {
  if (index >= targetString.length || gameOver)
    return;
  if (incorrectclicks >= 4)
    return;
  if (index == 0)
    timer = 0;

  var keycode = e.keycode || e.which;
  if (keycode == targetString.charCodeAt(index) && incorrectclicks == 0) {

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
    var cpm = index / timer * 60;
    document.getElementById("WPM").innerHTML = (cpm / 4).toFixed(0);
  }
}

function DeleteKeyTyped(e) {
  var keycode = e.keycode || e.which;
  if (keycode == 13 || keycode == 32)
    e.target.value = "";
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

function ViewRecord() {
  if (playingrecord)
    return;
  if (!gameOver)
    return;
  index = 0;
  incorrectclicks = 0;
  initialize();
  timer = 0;
  ViewRecordAction(0);
  playingrecord = true;
}

function ViewRecordAction(moveindex) {
  if (moveindex >= records.length)
    return;
  if (!gameOver)
    return;
  var keycode = records[moveindex].KeyCode;
  if (keycode != 8) {
    if (keycode == targetString.charCodeAt(index) && incorrectclicks == 0) {
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
    index++;
  }
  else {
    if (incorrectclicks > 0)
      incorrectclicks--;
    if (index < targetString.length) {
      targetTypedText.children[index].classList = [];
      targetTypedText.children[index].classList.add("normal-color");
    }
    index--;
    targetTypedText.children[index].classList = [];
    targetTypedText.children[index].classList.add("active");
  }
  if (moveindex + 1 >= records.length) {
    playingrecord = false;
    return;
  }
  setTimeout(function () { ViewRecordAction(moveindex + 1); }, records[moveindex + 1].time - records[moveindex].time);
}

function initialize() {
  for (var i = 0; i < targetTypedText.children.length; i++) {
    targetTypedText.children[i].classList = [];
    if (i != 0)
      targetTypedText.children[i].classList.add("normal-color");
    else
      targetTypedText.children[i].classList.add("active");
  }
}

function PlayAgain() {
  records = [];
  incorrectclicks = 0;
  index = 0;
  gameOver = false;
  playingrecord = false;
  document.getElementById("viewRecordBtn").disabled = true;
  initialize();
  timer = 0;
}

function DecrementTimer() {
  if (gameOver && !playingrecord)
    return;
  timer += 0.1;
  if (index == 0)
    timer = 0;
}

function ViewTimerAndWPM() {
  document.getElementById("timerText").innerHTML = timer.toFixed(1);
  if (timer - parseInt(timer) <= 0.1) {
    if (timer > 0)
      document.getElementById("WPM").innerHTML = (index / timer * 60 / 4).toFixed(0);
    if (index > 0)
      document.getElementById("Accuracy").innerHTML = (index / records.length * 100).toFixed(0) + "%";
  }
}

function Countlines(str) {
  var lines = str.split("\r");
  return lines.length;
}

function findGetParameter(parameterName) {
  var result = null,
    tmp = [];
  location.search
    .substr(1)
    .split("&")
    .forEach(function (item) {
      tmp = item.split("=");
      if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
    });
  return result;
}