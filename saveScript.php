<?php
$myData = $_GET["data"];

$myFile = "users.json";
$fileHandle = fopen($myFile, "w");

fwrite($fileHandle, "testing");
fclose($fileHandle);

?>