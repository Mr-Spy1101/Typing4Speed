var targetString = "Hello\rWorld !!";
var records = [];
var incorrectclicks = 0;
var index = 0;
var gameOver = false;

function addKeyTyped(e) {
  if (index >= targetString.length || gameOver)
    return;
  if (incorrectclicks >= 4)
    return;
  var keycode = e.keycode || e.which;
  if (keycode == targetString.charCodeAt(index) && incorrectclicks == 0) {
    document.getElementById("targetTypedText").children[index].classList = [];
    document.getElementById("targetTypedText").children[index].classList.add("correct-color");
    if (index + 1 < targetString.length) {
      document.getElementById("targetTypedText").children[index + 1].classList = [];
      document.getElementById("targetTypedText").children[index + 1].classList.add("active");
    }
  }
  else {
    incorrectclicks++;
    document.getElementById("targetTypedText").children[index].classList = [];
    document.getElementById("targetTypedText").children[index].classList.add("incorrect-color");
    if (index + 1 < targetString.length) {
      document.getElementById("targetTypedText").children[index + 1].classList = [];
      document.getElementById("targetTypedText").children[index + 1].classList.add("active");
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
  records.push({ KeyCode: keycode, time: Date.now() });
  if (index < targetString.length) {
    document.getElementById("targetTypedText").children[index].classList = [];
    document.getElementById("targetTypedText").children[index].classList.add("normal-color");
  }
  index--;
  document.getElementById("targetTypedText").children[index].classList = [];
  document.getElementById("targetTypedText").children[index].classList.add("active");
}

function ViewRecord() {
  if (!gameOver)
    return;
  index = 0;
  incorrectclicks = 0;
  initialize();
  ViewRecordAction(0);
}

function ViewRecordAction(moveindex) {
  if (moveindex == records.length)
    return;

  var keycode = records[moveindex].KeyCode;
  if (keycode != 8) {
    if (keycode == targetString.charCodeAt(index) && incorrectclicks == 0) {
      document.getElementById("targetTypedText").children[index].classList = [];
      document.getElementById("targetTypedText").children[index].classList.add("correct-color");
      if (index + 1 < targetString.length) {
        document.getElementById("targetTypedText").children[index + 1].classList = [];
        document.getElementById("targetTypedText").children[index + 1].classList.add("active");
      }
    }
    else {
      incorrectclicks++;
      document.getElementById("targetTypedText").children[index].classList = [];
      document.getElementById("targetTypedText").children[index].classList.add("incorrect-color");
      if (index + 1 < targetString.length) {
        document.getElementById("targetTypedText").children[index + 1].classList = [];
        document.getElementById("targetTypedText").children[index + 1].classList.add("active");
      }
    }
    index++;
  }
  else {
    if (incorrectclicks > 0)
      incorrectclicks--;
    if (index < targetString.length) {
      document.getElementById("targetTypedText").children[index].classList = [];
      document.getElementById("targetTypedText").children[index].classList.add("normal-color");
    }
    index--;
    document.getElementById("targetTypedText").children[index].classList = [];
    document.getElementById("targetTypedText").children[index].classList.add("active");
  }
  if (moveindex + 1 >= records.length)
    return;
  setTimeout(function () { ViewRecordAction(moveindex + 1); }, records[moveindex + 1].time - records[moveindex].time);
}

function initialize() {
  for (var i = 0; i < document.getElementById("targetTypedText").children.length; i++) {
    document.getElementById("targetTypedText").children[i].classList = [];
    if (i != 0)
      document.getElementById("targetTypedText").children[i].classList.add("normal-color");
    else
      document.getElementById("targetTypedText").children[i].classList.add("active");
  }
}

function PlayAgain() {
  records = [];
  incorrectclicks = 0;
  index = 0;
  gameOver = false;
  document.getElementById("viewRecordBtn").disabled = true;
  initialize();
}