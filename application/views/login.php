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

		$("#error").hide();

		$("#device").focus(function(){

			$("#device").val("");

		});

		$("#login").click(function(){

			var device = $("#device").val();

			// Ajax url
			var url = base_url + "index.php/login/process";

			var array = { "device": device }

			$.post(url, array, function(result){

				if(result == 1)
				{
					window.location.href = base_url + "index.php/home/";
				}
				else
				{
					$("#error").show();
				}

			});

		});

	});

	</script>


</head>
<body>

<div id="container">
	<h1>Tervetuloa Sauna Celsius Informationin sivuille!</h1>

	<div id="body">
		<p>Palvelun avulla voit seurata saunan lämpötilaa miltä päätelaitteelta tahansa</p>

		<div id="login-container">
			<input type="text" id="device" value="Laitteen sarjanumero...">
			<button id="login">Sisään</button>
			<span id="error">Laitteen tunnus väärin</span>
		</div>

	</div>

</div>

</body>
</html>