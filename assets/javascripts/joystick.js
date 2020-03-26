
var marginLeft = 70;
var marginTop = 70;

var xCentre = 112 + marginLeft;
var yCentre = 112 + marginTop; 

var xCentreCurseur = 54;
var yCentreCurseur = 49;

var isManette = false;
var vitesse = 0;
var angle = 0;

var nbCall = 0;

var isDown = false;

window.requestAnimationFrame = window.requestAnimationFrame
    || window.mozRequestAnimationFrame
    || window.webkitRequestAnimationFrame
    || window.msRequestAnimationFrame
    || function(f){return setTimeout(f, 200)} // simulate calling code 60 
 
window.cancelAnimationFrame = window.cancelAnimationFrame
    || window.mozCancelAnimationFrame
    || function(requestID){clearTimeout(requestID)} //fall back

$(document).ready(function(e) {
    
	SetCurseurV2(xCentre, yCentre);
	
	$('.joystickDiv .curseur').mousedown(function(e){
		e.preventDefault();
		isDown = true;
		SetCurseurV2(e.pageX, e.pageY);
	});
	$(document).mouseup(function(e) {
		isDown = false;
		SetCurseurV2(xCentre, yCentre);
	});
	$(document).mousemove(function(e) {
		if(isDown)
			SetCurseurV2(e.pageX, e.pageY);
	});
	
	$('.joystickDiv .curseur').on('touchmove', function(e){
		isDown = true;
		SetCurseurV2((event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX), (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY));
	});
	$(document).on('touchend', function(e) {
		isDown = false;
		SetCurseurV2(xCentre, yCentre);
	});
	$('.joystickDiv').on('touchmove', function(e) {
		if(isDown)
		{
			e.preventDefault();
			SetCurseurV2((event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX), (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY));
		}
	});
	
	//setInterval(SendCommande, 200);
	requestAnimationFrame(SendCommande);
	//setInterval(RefreshJoystickOn, 300);
	
});	

function SetInterfaceManette()
{
	isManette = true;
}

function SetVitesse(v)
{
	vitesse = v * 100;
}

var vitesseAngulaire = 0;
var vitesseX = 0

function SetCurseurV2(x, y)
{	
	if ($('.joystickDiv:visible').length > 0)
		offset = $('.joystickDiv:visible').offset()
	else
		offset = $('.joystickDiv').offset()
	marginLeft = offset.left;
	marginTop = offset.top;
	xCentre = 112 + marginLeft;
	yCentre = 112 + marginTop; 

	d = distanceJoystick (x, y, xCentre, yCentre);
	if (d <34)
	{
		$('.joystickDiv:visible .curseur').css({'left': (x-xCentreCurseur-marginLeft)+'px', 'top': (y-yCentreCurseur-marginTop)+'px'});
		vitesseAngulaire = yCentre-y;
		vitesseX = xCentre-x;
	}
	else
	{
		xt = x - xCentre;
		yt = y - yCentre;
		
		xt2 = xt * 34 / d;
		yt2 = yt * 34 / d;
		
		xt2 += xCentre;
		yt2 += yCentre;
		
		x = xt2;
		y = yt2;
		
	
		vitesseAngulaire = yCentre-yt2;
		vitesseX = xCentre-xt2;
		
		$('.joystickDiv:visible .curseur').css({'left': (xt2-xCentreCurseur-marginLeft)+'px', 'top': (yt2-yCentreCurseur-marginTop)+'px'});
	}

	valueY = (x - xCentre) / 37;
	valueX = (y - yCentre) / 37;
	
	lastValueX = valueX;
	lastValueY = valueY;
	
	nbCall++;
	if (nbCall % 5 == 0)
	{
		nbCall = 0;
	}
	//wycaApi.TeleopRobot(valueY * -0.5, valueX * -0.8);
}

var lastValueX = 0;
var lastValueY = 0;

nbCall0 = 0;

var lastSendMessage = 0;

function SendCommande()
{
	if ($('.joystickDiv:visible').length > 0 && nbCall0 >= 5)
	{
	}
	else
	{
		var d = new Date();
		ms = d.getTime();
		if (ms - lastSendMessage > 200)
		{
			lastSendMessage = ms;
			//if (robotCurrentState != 'undocked' || (lastValueX == 0 && lastValueY == 0))
			if ((lastValueX == 0 && lastValueY == 0))
			{
				if (nbCall0 < 5)
				{
					nbCall0++;
					wycaApi.Teleop(lastValueX * -0.5, lastValueY * -1.2);
				}
			}
			else if (isDown)
			{
				nbCall0 = 0;
				wycaApi.Teleop(lastValueX * -0.5, lastValueY * -1.2);
			}
		}
		
		requestAnimationFrame(SendCommande);
	}
}

function distanceJoystick(x1, y1, x2, y2)
{
	return Math.sqrt( (x2-x1)*(x2-x1) + (y2-y1)*(y2-y1));
}
