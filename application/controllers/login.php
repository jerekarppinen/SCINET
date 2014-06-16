<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Login extends CI_Controller {

	public function index()
	{
		$this->load->view('login');
	}


	// Function to process login ajax request
	public function process()
	{
		// Set device from post variable
		$device = $this->input->post("device");

		if(strlen($device) > 0 && $device != "")
		{

			// Load login model	
			$this->load->model("login_model");

			// Check if given device exists
			$login = $this->login_model->loginWithDevice($device);

			// If model returned an object, set session variables
			if(is_object($login))
			{
				$this->session->set_userdata("login", 		1);
				$this->session->set_userdata("device", 		$login->device);
				$this->session->set_userdata("last_seen", 	$login->last_seen);
				$this->session->set_userdata("notes", 		$login->notes);

				echo 1;
			}
			else
			{
				echo 0;
			}
		}
	}
}
