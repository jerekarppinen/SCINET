<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Temperature_model extends CI_Model {

	public function index()
	{
	}

	public function getTemps($device)
	{
		return $this->db->query("SELECT temperature, time_added FROM temperatures WHERE device = '".$device."';")->result();
	}

	public function addTemp($device, $temp)
	{
		// UNIX timestamp for time added
		$time_added = time();

		return $this->db->query("INSERT temperatures
										SET
										device = '".$device."',
										temperature = ".$temp.",
										time_added = ".$time_added.";");
	}

	public function setAlarmRate($device, $alarmRate)
	{
		return $this->db->query("UPDATE devices SET alarm_rate = ".$alarmRate." WHERE device = '".$device."';");
	}

	public function getAlarmRate($device)
	{
		return $this->db->query("SELECT alarm_rate FROM devices WHERE device = '".$device."';")->row();
	}
}