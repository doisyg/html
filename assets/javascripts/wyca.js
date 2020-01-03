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

$(document).ready(function(e) {
	
	wycaApi = new WycaAPI({
		api_key:'5LGU.LaYMMncJaA0i42HwsX9ZX-RCNgj-9V17ROFXt71st',
		id_robot:3,
		host:'elodie.wyca-solutions.com:9090', //192.168.1.32:9090', // host:'192.168.100.245:9090',
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
		onBatteryStateChange: function(data){
			initBatteryState(data);
		},
		onCameraCustomerDetectionChange: function(data){	
			initPersonnes(data);
		},
		onFollowMeStateChange: function(data){	
			if (robotFollowState != data)
			{ 
				robotFollowState = data;
				initFollowState(data);
			}
		},
		onNavigationRobotStateChange: function(data){
			initStateRobot(data);
		},
		onSafetyDataChange: function(data){
			console.log('safety', data);
			if (data.is_safety_stop_button || data.is_safety_stop_ir || data.is_safety_logical)
				$('.safety_stop').show();
			else
				$('.safety_stop').hide();
				
			lastEStop = data.is_safety_stop_button;
		}
	});
	
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
        EnableJoystick(true);
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
	if (robotCurrentState == 'undocked')
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

function initBatteryState(data)
{
	$('#icoBattery i').removeClass('fa-battery-0 fa-battery-1 fa-battery-2 fa-battery-3 fa-battery-4');
	$('#icoBattery').removeClass('battery-ko battery-ok battery-mid');
	if (data < 15)
	{
		$('#icoBattery i').addClass('fa-battery-0');
		$('#icoBattery').addClass('battery-ko');
	}
	else if (data <= 25)
	{
		$('#icoBattery i').addClass('fa-battery-1');
		$('#icoBattery').addClass('battery-ko');
	}
	else if (data <= 50)
	{
		$('#icoBattery i').addClass('fa-battery-2');
		$('#icoBattery').addClass('battery-mid');
	}
	else if (data <= 75)
	{
		$('#icoBattery i').addClass('fa-battery-3');
		$('#icoBattery').addClass('battery-ok');
	}
	else
	{
		$('#icoBattery i').addClass('fa-battery-4');
		$('#icoBattery').addClass('battery-ok');
	}
	$('#icoBattery span').html(data+'%');
}