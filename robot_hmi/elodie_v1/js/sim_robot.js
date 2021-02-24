var wycaApi;

var connectedToTheRobot = false;

var SOC = 100;
var IS_POWERED = false;
var intervalBatteryCharging = false;
var dockingStateLast = "not_init";

var robotCurrentState = '';
var lastRobotPose = '';
var version = '';

var svgMap = false;

$(document).ready(function(e){

	wycaApi = new WycaAPI({
		
		//api_key:api_key,
		api_key:'8MXUrCTC1rTe1wBGOyNgJhMg2nVTcnB8XpTfPAFESmIHJ9',
		host:robot_host,
		
		onRobotConnexionError: function(data){
			console.log('erreur');
			
		},
		onRobotConnexionOpen: function(data){
			connectedToTheRobot = true;
			
		},
		onRobotConnexionClose: function(data){
			connectedToTheRobot = false;
			
		},
		onInitialized: function(){
			
		},
		onBatteryState: function(data){
			if(data.SOC != SOC || data.IS_POWERED != IS_POWERED)
				refreshBattery(data);
		},
		onDockingState: function(data){
            if (dockingStateLast != data)
			{
				dockingStateLast = data;
            	refreshDockingState();
			}
		},
		onNavigationRobotPose:function(pose){
			lastRobotPose = pose;
		},
		onNavigationStateChange: function(data) {
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
		}
	
	});
	wycaApi.init();
	initMap();
})


var id_site = -1;
var name_site = '';

function initMap(){
	if (wycaApi.websocketAuthed)
	{
		wycaApi.GetCurrentSite(function(data){
			if (data.A == wycaApi.AnswerCode.NO_ERROR){
				
				name_site = data.D.name;
				$('#site_name').html(name_site);
				id_site = data.D.id_site;
				wycaApi.GetCurrentMapComplete(function(data) {
					if (data.A == wycaApi.AnswerCode.NO_ERROR)
					{
						console.log(data.D); 
						id_map = data.D.id_map;
						id_map_last = data.D.id_map;
						
						forbiddens = data.D.forbiddens;
						areas = data.D.areas;
						gommes = Array();
						docks = data.D.docks;
						pois = data.D.pois;
						augmented_poses = data.D.augmented_poses;
						
						ros_largeur = data.D.ros_width;
						ros_hauteur = data.D.ros_height;
						ros_resolution = data.D.ros_resolution;
						
						$('#install_normal_edit_map_svg').attr('width', data.D.ros_width);
						$('#install_normal_edit_map_svg').attr('height', data.D.ros_height);
						
						//console.log(
						
						//$('#install_normal_edit_map_image').attr('width', data.D.ros_width);
						//$('#install_normal_edit_map_image').attr('height', data.D.ros_height);
						
						$('#install_normal_edit_map_image').attr('width', $('#map').outerWidth());
						$('#install_normal_edit_map_image').attr('height', $('#map').outerHeight()*0.95);
						$('#install_normal_edit_map_image').attr('xlink:href', 'data:image/png;base64,'+data.D.image_tri);
						
						svgMap= document.querySelector('#install_normal_edit_map_svg');
						
						setTimeout(function(){
							if($('html').scrollTop() < $("#dashboard").offset().top)
								$('html, body').animate({scrollTop: $("#dashboard").offset().top}, 1000)}
						,1000)
						
					}else{
						alert('Error getting current Map');
					}
				})
			}else{
				alert('Error getting current site',data.A,data.M);
			}
		})
	}
	else
	{
		setTimeout(initMap, 500);
	}
	
}

function refreshBattery(data){
	SOC = data.SOC;
	IS_POWERED = data.IS_POWERED;
	let targetIcon = $('#battery_widget i');
	let targetTxt = $('#battery_lvl');
	targetTxt.html(SOC);
	
	if(!IS_POWERED){
		//REMOVE CLASSES
		targetIcon.removeClass('fa-battery-empty').removeClass('fa-battery-quarter').removeClass('fa-battery-half').removeClass('fa-battery-three-quarters').removeClass('fa-battery-full').removeClass('battery-charging');
		
		if (SOC < 15)
		{
			targetIcon.addClass('fa-battery-empty');
		}
		else if (SOC <= 25)
		{
			targetIcon.addClass('fa-battery-quarter');
		}
		else if (SOC <= 50)
		{
			targetIcon.addClass('fa-battery-half');
		}
		else if (SOC <= 75)
		{
			targetIcon.addClass('fa-battery-three-quarters');
		}
		else
		{
			targetIcon.addClass('fa-battery-full');
		}
		//DESTROY INTERVAL ANIM CHARGE
		if(intervalBatteryCharging != false){
			clearInterval(intervalBatteryCharging)
			intervalBatteryCharging = false;
		}
	}else{
		if(intervalBatteryCharging == false){
			animBatteryCharging();
		}
	}
}

function animBatteryCharging(){
	let targetIcon = $('#battery_widget i');
	targetIcon.addClass('battery-charging');
	
	if (targetIcon.hasClass('fa-battery-empty'))
	{
		targetIcon.removeClass('fa-battery-empty');
		targetIcon.addClass('fa-battery-quarter');
	}
	else if (targetIcon.hasClass('fa-battery-quarter'))
	{
		targetIcon.removeClass('fa-battery-quarter');
		targetIcon.addClass('fa-battery-half');
	}
	else if (targetIcon.hasClass('fa-battery-half'))
	{
		targetIcon.removeClass('fa-battery-half');
		targetIcon.addClass('fa-battery-three-quarters');
	}
	else if (targetIcon.hasClass('fa-battery-three-quarters'))
	{
		targetIcon.removeClass('fa-battery-three-quarters');
		targetIcon.addClass('fa-battery-full');
	}
	else if (targetIcon.hasClass('fa-battery-full'))
	{
		targetIcon.removeClass('fa-battery-full');
		
		if (SOC < 25)
		{
			targetIcon.addClass('fa-battery-empty');
		}
		else if (SOC <= 50)
		{
			targetIcon.addClass('fa-battery-quarter');
		}
		else if (SOC <= 75)
		{
			targetIcon.addClass('fa-battery-half');
		}
		else if (SOC <= 100)
		{
			targetIcon.addClass('fa-battery-three-quarters');
		}
	}
	if(intervalBatteryCharging == false){
		intervalBatteryCharging = setInterval(animBatteryCharging,1000);
	}
}

function refreshDockingState(){
	$('#docking_state_widget .docking_state').removeClass('active');
	if(dockingStateLast != 'not_init'){
		$('#docking_state_widget .docking_state#'+dockingStateLast).addClass('active');
	}
}