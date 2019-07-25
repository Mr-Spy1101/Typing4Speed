var typedString = "";
var targetString = "Hello\nWorld !!";
var records = [];
var correctTyping = true;
var index = 0;

function addKeyTyped(e) {
  if (e.which == targetString.charCodeAt(index)) {
    document.getElementById("targetTypedText").children[index].classList = [];
    document.getElementById("targetTypedText").children[index].classList.add("correct-color");
    if (index + 1 < targetString.length) {
      document.getElementById("targetTypedText").children[index + 1].classList = [];
      document.getElementById("targetTypedText").children[index + 1].classList.add("active");
    }
  }
  else {
    correctTyping = false;
    document.getElementById("targetTypedText").children[index].classList = [];
    document.getElementById("targetTypedText").children[index].classList.add("incorrect-color");
    if (index + 1 < targetString.length) {
      document.getElementById("targetTypedText").children[index + 1].classList = [];
      document.getElementById("targetTypedText").children[index + 1].classList.add("active");
    }
  }
  records.push(e.KeyCode);
  index++;
  if (index == targetString && correctTyping) {
    ;//end the user play
  }

  e.target.value = "";

  /*
  var inputArea = document.getElementById("typedStringInputArea");
  var newTypedString = inputArea.value;
  if (typedString.length < newTypedString.length) {
    if (correctTyping) {
      records.push(newTypedString[newTypedString.length - 1]);
      typedString = newTypedString;
      if (typedString[typedString.length - 1] == targetString[typedString.length - 1])
        ;
      else {
        inputArea.style.color = "#ff1a1a";//make it red
        correctTyping = false;
      }
      records.push(newTypedString[newTypedString.length - 1]);
    }
  }
  else if (typedString.length > newTypedString.length) {
    records.push('`');//` means backspace
    typedString = newTypedString;
    if (typedString.length == 0 || typedString[typedString.length - 1] == targetString[typedString.length - 1]) {
      inputArea.style.color = "#1aff1a";//make it green
      correctTyping = true;
    }
    else {
      inputArea.style.color = "#ff1a1a";//make it red
      correctTyping = false;
    }
  }
  */
}

function itemKeyDown(e) {
  console.log(String.fromCharCode(e.KeyCode || e.which));
}
