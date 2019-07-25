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
  console.log(keycode, "   ", targetString.charCodeAt(index));
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
  records.push(keycode);
  index++;
  if (index == targetString.length && incorrectclicks == 0) {
    gameOver = true;
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
  records.push(e.KeyCode);
  if (index < targetString.length) {
    document.getElementById("targetTypedText").children[index].classList = [];
    document.getElementById("targetTypedText").children[index].classList.add("normal-color");
  }
  index--;
  document.getElementById("targetTypedText").children[index].classList = [];
  document.getElementById("targetTypedText").children[index].classList.add("active");
}