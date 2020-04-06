// JavaScript Document
var connectedToTheRobot = false;
var navLaunched = false;
var mappingLaunched = false;

var mappingLastPose = null;
var mappingStarted = false;
var intervalMap = null;

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

var mappingLastOrigin = {'x':0, 'y':0 };

$(document).ready(function(e) {
	wycaApi = new WycaAPI({
		host:robot_host, //192.168.1.32:9090', // host:'192.168.100.245:9090',
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
        onIsPowered: function(data){
            initPoweredState(data);
        },
        onRelativeSOCPercentage: function(data){
			initBatteryState(data);
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
            mappingLastPose = data;
            InitPosCarteMapping();
		},
        onMappingMapInConstruction: function(data){
            var img = document.getElementById("install_by_step_mapping_img_map_saved");
            img.src = 'data:image/png;base64,' + data.map_trinary;
            mappingLastOrigin = {'x':data.x_origin, 'y':data.y_origin };
        }
	});
	
	
	wycaApi.init();	
});

function initPoweredState(data)
{
	$('#icoBattery').removeClass('battery-ok battery-mid');
    if (data)
	{
		$('.ifDocked').show();
		$('.ifUndocked').hide();
        $('#icoBattery').addClass('battery-ok');
	}
    else
	{
		$('.ifDocked').hide();
		$('.ifUndocked').show();
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
		$('.idUndocked').show();
	}
	
}


function InitRobotPose(pose)
{
	/*
	x =  (pose.x - 0.25) * 100 / 5;
	y = an_ros_hauteur - (pose.y + 0.25) * 100 / 5;
	
	x2 =  (pose.x) * 100 / 5;
	y2 = an_ros_hauteur - (pose.y) * 100 / 5;
	
	
	$('#an_robot').attr('x', x);
	$('#an_robot').attr('y', y);
	$('#an_robot').attr('transform', 'rotate('+(180 - pose.theta *  180 / Math.PI - 90) +', '+x2+', '+y2+')');
	*/
	
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
	
    originWidth = $(img_map_save_id).prop('naturalWidth');
    originHeight = $(img_map_save_id).prop('naturalHeight');
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

function SendJoystickOn()
{
	if (robotCurrentState == 'undocked' || robotCurrentState == '')
		wycaApi.TeleopOff(false);
}
*/
