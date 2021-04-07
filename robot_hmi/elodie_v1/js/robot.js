var in_visio = false;
var wycaApi;

var retryGotoDock = false;

var connectedToTheRobot = false;

var demandeStop = false;

var robotCurrentState = '';

var version = '';
var branch = '';
var mode_env = '';

var lastEStop = false;

var nbDockAttempt = 0;

var timeoutRetryDock = null;
var robotMoveToDock = false;

var loaded = true;
var gotoPoiInProgress = false;

var actionListInProgress = false;

var codeSaisie = "";


/* SIM VARS */

var SOC = 100;
var IS_POWERED = false;
var POWER_STATUT = false;
var intervalBatteryCharging = false;
var dockingStateLast = "not_init";

var lastRobotPose = '';
var version = '';

var svgMap = false;

var LED = {anim:1,r:255,g:0,b:0,speedleft:0,speedright:0};
/* SIM VARS */

$(document).ready(function(e) {

	wycaApi = new WycaAPI({
		
		api_key:api_key,
		host:robot_host,
		use_ssl:use_ssl,
		
		onRobotConnexionError: function(data){
			console.log('erreur');
			$('#connection').removeClass('battery-ok battery-mid battery-ko blinking');
		    $('#connection').addClass('battery-ko blinking');
		},
		onRobotConnexionOpen: function(data){
			connectedToTheRobot = true;
			$('#connection').removeClass('battery-ok battery-mid battery-ko blinking');
			$('#connection').addClass('battery-ok');
		   
			$('.voyant').hide();
			$('#voyany_vert').show();
		},
		onRobotConnexionClose: function(data){
			connectedToTheRobot = false;
			$('#connection').removeClass('battery-ok battery-mid battery-ko blinking');
		   	$('#connection').addClass('battery-ko blinking');
		},
		onInitialized: function(){
			
		},
		onGlobalVehiculePersistanteDataStorageUpdated : function(){
			RefreshConfigs();
		},
		onGoToPoiResult: function(data){
			queueState = 'done';
			gotoPoiInProgress = false;
			actionListInProgress = false;
			if (currentBatteryState < dataStorage.min_goto_charge)
			{
				if (!robotMoveToDock && robotCurrentState == 'undocked')
				{
					$('#current_action').html('Low battery, go to dock');
					// On stop tout et on envoi le robot se docker
					robotMoveToDock = true; 
					wycaApi.GoToCharge(-1,	ResultSendToDockDemand);
				}
				else
				{
					if (robotCurrentState == 'docked')
						$('#current_action').html('Low battery, charging');
				}
			}
			else
				NextAction();
		},
		onGoToChargeResult: function(data){
			ResultSendToDock(data);
		},
		onBatteryState: function(data){
			initBatteryState(data.SOC);
			initPoweredState(data.IS_POWERED);
			/* SIMU MODE */
			if(is_simu)
				if(data.SOC != SOC || data.IS_POWERED != IS_POWERED)
					refreshBattery(data);
			/* SIMU MODE */
		},
        onIsSafetyStop: function(data){
            if (data)
                $('.safety_stop').show();
            else
                $('.safety_stop').hide();
            lastEStop = data;
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
		},
		
		/* SIMU MODE */
		onMapUpdated: function(){
			if(is_simu)
				initMap();
		},
		
		onMoveInProgress: function(data){
			if(data)
				$('#tActionInProgess').show();
			else
				$('#tActionInProgess').hide();
		},
		onDockingState: function(data){
			console.log('Docking State',data,'current',dockingStateLast);
            if (dockingStateLast != data)
			{
				dockingStateLast = data;
            	refreshDockingState();
			}
		},
		onLedStateControl : function(data){
           LED = data;
		},
		
		onNavigationRobotPose:function(pose){
			lastRobotPose = pose;
			if(typeof(robot_traced) != 'undefined' && robot_traced)
				TraceRobot(lastRobotPose);
		}
	});
	
	wycaApi.init();	
	/* SIMU MODE */ 
	if(is_simu)
		initMap(); 
	/* SIMU MODE */
	/* DEMO MODE */
	
	RefreshConfigs();
	
	$('#bNextWaitClick').click(function(e) {
        e.preventDefault();
		queueState = 'done';
		$('#waitClick').hide();
		NextAction();
    });
	
	$('#bHideBouton').click(function(e) {
        e.preventDefault();
		$('#modalAskCode').modal('show');
    });
	
	$('#clavier_code .touche').click(function(e) {
		if ($(this).hasClass('backspace'))
		{
			if (codeSaisie.length > 0)
			{
				codeSaisie = codeSaisie.substr(0, codeSaisie.length-1);
				$('#code_aff').html($('#code_aff').html().substr(0, $('#code_aff').html().length-1));
				
				if (codeSaisie.length == 0)
					$('#connexionCode').prop( "disabled", true );
			}
			else
			{
				$('#connexionCode').prop( "disabled", true );
			}
		}
		else
		{
			codeSaisie += $(this).html();
			$('#code_aff').html($('#code_aff').html() + "*");
			
			$('#connexionCode').prop( "disabled", false );
		}
	});
	
	$('#cancelCode').click(function(e) {
		e.preventDefault();
		$('#ConfigCodeError').hide();
		HideCode();
	});
		
	$('#connexionCode').click(function(e) {
		e.preventDefault();
		$('#ConfigCodeError').hide();
				
		jQuery.ajax({
			url: 'com_to_server/check_code.php',
			type: "post",
			data: { 
					'code': codeSaisie
				},
			error: function(jqXHR, textStatus, errorThrown) {
					$('#connexionConfig').show();
				},
			success: function(data, textStatus, jqXHR) {
					if (data=='ok')
					{
						$('#modalAskCode').modal('hide');
						$('#modalAdmin').modal('show');
					}
					else
					{
						$('#ConfigCodeError').show();
					}
					
					codeSaisie = '';
					$('#code_aff').html('&nbsp;');
					
					$('#connexionCode').prop( "disabled", true );
				}
		});
	});
	
	$('#bRestartWindows').click(function(e) {
        e.preventDefault();
		wycaApi.DoBrowserRestart(false);
    });
	
	$('#bRestartKiosk').click(function(e) {
        e.preventDefault();
		wycaApi.DoBrowserRestart(true);
    });
	
	/* DEMO MODE */
});

/* DEMO MODE */
function RetryDock()
{
	if (timeoutRetryDock != null)
	{
		clearTimeout(timeoutRetryDock);
		timeoutRetryDock = null;
	}
	robotMoveToDock = true;
	//RefreshDisplayRobotMoveToDock();
	wycaApi.GoToCharge(-1, ResultSendToDockDemand);
}

function ResultSendToDockDemand(data)
{
	robotMoveToDock = false;
	
	if (data.A != wycaApi.AnswerCode.NO_ERROR && data.A != wycaApi.AnswerCode.CANCELED)
	{		
		actionListInProgress = false;
		if (timeoutRetryDock != null)
		{
			clearTimeout(timeoutRetryDock);
			timeoutRetryDock = null;
		}
		nbDockAttempt = 0;
		
		
		queueState = 'done';
		gotoPoiInProgress = false;
		if (currentBatteryState < dataStorage.min_goto_charge)
		{
			$('#current_action').html('Low battery, charging');
		}
		else
			NextAction();
		
	}
}

function ResultSendToDock(data)
{
	robotMoveToDock = false;
	
	if (data.A != wycaApi.AnswerCode.NO_ERROR && data.A != wycaApi.AnswerCode.CANCELED)
	{		
		nbDockAttempt++;
		if (nbDockAttempt < nbDockAttemptMax)
		{
			retryGotoDock = true;
			
			if (timeoutRetryDock != null)
			{
				clearTimeout(timeoutRetryDock);
				timeoutRetryDock = null;
			}
			timeoutRetryDock = setTimeout(RetryDock, delayBeforeRetryDock);
		}
		else
		{
			retryGotoDock = false;
			
			if (timeoutRetryDock != null)
			{
				clearTimeout(timeoutRetryDock);
				timeoutRetryDock = null;
			}
			
			nbDockAttempt = 0;
		}
	}
	else
	{
		actionListInProgress = false;
		if (timeoutRetryDock != null)
		{
			clearTimeout(timeoutRetryDock);
			timeoutRetryDock = null;
		}
		nbDockAttempt = 0;
		
		
		queueState = 'done';
		gotoPoiInProgress = false;
		if (currentBatteryState < dataStorage.min_goto_charge)
		{
			$('#current_action').html('Low battery, charging');
		}
		else
			NextAction();
		
	}
}

var currentBatteryState = 0;

function initPoweredState(data)
{
    $('#icoBattery').removeClass('battery-ok battery-mid');
    if (data)
	{
		robotCurrentState = 'docked';
        $('#icoBattery').addClass('battery-ok');
	}
    else
	{
		robotCurrentState = 'undocked';
        $('#icoBattery').addClass('battery-mid');
	}
}

function initBatteryState(volt)
{
	currentBatteryState = volt;
	if(dataStorage.wycaDemoStarted){
		//ONLY ON DEMO STARTED
		if (volt > dataStorage.min_goto_demo && robotCurrentState == 'docked')
		{
			NextAction();
		}
		else
		{
			if (volt < dataStorage.min_goto_demo && robotCurrentState == 'docked')
			{
				$('#current_action').html('Low battery for new task, charging');
			}
		}
		
		
		if (currentBatteryState < dataStorage.min_goto_charge)
		{
			if (robotMoveToDock)
			{
				$('#current_action').html('Low battery, go to dock');
			}
			else
			{
				if (robotCurrentState == 'docked')
					$('#current_action').html('Low battery, charging');
			}
		}
	}
	$('#icoBattery i').removeClass('fa-battery-0 fa-battery-1 fa-battery-2 fa-battery-3 fa-battery-4');
    $('#icoBattery').removeClass('battery-ko');
    if (volt < 15)
	{
		$('#icoBattery i').addClass('fa-battery-0');
		$('#icoBattery').addClass('battery-ko');
	}
	else if (volt <= 25)
	{
        $('#icoBattery i').addClass('fa-battery-1');
	}
	else if (volt <= 50)
	{
        $('#icoBattery i').addClass('fa-battery-2');
	}
	else if (volt <= 75)
	{
        $('#icoBattery i').addClass('fa-battery-3');
	}
	else
	{
        $('#icoBattery i').addClass('fa-battery-4');
	}
	$('#icoBattery span').html(volt+'%');
}

var dataStorage = {};
dataStorage.min_goto_charge = 75;
dataStorage.min_goto_demo = 80;
dataStorage.wycaDemo = [];
dataStorage.wycaDemoStarted = false;

var currentIndexStep = -1;
var currentQueueState = 'not_init';
var currentTask = null;

var oldWycaDemoStarted = false;

function RefreshConfigs()
{
	if (wycaApi.websocketAuthed)
	{
		wycaApi.GetGlobalVehiculePersistanteDataStorage(function(data){
			
			oldWycaDemoStarted = dataStorage.wycaDemoStarted;
			if(data.D != '')
				dataStorage = JSON.parse(data.D);
			
			if(typeof dataStorage.min_goto_charge == "undefined")
				dataStorage.min_goto_charge = 75;
			
			if(typeof dataStorage.min_goto_demo == "undefined")
				dataStorage.min_goto_demo = 80;
			
			if(typeof dataStorage.wycaDemo == "undefined")
				dataStorage.wycaDemo = [];
				
			if(typeof dataStorage.wycaDemoStarted == "undefined")
				dataStorage.wycaDemoStarted = false;
			
			if (!dataStorage.wycaDemoStarted && oldWycaDemoStarted != dataStorage.wycaDemoStarted)
			{
				// STOP => STOP MOVE
				wycaApi.StopMove();
				waitTimeRemaining = 0;
				$('#current_action').html('');
			}
			
			if (!dataStorage.wycaDemoStarted)
				currentIndexStep = -1;
			
			if (currentQueueState == 'not_init')
			{
				currentQueueState = 'inited';
				NextAction();	
			}
		});
	}
	else
	{
		setTimeout(RefreshConfigs, 500);
	}
}

function NextAction()
{
	if (!actionListInProgress)
	{
		if (dataStorage.wycaDemoStarted && dataStorage.wycaDemo.length > 0)
		{
			currentIndexStep++;
			if (currentIndexStep >= dataStorage.wycaDemo.length) currentIndexStep = 0
			currentTask = dataStorage.wycaDemo[currentIndexStep];
		
			ExecAction(currentTask);
		}
		else
		{
			if (!dataStorage.wycaDemoStarted)
				$('#current_action').html('');
			else
				$('#current_action').html('No task currently');
			currentTask = null;
			setTimeout(NextAction, 5000);
		}
	}
}

var waitTimeRemaining = 0;
var waitInterval = null;

function ExecAction(action)
{
	actionListInProgress = true;
	if (action.type == 'Poi')
	{
		gotoPoiInProgress = true;
		$('#current_action').html('Go to Poi '+action.id);
		wycaApi.GoToPoi(action.id,function(data){
			if (data.A != wycaApi.AnswerCode.NO_ERROR){
				queueState = 'done';
				gotoPoiInProgress = false;
				actionListInProgress = false;
				if (currentBatteryState < dataStorage.min_goto_charge)
				{
					if (!robotMoveToDock && robotCurrentState == 'undocked')
					{
						$('#current_action').html('Low battery, go to dock');
						// On stop tout et on envoi le robot se docker
						robotMoveToDock = true; 
						wycaApi.GoToCharge(-1,	ResultSendToDockDemand);
					}
					else
					{
						if (robotCurrentState == 'docked')
							$('#current_action').html('Low battery, charging');
					}
				}
				else
					NextAction();
			}
		});
	}
	else if(action.type == 'Dock')
	{
		$('#current_action').html('Go to docking station '+action.id);
		wycaApi.GoToCharge(action.id,	ResultSendToDockDemand);
	}
	else if (action.type == 'Wait')
	{
		waitTimeRemaining = parseInt(action.duration);
		$('#current_action').html('Wait '+ waitTimeRemaining + ' seconde'+((waitTimeRemaining > 1)?'s':''));
		if (waitInterval != null)
		{
			clearInterval(waitInterval);
			waitInterval = null;
		}
		
		$('#waitTime em').html(waitTimeRemaining);
		if (waitTimeRemaining < 2) $('#waitTime .pluriel').hide(); else $('#waitTime .pluriel').show();
		$('#waitTime').show();
		
		waitInterval = setInterval(NextTimeRemaining, 1000);
	}
}

function NextTimeRemaining()
{
	waitTimeRemaining--;
	$('#current_action').html('Wait '+ waitTimeRemaining + ' seconde'+((waitTimeRemaining > 1)?'s':''));
	$('#waitTime em').html(waitTimeRemaining);
	if (waitTimeRemaining < 2) $('#waitTime .pluriel').hide(); else $('#waitTime .pluriel').show();
	
	if (waitTimeRemaining <= 0)
	{
		clearInterval(waitInterval);
		waitInterval = null;
		$('#waitTime').hide();
		
		actionListInProgress = false;
		NextAction();
	}
}

/* DEMO MODE */
/* ---------------------------------------- */
/* SIMU MODE */ 

var id_site = -1;
var name_site = '';
$(window).on('resize',resizeMap);
 
function initMap(){
	$('#loader_map').show();
	$('#map_svg').hide();
	$('#tRobotNotLocalised').css('opacity',0);
	if (wycaApi.websocketAuthed)
	{
		$('#map_svg').children('.map_elem').remove();
		wycaApi.GetCurrentSite(function(data){
			if (data.A == wycaApi.AnswerCode.NO_ERROR){
				
				name_site = data.D.name;
				$('#site_name').html(name_site);
				id_site = data.D.id_site;
				wycaApi.GetCurrentMapComplete(function(data) {
					if (data.A == wycaApi.AnswerCode.NO_ERROR)
					{
						last_map = data.D;
						id_map = data.D.id_map;
						id_map_last = data.D.id_map;
						
						forbiddens = data.D.forbiddens;
						areas = data.D.areas;
						gommes = Array();
						docks = data.D.docks;
						pois = data.D.pois;
						augmented_poses = data.D.augmented_poses;
						
						ros_largeur = data.D.ros_width ;
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
						DrawMapElements();
						TraceRobot(lastRobotPose);
						setTimeout(function(){
							$('#loader_map').hide();
							$('#map_svg').show();
							$('#tRobotNotLocalised').css('opacity',1);
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
	POWER_STATUT = data.POWER_STATUT;
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
			animBatteryCharging(); // LAUNCH FOR FIRST TIME
		}
		
	}
}

function animBatteryCharging(){
	let targetIcon = $('#battery_widget i');
	if(POWER_STATUT == 4)
		targetIcon.addClass('fa-battery-full').removeClass('battery-charging').removeClass('fa-battery-empty').removeClass('fa-battery-quarter').removeClass('fa-battery-half').removeClass('fa-battery-three-quarters');
	else{
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
}

function refreshDockingState(){
	$('#docking_state_widget .docking_state').removeClass('active');
	if(dockingStateLast == 'docked' || dockingStateLast == 'undocked' || dockingStateLast == 'docking' || dockingStateLast == 'undocking'){
		$('#docking_state_widget .docking_state#'+dockingStateLast).addClass('active');
	}
}

function resizeMap(){
	if(is_simu){
		if(typeof(last_map) == 'undefined')
			initMap();
		else{
			$('#map_svg').children('.map_elem').remove();
			id_map = last_map.id_map;
			id_map_last = last_map.id_map;
			
			forbiddens = last_map.forbiddens;
			areas = last_map.areas;
			gommes = Array();
			docks = last_map.docks;
			pois = last_map.pois;
			augmented_poses = last_map.augmented_poses;
			
			ros_largeur = last_map.ros_width ;
			ros_hauteur = last_map.ros_height;
			ros_resolution = last_map.ros_resolution;
			
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
			$('#map_image').attr('xlink:href', 'data:image/png;base64,'+last_map.image_tri);
			
			svg_resolution_width = svg_resolution;
			svg_resolution_height = svg_resolution;
			svgMap = document.querySelector('#map_svg');
			DrawMapElements();
			TraceRobot(lastRobotPose);
			
		}
	}
}
/* SIMU MODE */ 