// JavaScript Document
var connectedToTheRobot = false;
var navLaunched = false;
var mappingLaunched = false;

var mappingLastPose = null;
var mappingStarted = false;
var intervalMap = null;

var dockingStateLast = "not_init";

var viewer;
var gridClient;

var threshold_free = 25;
var threshold_occupied = 65;

var color_free = 255;
var color_occupied = 0;
var color_unknow = 205;

var timeoutCalcul = null;

var img;
var canvas;

var width = 0;
var height = 0;

var teleopEnable = false;

var lastRobotPose = {'X':0, 'Y':0, 'T':0 };
var mappingLastOrigin = {'x':0, 'y':0 };

var imgMappingLoaded = true;

$(document).ready(function(e) {
	
	var img = document.getElementById("install_by_step_mapping_img_map_saved");
	img.onload = function () {
		imgMappingLoaded = true;	
		InitPosCarteMapping();
		
		if (timerGetMappingInConstruction == null)
		{
			// Le timer a déjà sauté, on relance l'appel
			GetMappingInConstruction();
		}
	};
	
	wycaApi = new WycaAPI({
		host:robot_host, //192.168.1.32:9090', // host:'192.168.100.245:9090',
		use_ssl: use_ssl,
		api_key:user_api_key,
		nick:'robot',
		
		onRobotConnexionError: function(data){
			connectedToTheRobot = false;
			$('#connexion_robot').show();
		},
		onRobotConnexionOpen: function(data){
			connectedToTheRobot = true;
			$('#connexion_robot').hide();
		},
		onRobotConnexionClose: function(data){
			connectedToTheRobot = false;
			$('#connexion_robot').show();
		},
		onInitialized: function(){
		},
		onBatteryState: function(data){
			initBatteryState(data.SOC);
			initPoweredState(data.IS_POWERED);
		},
        onIsSafetyStop: function(data){
            if (data)
                $('.safety_stop').show();
            else
                $('.safety_stop').hide();
            lastEStop = data;
        },
		onNavigationIsStarted: function(data) {
			navLaunched = data;
			if (data)
			{
				$('.no_navigation').hide();
				$('.only_navigation').show();
			}
			else
			{
				$('.no_navigation').show();
				$('.only_navigation').hide();
			}
		},
		onMappingIsStarted: function(data) {
			mappingLaunched = data;
		},
		onNavigationRobotPose:function(pose){
			lastRobotPose = pose;
			InitRobotPose(pose);
		},
        onMappingRobotPoseInBuildingMap: function(data){
            mappingLastPose = {'x':parseFloat(data.X), 'y':parseFloat(data.Y), 'theta':parseFloat(data.T) };
            InitPosCarteMapping();
		},
		/*
        onMappingMapInConstruction: function(data){
			if (data.M != undefined)
			{
				if (imgMappingLoaded)
				{
					imgMappingLoaded = false;
					var img = document.getElementById("install_by_step_mapping_img_map_saved");
					img.src = 'data:image/png;base64,' + data.M;
					mappingLastOrigin = {'x':parseFloat(data.X), 'y':parseFloat(data.Y) };
				}
			}
        },
		*/
		onMappingStartResult: function(data){
            InitMappingByStep();
		},
		onNavigationStartResult: function(data){
            if (data.A != wycaApi.AnswerCode.NO_ERROR) { alert_wyca('Error navigation start ; ' + wycaApi.AnswerCodeToString(data.A)+ " " + data.M);}
		},
		onDockingState: function(data){
            if (dockingStateLast != data)
			{
				dockingStateLast = data;
            	InitDockingState();
			}
		},
		onGoToPoiResult: onGoToPoiResult,
		onGoToAugmentedPoseResult: onGoToAugmentedPoseResult,
		onGoToChargeResult: onGoToChargeResult,
		onGoToPoseResult: onGoToPoseResult,
		onMoveInProgress: function(data){
			if (data)
				$('body > header .stop_move').show();
			else
				$('body > header .stop_move').hide();
		},
		onReceviedSegmented: function(data){
			if (data.I == data.NB)
			{
				$('#modalLoading').modal('hide');
			}
			else if (data.NB > 2)
			{
				$('#modalLoading').modal('show');
				
				valeur = parseInt(data.I / data.NB * 100);
				$('#modalLoading .loadingProgress .progress-bar').css('width', valeur+'%').attr('aria-valuenow', valeur); 
			}
		}
	});
	
	
	
	wycaApi.init();	
	
	$('body > header .stop_move').click(function(e) {
        e.preventDefault();
		wycaApi.StopMove();
    });
});

var timerGetMappingInConstruction = null;
var haveReplyFromGetMappingInConstruction = false;
var liveMapping = true;

function TimeoutGetMappingInConstruction()
{
	timerGetMappingInConstruction = null;
	if (haveReplyFromGetMappingInConstruction)
	{
		// Le timer a sauté, on a déjà eu une réponse de GetMappingInConstruction, on relance l'appel
		GetMappingInConstruction();
	}
}

function GetMappingInConstruction()
{
	if (liveMapping)
	{
		haveReplyFromGetMappingInConstruction = false;
		timerGetMappingInConstruction = setTimeout(TimeoutGetMappingInConstruction, 1000);
		
		wycaApi.GetMappingInConstruction(function(data) {
			
			haveReplyFromGetMappingInConstruction = true;
			
			if (data.A == wycaApi.AnswerCode.NO_ERROR)
			{
				if (imgMappingLoaded)
				{
					imgMappingLoaded = false;
					var img = document.getElementById("install_by_step_mapping_img_map_saved");
					//img.src = 'data:image/png;base64,' + data.D.M;
					img.src = robot_http + '/mapping/last_mapping.jpg?v='+ Date.now();
					//img.src = 'http://192.168.0.30/mapping/last_mapping.jpg?v='+ Date.now();
					mappingLastOrigin = {'x':parseFloat(data.D.X), 'y':parseFloat(data.D.Y) };
				}
			}
		});
	}
}

function onGoToPoseResult(data)
{
}
function onGoToPoiResult(data)
{
}
function onGoToAugmentedPoseResult(data)
{
}
function onGoToChargeResult(data)
{
}

function InitDockingState()
{
	if (dockingStateLast == "docked")
		$('.ifDocked').show();
	else
		$('.ifDocked').hide();
	
	if (dockingStateLast == 'undocked')
		$('.ifUndocked').show();
	else
		$('.ifUndocked').hide();
		
	
	// Le jpystick s'affiche quand le robot passe de docker à dédocker, donc on recheck l'initialisation du joystick
	InitJoystick();
}

function InitJoystick()
{
	// Si un joystick est visible, on enable le telop
	if ($('.joystickDiv:visible').length > 0)
	{
		if (!teleopEnable)
		{
			teleopEnable = true;
			wycaApi.TeleopStart();
		}
	}
	else
	{
		// Sinon, on le disabled
		if (teleopEnable)
		{
			teleopEnable = false;
			wycaApi.TeleopStop();
		}
	}
}

function initPoweredState(data)
{
	$('#icoBattery').removeClass('battery-ok battery-mid');
    if (data)
	{
        $('#icoBattery').addClass('battery-ok');
	}
    else
	{
        $('#icoBattery').addClass('battery-mid');
	}
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

var robotCurrentState = '';
function initStateRobot(etat)
{
	robotCurrentState = etat;
	
	if (robotCurrentState == 'docked')
	{
		$('.ifDocked').show();
	}
	else if (robotCurrentState == 'undocked')
	{
		$('.ifUndocked').show();
	}
}

firstInitRobotPose = true;
function InitRobotPose(pose)
{
	if ($('#install_by_step_edit_map').length > 0 && ($('#install_by_step_edit_map').is(':visible') || firstInitRobotPose)) ByStepTraceRobot(pose.X, pose.Y, pose.T);
	if ($('#install_normal_edit_map').length > 0 && ($('#install_normal_edit_map').is(':visible') || firstInitRobotPose)) NormalTraceRobot(pose.X, pose.Y, pose.T);
	if ($('#manager_edit_map').length > 0 && ($('#manager_edit_map').is(':visible') || firstInitRobotPose)) ManagerTraceRobot(pose.X, pose.Y, pose.T);
	if ($('#user_edit_map').length > 0 && ($('#user_edit_map').is(':visible') || firstInitRobotPose)) UserTraceRobot(pose.X, pose.Y, pose.T);
	
	firstInitRobotPose = false
}

function InitPosCarteMapping()
{
	// On affiche 15 metre sur les 150pixels visible = 1px pour 10cm
	
	img_map_save_id = '#install_by_step_mapping_img_map_saved';
	img_map_save_contener_id = '#install_by_step_mapping';
	if ($('#install_by_step_mapping_img_map_saved').is(':visible'))
	{
		img_map_save_id = '#install_by_step_mapping_img_map_saved';
		img_map_save_contener_id = '#install_by_step_mapping';
	}
	
    originWidth = $(img_map_save_id).prop('naturalWidth') * 2;
    originHeight = $(img_map_save_id).prop('naturalHeight') * 2;
    if (originWidth > 0 && originHeight > 0) //mappingLastInfo != null)
    {
        hauteurCm = originHeight * 5;
		hauteurM = hauteurCm / 100;
		
        $(img_map_save_id).height(originHeight / 2); // 1px pour 10cm

		if (mappingLastPose != null)
		{
            posLeft = mappingLastPose.x - mappingLastOrigin.x;
            posBottom = - mappingLastPose.y + mappingLastOrigin.y;
			
			posLeft = posLeft * 10; // 1px pour 10cm
			posBottom = posBottom * 10; // 1px pour 10cm
			
			centreVueLeft = $(img_map_save_contener_id+' .mapping_view').width() / 2;
			centreVueBottom = 400;

			decallageLeft  = centreVueLeft - posLeft;
            decallageBottom  = posBottom + centreVueBottom + 3;

            $(img_map_save_id).css('left', decallageLeft);
            $(img_map_save_id).css('bottom', decallageBottom);
			
			deg = mappingLastPose.theta * 180 / Math.PI - 90;

            $(img_map_save_id).css({
		        "-webkit-transform": "rotate("+deg+"deg)",
				"-moz-transform": "rotate("+deg+"deg)",
				"transform": "rotate("+deg+"deg)",
                "transform-origin":(mappingLastPose.x - mappingLastOrigin.x)*10 + "px " + (originHeight/2 - ((mappingLastPose.y - mappingLastOrigin.y) * 10))+"px"
            });
		}
	}
}

/*
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


*/
