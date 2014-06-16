<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Login_model extends CI_Model {

	public function index()
	{
	}


	// Function to process login ajax request
	public function loginWithDevice($device)
	{
		// Define query and return the array if number of rows is greater than 0
		$query = $this->db->query("SELECT * FROM devices WHERE device = '".$device."';");
		
		if($query->num_rows() > 0)
		{
			return $query->row();	
		}
		else
		{
			return 0;
		}

		
	}
}
