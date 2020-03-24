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

var navLaunched = false;
var mappingLaunched = false;

var lastRobotPose = { 'x':0, 'y':0, 'theta':0 }

var an_confirm_action = '';
var an_confirm_details = '';

var canvas_an_plan = null;
		

var vh = window.innerHeight * 0.01;
document.documentElement.style.setProperty('--vh', vh+'px');

window.addEventListener('resize', () => {
  // We execute the same script as before
  vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', vh+'px');
});

$(document).ready(function(e) {
	
	var optionsDefault = {
		host:robot_host, //192.168.1.32:9090', // host:'192.168.100.245:9090',
		api_key:user_api_key,
		nick:'robot',
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
		}
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
	
	$('#bDevStartNav').click(function(e) {
        e.preventDefault();
		wycaApi.NavigationStart(false, function(r) {
			if (!r.success) alert(r.message);
		});
    });
	
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
		wycaApi.Undock( function (r) { console.log(r);});
    });
	$('#bDockJoystick').click(function(e) {
        e.preventDefault();
		wycaApi.Dock(-1, function (r) { console.log(r);});
    });
	$('#bGotoAutonomousNavigation').click(function(e) {
        e.preventDefault();
		$('#modalAutonomousNavigation').modal('show');
		
		setTimeout(function() {
		window.panZoomAn = svgPanZoom('#an_svg', {
			  zoomEnabled: true
			, controlIconsEnabled: false
			, maxZoom: 20
			, fit: 1
			, center: 1
			, customEventsHandler: an_eventsHandler
			, RefreshMap: function() { setTimeout(an_RefreshZoomView, 10); }
			});
		an_svg = document.querySelector('#an_svg .svg-pan-zoom_viewport');
		an_AppliquerZoom();
		an_RefreshZoomView();
		}, 200);
		
    });
	
	$(document).on('click', '#an_svg .poi_elem', function(e) {
		anClickOnElement = true;
		
		currentPoiIndex = AnGetPoiIndexFromID($(this).data('id_poi'));
		poi = an_pois[currentPoiIndex];
		
		an_confirm_action = 'goto_poi';
		an_confirm_details = {x:parseFloat(poi.x_ros), y:parseFloat(poi.y_ros), theta:parseFloat(poi.t_ros)};
		console.log(an_confirm_details);
		x =  (an_confirm_details.x - 0.25) * 100 / 5;
		y = an_ros_hauteur - (an_confirm_details.y + 0.25) * 100 / 5;
		
		x2 =  (an_confirm_details.x) * 100 / 5;
		y2 = an_ros_hauteur - (an_confirm_details.y) * 100 / 5;
		console.log(x, y);
		$('#an_robot_dest').attr('x', x);
		$('#an_robot_dest').attr('y', y);
		$('#an_robot_dest').attr('transform', 'rotate('+(180 - an_confirm_details.theta *  180 / Math.PI - 90) +', '+x2+', '+y2+')');
		$('#an_robot_dest').show();
		
		$('#an_confirm').show();
	});
	
	$(document).on('click', '#an_svg .dock_elem', function(e) {
		console.log('TODO click dock');
		anClickOnElement = true;
		
		an_confirm_action = 'goto_dock';
		an_confirm_details = '';
		
		$('#an_confirm').show();
	});
	
	$(document).on('click', '#an_svg', function(e) {
		if (anClickOnElement)
		{
			anClickOnElement = false;
		}
		else
		{
			an_confirm_action = 'goto_pose';
			
			p = $('#an_svg #an_plan').position();
			x = e.pageX - p.left;
			y = e.pageY - p.top;
			
			x_in_map = parseInt(x * zoom);
			y_in_map = parseInt(y * zoom);
			
			x = x * zoom;
			y = an_ros_hauteur - (y * zoom);
			
			xRos = x * an_ros_resolution / 100;
			yRos = y * an_ros_resolution / 100;
			
			console.log('check');
			not_allow = !CheckAllowPose(x_in_map, y_in_map);
			if (not_allow) console.log('not allow');
			
			
			an_confirm_details = {x:parseFloat(xRos), y:parseFloat(yRos), theta:parseFloat(0)};
			
			x =  (an_confirm_details.x - 0.25) * 100 / 5;
			y = an_ros_hauteur - (an_confirm_details.y + 0.25) * 100 / 5;
			
			x2 =  (an_confirm_details.x) * 100 / 5;
			y2 = an_ros_hauteur - (an_confirm_details.y) * 100 / 5;
			
			$('#an_robot_dest').attr('x', x);
			$('#an_robot_dest').attr('y', y);
			$('#an_robot_dest').attr('transform', 'rotate('+(180 - an_confirm_details.theta *  180 / Math.PI - 90) +', '+x2+', '+y2+')');
			$('#an_robot_dest').show();
			
			$('#an_confirm').show();
		}
	});
	
	$('#an_confirm_no').click(function(e) {
        e.preventDefault();
		
		an_confirm_action = '';
		an_confirm_details = '';
		
		$('#an_robot_dest').hide();
		$('#an_confirm').hide();
    });
	
	$('#an_confirm_yes').click(function(e) {
        e.preventDefault();
		
		switch(an_confirm_action)
		{
			case 'goto_poi':
				wycaApi.GoToPose(an_confirm_details.x, an_confirm_details.y, an_confirm_details.theta);
				break;
			case 'goto_dock':
				alert('Not available for the moment');
				break;
			case 'goto_pose':
				wycaApi.GoToPose(an_confirm_details.x, an_confirm_details.y, an_confirm_details.theta);
				break;
		}
		
		an_confirm_action = '';
		an_confirm_details = '';
		
		$('#an_robot_dest').hide();
		$('#an_confirm').hide();
    });
	
});

var anClickOnElement

var doRefresh = 0;

/*
mappingLastPose
mappingLastInfo
*/

function CheckAllowPose(x_img, y_img)
{
	if (canvas_an_plan == null)
	{
		img = document.getElementById('an_plan_fond');
		canvas_an_plan = document.createElement('canvas');
		canvas_an_plan.width = img.width;
		canvas_an_plan.height = img.height;
		console.log(img.width);
		canvas_an_plan.getContext('2d').drawImage(img, 0, 0, img.width, img.height);    
	}
	
	// On checl un carré de 12 sur 12 (60cm par 60cm
	console.log(x_img, y_img);
	not_allow = false;
	
	for(i = x_img - 7; i<= x_img + 7; i++)
	{
		for(j = y_img - 7; j<= y_img + 7; j++)
		{
			if (i <= x_img - 7) 
			{
				if (j < y_img - 4) continue;
				if (j > y_img + 4) continue;
			}
			if (i <= x_img - 6) 
			{
				if (j < y_img - 5) continue;
				if (j > y_img + 5) continue;
			}
			if (i <= x_img - 5) 
			{
				if (j < y_img - 6) continue;
				if (j > y_img + 6) continue;
			}
			
			if (i <= x_img + 7) 
			{
				if (j < y_img - 4) continue;
				if (j > y_img + 4) continue;
			}
			if (i <= x_img + 6) 
			{
				if (j < y_img - 5) continue;
				if (j > y_img + 5) continue;
			}
			if (i <= x_img + 5) 
			{
				if (j < y_img - 6) continue;
				if (j > y_img + 6) continue;
			}
			pixelData = canvas_an_plan.getContext('2d').getImageData(i, j, 1, 1).data;
			if (pixelData[0] == 0)
			{
				console.log(i, j, pixelData);
				return false;
			}
		}
	}
	
	return true;
}

console.log('Init pose theta');
function InitRobotPose(pose)
{
	x =  (pose.x - 0.25) * 100 / 5;
	y = an_ros_hauteur - (pose.y + 0.25) * 100 / 5;
	
	x2 =  (pose.x) * 100 / 5;
	y2 = an_ros_hauteur - (pose.y) * 100 / 5;
	
	$('#an_robot').attr('x', x);
	$('#an_robot').attr('y', y);
	$('#an_robot').attr('transform', 'rotate('+(180 - pose.theta *  180 / Math.PI - 90) +', '+x2+', '+y2+')');
	
}

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
			centreVueBottom = 400;

			decallageLeft  = centreVueLeft - posLeft;
            decallageBottom  = posBottom + centreVueBottom + 3;
			
            //console.log('decallageBottom', decallageBottom);
			
            //$('#img_map_saved_div').css('left', decallageLeft);
            //$('#img_map_saved_div').css('bottom', decallageBottom);

            $('#img_map_saved').css('left', decallageLeft);
            $('#img_map_saved').css('bottom', decallageBottom);
			
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
		wycaApi.TeleopOff(false);
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
