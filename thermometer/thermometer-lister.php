<?php

include("../globals.php");
include("../db.php");

$dbConnection = new DBConnection($hostname, $username, $password, $dbName);
$dbConnection->createDBConnection();

if(isset($_GET['lastday'])) {

	echo json_encode($dbConnection->getLastDayTemperature());
}
if(isset($_GET['latest'])) {

	echo json_encode(($dbConnection->getLatestTemperature()));
	
}
else {

	echo json_encode($dbConnection->getAllTemperatures());

}

$conn->close();

?>
