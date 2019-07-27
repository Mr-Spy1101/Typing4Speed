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
}
go();
?>