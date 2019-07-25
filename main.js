var targetString = "Hello\rWorld !!";
const targetTypedText = "targetTypedText";
var records = [];
var incorrectclicks = 0;
var index = 0;
var gameOver = false;
var timer = 60;
var playingrecord = false;
setInterval(() => {
  DecrementTimer();
  ViewTimer();
}, 1000);

function addKeyTyped(e) 
{
  if (index >= targetString.length || gameOver)
    return;
  if (incorrectclicks >= 4)
    return;
  if (index == 0)
    timer = 60;

  var keycode = e.keycode || e.which;
  if (keycode == targetString.charCodeAt(index) && incorrectclicks == 0) {
    
    document.getElementById(targetTypedText).children[index].classList = [];
    document.getElementById(targetTypedText).children[index].classList.add("correct-color");
    if (index + 1 < targetString.length) {
      document.getElementById(targetTypedText).children[index + 1].classList = [];
      document.getElementById(targetTypedText).children[index + 1].classList.add("active");
    }
  }
  else {
    incorrectclicks++;
    document.getElementById(targetTypedText).children[index].classList = [];
    document.getElementById(targetTypedText).children[index].classList.add("incorrect-color");
    if (index + 1 < targetString.length) {
      document.getElementById(targetTypedText).children[index + 1].classList = [];
      document.getElementById(targetTypedText).children[index + 1].classList.add("active");
    }
  }
  records.push({ KeyCode: keycode, time: Date.now() });
  index++;
  if (index == targetString.length && incorrectclicks == 0) {
    gameOver = true;
    document.getElementById("viewRecordBtn").disabled = false;
    var cpm = targetString.length / (60 - timer) * 60;
    document.getElementById("scoreText").innerHTML = "" + cpm.toFixed(1) + "  CPM" + "<br>" + (cpm / 4).toFixed(1) + "  WPM";
  }
}

function DeleteKeyTyped(e) {
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
    timer = 60;
  records.push({ KeyCode: keycode, time: Date.now() });
  if (index < targetString.length) {
    document.getElementById(targetTypedText).children[index].classList = [];
    document.getElementById(targetTypedText).children[index].classList.add("normal-color");
  }
  index--;
  document.getElementById(targetTypedText).children[index].classList = [];
  document.getElementById(targetTypedText).children[index].classList.add("active");
}

function ViewRecord() {
  if (playingrecord)
    return;
  if (!gameOver)
    return;
  index = 0;
  incorrectclicks = 0;
  initialize();
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
      document.getElementById(targetTypedText).children[index].classList = [];
      document.getElementById(targetTypedText).children[index].classList.add("correct-color");
      if (index + 1 < targetString.length) {
        document.getElementById(targetTypedText).children[index + 1].classList = [];
        document.getElementById(targetTypedText).children[index + 1].classList.add("active");
      }
    }
    else {
      incorrectclicks++;
      document.getElementById(targetTypedText).children[index].classList = [];
      document.getElementById(targetTypedText).children[index].classList.add("incorrect-color");
      if (index + 1 < targetString.length) {
        document.getElementById(targetTypedText).children[index + 1].classList = [];
        document.getElementById(targetTypedText).children[index + 1].classList.add("active");
      }
    }
    index++;
  }
  else {
    if (incorrectclicks > 0)
      incorrectclicks--;
    if (index < targetString.length) {
      document.getElementById(targetTypedText).children[index].classList = [];
      document.getElementById(targetTypedText).children[index].classList.add("normal-color");
    }
    index--;
    document.getElementById(targetTypedText).children[index].classList = [];
    document.getElementById(targetTypedText).children[index].classList.add("active");
  }
  if (moveindex + 1 >= records.length) {
    playingrecord = false;
    return;
  }
  setTimeout(function () { ViewRecordAction(moveindex + 1); }, records[moveindex + 1].time - records[moveindex].time);
}

function initialize() {
  for (var i = 0; i < document.getElementById(targetTypedText).children.length; i++) {
    document.getElementById(targetTypedText).children[i].classList = [];
    if (i != 0)
      document.getElementById(targetTypedText).children[i].classList.add("normal-color");
    else
      document.getElementById(targetTypedText).children[i].classList.add("active");
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
  timer = 60;
}

function DecrementTimer() {
  if (gameOver)
    return;
  timer--;
  if (index == 0)
    timer = 60;
}

function ViewTimer() {
  document.getElementById("timerText").innerHTML = "Timer : " + timer;
}