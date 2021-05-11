var JoystickDebug = false;
var isManette = false;
/* DYNAMICS VAR */
var widthCurseurJoystick = 104;
var heightCurseurJoystick = 104;
var widthFondJoystick = 224;
var heightFondJoystick = 224;
var offset = null;
var xCentre = (widthFondJoystick/2);
var yCentre = (heightFondJoystick/2);

var xCentreCurseur = 60;
var yCentreCurseur = 60;

var vitesseAngulaire = 0;
var vitesseX = 0
var vitesse = 0;
var angle = 0;

var nbCall = 0;
var nbCall0 = 0;
var lastValueX = 0;
var lastValueY = 0;
var isDown = false;
var teleopSafe = true;

var delayPublish = 200;
var intervalSendCommande = null;

function initJoystick(){
	
	haveJoystick = false;
	
	if ($('.joystickDiv:visible').length > 0)
	{
		offset = $('.joystickDiv:visible').offset();
		haveJoystick = true;
	}
	else if ($('.joystickDiv').length > 0)
	{
		offset = $('.joystickDiv').offset();
		haveJoystick = true;
	}
	
	if (haveJoystick)
	{
		widthCurseurJoystick = $('.joystickDiv > .curseur' ).css('width').substr(0,$('.joystickDiv > .curseur' ).css('width').length-2);
		heightCurseurJoystick = $('.joystickDiv > .curseur' ).css('height').substr(0,$('.joystickDiv > .curseur' ).css('height').length-2);
		
		widthFondJoystick = $('.joystickDiv > .fond' ).css('width').substr(0,$('.joystickDiv > .fond' ).css('width').length-2);
		heightFondJoystick = $('.joystickDiv > .fond' ).css('height').substr(0,$('.joystickDiv > .fond' ).css('height').length-2);
		
		xCentre = (widthFondJoystick/2) + offset.left;
		yCentre = (heightFondJoystick/2) + offset.top;

		xCentreCurseur = widthCurseurJoystick/2;
		yCentreCurseur = heightCurseurJoystick/2;
		
		SetCurseurV2(xCentre, yCentre);
	}
	
	return haveJoystick;
}

window.onresize = initJoystick;

$(document).ready(function(e) {
	
	/* INIT VARIABLES */
	initJoystick();
	
	$('.joystickDiv .curseur').mousedown(function(e){
		e.preventDefault();
		teleopSafe = $(this).hasClass('withoutForbidden')? false:true;
		isDown = true;
		SetCurseurV2(e.pageX, e.pageY);
	});
	
	$(document).mouseup(function(e) {
		if(isDown)
		{
			teleopSafe = true;
			isDown = false;
			SetCurseurV2(xCentre, yCentre);
		}
	});
	
	$(document).mousemove(function(e) {
		if(isDown)
		{
			SetCurseurV2(e.pageX, e.pageY);
		
			if (intervalSendCommande == null)
				intervalSendCommande = setInterval(SendCommande, delayPublish);
		}
	});
	
	$('.joystickDiv .curseur').on('touchmove', function(e){
		isDown = true;
		teleopSafe = $(this).hasClass('withoutForbidden')? false:true;
		SetCurseurV2((event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX), (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY));
		
		if (intervalSendCommande == null)
			intervalSendCommande = setInterval(SendCommande, delayPublish);
		
	});
	
	$(document).on('touchend', function(e) {
		if(isDown)
		{
			teleopSafe = true;
			isDown = false;
			SetCurseurV2(xCentre, yCentre);
		}
	});
	
	$('.joystickDiv').on('touchmove', function(e) {
		if(isDown)
		{
			e.preventDefault();
			SetCurseurV2((event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX), (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY));
		}
	});
	
	$(document).on('touchcancel', function(e) {
		if(isDown)
		{
			teleopSafe = true;
			isDown = false;
			SetCurseurV2(xCentre, yCentre);
		}
	});
});	

function SetInterfaceManette()
{
	isManette = true;
}

function SetVitesse(v)
{
	vitesse = v * 100;
}

function SetCurseurV2(x, y)
{	
	d = distanceJoystick (x, y, xCentre, yCentre);
	
	if ($('.joystickDiv:visible').length > 0)
	{
		offset = $('.joystickDiv:visible').offset();
	}
	else if ($('.joystickDiv').length > 0)
	{
		offset = $('.joystickDiv').offset();
	}
	
	marginLeft = offset.left;
	marginTop = offset.top;
	xCentre = (widthFondJoystick/2) + marginLeft;
	yCentre = (heightFondJoystick/2) + marginTop;
	
	if (d < 34)
	{
		
		cssLeft = (x-xCentreCurseur-marginLeft)+'px';
		cssTop  = (y-yCentreCurseur-marginTop) +'px';
		$('.joystickDiv:visible .curseur').css({'left': cssLeft, 'top': cssTop });
		vitesseAngulaire = yCentre-y;
		vitesseX = xCentre-x;
	}
	else
	{
			
		xCentre = widthFondJoystick/2 + marginLeft;
		yCentre = heightFondJoystick/2 + marginTop; 
		
		//OLD 
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
	
		/*
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
		
		cssLeft = (xt2-xCentreCurseur)+'px';
		cssTop  = (yt2-yCentreCurseur) +'px';
		
		$('.joystickDiv:visible .curseur').css({'left': cssLeft , 'top': cssTop});
		*/
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
		
	//wycaApi.Teleop(valueY * -0.5, valueX * -0.8);
}

function SendCommande()
{
	//if (robotCurrentState != 'undocked' || (lastValueX == 0 && lastValueY == 0))
	if (connectedToTheRobot)
	{
		if ((lastValueX == 0 && lastValueY == 0))
		{
			if (nbCall0 < 5)
			{
				nbCall0++;
				if(teleopSafe)
					wycaApi.Teleop(lastValueX * -0.7, lastValueY * -1.2);
				else
					wycaApi.TeleopPasSafe(lastValueX * -0.7, lastValueY * -1.2);
				if(JoystickDebug){
					console.log('Wyca Teleop X Z');
					console.log(Date.now(),lastValueX * -0.7, lastValueY * -1.2);
				}
			}
			else
			{
				clearInterval(intervalSendCommande);
				intervalSendCommande = null;
			}
		}
		else if (isDown)
		{
			nbCall0 = 0;
			if(teleopSafe)
				wycaApi.Teleop(lastValueX * -0.7, lastValueY * -1.2);
			else
				wycaApi.TeleopPasSafe(lastValueX * -0.7, lastValueY * -1.2);
			if(JoystickDebug){
				console.log('Wyca Teleop X Z');
				console.log(Date.now(),lastValueX * -0.7, lastValueY * -1.2);
			}
		}
	}
}

function distanceJoystick(x1, y1, x2, y2)
{
	return Math.sqrt( (x2-x1)*(x2-x1) + (y2-y1)*(y2-y1));
}
