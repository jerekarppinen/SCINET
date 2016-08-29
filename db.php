<?php

class DBConnection {

	public $hostname;
	public $username;
	public $password;
	public $dbName;

	function __construct($hostname,$username,$password,$dbName) {

		$this->hostname = $hostname;
		$this->username = $username;
		$this->password = $password;
		$this->dbName = $dbName;
	}

	function createDBConnection() {

		$this->connection = new PDO("mysql:host=$this->hostname;dbname=$this->dbName",$this->username,$this->password);
		$this->connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	}

	function getAllTemperatures() {

		$sql = "SELECT * FROM $this->dbName.temperatures ORDER BY DATETIME DESC;";

		try {
			$sth = $this->connection->prepare($sql);
			$sth->execute();			
		} catch(Exception $e) {
			die($e);
		}


		return $sth->fetchAll(PDO::FETCH_ASSOC);

	}

	function getLastDayTemperature() {

		$sql = "SELECT * FROM $this->dbName.temperatures WHERE DATETIME >= now() - INTERVAL 1 DAY ORDER BY DATETIME DESC;";

		try {
			$sth = $this->connection->prepare($sql);
			$sth->execute();			
		} catch(Exception $e) {
			die($e);
		}


		return $sth->fetchAll(PDO::FETCH_ASSOC);

	}

	function getLatestTemperature() {

		$sql = "SELECT * FROM $this->dbName.temperatures ORDER BY DATETIME DESC LIMIT 1;";

		try {
			$sth = $this->connection->prepare($sql);
			$sth->execute();			
		} catch(Exception $e) {
			die($e);
		}


		return $sth->fetch(PDO::FETCH_ASSOC);

	}

	function insertTemperature($celsius) {

		try {
			$sth = $this->connection->prepare("INSERT INTO $this->dbName.temperatures (celsius) VALUES (:celsius)");
			return $sth->execute(array("celsius" => $celsius));
		} catch(Exception $e) {
			die($e);
		}
	}

}

?>