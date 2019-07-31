<?php
function go()
{
    require 'functions.php';
    if(!isset($_GET["mode"]))
        ;
    else if($_GET["mode"]=="html" && isset($_GET["id"]))
    {
        $textId = $_GET["id"];
        echo TargetTextFileToString($textId);
    }
    else if($_GET["mode"]=="plain" && isset($_GET["id"]))
    {
        $textId = $_GET["id"];
        echo TargetTextFileToString($textId);
    }
    else if($_GET["mode"]=="session" && isset($_GET["sessionkey"]))
    {
        $value = $_GET["sessionkey"];
        session_start();
        echo $_SESSION[$value];
    }
    else if($_GET["mode"]=="refresh" && isset($_GET["matchid"]) && isset($_GET["playerid"]) && isset($_GET["lifetime"]))
    {
        $sql = "";
        $matchId = $_GET["matchid"];
        $playerId = $_GET["playerid"];
        if(isset($_GET["lifetime"]))
        {
            $newtime = time();
            $sql .= "UPDATE matchesplayers SET lifetime='$newtime' WHERE matchid='$matchId' AND playerid='$playerId';";
        }
        if(isset($_GET["wpm"]))
        {
            $wpm = $_GET["wpm"];
            $sql .= "UPDATE matchesplayers SET wpm='$wpm' WHERE matchid='$matchId' AND playerid='$playerId';";
        }
        if($sql != "")
        {
            require 'dbconnection.php';
            $conn->query($sql);
        }
    }
    else if($_GET["mode"]=="refresh" && isset($_GET["all"]))
    {
        require 'dbconnection.php';
        $time = time();
        $sql = "DELETE FROM matchesplayers WHERE ($time - lifetime > 10);";
        $conn->query($sql);

        $sql = "SELECT id from matches;";
        $res = $conn->query($sql);
        foreach ($res as $row)
        {
            $matchId = $row['id'];
            $sql = "SELECT matchid FROM matchesplayers WHERE matchid='$matchId';";
            $subres = $conn->query($sql);
            $isEmpty = true;
            foreach ($subres as $row)
            {
                $isEmpty = false;
            }

            if($isEmpty)
            {
                $sql = "DELETE FROM matcheschats WHERE matchid='$matchId';";
                $conn->query($sql);
                $sql = "DELETE FROM matches WHERE id='$matchId';";
                $conn->query($sql);
            }
        }
    }
    else if($_GET["mode"]=="refresh" && isset($_GET["match"]))
    {
        require 'dbconnection.php';
        $time = time();
        $sql = "SELECT id, maxtime, starttime, texttype FROM matches WHERE maxtime < $time;";
        $res = $conn->query($sql);
        foreach ($res as $row)
        {
            $type = $row["texttype"];
            $subres = $conn->query("SELECT id FROM texts where type='$type' ORDER BY RAND();");
            $textId = -1;
            foreach ($subres as $subrow)
            {
                $textId = $subrow["id"];
                break;
            }
            $maxTime = $row["maxtime"] - $row["starttime"] + $time;
            $sql = "UPDATE matches SET textid='$textId', starttime='$time', maxtime='$maxTime' WHERE maxtime < $time;";
            $conn->query($sql);
        }
    }
    else if($_GET["mode"]=="data" && isset($_GET["matchid"]) && isset($_GET["score"]))
    {
        require 'dbconnection.php';
        $matchId = $_GET["matchid"];
        $res = $conn->query("SELECT playerid, wpm FROM matchesplayers WHERE matchid='$matchId' ORDER BY wpm DESC");
        
        $output = "";
        foreach ($res as $row)
        {
            $playerId = $row["playerid"];
            $wpm = $row["wpm"];
            $output .= "<li>&nbsp; &nbsp;<h4>$playerId</h4> &nbsp; &nbsp; &nbsp;<h4>$wpm</h4></li>";
        }
        echo $output;
    }

    else if($_GET["mode"]=="data" && isset($_GET["matchid"]) && isset($_GET["ismatchexist"]))
    {
        require 'dbconnection.php';
        $matchId = $_GET["matchid"];
        $res = $conn->query("SELECT id FROM matches WHERE id='$matchId';");
        
        $output = "no";
        foreach ($res as $row)
        {
            $output = "yes";
        }
        echo $output;
    }

    else if($_GET["mode"]=="data" && isset($_GET["matchid"]) && isset($_GET["playerid"]) && isset($_GET["isplayerexistsinmatch"]))
    {
        require 'dbconnection.php';
        $matchId = $_GET["matchid"];
        $playerId = $_GET["playerid"];
        if(PlayerExistInMatch($matchId, $playerId))
            echo "yes";
        else
            echo "no";
    }

    else if($_GET["mode"]=="creatematch" && isset($_GET["matchid"]) && isset($_GET["playerid"]))
    {
        require 'dbconnection.php';
        $matchId = $_GET["matchid"];
        $playerId = $_GET["playerid"];
        AddNewMatch($matchId, "code", 100);
        AddPlayerToMatch($matchId, $playerId);
    }
}
go();
?>