
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
	
function RefreshJoystickOn()
{
	if ($('.bToggleJosytick i').hasClass('fa-toggle-off'))
	{
		//wycaApi.JoystickIsSafeOff(true); Retour auto
	}
	else
	{
		wycaApi.JoystickIsSafeOff(false);
	}
}

function StopJoystickEnable()
{
	if ($('.bToggleJosytick i').hasClass('fa-toggle-on'))
	{
		$('.bToggleJosytick i').removeClass('fa-toggle-on')
		$('.bToggleJosytick i').addClass('fa-toggle-off')
	}
}

$(document).ready(function(e) {
    
	SetCurseurV2(xCentre, yCentre);
	
	$('.bToggleJosytick').click(function(e) {
        e.preventDefault();
		
		if ($('.bToggleJosytick i').hasClass('fa-toggle-off'))
		{
			$('.bToggleJosytick i').removeClass('fa-toggle-off')
			$('.bToggleJosytick i').addClass('fa-toggle-on')
			
			//wycaApi.SetJoystickOn(true);
		}
		else
		{
			$('.bToggleJosytick i').removeClass('fa-toggle-on')
			$('.bToggleJosytick i').addClass('fa-toggle-off')
			
			//wycaApi.SetJoystickOn(false);
		}
		
    });
		
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
	/*
	$('.joystickDiv').mousemove(function(e) {
		if(isDown)
		{
			SetCurseurV2(e.pageX, e.pageY);
		}
	});
	/*
	$('.joystickDiv').mouseout(function(){
		isDown = false;
		SetCurseurV2(xCentre, yCentre);
	});
	*/
	
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
function SendCommande()
{
	if (robotCurrentState != 'undocked' || jobInProgress || (lastValueX == 0 && lastValueY == 0))
	{
		if (nbCall0 < 5)
		{
			nbCall0++;
			if (in_visio)
				wycaApi.TeleopRobot(lastValueX * -0.3, lastValueY * -0.4);
		}
	}
	else
	{
		nbCall0 = 0;
		if (in_visio)
			wycaApi.TeleopRobot(lastValueX * -0.3, lastValueY * -0.4);
	}
}

function distanceJoystick(x1, y1, x2, y2)
{
	return Math.sqrt( (x2-x1)*(x2-x1) + (y2-y1)*(y2-y1));
}