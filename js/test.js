function initialize()
{

var mittarinKeskipiste_x = null;
var mittarinKeskipiste_y = null;
var y = window.innerHeight;
var x = window.innerWidth;

var mittari_bg = document.getElementById("mittariBG");
var neula = document.getElementById("viisari");
var lampotila = document.getElementById("lampotila");

x = (x / 2) * 0.5;
y = (y / 2) * 0.5;

// asetellaan mittaristo keskelle ruutua
mittari_bg.style.left = x;
mittari_bg.style.top= y;

// asetetaan neula oikeaan paikkaan
mittarinKeskipiste_x = mittari_bg.clientWidth;
mittarinKeskipiste_y = mittari_bg.clientHeight;
neula.style.left= (mittarinKeskipiste_x / 2) + x - 40;	// vakioluvut ovat justeeraamista...
neula.style.top= (mittarinKeskipiste_y / 2) + y - 60;

// käännetään neula kohti 20 astetta
neula.style.transformOrigin= "70% 10%";
neula.style.webkitTransform = "rotate(-130deg)";

// asetetaan lämpötilatietokenttä
lampotila.style.left = x;
lampotila.style.top = y;
}

function setTemperature(temp)
{
// tehtävää: tunnista selain ja käytä oikeaa pyöritysmetodia.. nyt tuki vain chromelle
// Infoa. Nykyisillä kuvilla mittarin neula voi pyöriä 180 astetta, mittasin ihan kulmamitalla (viivotin).
var neula = document.getElementById("viisari");
var rnd = Math.random();
var current = -130;

neula.style.transformOrigin= "70% 10%";
neula.style.webkitTransform = "rotate(-130deg)";
rnd = rnd * 180;


function needleMove()
{
	if( temp == null)
	{
		if(current < rnd)
		{
			neula.style.webkitTransform = "rotate("+current+"deg)";
		}
	}
	else
	{
		if(current < temp)
		{
			neula.style.webkitTransform = "rotate("+current+"deg)";
		}
	}
	
	current++;
}
// asetetaan animaatio päälle
var anim = setInterval(needleMove,50); // 50 ms välein

// päivitetään lämpötilatietokenttä
document.getElementById("lampotila").innerHTML = "Lämpötila: "+rnd;
}

