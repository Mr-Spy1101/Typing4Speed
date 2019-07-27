<?php

function TargetTextFileToDB($filename, $type)
{
    $output = '';
    if($fh = fopen('code.txt', 'r'))
    {
        while(!feof($fh))
        {
            $line = fgets($fh);
            $line = preg_replace("/[\t]/", "    ", $line);
            for($i=0;$i<strlen($line);$i++)
                $output .= $line[$i];
        }
        fclose($fh);
    }

    require 'dbconnection.php';
    $output = base64_encode($output);
    $sql = "INSERT INTO texts (text, type) VALUES ('$output', '$type');";
    $conn->query($sql);
}

function TargetTextFileToHTML($textId)
{
    require 'dbconnection.php';
    $result = $conn->query("SELECT text FROM texts WHERE id='$textId';");
    $data = '';
    foreach ($result as $row)
    {
        $data = $row['text'];
        break;
    }
    if($data=='');//error msg
    
    $data = base64_decode($data);

    $output = "<pre id='targetTypedText'>";
    $index = 0;
    $firstchar = true;
    while (strpos($data, "\r", $index) !== false)
    {
        $line = substr($data, $index, strpos($data, "\r", $index) - $index);
        $index = strpos($data, "\r", $index) + 2;
        $isNotSpace = false;
        $len = strlen($line);
        for($i=0;$i<$len;$i++)
        {            
            if($isNotSpace==false)
            {
                if(ctype_space($line[$i]) == false)//if not space
                {
                    $isNotSpace = true;
                    if($firstchar)
                    {
                        $output .= "<span class='normal-color active'>" . $line[$i] . "</span>";
                        $firstchar = false;
                    }
                    else
                        $output .= "<span class='normal-color'>" . $line[$i] . "</span>";
                }   
                else
                    $output .= " ";
            }
            else
            {
                if(ctype_space($line[$i])) 
                    $output .= "<span class='normal-color'>" . "<span class='space'>" . $line[$i] . "</span></span>";
                else
                    $output .= "<span class='normal-color'>" . $line[$i] . "</span>";
            }
        }
        
        if($len > 1)
            $output .= "<span class='normal-color enter'><span class='enter'>&#9661;</span></span>";
        $output .= "\r";
    }
    $output .= '</pre>';

    return $output;
}

function TargetTextFileToString($textId)
{
    require 'dbconnection.php';
    $result = $conn->query("SELECT text FROM texts WHERE id='$textId';");
    $data = '';
    foreach ($result as $row)
    {
        $data = $row['text'];
        break;
    }

    if($data=='');//error msg
    
    $data = base64_decode($data);

    $output = "";
    $index = 0;
    while (strpos($data, "\r", $index) !== false)
    {
        $line = substr($data, $index, strpos($data, "\r", $index) - $index);
        $index = strpos($data, "\r", $index) + 1;
        $isNotSpace = false;
        $len = strlen($line);
        for($i=0;$i<$len;$i++)
        {
            if($isNotSpace==false)
            {
                if(!ctype_space($line[$i]))
                {
                    $isNotSpace = true;
                    $output .= $line[$i];
                }
            }
            else
                $output .= $line[$i];
        }
        if($len > 1)
            $output .= "\r";
    }

    return $output;
}
?>