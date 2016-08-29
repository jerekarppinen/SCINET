<?php

include("../globals.php");
include("../db.php");

$dbConnection = new DBConnection($hostname, $username, $password, $dbname);
$dbConnection->createDBConnection();	

if(isset($_GET['lastday'])) {

	echo json_encode($dbConnection->getLastDayTemperature());
}




if(isset($_GET['latest'])) {

	print_r($dbConnection->getLatestTemperature());
	
}
else {

	echo json_encode($dbConnection->getAllTemperatures());

}

$conn->close();

?>
