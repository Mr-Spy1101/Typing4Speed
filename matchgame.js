var targetString;
var textId;
var targetTypedText;
var incorrectclicks;
var records;
var index;
var gameOver;
var timer;
var maxTime;
var playerId;
var matchId;

FirstFunctionToCall();

function FirstFunctionToCall() {
    textId = 0;
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

    request = new XMLHttpRequest();
    request.open('GET', 'api.php?mode=session&sessionkey=matchid', true);
    request.send();
    request.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            matchId = this.responseText;
        };
    }

    request = new XMLHttpRequest();
    request.open('GET', 'api.php?mode=session&sessionkey=playerid', true);
    request.send();
    request.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            playerId = this.responseText;
        }
    };

    request = new XMLHttpRequest();
    request.open('GET', 'api.php?mode=session&sessionkey=maxtime', true);
    request.send();
    request.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            maxTime = parseInt(this.responseText) - Math.floor(Date.now() / 1000);
        }
    };

    targetTypedText = document.getElementById("targetTypedText");
    incorrectclicks = 0;
    records = [];
    index = 0;
    gameOver = false;
    timer = 0;
    playingrecord = false;

    setInterval(() => {
        IncrementTimer();
        ViewTimerAndWPM();
        CheckMaxTime();
    }, 100);

    setInterval(() => {
        RefreshData();
    }, 1000);

    setInterval(() => {
        var xxrequest = new XMLHttpRequest();
        xxrequest.open('GET', 'api.php?mode=data&score=1&matchid=' + matchId, true);
        xxrequest.send();
        xxrequest.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                document.getElementById("scoreboxcontainer").innerHTML = this.responseText;
                //$("scoreboxcontainer").html(this.responseText);
            }
        };
    }, 1000);
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

function IncrementTimer() {
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

function CheckMaxTime() {
    maxTime -= 0.1;
    document.getElementById("maxtime").innerHTML = (Math.max(0, maxTime - 5)).toFixed(1);
    if (maxTime <= 5) {
        gameOver = true;
        document.getElementById("maxtime").style.color = "#ff0000";
    }
    if (maxTime < 0) {
        var request = new XMLHttpRequest();
        request.open('GET', 'api.php?mode=refresh&match=1', true);
        request.send();
        setTimeout(function () {
            location.reload(true);
        }, 1000);
    }
}

function RefreshData() {
    //refresh lifetime, wpm
    var wpm = 0;
    if (timer > 0)
        wpm = (index / timer * 60 / 4);
    var request = new XMLHttpRequest();
    request.open('GET', 'api.php?mode=refresh&matchid=' + matchId + '&playerid=' + playerId + '&wpm=' + wpm.toFixed(0) + '&lifetime=1', true);
    request.send();

    //refresh and delete empty matches and dead players //maybe search for an automated way that the server itself make
    request = new XMLHttpRequest();
    request.open('GET', 'api.php?mode=refresh&all=1', true);
    request.send();
}

/*
var joined = 0;
var MatchStarted = false;

function NeedPlayers() {
    $("#matchState").html("<h2>Waiting for Players...</h2>");
}

function StartMatchCountDown() {
    let x = 10;
    $("#matchState").html("<h2>The match will start in " + x + " </h2>");

    setInterval(() => {
        x--;
        if (x == -1)
            StartMatch();
        else
            $("#matchState").html("<h2>The match will start in " + x + " </h2>");

    }, 1000);
}

function StartMatch() {
    MatchStarted = true;
}
*/

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


        /*
        if (joined >= 2) {
            StartMatchCountDown();
        }
        else {
            NeedPlayers();
        }
        */
    }
    )
})