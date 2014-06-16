<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Device_model extends CI_Model {

	public function index()
	{
	}


	// Check given device, return 1 or 0
	public function checkDevice($device)
	{
		$query = $this->db->query("SELECT * FROM devices WHERE device = '".$device."';");
		
		if($query->num_rows() == 1)
		{
			return 1;	
		}
		// If number of rows is greater than 1, there are too many devices with the same serial
		elseif($query->num_rows() > 1)
		{
			return 2;
		}
		else
		{
			return 0;
		}

	}

	public function addDevice($device, $alarmRate, $notes)
	{
		$time_added = time();

		return $this->db->query("INSERT INTO devices
										(device, alarm_rate, time_added, notes)
										VALUES
										('".$device."', ".$alarmRate.", ".$time_added.", '".$notes."');");
	}

}