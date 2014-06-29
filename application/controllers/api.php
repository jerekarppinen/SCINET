<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Api extends CI_Controller {

	public function index()
	{
	}

	// Interface for Rasberry to insert temperature values
	public function addTemp($device, $temp)
	{
		// Check if we can find the device
		$this->load->model("device_model");
		$this->load->model("temperature_model");

		$found = $this->device_model->checkDevice($device);

		if($found === 0)
		{
			echo "No device found.";
		}
		elseif($found > 1)
		{
			echo "Too many devices with the same serial.";
		}
		elseif(!is_numeric($temp))
		{
			echo "Not numeric temperature.";
		}
		else
		{
			if($this->temperature_model->addTemp($device, $temp))
			{
				echo "Added temperature ".$temp." for device ".$device;
			}
			else
			{
				echo "Could not add temperature ".$temp." for ".$device;
			}
		}
	}

	public function getTempsForUI()
	{

		if($this->session->userdata("device") != "")
		{
			$device = $this->session->userdata("device");
		}		

		$this->load->model("device_model");
		$this->load->model("temperature_model");

		$found = $this->device_model->checkDevice($device);

		if($found === 0)
		{
			echo "No device found.";
		}
		elseif($found > 1)
		{
			echo "Too many devices with the same serial.";
		}
		else
		{
			$temps = $this->temperature_model->getTemps($device);

			echo json_encode($temps);
		}
	}

	public function setAlarmRateForUI()
	{
		$this->load->model("device_model");
		$this->load->model("temperature_model");

		if($this->session->userdata("device") != "")
		{
			$device = $this->session->userdata("device");
		}	

		// Set alarmRate from AJAX call
		$alarmRate = $this->input->post("alarmRate");

		$found = $this->device_model->checkDevice($device);

		if($found === 0)
		{
			echo "No device found.";
		}
		elseif($found > 1)
		{
			echo "Too many devices with the same serial.";
		}
		elseif(!is_numeric($alarmRate))
		{
			echo "Alarm rate must be numeric.";
		}
		else
		{
			$alarm = $this->temperature_model->setAlarmRate($device, $alarmRate);

			// Out put 1 if success

			echo $alarm;
		}
	}

	public function getAlarmRate($device)
	{
		$this->load->model("device_model");
		$this->load->model("temperature_model");

		$found = $this->device_model->checkDevice($device);

		if($found === 0)
		{
			echo "No device found.";
		}
		elseif($found > 1)
		{
			echo "Too many devices with the same serial.";
		}
		else
		{
			$alarm = $this->temperature_model->getAlarmRate($device);

			// Out put 1 if success

			echo json_encode($alarm);
		}
	}

	public function getDeviceDataForUI()
	{
		if($this->session->userdata("device") != "")
		{
			$device = $this->session->userdata("device");
		}


		$this->load->model("login_model");

		// Found variable has an array if device is found, otherwise 0

		$found = $this->login_model->loginWithDevice($device);	

		if(is_object($found))
		{
			echo json_encode($found);
		}
		else
		{
			echo "Device not found.";
		}
	}	

	// Last parameter for security reasons
	public function addDevice($device = "", $alarmRate = "", $notes = "", $yptologin = "")
	{

		if($yptologin != "LiisaIhmeMaassa")
		{
			echo "Not permitted.";
		}
		else
		{
			$this->load->model("device_model");

			// Prevent duplicates
			$found = $this->device_model->checkDevice($device);

			if($found > 0)
			{
				echo "Select different serial.";
			}
			else
			{
				$add = $this->device_model->addDevice($device, $alarmRate, $notes);

				if($add == 1)
				{
					echo "Added device ".$device;
				}
				else
				{
					echo "Adding device failed.";
				}
			}
		}
	}

	// Function called by RasPi
	public function startUp()
	{

		$yptologin = $this->input->post("yptologin");

		if($yptologin != "LiisaIhmeMaassa")
		{
			echo "Not permitted.";
		}
		else
		{

			$this->load->model("custom_model");

			$new_serial = $this->custom_model->getUniqueSerial();
			
			$this->addDevice($new_serial, 100, "", "LiisaIhmeMaassa");

		}
	}

}
