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

$(document).ready(function(e) {
	
	setInterval(RefreshConfigs, 30000); // Toutes les 30 secondes
	RefreshConfigs();
	
	GetCurrentTask();
	
	wycaApi = new WycaAPI({
		api_key:'5LGU.LaYMMncJaA0i42HwsX9ZX-RCNgj-9V17ROFXt71st',
		host:'elodie.wyca-solutions.com:9090',
		//host:'192.168.100.165:9090', // host:'192.168.100.245:9090',
		video_element_id:'webcam_local',
		/*webcam_name: 'r200 nav',*/
		nick:'robot',
		delay_no_reply : 30,
		delay_lost_connexion : 30,
		with_audio: true,
		with_video: true,
		onNewServerMessage: function (message){
			if (message != '' && message.message != undefined)
			{
				if (message.message.substr(0,3) != 'ACK') wycaApi.SendServerMessageToServer(message.from, 'ACK_'+message.message);
				
				data = message.message.split('|')
				
			}
		},
		onEquipmentError: function(){
			wycaApi.StartCloseWebRTC();
		},
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
			
			setTimeout(function() {
				if (currentTask != null)
					NextStepCurrentTask();
			}, 5000);
		},
		onRobotConnexionClose: function(data){
			connectedToTheRobot = false;
			$('#connection').removeClass('battery-ok battery-mid battery-ko blinking');
		   	$('#connection').addClass('battery-ko blinking');
		},
		onInitialized: function(){
		},
		onRobotMoveToResult: function(data){
			queueState = 'done';
			NextStepCurrentTask();
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
		onRobotActionFinished: function(data){
			console.error('onRobotActionFinished');
		},
		onRobotActionStarted: function(data){
			console.error('onRobotActionStarted');
		}
	});
	
	wycaApi.init();	
	
	$('#bNextWaitClick').click(function(e) {
        e.preventDefault();
		queueState = 'done';
		$('#waitClick').hide();
		NextStepCurrentTask();
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
	wycaApi.RobotMoveToDock(1, ResultSendToDock);
}

function ResultSendToDock(result)
{
	robotMoveToDock = false;
	
	if ((result.success == undefined || !result.success) && (result.canceled == undefined || !result.canceled))
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
	if (volt > configs.level_min_dotask && robotCurrentState == 'docked')
	{
		if (currentTask != null)
		{
			// On continue la tache
			NextStepCurrentTask();
		}
		else
		{
			GetCurrentTask();
		}
	}
	else
	{
		if (volt < configs.level_min_dotask && robotCurrentState == 'docked')
		{
			$('#current_action').html('Low battery for new task, charging');
		}
	}
	
	if (volt < configs.level_min_gotodock)
	{
		if (!robotMoveToDock && robotCurrentState == 'undocked')
		{
			$('#current_action').html('Low battery, go to dock');
			// On stop tout et on envoi le robot se docker
			queueState = 'pause';
			robotMoveToDock = true; 
			wycaApi.RobotMoveToDock(1,	ResultSendToDock);
		}
		else
		{
			if (robotCurrentState == 'docked')
				$('#current_action').html('Low battery, charging');
		}
	}
	
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

var configs = null;

/*
configs.level_min_gotodock
configs.level_min_gotodock_aftertask
configs.level_min_dotask
*/
function RefreshConfigs()
{
	jQuery.ajax({
			url: 'com_to_server/get_configs.php',
			type: "post",
			dataType: 'json',
			data: { 
				},
			error: function(jqXHR, textStatus, errorThrown) {
				},
			success: function(data, textStatus, jqXHR) {
				configs = data;
				console.log(configs);
				}
		});
}

var currentTask = null;
function GetCurrentTask()
{
	jQuery.ajax({
			url: 'com_to_server/get_current_task.php',
			type: "post",
			dataType: 'json',
			data: { 
				},
			error: function(jqXHR, textStatus, errorThrown) {
				},
			success: function(data, textStatus, jqXHR) {
					loaded = true;
					if (data != 'no_task')
					{
						currentTask = data;
						if (connectedToTheRobot)
							NextStepCurrentTask();
					}
					else
					{
						$('#current_action').html('No task currently');
						currentTask = null;
						setTimeout(GetCurrentTask, 5000);
					}
				}
		});
}

var queueState = '';
function NextStepCurrentTask()
{
	console.log('NextStepCurrentTask');
	if (queueState == 'pause')
	{
		// On reprend la tache
		ExecAction ( currentTask.actions[currentTask.step] );
	}
	else if (queueState == '' || queueState == 'done')
	{
		queueState = 'processing';
		currentTask.step++;
		currentTask.state = 'in_progress';
		currentTask.progress = 'Executing step '+ (currentTask.step+1);
		$('#current_action').html(currentTask.progress);
		
		if (currentTask.step < currentTask.actions.length)
		{
			ExecAction ( currentTask.actions[currentTask.step] );
			
			// On sauvegarde la tache
			jQuery.ajax({
				url: 'com_to_server/save_current_task.php',
				type: "post",
				dataType: 'json',
				data: { 
					'id_tache_queue':currentTask.id_tache_queue,
					'step':currentTask.step,
					'state':currentTask.state,
					'progress':currentTask.progress,
					},
				error: function(jqXHR, textStatus, errorThrown) {
					},
				success: function(data, textStatus, jqXHR) {
						// Fin de l'action, on passe à la suivante si on peux
						/*
						if (currentBatteryState <= configs.level_min_gotodock_aftertask)
						{
							$('#current_action').html('Low battery for new task, go to dock');
							robotMoveToDock = true; 
							wycaApi.RobotMoveToDock(1,	ResultSendToDock);
						}
						else
						{
							
						}
						*/
						NextStepCurrentTask();
					}
			});
			
		}
		else
		{
			// on supprime la tache en cours et récupère la prochaine tache
			jQuery.ajax({
				url: 'com_to_server/finish_current_task.php',
				type: "post",
				dataType: 'json',
				data: { 
					},
				error: function(jqXHR, textStatus, errorThrown) {
					},
				success: function(data, textStatus, jqXHR) {
						// Fin de l'action, on passe à la suivante si on peux
						if (currentBatteryState <= configs.level_min_gotodock_aftertask)
						{
							$('#current_action').html('Low battery for new task, go to dock');
							queueState = '';
							robotMoveToDock = true; 
							wycaApi.RobotMoveToDock(1,	ResultSendToDock);
						}
						else
						{
							queueState = '';
							GetCurrentTask();
						}
					}
			});
		}
	}
}

var TYPE_GotoPOI 	= 1;
var TYPE_WaitClick 	= 2;
var TYPE_WaitTime 	= 3;

var waitTimeRemaining = 0;
var waitInterval = null;

function ExecAction(action)
{
	switch(parseInt(action.action_type))
	{
		case TYPE_GotoPOI:
			poi = configs.pois[action.action_detail];
			console.log({x:parseFloat(poi.x_ros), y:parseFloat(poi.y_ros), theta:parseFloat(poi.t_ros)});
			wycaApi.RobotMoveTo({x:parseFloat(poi.x_ros), y:parseFloat(poi.y_ros), theta:parseFloat(poi.t_ros)}, function(e){ console.log(e); });
			
			break;
		case TYPE_WaitClick:
			$('#waitClick').show();
			break;
		case TYPE_WaitTime:
			waitTimeRemaining = parseInt(action.action_detail);
			if (waitInterval != null)
			{
				clearInterval(waitInterval);
				waitInterval = null;
			}
			
			$('#waitTime em').html(waitTimeRemaining);
			if (waitTimeRemaining < 2) $('#waitTime .pluriel').hide(); else $('#waitTime .pluriel').show();
			$('#waitTime').show();
			
			waitInterval = setInterval(NextTimeRemaining, 1000);
			break;
		default:
			console.error('Invalid action type '+action.action_type);
	}
}

function NextTimeRemaining()
{
	waitTimeRemaining--;
	$('#waitTime em').html(waitTimeRemaining);
	if (waitTimeRemaining < 2) $('#waitTime .pluriel').hide(); else $('#waitTime .pluriel').show();
	
	if (waitTimeRemaining == 0)
	{
		clearInterval(waitInterval);
		waitInterval = null;
		$('#waitTime').hide();
		
		queueState = 'done';
		NextStepCurrentTask();
	}
}

