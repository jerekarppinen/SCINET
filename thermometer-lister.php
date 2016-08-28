<?php

include("globals.php");

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
} 

$sql = "SELECT * FROM temperatures ORDER BY DATETIME DESC;";



$result = $conn->query($sql);

while($row = $result->fetch_assoc()) {
	print_r('<strong>ID:</strong> ' . $row['ID'] . ' <strong>CELSIUS</strong>: ' . $row['CELSIUS'] . ' <strong>DATETIME</strong>: ' . $row['DATETIME'] . '<br/>');
}


$conn->close();

?>
