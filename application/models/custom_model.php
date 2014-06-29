<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Custom_model extends CI_Model {

	public function index()
	{
	}

	public function generateRandomString($length = 6)
	{

   		$characters = '0123456789abcdefghijklmnopqrstuvwxyz';
	    $randomString = '';

	    for ($i = 0; $i < $length; $i++)
	    {
	        $randomString .= $characters[rand(0, strlen($characters) - 1)];
	    }

	    return $randomString;
	}

	public function getUniqueSerial()
	{

		while(true)
		{
			$random = $this->generateRandomString();

			$q = $this->db->query("SELECT * FROM devices WHERE device = '".$random."';");

			// If result is empty, return new serial

			if($q->num_rows() == 0)
			{
				return $random;
			}
		}
	}



}