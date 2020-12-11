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

$(document).ready(function(e) {
	
	wycaApi = new WycaAPI({
		api_key:'4tEV6A6Bd8mVQtgHjUj85fGwYeJbsYkChHSRGP21HxaAIE',
		host:robot_host,
		
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
		}
	});
	
	wycaApi.init();	
	
	
	
	setInterval(RefreshConfigs, 1000); // Toutes les 1 secondes
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
	
});

function RetryDock()
{
	if (timeoutRetryDock != null)
	{
		clearTimeout(timeoutRetryDock);
		timeoutRetryDock = null;
	}
	robotMoveToDock = true;
	RefreshDisplayRobotMoveToDock();
	wycaApi.GoToCharge(-1, ResultSendToDockDemand);
}

function ResultSendToDockDemand(result)
{
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
				// Stop la demo, on cancel le go to poi
				if (gotoPoiInProgress)
					wycaApi.GoToPoiCancel();
				else
					waitTimeRemaining = 0;
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
		wycaApi.GoToPoi(action.id);
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

