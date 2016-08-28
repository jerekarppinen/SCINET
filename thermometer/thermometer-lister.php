<?php

include("../globals.php");

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
} 

if(isset($_GET['lastday'])) {
	$sql = "SELECT * FROM temperatures WHERE DATETIME >= now() - INTERVAL 1 DAY ORDER BY DATETIME DESC;";

	$result = $conn->query($sql);

	$temparray = array();

	while($row = $result->fetch_assoc()) {

	$temparray[] = $row;

	}

	echo json_encode($temparray);
}




if(isset($_GET['latest'])) {

	$sql = "SELECT * FROM temperatures ORDER BY DATETIME DESC LIMIT 1;";
	$result = $conn->query($sql);

	$temparray = array();

	while($row = $result->fetch_assoc()) {

	$temparray[] = $row;

	}

	echo json_encode($temparray);
	
}
else {

	$sql = "SELECT * FROM temperatures ORDER BY DATETIME DESC;";
	$result = $conn->query($sql);

	$temparray = array();

	while($row = $result->fetch_assoc()) {

	$temparray[] = $row;

	}

	echo json_encode($temparray);

}

$conn->close();

?>
