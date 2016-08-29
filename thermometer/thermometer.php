<?php

include("../globals.php");
include("../db.php");

$decoded = json_decode(file_get_contents('php://input'));

$celsius = $decoded->celsius[0];

$dbConnection = new DBConnection($hostname, $username, $password, $dbname);
$dbConnection->createDBConnection();

print_r($dbConnection->insertTemperature($celsius));


?>