<?php
$myData = $_GET["data"];

$myFile = "users.json";
$fileHandle = fopen($myFile, "w");

fwrite($fileHandle, $myData);
fclose($fileHandle);

?>