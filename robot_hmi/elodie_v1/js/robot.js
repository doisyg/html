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
		host:'192.168.100.245:9090', // host:'192.168.100.245:9090',
		video_element_id:'webcam_local',
		webcam_name: 'r200 nav',
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
		},
		onRobotConnexionClose: function(data){
			connectedToTheRobot = false;
			$('#connection').removeClass('battery-ok battery-mid battery-ko blinking');
		   	$('#connection').addClass('battery-ko blinking');
		},
		onInitialized: function(){
		},
		onBatteryStateChange: function(data){
			initBatteryState(data);
		},
		onRobotMoveToResult: function(data){
			queueState = 'done';
			NextStepCurrentTask();
		},
		/*
		onCaptureJobFeedback: function(data){
		},
		onCaptureJobStatus: function(data){
			switch(data.status)
			{
				case wycaApi.ACTION_STATUS_PENDING: break;
				case wycaApi.ACTION_STATUS_ACTIVE: break;
				case wycaApi.ACTION_STATUS_PREEMPTED: break;
				case wycaApi.ACTION_STATUS_SUCCEEDED: break;
				case wycaApi.ACTION_STATUS_ABORTED: break;
				case wycaApi.ACTION_STATUS_REJECTED: break;
				case wycaApi.ACTION_STATUS_PREEMPTING: break;
				case wycaApi.ACTION_STATUS_RECALLING: break;
				case wycaApi.ACTION_STATUS_RECALLED: break;
				case wycaApi.ACTION_STATUS_LOST: break;
			}
		},
		onCaptureJobResult: function(data){
			
			console.log(data);
			if (!data.success) { $('#erreur').html(data.message); $('#erreur').show(); }
			
			jobInProgress = false;
			
			if(!demandeStop)
				GoToPage('home');
			else
				demandeStop = false;
				
			if (stopFromServer != '')
			{
				wycaApi.SendServerMessageToServer(stopFromServer, 'JOB_FINISHED');
				stopFromServer = '';
			}
			else
			{
				if (gotoDockAfterJob && !in_visio)
				{
					robotMoveToDock = true;
					RefreshDisplayRobotMoveToDock();
					wycaApi.RobotMoveToDock(1,	ResultSendToDock);
				}
			}
			gotoDockAfterJob = false;
		},
		*/
		onNavigationRobotStateChange: function(data){
			initStateRobot(data);
		},
		onRobotActionFinished: function(data){
		},
		onRobotActionStarted: function(data){
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

function initStateRobot(etat)
{
	// docking undocking docked undocked
	var save_state = robotCurrentState;
	console.log('Robot state', etat);
	robotCurrentState = etat;
	
	
}

var currentBatteryState = 0;
function initBatteryState(volt)
{
	currentBatteryState = volt;
	if (volt > configs.level_min_dotask &&  robotCurrentState == 'docked')
	{
		if (currentTask != null)
		{
			// On continue la tache
			NextStepCurrentTask();
		}
	}
	
	if (volt < configs.level_min_gotodock)
	{
		if (!robotMoveToDock && robotCurrentState == 'undocked')
		{
			// On stop tout et on envoi le robot se docker
			queueState = 'pause';
			robotMoveToDock = true; 
			wycaApi.RobotMoveToDock(1,	ResultSendToDock);
		}
	}
	
	$('#battery i').removeClass('fa-battery-0 fa-battery-1 fa-battery-2 fa-battery-3 fa-battery-4');
	$('#battery').removeClass('battery-ko blinking battery-ok battery-mid');
	if (volt < 15)
	{
		$('#battery i').addClass('fa-battery-0');
		$('#battery').addClass('battery-ko blinking');
	}
	else if (volt <= 25)
	{
		$('#battery i').addClass('fa-battery-1');
		$('#battery').addClass('battery-ko');
	}
	else if (volt <= 50)
	{
		$('#battery i').addClass('fa-battery-2');
		$('#battery').addClass('battery-mid');
	}
	else if (volt <= 75)
	{
		$('#battery i').addClass('fa-battery-3');
		$('#battery').addClass('battery-ok');
	}
	else
	{
		$('#battery i').addClass('fa-battery-4');
		$('#battery').addClass('battery-ok');
	}
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
						currentTask = data;
					else
						currentTask = null;
				}
		});
}

var queueState = '';
function NextStepCurrentTask()
{
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
		currentTask.progress = 'Executing step '+ (currentTask+1);
		
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
							robotMoveToDock = true; 
							wycaApi.RobotMoveToDock(1,	ResultSendToDock);
						}
						else
						{
							NextStepCurrentTask();
						}
						*/
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
							queueState = '';
							robotMoveToDock = true; 
							wycaApi.RobotMoveToDock(1,	ResultSendToDock);
						}
						else
						{
							queueState = '';
							NextStepCurrentTask();
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
	switch(action.action_type)
	{
		case TYPE_GotoPOI:
			poi = configs.pois[action.action_detail];
			wycaApi.RobotMoveTo({x:poi.x_ros, y:poi.y_ros, theta:poi.t_ros});
			
			break;
		case TYPE_WaitClick:
			$('#waitClick').show();
			break;
		case TYPE_WaitTime:
			waitTimeRemaining = action.action_detail
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

