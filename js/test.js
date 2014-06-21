function initialize()
{
var y = window.innerHeight;
var x = window.innerWidth;

x = x / 2;
y = y / 2;

var mittari_bg = null;
var neula = null;

mittari_bg = document.getElementById("mittariBG");
neula = document.getElementById("viisari");

mittari_bg.style.top= y;
mittari_bg.style.left = x;
neula.style.left= x;
neula.style.top= y;
}