var targetString;
var textId;
var targetTypedText;
var incorrectclicks;
var records;
var index;
var gameOver;
var timer;
var playerId;
var matchId;
var MatchStatus;

function FirstFunctionToCall() {
    targetTypedText = document.getElementById("targetTypedText");
    incorrectclicks = 0;
    records = [];
    index = 0;
    gameOver = false;
    playingrecord = false;
}

function addKeyTyped(e) {
    if (MatchStatus == 'waiting' || MatchStatus == 'gameover')
        return;
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
    if (MatchStatus == 'waiting' || MatchStatus == 'gameover')
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

$(() => {
    $("#join").click(function () {
        $("#join").addClass('joinFade');
        setTimeout(() => {
            $("#join").css("display", "none");
            $("#CodeInput").css("display", "inherit");
        }, 200);

        setTimeout(() => {
            $('#CodeInput').focus();
        }, 300);
    }
    )
})