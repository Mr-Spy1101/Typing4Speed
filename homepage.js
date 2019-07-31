$(() => {
    $("#matchcreatebtn").click(function () {
        var matchId = document.getElementById("matchidinputtext").value;
        var playerId = document.getElementById("playeridinputtext").value;
        if (matchId == "" || playerId == "") {
            return;
        }
        var request = new XMLHttpRequest();
        request.open('GET', 'api.php?mode=data&ismatchexist=1&matchid=' + matchId, true);
        request.send();
        request.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                if (this.responseText == "yes")
                    alert("This room already exists");//do nothing
                else {
                    //create this room
                    var request = new XMLHttpRequest();
                    request.open('GET', 'api.php?mode=creatematch&matchid=' + matchId + '&playerid=' + playerId, true);
                    request.send();
                    request.onreadystatechange = function () {
                        if (this.readyState == 4 && this.status == 200) {
                            location.replace("matchgame.php?matchid=" + matchId + "&playerid=" + playerId);
                        }
                    };
                }
            }
        };
    }
    )
})


$(() => {
    $("#matchjoinbtn").click(function () {
        var matchId = document.getElementById("joinmatchidinputtext").value;
        var playerId = document.getElementById("joinplayeridinputtext").value;
        if (matchId == "" || playerId == "") {
            return;
        }
        var request = new XMLHttpRequest();
        request.open('GET', 'api.php?mode=data&ismatchexist=1&matchid=' + matchId, true);
        request.send();
        request.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                if (this.responseText == "no")
                    alert("This room not exists");//do nothing
                else {
                    var xrequest = new XMLHttpRequest();
                    xrequest.open('GET', 'api.php?mode=data&isplayerexistsinmatch=1&matchid=' + matchId + "&playerid=" + playerId, true);
                    xrequest.send();
                    xrequest.onreadystatechange = function () {
                        if (this.readyState == 4 && this.status == 200) {
                            if (this.responseText == "yes")
                                alert("This name is taken in this room");//do nothing
                            else
                                location.replace("matchgame.php?matchid=" + matchId + "&playerid=" + playerId);
                        }
                    };
                }
            }
        };
    }
    )
})