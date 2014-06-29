<html>
<head>
<meta http-equiv="Content-Type" content="text/html" charset="utf8" />
<title>Scinet.fi - Javascript animointitesti</title>
<link rel="stylesheet" href="styles/style.css" />
<meta name="scinet" content="saunamittari" />
<script src="js/test.js"></script>
<script type="text/javascript"></script>
</head>
<body onload="initialize()">
<div id="mittaristo" >
<!-- mittariBG on saunamittarin tausta. UI_mittari on tavallaan luokka mihin mittari kuuluu, eli osa suurempaa kokonaisuutta. Tyylitajua tässä vain hahmottelen.. :)  -->
<div id="mittariBG" class="UI_mittari" ></div>
<div id="viisari" class="UI_mittari" onclick="setTemperature()"></div>
<div id="lampotila" class="UI_mittari">Lämpötila</div>
</div>
</body>

</html>

