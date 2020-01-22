var in_visio = false;
var wycaApi;

var connectedToTheRobot = false;

var current_tracking_id = -2;
var robotCurrentState = '';
var robotFollowStarted = false;
var robotFollowState = '';

var do_reload_map = true;

var version = '';
var branch = '';
var mode_env = '';

var lastEStop = false;

var timeoutStopFollow = null;

var mappingLastPose = null;
var mappingLastInfo = null;
var mappingLastOrigin = {'x':0, 'y':0 };

var drawLaserInProgress = false;

$(document).ready(function(e) {
	
	var optionsDefault = {
		api_key:'5LGU.LaYMMncJaA0i42HwsX9ZX-RCNgj-9V17ROFXt71st',
		id_robot:3,
		//host:'elodie.wyca-solutions.com:9090', //192.168.1.32:9090', // host:'192.168.100.245:9090',
		host:'192.168.100.165:9090',
		video_element_id:'webcam_local',
		webcam_name: 'r200 nav',
		nick:'robot',
		delay_no_reply : 30,
		delay_lost_connexion : 30,
		with_audio: true,
		with_video: true,
		onSessionClosed: function (){
			in_visio = false;
		},
		onNewServerMessage: function (message){
			if (message != '' && message.message != undefined)
			{
				if (message.message.substr(0,3) != 'ACK') wycaApi.SendServerMessageToServer(message.from, 'ACK_'+message.message);
				
				data = message.message.split('|')
				switch(data[0])
				{
					case 'StartCall':
						if (!in_visio)
						{
							$('#popupRemoteControl').show();
							wycaApi.SetRoom(data[1]);
							in_visio = true;
							initStateRobot(robotCurrentState);
							wycaApi.StartWebRTC(true);
						}
						break;
					case 'CloseSession':
						break;
				}
			}
		},
		onEquipmentError: function(){
			wycaApi.StartCloseWebRTC();
			alert('No webcam or microphone');
		},
		onRobotConnexionError: function(data){
			console.log('erreur');
			$('#icoConnected i').removeClass('battery-ok battery-mid battery-ko blinking');
		    $('#icoConnected i').addClass('battery-ko blinking');
		},
		onRobotConnexionOpen: function(data){
			connectedToTheRobot = true;
			$('#icoConnected i').removeClass('battery-ok battery-mid battery-ko blinking');
			$('#icoConnected i').addClass('battery-ok');
		},
		onRobotConnexionClose: function(data){
			connectedToTheRobot = false;
			$('#icoConnected i').removeClass('battery-ok battery-mid battery-ko blinking');
		   	$('#icoConnected i').addClass('battery-ko blinking');
		},
		onInitialized: function(){
		},
        onIsPoweredChange: function(data){
            initPoweredState(data);
        },
        onSOCChange: function(data){
			initBatteryState(data);
        },
        onIsSafetyStopChange: function(data){
            if (data)
                $('.safety_stop').show();
            else
                $('.safety_stop').hide();
            lastEStop = data;
        },
        /*
		onNavigationRobotStateChange: function(data){
			initStateRobot(data);
		},
        */
	};
	
	if (typeof optionsWyca !== 'undefined')
		$.extend(true, optionsDefault, optionsDefault, optionsWyca);
	
	wycaApi = new WycaAPI(optionsDefault);
	
	wycaApi.init();	
	
	$('#bJoystickPanel').click(function(e) {
        EnableJoystick(true);
    });
	$('#bCloseJoystickPanel').click(function(e) {
        EnableJoystick(false);
    });
	$('#bOpenModalCreateMap').click(function(e) {
        EnableJoystick(true);
    });
	$('.bCloseModalCreateMap').click(function(e) {
        EnableJoystick(false);
    });
	$('#bUndockJoystick').click(function(e) {
        e.preventDefault();
		wycaApi.RobotUndock( function (r) { console.log(r);});
    });
	$('#bDockJoystick').click(function(e) {
        e.preventDefault();
		wycaApi.RobotDock( function (r) { console.log(r);});
    });
	
});

var doRefresh = 0;

/*
mappingLastPose
mappingLastInfo
*/
function InitPosCarteMapping()
{
	// On affiche 15 metre sur les 150pixels visible = 1px pour 10cm
    originWidth = $('#img_map_saved').prop('naturalWidth');
    originHeight = $('#img_map_saved').prop('naturalHeight');
    if (originWidth > 0 && originHeight > 0) //mappingLastInfo != null)
    {
        hauteurCm = originHeight * 5;
		hauteurM = hauteurCm / 100;
		
        $('#img_map_saved').height(originHeight / 2); // 1px pour 10cm
        $('#img_map_trinary_saved').height(originHeight / 2); // 1px pour 10cm

		if (mappingLastPose != null)
		{
            //console.log('Robot pose ', mappingLastPose.x, ' ', mappingLastPose.y);
            posLeft = mappingLastPose.x - mappingLastOrigin.x;
            posBottom = - mappingLastPose.y + mappingLastOrigin.y;
			
			posLeft = posLeft * 10; // 1px pour 10cm
			posBottom = posBottom * 10; // 1px pour 10cm
			
			centreVueLeft = $('#mapping_view').width() / 2;
			centreVueBottom = 50;

			decallageLeft  = centreVueLeft - posLeft;
            decallageBottom  = posBottom + centreVueBottom + 3;
			
            //console.log('decallageBottom', decallageBottom);
			
            //$('#img_map_saved_div').css('left', decallageLeft);
            //$('#img_map_saved_div').css('bottom', decallageBottom);

            $('#img_map_saved').css('left', decallageLeft);
            $('#img_map_saved').css('bottom', decallageBottom);
			
			$('#img_map_trinary_saved').css('left', decallageLeft);
            $('#img_map_trinary_saved').css('bottom', decallageBottom);

			
			deg = mappingLastPose.theta * 180 / Math.PI - 90;
            //deg = 180;
			
            $('#img_map_saved').css({
		        "-webkit-transform": "rotate("+deg+"deg)",
				"-moz-transform": "rotate("+deg+"deg)",
				"transform": "rotate("+deg+"deg)",
                "transform-origin":(mappingLastPose.x - mappingLastOrigin.x)*10 + "px " + (originHeight/2 - ((mappingLastPose.y - mappingLastOrigin.y) * 10))+"px"
            });
            $('#img_map_trinary_saved').css({
		        "-webkit-transform": "rotate("+deg+"deg)",
				"-moz-transform": "rotate("+deg+"deg)",
				"transform": "rotate("+deg+"deg)",
                "transform-origin":(mappingLastPose.x - mappingLastOrigin.x)*10 + "px " + (originHeight/2 - ((mappingLastPose.y - mappingLastOrigin.y) * 10))+"px"
            });
		}
	}
}

var intervalJoystickEnable = null;
function EnableJoystick(enable)
{
	if (enable)
	{
		if (intervalJoystickEnable == null)
		{
			intervalJoystickEnable = setInterval(SendJoystickOn, 300);
		}
	}
	else
	{
		if (intervalJoystickEnable != null)
		{
			clearInterval(intervalJoystickEnable);
			intervalJoystickEnable = null;
		}
	}
	
}

function SendJoystickOn()
{
	if (robotCurrentState == 'undocked' || robotCurrentState == '')
		wycaApi.JoystickIsSafeOff(false);
}


function initPersonnes(data)
{
	widthInitVideo = 1920;
	heightInitVideo = 1080;
	
	widthVideo = $('#divVideoFollow video').width();
	heightVideo = $('#divVideoFollow video').height();
	
	$('.marker').hide();
	
	$.each(data.persons,function(index, value){
		
		tracking_id = value.person_id.tracking_id;
		if($('#marker_'+tracking_id).length == 0)
		{
			$('#divVideoFollow').append('<div id="marker_'+tracking_id+'" class="marker" style="top:200px; left:200px;" data-id_tracking="'+tracking_id+'">'+tracking_id+'</div>');
		}
		
		$('#marker_'+tracking_id).show();
		
		posTop = value.center_of_mass.image.y * heightVideo / heightInitVideo - $('#marker_'+tracking_id).height()/2;
		posLeft = value.center_of_mass.image.x * widthVideo / widthInitVideo - $('#marker_'+tracking_id).width()/2;
		
		$('#marker_'+tracking_id).css({'top': posTop, 'left': posLeft, 'position':'absolute'});
	});
	
	if (current_tracking_id == -2)
	{
		$('.marker').removeClass('active');
		if (data.persons[0] != undefined && data.persons[0].person_id != undefined && data.persons[0].person_id.tracking_id != undefined)
			$('#marker_'+(data.persons[0].person_id.tracking_id)).addClass('active');
	}
}

function initFollowState(state)
{
	switch(state)
	{
		case "ON":
			if (timeoutStopFollow != null)
			{
				clearTimeout(timeoutStopFollow);
				timeoutStopFollow = null;
			}
			robotFollowStarted = true;
			$('#erreurFollow').hide();
			break;
		case "OFF":
			if (timeoutStopFollow != null)
			{
				clearTimeout(timeoutStopFollow);
				timeoutStopFollow = null;
			}
			robotFollowStarted = false;
			$('#erreurFollow').hide();
			break;
		case "LOST":
		case "JUMP":
			if (timeoutStopFollow != null)
			{
				clearTimeout(timeoutStopFollow);
				timeoutStopFollow = null;
			}
			$('#erreurFollow').show();
			timeoutStopFollow = setTimeout(function () { $('#player_beep').trigger("play"); StopFollow(); }, 2000);
			break;
		case "Not_selected":
			$('#erreurFollow').hide();
			break;
	}
	
	if (robotFollowStarted)
	{
		$('#bouton_startFollow').hide();
		$('#bouton_stopFollow').show();
	}
	else
	{
		$('#bouton_startFollow').show();
		$('#bouton_stopFollow').hide();
	}
}

function initStateRobot(etat)
{
	console.log('Robot state', etat);
	robotCurrentState = etat;
	
	$('#bUndockJoystick').hide();
	$('#bDockJoystick').hide();
	
	if (robotCurrentState == 'docked')
	{
		$('#bUndockJoystick').show();
	}
	else if (robotCurrentState == 'undocked')
	{
		$('#bDockJoystick').show();
	}
	
}

function initPoweredState(data)
{
    $('#icoBattery').removeClass('battery-ok battery-mid');
    if (data)
        $('#icoBattery').addClass('battery-ok');
    else
        $('#icoBattery').addClass('battery-mid');
}

function initBatteryState(data)
{
	$('#icoBattery i').removeClass('fa-battery-0 fa-battery-1 fa-battery-2 fa-battery-3 fa-battery-4');
    $('#icoBattery').removeClass('battery-ko');
    if (data < 15)
	{
		$('#icoBattery i').addClass('fa-battery-0');
		$('#icoBattery').addClass('battery-ko');
	}
	else if (data <= 25)
	{
        $('#icoBattery i').addClass('fa-battery-1');
	}
	else if (data <= 50)
	{
        $('#icoBattery i').addClass('fa-battery-2');
	}
	else if (data <= 75)
	{
        $('#icoBattery i').addClass('fa-battery-3');
	}
	else
	{
        $('#icoBattery i').addClass('fa-battery-4');
	}
	$('#icoBattery span').html(data+'%');
}
