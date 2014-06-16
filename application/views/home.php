<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<title>SCINET</title>

	<script src="<?php echo base_url() ?>assets/js/jQuery_v1.11.1.js"></script>
	<link type="text/css" rel="stylesheet" href="<?php echo base_url() ?>assets/css/style.css">

	<script>

	$(document).ready(function(){


		// Base url

		base_url = "<?php echo base_url() ?>";

		// Example usage of PHP API

		// Device Data For UI uses session variable. Does not need parameter.
		device_data_url = base_url + "index.php/api/getDeviceDataForUI";

		$.post(device_data_url, function(result){

			console.log(result);

		});

		// Returns all the temperatures for the given device. Does not need parameter. Session, bitch.
		device_temps_url = base_url + "index.php/api/getTempsForUI";

		$.post(device_temps_url, function(result){

			console.log(result);

		});

		// Set alarm rate
		device_alarmrate_url = base_url + "index.php/api/setAlarmRateForUI";

		var array = {

			"alarmRate": 100
		}

		// Result 1 if success
		$.post(device_alarmrate_url, array, function(result){

			console.log(result);

		});
	});

	</script>

</head>
<body>

<div id="container">
	<h2>Laite <?php echo $this->session->userdata("device"); ?></h2>
</div>

</body>
</html>