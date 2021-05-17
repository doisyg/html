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
		api_key:'key_idl',
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
			wycaApi.GetTopPersistanteDataStorage(function(data){
				console.log(data)
				if(data.D != ''){
					navSegments = JSON.parse(data.D);
					saveNavSegments();
				}
			})

		},
		onMapUpdated: function(){
			initMap();
		},
		onMoveInProgress: function(data){
			if(data){
				$('#tActionInProgess').show();
				$('.bSetNavSegment').addClass('disabled');
				$('#bStartNavSegment').addClass('disabled');
			}
			else{
				$('#tActionInProgess').hide();
				$('.bSetNavSegment').removeClass('disabled');
				$('#bStartNavSegment').removeClass('disabled');
			}
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
			$('#robot_position').html(JSON.stringify(lastRobotPose));
			if(robot_traced)
				TraceRobot(lastRobotPose);
		},
		onNavigationStateChange: function(data) {
			
		},
		onCaptureSegmentFeedback: function(data) {
			console.log('onCaptureSegmentFeedback', data);
			$('#navsegment_feedback').html($('#navsegment_feedback').html() + data.M + '<br>');
		},
		onCaptureSegmentResult: function(data) {
			console.log('onCaptureSegmentResult', data);
			$('#navsegment_result').html(wycaApi.AnswerCodeToString(data.A) + '<br>' + data.M + '<br>');
			
			
		}
	
	});
	wycaApi.init();
	initMap();
	
	
	$('#bStartNavSegment').click(function(e) {
        e.preventDefault();
		
		$('#navsegment_feedback').html('');
		$('#navsegment_result').html('');
		$('#navsegment_response').html('');
		
	
		wycaApi.CaptureSegment(
			$("#segment_id").val(),
			parseFloat($("#start_x").val()),
			parseFloat($("#start_y").val()),
			parseFloat($("#end_x").val()),
			parseFloat($("#end_y").val()),
			parseFloat($("#step_distance").val()), function(data) {
				$('#navsegment_response').html(wycaApi.AnswerCodeToString(data.A) + '<br>' + data.M + '<br>');
			});
		
    });
	
	$('#bSaveNavSegment').click(function(e) {
        e.preventDefault();
		let segment = {"segment_id":$("#segment_id").val(),"start_x":parseFloat($("#start_x").val()),"start_y":parseFloat($("#start_y").val()),"end_x":parseFloat($("#end_x").val()),"end_y":parseFloat($("#end_y").val()),"step_distance":parseFloat($("#step_distance").val()),};
		navSegments.push(segment);
		saveNavSegments();
    });
	
	$( ".list_segment" ).on( 'click', '.bDeleteNavSegment', function(e) {
		e.preventDefault();
		let index = $(this).parent().attr('id');
		/*
		let id = $(this).parent().find('span.unique_id_string').html();
		let index = -1;
		navSegments.forEach((element,idx) => {index = element.segment_id == id ? idx : index});*/
		
		if(index != -1){
			navSegments.splice(index,1);
			saveNavSegments();
		}
	})
	
	$( ".list_segment" ).on( 'click', '.bSetNavSegment', function(e) {
		e.preventDefault();
		
		let index = $(this).parent().attr('id');
		
		/*
		let id = $(this).parent().find('span.unique_id_string').html();
		let index = -1;
		navSegments.forEach((element,idx) => {index = encodeHTML(element.segment_id) == id ? idx : index});
		*/
		if(index != -1){
			let segment = navSegments[index];
			$("#segment_id").val(segment.segment_id);
			$("#start_x").val(parseFloat(segment.start_x));
			$("#start_y").val(parseFloat(segment.start_y));
			$("#end_x").val(parseFloat(segment.end_x));
			$("#end_y").val(parseFloat(segment.end_y));
			$("#step_distance").val(parseFloat(segment.step_distance));
			$('#bStartNavSegment').click();
		}
	})
	
})

var navSegments = [];
var id_site = -1;
var name_site = '';

function encodeHTML(str) {
  const code = {
      ' ' : '&nbsp;',
      '¢' : '&cent;',
      '£' : '&pound;',
      '¥' : '&yen;',
      '€' : '&euro;', 
      '©' : '&copy;',
      '®' : '&reg;',
      '<' : '&lt;', 
      '>' : '&gt;',  
      '"' : '&quot;', 
      '&' : '&amp;',
      '\'' : '&apos;'
  };
  return str.replace(/[\u00A0-\u9999<>\&''""]/gm, (i)=>code[i]);
}
function saveNavSegments(){
	
	$('.list_segment').html('');
	navSegments.forEach(function(item,idx){
		$('.list_segment').append('' +
		'<li id="'+idx+'">'+
		'	<span class="unique_id_string">'+item.segment_id+'</span>'+
		'	<a href="#" class="flex-centered btn btn-sm btn-circle btn-danger pull-right bDeleteNavSegment"><i class="fa fa-trash fa-2x text-white"></i></a>'+
		'	<a href="#" class="flex-centered btn btn-sm btn-circle btn-primary pull-right bSetNavSegment" style="margin-right:5px;"><i class="fa fa-play fa-2x text-white"></i></a>'+
		'</li>'
		);
	})

	wycaApi.SetTopPersistanteDataStorage(JSON.stringify(navSegments),function(data){
		if (data.A != wycaApi.AnswerCode.NO_ERROR){
			alert('Error on saving navSegments on Top Data',data.A,data.M);
		}
	});
}

function initMap(){
	$('#loader_map').show();
	$('#map_svg').hide();
	
	if (wycaApi.websocketAuthed)
	{
		$('#map_svg').children('.map_elem').remove();
		if(robot_traced)
			robot_traced = false;
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
						
						div_height = $('#map').outerHeight();
						div_width = $('#map').outerWidth();
						
						svg_resolution = div_height / ros_hauteur ;
						
						let temp_width = ros_largeur * svg_resolution;
						
						if(temp_width > div_width)
							svg_resolution = svg_resolution * div_width / temp_width;
						
						offset_image_x = ros_largeur * svg_resolution < div_width ? (div_width - ros_largeur * svg_resolution)/2 : 0;
						offset_image_y = ros_hauteur * svg_resolution < div_height ? (div_height - ros_hauteur * svg_resolution)/2 : 0;
							
						
						$('#map_svg').attr('width',$('#map').outerWidth());
						$('#map_svg').attr('height',$('#map').outerHeight());
						
						$('#map_image').attr('width', ros_largeur * svg_resolution);
						$('#map_image').attr('height', ros_hauteur * svg_resolution);
						$('#map_image').attr('x', offset_image_x);
						$('#map_image').attr('y', offset_image_y);
						$('#map_image').attr('xlink:href', 'data:image/png;base64,'+data.D.image_tri);
						
						svg_resolution_width = svg_resolution;
						svg_resolution_height = svg_resolution;
						svgMap = document.querySelector('#map_svg');
						TraceRobot(lastRobotPose);
						DrawMapElements();
						setTimeout(function(){
							$('#loader_map').hide();
							$('#map_svg').show();
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
	if(dockingStateLast == 'docked' || dockingStateLast == 'undocked' || dockingStateLast == 'docking' || dockingStateLast == 'unocking'){
		$('#docking_state_widget .docking_state#'+dockingStateLast).addClass('active');
	}
}
