<?php
if (!isset($_GET['api_key'])) { echo 'alert("WycaAPI - API KEY is needed");'; exit; }
require_once ('../config/initSite.php');

$topics_interne = array('onArrivedToDestination', 'onArrivedToPOI', 'onArrivedToBox', 'onMapBoxClick', 'onMapRouteClick', 'onMapIsLoaded');
$services_interne = array('MapGetHTML', 'MapInit', 'GetPOIs', 'GetBoxs', 'RobotMoveToDock', 'RobotMoveToPOI', 'RobotMoveToBox', 'InitDynamicsTopics', 'InitDynamicServices', 'TakePhotoCamNav', 'TakePhotoCamCustomer');
$actions_interne = array();
$topic_pubs_interne = array();
		

$_GET['api_key'] = str_replace(' ', '+', $_GET['api_key']);

$user = User::GetUserFromApiKey($_GET['api_key']);
if ($user == null)
{
	echo 'alert("WycaAPI - Invalid parameters");'; exit;
}

$URL_WYCA = 'https://elodie.wyca-solutions.com/';

$topics = $user->GetApiTopics();
$topic_pubs = $user->GetApiTopicPubs();
$services = $user->GetApiServices();
$actions = $user->GetApiActions();

$topics_by_id = array();
foreach($topics as $topic)
	$topics_by_id[$topic->id_topic] = $topic;

$services_by_id = array();
foreach($services as $service)
	$services_by_id[$service->id_service] = $service;
	
$topic_pubs_by_id = array();
foreach($topic_pubs as $topic_pub)
	$topic_pubs_by_id[$topic_pub->id_topic_pub] = $topic_pub;
	
$actions_by_id = array();
foreach($actions as $action)
	$actions_by_id[$action->id_action] = $action;

if (false) // Pour rendre l'IDE plus firendly
{
?><script><?php
}
else
{
	?>// JavaScript Document<?php
}

/*
window.onerror = function(messageOrEvent, source, noligne) { 

	jQuery.ajax({
			url: '<?php echo $URL_WYCA;?>API/webservices/v1.0/json/error',
			type: "post",
			timeout: 15000,
			data: { 
				messageOrEvent:messageOrEvent,
				source:source,
				noligne:noligne
				},
			error: function(jqXHR, textStatus, errorThrown) {
				},
			success: function(data, textStatus, jqXHR) {
				}
		});

}
*/
?>
var couleurs;

function WycaAPI(options){

	this.ROBOT_STATE_SAFETY = 1;
    this.ROBOT_STATE_MOVE = 2;
    this.ROBOT_STATE_CHARGING = 3;
	this.ROBOT_STATE_STOPPED = 4;
    this.ROBOT_STATE_MANUAL = 5;
    this.ROBOT_STATE_LIGHT = 6;
	
	this.LED_ANIM_PROGRESS = 1;
    this.LED_ANIM_PROGRESS_CENTER = 2;
    this.LED_ANIM_RAINBOW = 3;
    this.LED_ANIM_K2000 = 4;
    this.LED_ANIM_CLIGNOTE = 5;
    this.LED_ANIM_CLIGNOTE_2 = 6;
    this.LED_ANIM_POLICE = 7;
    this.LED_ANIM_FONDU = 8;
    this.LED_ANIM_MOVE = 9;
    this.LED_ANIM_LIGHT = 10;
	
	this.ACTION_STATUS_PENDING 		= 0;
	this.ACTION_STATUS_ACTIVE		= 1;
	this.ACTION_STATUS_PREEMPTED	= 2;
	this.ACTION_STATUS_SUCCEEDED    = 3;
	this.ACTION_STATUS_ABORTED      = 4;
	this.ACTION_STATUS_REJECTED     = 5;
	this.ACTION_STATUS_PREEMPTING   = 6;
	this.ACTION_STATUS_RECALLING    = 7;
	this.ACTION_STATUS_RECALLED     = 8;
	this.ACTION_STATUS_LOST         = 9;
	
   	if (typeof jQuery === 'undefined') {
	  throw new Error('WycaAPI requires jQuery')
	}
	
	if (typeof ROSLIB === 'undefined') {
	  throw new Error('WycaAPI requires Roslib')
	}
	
	var defaults = {
        webcam_name : 'default',
		with_audio : true,
		with_video : true,
		delay_no_reply : 30,
		delay_lost_connexion : 30,
		checkLostConnection: true,
		webcam_id : "",
		webcam_name: "",
		serveurWyca : '<?php echo $URL_WYCA;?>',
		on_error_webcam_try_without : true,
		host : '127.0.0.1:9090',
		distance_max_arrived:0.5
    };
    this.options = $.extend({}, defaults, options || {});
   	
	if (this.options.api_key == undefined || this.options.api_key == '')
		throw new Error('WycaAPI - requires API KEY');
	if (this.options.nick == '')
		this.options.nick = 'server';
	
	var ros;
	var socketStarted = false;
	
	var timerNoResponceCall = null
	var timerFinCall = null;
	
	this.webrtc = null;
	this.closing = false;
	this.other_id = '';
	
	this.call_from_admin = false;
	
	var pc_config = null;
	var isStarted = false;
	
	var multiStreamRecorder;
	
	var audioVideoBlobs = {};
	var recordingInterval = 0;
	
	var container;
	var index = 1;
	var localStream = null;
	var videoElement;
	var indexVideo = 0;
	var haveVideoOpe = false;
	var socketStarted = false;
	var socketError = false;
	this.reply = false;
	
	this.ros_topics = Array();
	this.ros_topics_nb = Array();
	this.ros_topics_subscribed = Array();
	this.ros_topics_subscribed_by_pc = Array();
	this.ros_services = Array();
	this.ros_actions = Array();
	this.ros_topic_pubs = Array();
	this.ros_goal_actions = Array();
	this.ros_actions_feedback = Array();
	this.ros_actions_result = Array();
	this.ros_actions_status = Array();
	this.ros_params_result = Array();
	
	this.plans = Array();
	this.current_floor = 0;
	
	this.posesDock = Array();
	
	this.gotoDockInProgress = false;
	this.gotoDockNum = -1;
	this.gotoDockReturn = null;
	
	this.currentAction = -1;
	
	this.connectedTodo = false;
	
	_this = this;
	
	jQuery.ajax({
		url: _this.options.serveurWyca+'API/webservices/v1.0/json/pcConfig',
		type: "get",
		timeout: 15000,
		beforeSend: function(x) {
			x.setRequestHeader ("Authorization", "Basic " + btoa(_this.options.api_key + ':'));
		},
		error: function(jqXHR, textStatus, errorThrown) {
			throw new Error('WycaAPI check API KEY error')
			},
		success: function(data, textStatus, jqXHR) {
				if (data != '')
				{
					pc_config = jQuery.parseJSON(data);
					if (isStarted) _this.StartWebRTC();
				}
				else
				{
					throw new Error('WycaAPI API KEY not valid')
				}
			}
	});
	
	this.init = function (){
		
		jQuery.ajax({
			url: _this.options.serveurWyca+'API/webservices/v1.0/json/plans',
			type: "get",
			timeout: 15000,
			beforeSend: function(x) {
				x.setRequestHeader ("Authorization", "Basic " + btoa(_this.options.api_key + ':'));
			},
			error: function(jqXHR, textStatus, errorThrown) {
				throw new Error('WycaAPI get plans error')
			},
			success: function(data, textStatus, jqXHR) {
				if (data != '')
				{
					_this.plans = jQuery.parseJSON(data);
					if (_this.plans.length > 0 && _this.plans[0] != undefined)
					{
						_this.plan_ros_resolution = parseInt(_this.plans[0].ros_resolution);
						_this.largeurRos = parseInt(_this.plans[0].ros_largeur);
						_this.hauteurRos = parseInt(_this.plans[0].ros_hauteur);
						_this.largeurSVG = parseInt(_this.plans[0].largeur);
						_this.hauteurSVG = parseInt(_this.plans[0].hauteur);
					}
					
					if (_this.options.onMapIsLoaded != undefined)
					{
						_this.options.onMapIsLoaded();
					}
				}
			}
		});
		
		if (this.options.nick == 'robot')
		{
			/*** ROBOT ***/
			ros = new ROSLIB.Ros();
			
			// If there is an error on the backend, an 'error' emit will be emitted.
			
			ros.on('error', jQuery.proxy(function(error) {
		   		socketStarted = false;
				socketError = true;
				_this.ROSMessageSendToPC('onRobotConnexionError');
				if (this.options.onRobotConnexionError != undefined)
				{
					this.options.onRobotConnexionError();
				}
			}, this));
			
			// Find out exactly when we made a connection.
			ros.on('connection', jQuery.proxy(function() {
			    socketStarted = true;
			    _this.ROSMessageSendToPC('onRobotConnexionOpen');
				if (this.options.onRobotConnexionOpen != undefined)
				{
					this.options.onRobotConnexionOpen();
				}
			}, this));
			
			ros.on('close', jQuery.proxy(function() {
				socketStarted = false;
				_this.ROSMessageSendToPC('onRobotConnexionClose');
				if (this.options.onRobotConnexionClose != undefined)
				{
					this.options.onRobotConnexionClose();
				}
			}, this));
			
			jQuery.ajax({
				url: _this.options.serveurWyca+'API/webservices/v1.0/json/robot/getHash',
				type: "get",
				timeout: 15000,
				beforeSend: function(x) {
					x.setRequestHeader ("Authorization", "Basic " + btoa(_this.options.api_key + ':'));
				},
				async: true,
				data: { },
				error: function(jqXHR, textStatus, errorThrown) {
					if (_this.options.onRobotConnexionError != undefined)
					{
						_this.options.onRobotConnexionError();
					}
				},
				success: jQuery.proxy(function(data, textStatus, jqXHR) {
					donnees = JSON.parse(data);
				
					ros.authenticate(donnees.mac, donnees.client, donnees.dest, donnees.rand, donnees.t, donnees.level, donnees.end);
					ros.connect('wss://'+this.options.host+'/');
				
					this.SubscribeData();
					
					<?php
					// Init sur demande
					$id_services_topics = $user->GetIdServicesAndTopicsToInit();
					foreach($id_services_topics as $id_service => $id_topics)
					{
						if (isset($services_by_id[$id_service]))
						{
							$conds = array();
							foreach($id_topics as $id_topic)
							{
								$conds[] = 'this.options.'.$topics_by_id[$id_topic]->event_name.' != undefined';
							}
							echo 'if ('.implode(' || ', $conds).') this.'.$services_by_id[$id_service]->function_name.'();';
						}
					}
					?>
						
				}, this)
			});
		}
	};
	
	var _this = this;
	
	/*** FUNCTIONS MESSAGING ***/
	
	
	this.SendWebRTCMessage = function(message)
	{
		_this.webrtc.sendToAll('wyca', {message: message, nick: _this.webrtc.config.nick});
	}
	
	/*** FUNCTIONS ROS ***/
		
	this.GetParam = function(param_name, function_return)
	{
		p = new ROSLIB.Param({ ros : ros, name :  param_name });
		p.get(function(value) { 
			function_return(value);
		});
	}
	
	
	<?php
	$topicArrived = ApiTopic::GetByEventName('onArrivedToDestination');
	$topicArrivedPoi = ApiTopic::GetByEventName('onArrivedToPOI');
	$topicArrivedBox = ApiTopic::GetByEventName('onArrivedToBox');
	
	$serviceTakePhotoCamNav = ApiService::GetByFunctionName('TakePhotoCamNav');
	$serviceTakePhotoCamCustomer = ApiService::GetByFunctionName('TakePhotoCamCustomer');
	?>
	
	this._compteurPhotoNav = 0;
	this._topicImageCamNavIndex = -1;
	this._topicImageCamNavAlreadyInit = false;
	this.TakePhotoCamNav = function()
	{
		if (_this._topicImageCamNavIndex > -1)
		{
			if (_this.options.nick != 'robot')
			{
				//this.ros_services[<?php echo $serviceTakePhotoCamNav->id_service;?>] = function_return;
				msg = { action: 'callService', name: '<?php echo $serviceTakePhotoCamNav->id_service;?>', params : {}};
				_this.webrtc.sendToAll('ros', {message: msg, nick: _this.webrtc.config.nick});
			}
			else
			{
				if (_this._topicImageCamNavAlreadyInit)
				{
					_this.ros_topics[_this._topicImageCamNavIndex].subscribe();
				}
				else
				{
					_this._topicImageCamNavAlreadyInit = true;
					_this.ros_topics[_this._topicImageCamNavIndex].subscribe(jQuery.proxy(function(message) { 
						_this._compteurPhotoNav++;
						if (_this._compteurPhotoNav >= 2)
						{
							_this._compteurPhotoNav=0;
							data = message; if (message.data != undefined) data = message.data; 
							if(_this.ros_topics_subscribed_by_pc[_this._topicImageCamNavIndex]) _this.ROSMessageSendToPC({ topic: _this._topicImageCamNavIndex, data: data });
							if (_this.options.onGetPhotoCamNav != undefined) _this.options.onGetPhotoCamNav(data);
							_this.ros_topics[_this._topicImageCamNavIndex].unsubscribe();
						}
					}, this));	
				}
			}
		}
	}
	this._compteurPhotoCustomer = 0;
	this._topicImageCamCustomerIndex = -1;
	this._topicImageCamCustomerAlreadyInit = false;
	this.TakePhotoCamCustomer = function()
	{
		if (_this._topicImageCamCustomerIndex > -1)
		{	
			if (_this.options.nick != 'robot')
			{
				//this.ros_services[<?php echo $serviceTakePhotoCamCustomer->id_service;?>] = function_return;
				msg = { action: 'callService', name: '<?php echo $serviceTakePhotoCamCustomer->id_service;?>', params : {}};
				_this.webrtc.sendToAll('ros', {message: msg, nick: _this.webrtc.config.nick});
			}
			else
			{	
				if (_this._topicImageCamCustomerAlreadyInit)
				{
					_this.ros_topics[_this._topicImageCamCustomerIndex].subscribe();
				}
				else
				{
					_this._topicImageCamCustomerAlreadyInit = true;
					_this.ros_topics[_this._topicImageCamCustomerIndex].subscribe(jQuery.proxy(function(message) { 
						_this._compteurPhotoCustomer++;
						if (_this._compteurPhotoCustomer >= 2)
						{
							_this._compteurPhotoCustomer=0;
							data = message; if (message.data != undefined) data = message.data; 
							if(_this.ros_topics_subscribed_by_pc[_this._topicImageCamCustomerIndex]) _this.ROSMessageSendToPC({ topic: _this._topicImageCamCustomerIndex, data: data });
							if (_this.options.onGetPhotoCamCustomer != undefined) _this.options.onGetPhotoCamCustomer(data);
							_this.ros_topics[_this._topicImageCamCustomerIndex].unsubscribe();
						}
					}, this));
				}
			}
		}
	}
	
	this._call_stop = false;
	this._robot_state = '';
	this._current_goal = '';
	
	this.SaveCurrentGoal = function(data) {
		if (data.pose != undefined && data.pose.position != undefined)
			this._current_goal = data.pose.position;
	}
	
	this.SaveCurrentFloor = function(data) {
		this.current_floor = data;
	}
		
	this.SaveRobotState = function(data) {
		
		if (data == 'undocked_stopped' && this._robot_state != data && this._robot_state != '')
		{
			this._robot_state = data;
			if (_this._call_stop)
			{
				_this._call_stop = false;
			}
			else
			{
				if (this._current_goal != '')
				{
					// On calcul la distance entre le robot et le poi1
					dMin =  Math.sqrt((this._current_goal.x - this.lastCoordRobot.x) * (this._current_goal.x - this.lastCoordRobot.x) + (this._current_goal.y - this.lastCoordRobot.y) * (this._current_goal.y - this.lastCoordRobot.y) );
					if (dMin < _this.options.distance_max_arrived)
					{
						if(_this.ros_topics_subscribed_by_pc[<?php echo $topicArrived->id_topic;?>]) _this.ROSMessageSendToPC({ topic: <?php echo $topicArrived->id_topic;?>, data: true });
						this.options.onArrivedToDestination(true);
					}
					else
					{
						if(_this.ros_topics_subscribed_by_pc[<?php echo $topicArrived->id_topic;?>]) _this.ROSMessageSendToPC({ topic: <?php echo $topicArrived->id_topic;?>, data: false });
						this.options.onArrivedToDestination(false);
					}
				}
			
				// On calcul la distance entre le robot et le poi1
				if (_this._lastPoi != '')
				{
					dMin = 999999;
					idMin = -1;
					for(var i= 0; i < this.plans.length; i++)
					{
						if (this.plans[i].floor == _this.current_floor)
						{
							for(var j= 0; j < this.plans[i].pois.length; j++)
							{
								poi = this.plans[i].pois[j];
								if (_this.lastPoi == poi.name)
								{							
									d =  Math.sqrt((poi.position.x - this.lastCoordRobot.x) * (poi.position.x - this.lastCoordRobot.x) + (poi.position.y - this.lastCoordRobot.y) * (poi.position.y - this.lastCoordRobot.y) );
									if (d < dMin)
									{
										dMin = d;
										idMin = poi.num;
									}
								}
							}
						}
					}
					
					if (dMin < _this.options.distance_max_arrived)
					{
						if(_this.ros_topics_subscribed_by_pc[<?php echo $topicArrivedPoi->id_topic;?>]) _this.ROSMessageSendToPC({ topic: <?php echo $topicArrivedPoi->id_topic;?>, data: jQuery.parseJSON('{"arrived":true,"poi_name":"poi'+idMin+'"}') });
						this.options.onArrivedToPOI(jQuery.parseJSON('{"arrived":true,"poi_name":"poi'+idMin+'"}'));
					}
					else
					{
						//if(_this.ros_topics_subscribed_by_pc[<?php echo $topicArrivedPoi->id_topic;?>]) _this.ROSMessageSendToPC({ topic: <?php echo $topicArrivedPoi->id_topic;?>, data: true });
						//this.options.onArrivedToPOI(false, -1);
					}
				}
				
				// On calcul la distance entre le robot et le poi1
				if (_this._lastBox != '')
				{
					dMin = 999999;
					idMin = -1;
					for(var i= 0; i < this.plans.length; i++)
					{
						if (this.plans[i].floor == _this.current_floor)
						{
							//console.log(this.plans[i].boxs);
							for(var j= 0; j < this.plans[i].boxs.length; j++)
							{
								box = this.plans[i].boxs[j];
								if (_this.lastBox == box.name)
								{
									d =  Math.sqrt((box.position.x - this.lastCoordRobot.x) * (box.position.x - this.lastCoordRobot.x) + (box.position.y - this.lastCoordRobot.y) * (box.position.y - this.lastCoordRobot.y) );
									if (d < dMin)
									{
										dMin = d;
										idMin = box.numbox;
									}
								}
							}
						}
					}
					
					if (dMin < _this.options.distance_max_arrived)
					{
						if(_this.ros_topics_subscribed_by_pc[<?php echo $topicArrivedBox->id_topic;?>]) _this.ROSMessageSendToPC({ topic: <?php echo $topicArrivedBox->id_topic;?>, data: jQuery.parseJSON('{"arrived":true,"box_name":"box'+idMin+'"}') });
						this.options.onArrivedToBox(jQuery.parseJSON('{"arrived":true,"box_name":"box'+idMin+'"}'));
					}
					else
					{
						//if(_this.ros_topics_subscribed_by_pc[<?php echo $topicArrivedBox->id_topic;?>]) _this.ROSMessageSendToPC({ topic: <?php echo $topicArrivedBox->id_topic;?>, data: true });
						//this.options.onArrivedToPOI(false, -1);
					}
				}
			}
			
			_this._lastPoi = '';
			_this._lastBox = '';
			_this._lastPoint = '';
		}
		
		this._robot_state = data;
	}
	
	this.SubscribeData = function() {
		this.ros_topics_subscribed_by_pc[<?php echo $topicArrived->id_topic;?>] = false;
		if (this.options.<?php echo $topicArrived->event_name;?> != undefined)
		{
			if (this.options.nick != 'robot')
			{
				msg = { action: 'addTopic', name: '<?php echo $topicArrived->id_topic;?>'};
				this.webrtc.sendToAll('ros', {message: msg, nick: _this.webrtc.config.nick});
			}
			else
			{
				this.ros_topics_subscribed[<?php echo $topicArrived->id_topic;?>] = true;
			}
		}
		else this.ros_topics_subscribed[<?php echo $topicArrived->id_topic;?>] = false;
		
		this.ros_topics_subscribed_by_pc[<?php echo $topicArrivedPoi->id_topic;?>] = false;
		if (this.options.<?php echo $topicArrivedPoi->event_name;?> != undefined)
		{
			if (this.options.nick != 'robot')
			{
				msg = { action: 'addTopic', name: '<?php echo $topicArrivedPoi->id_topic;?>'};
				this.webrtc.sendToAll('ros', {message: msg, nick: _this.webrtc.config.nick});
			}
			else
			{
				this.ros_topics_subscribed[<?php echo $topicArrivedPoi->id_topic;?>] = true;
			}
		}
		else this.ros_topics_subscribed[<?php echo $topicArrivedPoi->id_topic;?>] = false;
		
		this.ros_topics_subscribed_by_pc[<?php echo $topicArrivedBox->id_topic;?>] = false;
		if (this.options.<?php echo $topicArrivedBox->event_name;?> != undefined)
		{
			if (this.options.nick != 'robot')
			{
				msg = { action: 'addTopic', name: '<?php echo $topicArrivedBox->id_topic;?>'};
				this.webrtc.sendToAll('ros', {message: msg, nick: _this.webrtc.config.nick});
			}
			else
			{
				this.ros_topics_subscribed[<?php echo $topicArrivedBox->id_topic;?>] = true;
			}
		}
		else this.ros_topics_subscribed[<?php echo $topicArrivedBox->id_topic;?>] = false;
		<?php
		foreach($topics as $topic)
		{
			if (in_array($topic->event_name, $topics_interne)) continue;
			
			if ($topic->event_name != '')
			{
			?>
			this.ros_topics_subscribed_by_pc[<?php echo $topic->id_topic;?>] = false;
			if (this.options.nick == 'robot')
			{
				<?php
				if ($topic->nom != '')
				{
					?>
					this.ros_topics[<?php echo $topic->id_topic;?>] = new ROSLIB.Topic({ ros : ros,	name : '<?php echo $topic->nom;?>', messageType : '<?php echo $topic->messageType;?>'});
					<?php
				}
				?>
			}
			if (this.options.<?php echo $topic->event_name;?> != undefined <?php if ($topic->nom == '/keylo_arduino/current_floor' || $topic->nom == '/keylo_api/navigation/robot_pose' || $topic->nom == '/keylo_api/navigation/current_goal' || $topic->nom == '/keylo_api/navigation/robot_state'){?>|| this.ros_topics_subscribed[<?php echo $topicArrived->id_topic;?>] || this.ros_topics_subscribed[<?php echo $topicArrivedPoi->id_topic;?>] || this.ros_topics_subscribed[<?php echo $topicArrivedBox->id_topic;?>]<?php }?>)
			{
				if (this.options.nick != 'robot')
				{
					if ('<?php echo $topic->event_name;?>' != 'onJoystickInput')
					{
						<?php
						if ($topic->event_name == 'onGetPhotoCamNav')
						{
							?>
							this._topicImageCamNavIndex = <?php echo $topic->id_topic;?>;
							<?php
						}
						elseif ($topic->event_name == 'onGetPhotoCamCustomer')
						{
							 ?>
							 this._topicImageCamCustomerIndex = <?php echo $topic->id_topic;?>;
							 <?php
						}
						?>
						 
						msg = { action: 'addTopic', name: '<?php echo $topic->id_topic;?>'};
						this.webrtc.sendToAll('ros', {message: msg, nick: _this.webrtc.config.nick});
					}
				}
				else
				{
					this.ros_topics_subscribed[<?php echo $topic->id_topic;?>] = true;
					
					<?php if ($topic->event_name != 'onGetPhotoCamCustomer' && $topic->event_name != 'onGetPhotoCamNav') // subscribe on demand
					{
						?>
					this.ros_topics[<?php echo $topic->id_topic;?>].subscribe(jQuery.proxy(function(message) { data = message; if (message.data != undefined) data = message.data; if(_this.ros_topics_subscribed_by_pc[<?php echo $topic->id_topic;?>]) _this.ROSMessageSendToPC({ topic: <?php echo $topic->id_topic;?>, data: data });  <?php if ($topic->nom == '/keylo_api/navigation/robot_pose'){?>_this.PositionneRobot(data);<?php }?> <?php if ($topic->nom == '/keylo_api/navigation/current_goal'){?>_this.SaveCurrentGoal(data);<?php }?> <?php if ($topic->nom == '/keylo_arduino/current_floor'){?>_this.SaveCurrentFloor(data);<?php }?> <?php if ($topic->nom == '/keylo_api/navigation/robot_state'){?>_this.SaveRobotState(data);<?php }?> if (_this.options.<?php echo $topic->event_name;?> != undefined) _this.options.<?php echo $topic->event_name;?>(data);}, this));
						<?php
					}
					else
					{
						if ($topic->event_name == 'onGetPhotoCamNav')
						{
							?>
							this._topicImageCamNavIndex = <?php echo $topic->id_topic;?>;
							<?php
						}
						elseif ($topic->event_name == 'onGetPhotoCamCustomer')
						{
							 ?>
							 this._topicImageCamCustomerIndex = <?php echo $topic->id_topic;?>;
							 <?php
						}
						elseif ($topic->nom == '/scan_filtered')
						{
							?>
						this.ros_topics_nb[<?php echo $topic->id_topic;?>] = 0;
						this.ros_topics[<?php echo $topic->id_topic;?>].subscribe(jQuery.proxy(function(message) { this.ros_topics_nb[<?php echo $topic->id_topic;?>]++; if (this.ros_topics_nb[<?php echo $topic->id_topic;?>]%4 == 0) { this.ros_topics_nb[<?php echo $topic->id_topic;?>]=0; return; }  data = message; if (message.data != undefined) data = message.data; if(_this.ros_topics_subscribed_by_pc[<?php echo $topic->id_topic;?>]) _this.ROSMessageSendToPC({ topic: <?php echo $topic->id_topic;?>, data: data });  _this.options.<?php echo $topic->event_name;?>(data);}, this));
							<?php
						}
					}
					?>
				}
			}
			else this.ros_topics_subscribed[<?php echo $topic->id_topic;?>] = false;
			<?php
			}
			elseif($topic->publish_name != '')
			{
				/*
				?>
				if (this.options.nick != 'robot')
				{
					msg = { action: 'addTopic', name: '<?php echo $topic->id_topic;?>'};
					this.webrtc.sendToAll('ros', {message: msg, nick: _this.webrtc.config.nick});
				}
				<?php
				*/
			}
		}
		
		$topic = new ApiTopicPub();
		foreach($topic_pubs as $topic)
		{
			if (in_array($topic->function_name, $topic_pubs_interne)) continue;
			
			if ($topic->function_name != '')
			{
			?>
			if (this.options.nick == 'robot')
			{
				<?php
				if ($topic->function_name != '')
				{
					?>
					this.ros_topic_pubs[<?php echo $topic->id_topic_pub;?>] = new ROSLIB.Topic({ ros : ros,	name : '<?php echo $topic->nom;?>', messageType : '<?php echo $topic->messageType;?>'});
					<?php
				}
				?>
			}
			<?php
			}
		}
		?>
			
		<?php
		$haveDynamicTopic = false;
		$haveDynamicService = false;
		foreach($services as $service)
		{
			if ($service->function_name == 'InitDynamicsTopics') $haveDynamicTopic = true;
			if ($service->function_name == 'InitDynamicServices') $haveDynamicService = true;
			
			if (in_array($service->function_name, $services_interne)) continue;
			if ($service->function_name != '')
			{
			?>
			if (this.options.nick == 'robot') this.ros_services[<?php echo $service->id_service;?>] = new ROSLIB.Service({ ros : ros, name : '<?php echo $service->nom;?>', messageType : '<?php echo $service->messageType;?>'});
			<?php
			}
		}
		
		foreach($actions as $action)
		{	
			if (in_array($action->function_name, $actions_interne)) continue;
			if ($action->function_name != '')
			{
			?>
			if (this.options.nick == 'robot') this.ros_actions[<?php echo $action->id_action;?>] = new ROSLIB.ActionClient({ ros : ros, serverName : '<?php echo $action->nom;?>', actionName : '<?php echo $action->messageType;?>'});
			if (_this.options.nick != 'robot')
			{
				_this.ros_actions_feedback[<?php echo $action->id_action;?>] = _this.options.on<?php echo $action->function_name;?>Feedback;
				_this.ros_actions_result[<?php echo $action->id_action;?>] = _this.options.on<?php echo $action->function_name;?>Result;
				_this.ros_actions_status[<?php echo $action->id_action;?>] = _this.options.on<?php echo $action->function_name;?>Status;
			}
			<?php
			}
		}
		?>
		
		<?php if ($haveDynamicTopic) {?>
		this.InitDynamicTopics();
		<?php 
		}
		if ($haveDynamicService) {?>
		this.InitDynamicServices();
		<?php }?>
		
		if (_this.options.onInitialized != undefined) _this.options.onInitialized();
	},
	
	/*** FUNCTIONS ***/
	<?php if ($haveDynamicTopic) {?>
	this.InitDynamicTopics = function()
	{
		if (this.options.dynamic_topics != undefined)
		{
			indexTopic = 10000;
			$.each(this.options.dynamic_topics, function( index, topic ) {
				_this.ros_topics_subscribed_by_pc[indexTopic] = false;
				if (_this.options.nick == 'robot')
				{
					_this.ros_topics[indexTopic] = new ROSLIB.Topic({ ros : ros,	name : topic.topic_name, messageType : topic.message_type});
				}
				if (_this.options[topic.event_name] != undefined)
				{
					if (_this.options.nick != 'robot')
					{
						msg = { action: 'addTopic', name: indexTopic};
						_this.webrtc.sendToAll('ros', {message: msg, nick: _this.webrtc.config.nick});
					}
					else
					{
						_this.ros_topics_subscribed[indexTopic] = true;
						_this.ros_topics[indexTopic].subscribe(jQuery.proxy(function(indexTopicLocal, eventNameLocal, message) {
							data = message; if (message.data != undefined) data = message.data; if(_this.ros_topics_subscribed_by_pc[indexTopicLocal]) _this.ROSMessageSendToPC({ topic: indexTopicLocal, data: data }); _this.options[eventNameLocal](data);
						}, _this, indexTopic, topic.event_name));
					}
				}
				else
					_this.ros_topics_subscribed[indexTopic] = false;
				
				topic.index = indexTopic;
				indexTopic++;
			});
		}
	}
	<?php
	}
	if ($haveDynamicService) {?>
	this.InitDynamicServices = function()
	{
		if (this.options.dynamic_services != undefined)
		{
			indexService = 10000;
			$.each(this.options.dynamic_services, function( index, service ) {
				if (_this.options.nick == 'robot') _this.ros_services[indexService] = new ROSLIB.Service({ ros : ros, name : service.service_name, messageType : service.message_type });
				
				service.index = indexService;
								
				indexService++;
			});
		}
	}
	this.CallDynamiqueService = function(service_name, parameters, function_return)
	{
		if (_this.options.nick != 'robot')
		{
			indexCurService = 0;
			$.each(this.options.dynamic_services, function( index, service ) {
				if (service.service_name == service_name)
				{
					indexCurService = service.index;
				}
			});
			
			if (indexCurService > 0)
			{
				
				this.ros_services[indexCurService] = function_return;
				msg = { action: 'callService', name: indexCurService, params : parameters};
				_this.webrtc.sendToAll('ros', {message: msg, nick: _this.webrtc.config.nick});
			}
			else
				console.log('Service not found');
		}
		else
		{
			indexCurService = 0;
			$.each(this.options.dynamic_services, function( index, service ) {
				console.log(service.service_name, service_name);
				if (service.service_name == service_name)
				{
					indexCurService = service.index;
				}
			});
			
			if (indexCurService > 0)
			{
				var request = new ROSLIB.ServiceRequest(parameters);
				_this.ros_services[indexCurService].callService(request, function_return);
			}
			else
				console.log('Service not found');
		}
	}
	<?php }?>
	
	<?php
	foreach($topic_pubs as $topic_pub)
	{
		if (in_array($topic_pub->function_name, $topic_pubs_interne)) continue;
		if ($topic_pub->function_name != '')
		{
			// On récupère les params d'entrée
			if ($topic_pub->function_name == 'TeleopRobot')
			{
				?>
				this.id_telop_topic = <?php echo $topic_pub->id_topic_pub;?>;
				this.<?php echo $topic_pub->function_name;?> = function(x, t) {
					if (_this.options.nick != 'robot')
					{
						msg = { action: 'publishTopic', name: '<?php echo $topic_pub->id_topic_pub;?>', 'data' : {'x':x, 't':t }};
						this.webrtc.sendToAll('ros', {message: msg, nick: _this.webrtc.config.nick});
					}
					else
					{
						twist = {
							angular: {
								x:0,
								y:0,
								z:t
							},
							linear: {
								x:x,
								y:0,
								z:0
							}
						};
						
						var msg = new ROSLIB.Message(twist);
						_this.ros_topic_pubs[<?php echo $topic_pub->id_topic_pub;?>].publish(msg);
					}
				},
				<?php
			}
			else
			{
				?>
				this.<?php echo $topic_pub->function_name;?> = function(data) {
					if (_this.options.nick != 'robot')
					{
						msg = { action: 'publishTopic', name: '<?php echo $topic_pub->id_topic_pub;?>', 'data' : data };
						this.webrtc.sendToAll('ros', {message: msg, nick: _this.webrtc.config.nick});
					}
					else
					{
						var msg = new ROSLIB.Message(data);
						_this.ros_topic_pubs[<?php echo $topic_pub->id_topic_pub;?>].publish(msg);
					}
				},
				<?php
			}
		}
	}
	?>
	
	<?php
	foreach($services as $service)
	{
		if (in_array($service->function_name, $services_interne)) continue;
		if ($service->function_name != '')
		{
			// On récupère les params d'entrée
			$params = $service->GetParams();
			$entrees = array();
			foreach($params['entree'] as $param)
			{
				$entrees[] = $param['nom'];
			}
			
			?>
			this.<?php echo $service->function_name;?> = function(<?php echo (count($entrees)>0)?implode(', ', $entrees).', ':'';?>function_return) {
				if (_this.options.nick != 'robot')
				{
					this.ros_services[<?php echo $service->id_service;?>] = function_return;
					msg = { action: 'callService', name: '<?php echo $service->id_service;?>', params : {<?php foreach($entrees as $i => $p) echo ($i>0?',':'').$p.':'.$p;?>}};
					_this.webrtc.sendToAll('ros', {message: msg, nick: _this.webrtc.config.nick});
				}
				else
				{
					var request = new ROSLIB.ServiceRequest({<?php foreach($entrees as $i => $p) echo ($i>0?',':'').$p.':'.$p;?>});
					<?php if($service->function_name == 'RobotMoveToName')
					{
						?>
						_this.ros_services[<?php echo $service->id_service;?>].callService(request, function(reponse)
						{
							_this._current_goal = data.goal_pose_feedback;
							function_return(reponse);
						});
						<?php
					}
					elseif($service->function_name == 'RobotStop')
					{
						?>
						if (_this._robot_state == 'undocked_navigating') _this._call_stop = true;
						_this.ros_services[<?php echo $service->id_service;?>].callService(request, function_return);
						<?php
					}
					else
					{
						?>
						_this.ros_services[<?php echo $service->id_service;?>].callService(request, function_return);
						<?php
					}?>
				}
			},
			<?php
		}
	}
	?>
	
	_this.ThetaToQuaternion = function (theta) {
		pitch = 0;
		roll = 0;
		
		// Abbreviations for the various angular functions
		cy = Math.cos(theta * 0.5);
		sy = Math.sin(theta * 0.5);
		cp = Math.cos(pitch * 0.5);
		sp = Math.sin(pitch * 0.5);
		cr = Math.cos(roll * 0.5);
		sr = Math.sin(roll * 0.5);
	
		q = {};
		q.w = cy * cp * cr + sy * sp * sr;
		q.x = cy * cp * sr - sy * sp * cr;
		q.y = sy * cp * sr + cy * sp * cr;
		q.z = sy * cp * cr - cy * sp * sr;
	
		return q;
	}
	
	<?php
	foreach($actions as $action)
	{
		if (in_array($action->function_name, $actions_interne)) continue;
		if ($action->function_name != '')
		{
			// On récupère les params d'entrée
			$params = $action->GetParams();
			$entrees = array();
			foreach($params['entree'] as $param)
			{
				$entrees[] = $param['nom'];
			}
			
			?>
			_this.<?php echo $action->function_name;?> = function(<?php echo implode(', ', $entrees);?>) {
				if (_this.options.nick != 'robot')
				{
					this.ros_actions[<?php echo $action->id_action;?>] = 'on';
					<?php if (count($entrees) == 0)
					{
						?>msg = { action: 'callAction', name: '<?php echo $action->id_action;?>', fname: '<?php echo $action->function_name;?>()', params : {}};<?php
					}
					else
					{
						?>msg = { action: 'callAction', name: '<?php echo $action->id_action;?>', fname: '<?php echo $action->function_name;?>('+<?php echo implode('+\', \'+', $entrees);?>+')', params : {<?php foreach($entrees as $i => $p) echo ($i>0?',':'').$p.':'.$p;?>}};<?php
					}
					?>
					
					_this.webrtc.sendToAll('ros', {message: msg, nick: _this.webrtc.config.nick});
				}
				else
				{
					<?php
					if ($action->function_name == 'RobotMoveTo')
					{
						?>
						if (<?php echo $entrees[0];?>.x != undefined)
						{
							<?php echo $entrees[0];?> = {
								'header': {
									'seq':0,
									'stamp':{'secs': 0, 'nsecs': 0},
									'frame_id':'map'
								},
								'pose': {
									'position': { 'x':<?php echo $entrees[0];?>.x, 'y':<?php echo $entrees[0];?>.y, 'z':0 },
									'orientation': _this.ThetaToQuaternion(<?php echo $entrees[0];?>.theta)
								}
							};
						}
							
						this.ros_goal_actions[<?php echo $action->id_action;?>] = new ROSLIB.Goal({
							actionClient : this.ros_actions[<?php echo $action->id_action;?>],
							goalMessage : {	<?php foreach($entrees as $i => $p) echo ($i>0?',':'').$p.':'.$p;?> }
						});
			
						this.ros_actions_feedback[<?php echo $action->id_action;?>] = _this.options.on<?php echo $action->function_name;?>Feedback;
						this.ros_actions_result[<?php echo $action->id_action;?>] = _this.options.on<?php echo $action->function_name;?>Result;
			
						this.ros_goal_actions[<?php echo $action->id_action;?>].on('feedback', function(feedback) {
							data = feedback; if (feedback.data != undefined) data = feedback.data; 
							_this.ROSMessageSendToPC({ action_feedback: <?php echo $action->id_action;?>, data: data }); 
							if (_this.options.on<?php echo $action->function_name;?>Feedback != undefined) _this.options.on<?php echo $action->function_name;?>Feedback(data);
						});
			
						this.ros_goal_actions[<?php echo $action->id_action;?>].on('result', function(result) {
							_this.EndAction(<?php echo $action->id_action;?>);
							data = result; if (result.data != undefined) data = result.data; 
							
							data.canceled = false;
							if (_this.ros_goal_actions[<?php echo $action->id_action;?>].lastStatut != undefined)
							{
								switch(_this.ros_goal_actions[<?php echo $action->id_action;?>].lastStatut)
								{
									case _this.ACTION_STATUS_PENDING: break;
									case _this.ACTION_STATUS_ACTIVE: break;
									case _this.ACTION_STATUS_PREEMPTED: data.success = false; data.canceled = true; break;
									case _this.ACTION_STATUS_SUCCEEDED: data.success = true; break;
									case _this.ACTION_STATUS_ABORTED: data.success = false; break;
									case _this.ACTION_STATUS_REJECTED: data.success = false; break;
									case _this.ACTION_STATUS_PREEMPTING: break;
									case _this.ACTION_STATUS_RECALLING: break;
									case _this.ACTION_STATUS_RECALLED: break;
									case _this.ACTION_STATUS_LOST: break;
								}
							}
							else
								data.success = false;
							
							if (_this.gotoDockInProgress)
							{
								if (data.success == undefined || !data.success)
								{
									_this.gotoDockInProgress = false;
									if (_this.gotoDockReturn != undefined) _this.gotoDockReturn(data);
								}
								else
								{
									_this.RobotDock();
								}
							}
							else
							{
								_this.ROSMessageSendToPC({ action_result: <?php echo $action->id_action;?>, data: data }); 
								if (_this.options.on<?php echo $action->function_name;?>Result != undefined) _this.options.on<?php echo $action->function_name;?>Result(data);
							}
						});
			
						this.ros_goal_actions[<?php echo $action->id_action;?>].on('status', function(result) {
							data = result; if (result.data != undefined) data = result.data;
							if (_this.ros_goal_actions[<?php echo $action->id_action;?>].lastStatut == undefined || _this.ros_goal_actions[<?php echo $action->id_action;?>].lastStatut != data.status)
							{
								_this.ros_goal_actions[<?php echo $action->id_action;?>].lastStatut = data.status;
								if (_this.gotoDockInProgress)
								{
									switch(data.status)
									{
										case _this.ACTION_STATUS_PENDING: break;
										case _this.ACTION_STATUS_ACTIVE: break;
										case _this.ACTION_STATUS_PREEMPTED: break;
										case _this.ACTION_STATUS_SUCCEEDED: break;
										case _this.ACTION_STATUS_ABORTED: break;
										case _this.ACTION_STATUS_REJECTED: break;
										case _this.ACTION_STATUS_PREEMPTING: break;
										case _this.ACTION_STATUS_RECALLING: break;
										case _this.ACTION_STATUS_RECALLED: break;
										case _this.ACTION_STATUS_LOST: break;
									}
								}
								else
								{
									_this.ROSMessageSendToPC({ action_status: <?php echo $action->id_action;?>, data: data }); 
									if (_this.options.on<?php echo $action->function_name;?>Status != undefined) _this.options.on<?php echo $action->function_name;?>Status(data);
								}
							}
						});
						
						this.ros_goal_actions[<?php echo $action->id_action;?>].send();
						this.StartAction(<?php echo $action->id_action;?>);
						<?php
					}
					elseif ($action->function_name == 'RobotDock')
					{
						?>
						this.ros_goal_actions[<?php echo $action->id_action;?>] = new ROSLIB.Goal({
							actionClient : this.ros_actions[<?php echo $action->id_action;?>],
							goalMessage : {	<?php foreach($entrees as $i => $p) echo ($i>0?',':'').$p.':'.$p;?> }
						});
			
						this.ros_actions_feedback[<?php echo $action->id_action;?>] = _this.options.on<?php echo $action->function_name;?>Feedback;
						this.ros_actions_result[<?php echo $action->id_action;?>] = _this.options.on<?php echo $action->function_name;?>Result;
			
						this.ros_goal_actions[<?php echo $action->id_action;?>].on('feedback', function(feedback) {
							data = feedback; if (feedback.data != undefined) data = feedback.data; 
							_this.ROSMessageSendToPC({ action_feedback: <?php echo $action->id_action;?>, data: data }); 
							if (_this.options.on<?php echo $action->function_name;?>Feedback != undefined) _this.options.on<?php echo $action->function_name;?>Feedback(data);
						});
			
						this.ros_goal_actions[<?php echo $action->id_action;?>].on('result', function(result) {
							_this.EndAction(<?php echo $action->id_action;?>);
							data = result; if (result.data != undefined) data = result.data;
							
							console.log('result dock', _this.ros_goal_actions[<?php echo $action->id_action;?>].lastStatut);
							
							data.canceled = false;
							
							if (_this.ros_goal_actions[<?php echo $action->id_action;?>].lastStatut != undefined)
							{
								switch(_this.ros_goal_actions[<?php echo $action->id_action;?>].lastStatut)
								{
									case _this.ACTION_STATUS_PENDING: break;
									case _this.ACTION_STATUS_ACTIVE: break;
									case _this.ACTION_STATUS_PREEMPTED: data.success = false; data.canceled = true; break;
									case _this.ACTION_STATUS_SUCCEEDED: data.success = true; break;
									case _this.ACTION_STATUS_ABORTED: data.success = false; break;
									case _this.ACTION_STATUS_REJECTED: data.success = false; break;
									case _this.ACTION_STATUS_PREEMPTING: break;
									case _this.ACTION_STATUS_RECALLING: break;
									case _this.ACTION_STATUS_RECALLED: break;
									case _this.ACTION_STATUS_LOST: break;
								}
							}
							else
								data.success = false;
								
							
							if (_this.gotoDockInProgress)
							{
								_this.gotoDockInProgress = false;
								if (_this.gotoDockReturn != undefined) _this.gotoDockReturn(data);
							}
							
							_this.ROSMessageSendToPC({ action_result: <?php echo $action->id_action;?>, data: data }); 
							if (_this.options.on<?php echo $action->function_name;?>Result != undefined) _this.options.on<?php echo $action->function_name;?>Result(data);
						});
			
						this.ros_goal_actions[<?php echo $action->id_action;?>].on('status', function(result) {
							data = result; if (result.data != undefined) data = result.data; 
							if (_this.ros_goal_actions[<?php echo $action->id_action;?>].lastStatut == undefined || _this.ros_goal_actions[<?php echo $action->id_action;?>].lastStatut != data.status)
							{
								console.log('status dock', data.status);
								_this.ros_goal_actions[<?php echo $action->id_action;?>].lastStatut = data.status;
								_this.ROSMessageSendToPC({ action_status: <?php echo $action->id_action;?>, data: data }); 
								if (_this.options.on<?php echo $action->function_name;?>Status != undefined) _this.options.on<?php echo $action->function_name;?>Status(data);
							}
						});
						
						this.ros_goal_actions[<?php echo $action->id_action;?>].send();
						this.StartAction(<?php echo $action->id_action;?>);
						<?php
					}
					else
					{
					?>
					
					this.ros_goal_actions[<?php echo $action->id_action;?>] = new ROSLIB.Goal({
						actionClient : this.ros_actions[<?php echo $action->id_action;?>],
						goalMessage : {	<?php foreach($entrees as $i => $p) echo ($i>0?',':'').$p.':'.$p;?> }
					});
		
					this.ros_actions_feedback[<?php echo $action->id_action;?>] = _this.options.on<?php echo $action->function_name;?>Feedback;
					this.ros_actions_result[<?php echo $action->id_action;?>] = _this.options.on<?php echo $action->function_name;?>Result;
		
					this.ros_goal_actions[<?php echo $action->id_action;?>].on('feedback', function(feedback) {
						data = feedback; if (feedback.data != undefined) data = feedback.data; 
						_this.ROSMessageSendToPC({ action_feedback: <?php echo $action->id_action;?>, data: data }); 
						if (_this.options.on<?php echo $action->function_name;?>Feedback != undefined) _this.options.on<?php echo $action->function_name;?>Feedback(data);
					});
		
					this.ros_goal_actions[<?php echo $action->id_action;?>].on('result', function(result) {
						_this.EndAction(<?php echo $action->id_action;?>);
						data = result; if (result.data != undefined) data = result.data; 
						
						data.canceled = false;
						if (_this.ros_goal_actions[<?php echo $action->id_action;?>].lastStatut != undefined)
						{
							switch(_this.ros_goal_actions[<?php echo $action->id_action;?>].lastStatut)
							{
								case _this.ACTION_STATUS_PENDING: break;
								case _this.ACTION_STATUS_ACTIVE: break;
								case _this.ACTION_STATUS_PREEMPTED: data.success = false; data.canceled = true; break;
								case _this.ACTION_STATUS_SUCCEEDED: data.success = true; break;
								case _this.ACTION_STATUS_ABORTED: data.success = false; break;
								case _this.ACTION_STATUS_REJECTED: data.success = false; break;
								case _this.ACTION_STATUS_PREEMPTING: break;
								case _this.ACTION_STATUS_RECALLING: break;
								case _this.ACTION_STATUS_RECALLED: break;
								case _this.ACTION_STATUS_LOST: break;
							}
						}
						else
							data.success = false;
						
						_this.ROSMessageSendToPC({ action_result: <?php echo $action->id_action;?>, data: data }); 
						if (_this.options.on<?php echo $action->function_name;?>Result != undefined) _this.options.on<?php echo $action->function_name;?>Result(data);
					});
		
					this.ros_goal_actions[<?php echo $action->id_action;?>].on('status', function(result) {
						data = result; if (result.data != undefined) data = result.data; 
						if (_this.ros_goal_actions[<?php echo $action->id_action;?>].lastStatut == undefined || _this.ros_goal_actions[<?php echo $action->id_action;?>].lastStatut != data.status)
						{
							_this.ros_goal_actions[<?php echo $action->id_action;?>].lastStatut = data.status;
							_this.ROSMessageSendToPC({ action_status: <?php echo $action->id_action;?>, data: data }); 
							if (_this.options.on<?php echo $action->function_name;?>Status != undefined) _this.options.on<?php echo $action->function_name;?>Status(data);
						}
					});
					
					this.ros_goal_actions[<?php echo $action->id_action;?>].send();
					this.StartAction(<?php echo $action->id_action;?>);
					<?php }
					?>
				}
			},
			this.<?php echo $action->function_name;?>Cancel = function() {
				if (_this.options.nick != 'robot')
				{
					this.ros_actions[<?php echo $action->id_action;?>] = 'on';
					msg = { action: 'callActionCancel', name: '<?php echo $action->id_action;?>', params : {}};
					_this.webrtc.sendToAll('ros', {message: msg, nick: _this.webrtc.config.nick});
				}
				else
				{
					this.ros_goal_actions[<?php echo $action->id_action;?>].cancel();
				}
			},
			<?php
		}
	}
	?>
	this.EndAction = function(indexAction)
	{
		this.currentAction = -1;
		if (_this.options.onRobotActionFinished != undefined) _this.options.onRobotActionFinished();
	}
	this.StartAction = function(indexAction)
	{
		this.currentAction = indexAction;
		if (_this.options.onRobotActionStarted != undefined) _this.options.onRobotActionStarted();
	}
	this.RobotStop = function(function_return)
	{
		if (_this.currentAction == -1)
		{
			if (function_return != undefined)
				function_return({ 'success':false, 'message':'No action in progress'});
		}
		else
		{
			//_this.gotoDockInProgress = false;
			if (_this.options.nick != 'robot')
			{
				this.ros_actions[_this.currentAction] = 'on';
				msg = { action: 'callActionCancel', name: '_this.currentAction', params : {}};
				_this.webrtc.sendToAll('ros', {message: msg, nick: _this.webrtc.config.nick});
			}
			else
			{
				this.ros_goal_actions[_this.currentAction].cancel();
			}
			
			if (function_return != undefined)
				function_return({ 'success':true, 'message':''});
		}
	}
	


	/*** MAP ***/
	this.contenuCarte = {};
	this.contenuCarteRotate = {};
	this.nbTailleOK = 0;
	this.nbTailleKO = 0;
	this.indexMap = 0;
	this.zoom_carte = 1;
	this.current_floor_view = 0;
	this.couleurs = {};
	this.couleursMap = {};
	this.rotation = false;
	this.alreadyInitCarte = false;
	this.nb_floor = 0;
	this.plan_ros_resolution = 0;
	this.largeurRos = 0;
	this.hauteurRos = 0;
	this.largeurSVG = 0;
	this.hauteurSVG = 0;
	this.saveHeight = 0;
	this.saveWidth = 0;
	this.pois = Array();
	this.boxs = Array();
	
	this._lastPoi = '';
	this._lastBox = '';
	this._lastPoint = '';
	
	this.GetPOIs = function()
	{
		if (_this.pois.length == 0)
		{
			for(var i= 0; i < _this.plans.length; i++)
			{
				for(var j= 0; j < _this.plans[i].pois.length; j++)
				{
					poi = _this.plans[i].pois[j];
					p = { "name":"poi"+poi.num, "position":poi.position, "floor":_this.plans[i].floor }
					_this.pois.push(p);
				}
			}
		}
		
		return _this.pois;
	}
	this.GetBoxs = function()
	{
		if (_this.boxs.length == 0)
		{
			for(var i= 0; i < _this.plans.length; i++)
			{
				for(var j= 0; j < _this.plans[i].boxs.length; j++)
				{
					box = _this.plans[i].boxs[j];
					b = { "name":"box"+box.numbox, "position":box.position, "floor":_this.plans[i].floor }
					_this.boxs.push(b);
				}
			}
		}
		
		return _this.boxs;
	}
	this.RobotMoveToDockExecute = function(num_dock)
	{
		if (_this.posesDock[num_dock] != undefined)
		{
			_this.gotoDockInProgress = true;
			_this.RobotMoveTo(_this.posesDock[num_dock]);
		}
	}
	this.RobotMoveToDock = function(num_dock, return_function)
	{
		_this.gotoDockNum = num_dock;
		_this.gotoDockReturn = return_function;
		if (_this.posesDock[_this.gotoDockNum] == undefined)
		{			
			_this.GetParam('/poses_coordinates/dock'+_this.gotoDockNum, 		function(value) { if (value != null) { _this.posesDock[_this.gotoDockNum] = value; _this.RobotMoveToDockExecute(_this.gotoDockNum); } 	});	
		}
		else
		{
			_this.RobotMoveToDockExecute(_this.gotoDockNum);
		}
		
		//return_function({"success":false, "message":"Unknown poi name"});
	}
	this.RobotMoveToPOI = function(poi_name, return_function)
	{
		_this.GetPOIs();
		for(var i= 0; i < _this.pois.length; i++)
		{
			if (poi_name == _this.pois[i].name)
			{
				_this._lastPoi = poi_name;
				_this._lastBox = '';
				_this._lastPoint = '';
				
				_this.RobotMoveTo({"x":parseFloat(_this.pois[i].position.x), "y":parseFloat(_this.pois[i].position.y), "theta":parseFloat(_this.pois[i].position.t) }, return_function);
				return;
			}
		}
		
		return_function({"success":false, "message":"Unknown poi name"});
	}
	this.RobotMoveToBox = function(box_name, return_function)
	{
		_this.GetBoxs();
		for(var i= 0; i < _this.boxs.length; i++)
		{
			if (box_name == _this.boxs[i].name)
			{
				_this._lastPoi = '';
				_this._lastBox = box_name;
				_this._lastPoint = '';
				//console.log('box trouve', _this.boxs[i]);
				//console.log('call', {"x":parseFloat(_this.boxs[i].position.x), "y":parseFloat(_this.boxs[i].position.y), "theta":parseFloat(_this.boxs[i].position.t) });
				_this.RobotMoveTo({"x":parseFloat(_this.boxs[i].position.x), "y":parseFloat(_this.boxs[i].position.y), "theta":parseFloat(_this.boxs[i].position.t) }, return_function);
				return;
			}
		}
		
		return_function({"success":false, "message":"Unknown box name"});
	}
	
	this.MapGetHTML = function(return_function)
	{
		jQuery.ajax({
			url: _this.options.serveurWyca+'API/webservices/v1.0/json/plans_contenu',
			type: "get",
			timeout: 5000,
			beforeSend: function(x) {
				x.setRequestHeader ("Authorization", "Basic " + btoa(_this.options.api_key + ':'));
			},
			error: function(jqXHR, textStatus, errorThrown) {
				throw new Error('WycaAPI get plans error')
			},
			success: function(data, textStatus, jqXHR) {
				if (data != '')
				{
					d = jQuery.parseJSON(data);
					
					_this.contenuCarte = {};
					_this.contenuCarteRotate = {};

					for (i=0; i<d.contenuCarte.length; i++)
					{
						if (d.contenuCarte[i] != '')
						{
							_this.nb_floor++;
							_this.contenuCarte[i] = d.contenuCarte[i];
							jQuery.fn.vectorMap('addMap','planjson'+i, _this.contenuCarte[i]);
						}
					}
					for (i=0; i<d.contenuCarteRotate.length; i++)
					{
						if (d.contenuCarteRotate[i] != '')
						{
							_this.contenuCarteRotate[i] = d.contenuCarteRotate[i];
							jQuery.fn.vectorMap('addMap','planjsonRotate'+i, _this.contenuCarteRotate[i]);
						}
					}
					
					html = '<div id="map_wyca">';
					html += '<div id="boutons_zoom"><a id="zoom_plus" href="#" class="btn btn-sm btn-primary"><i class="fa fa-plus"></i></a><a id="zoom_moins" href="#" class="btn btn-sm btn-primary"><i class="fa fa-minus"></i></a></div>';
					if (_this.plans.length > 1)
					{
						html += '<div id="list_etage"><ul><li><a href="#" id="btn_floor_up"><i class="fa fa-chevron-up"></i></a></li>';
						$.each(_this.plans, function( index, plan ) {
							html += '<li><a href="#" class="btn_etage btn_etage_'+plan.floor+'" data-floor="'+plan.floor+'"><i class="fa fa-square-o fa-2x" style="transform:scale(1, 0.5) rotate(45deg);"></i> <span>'+plan.floor_name+'</span></a></li>';
						});
						html += '<li><a href="#" id="btn_floor_down"><i class="fa fa-chevron-down"></i></a></li></ul></div>';
					}
					
					html += '<div id="zoom_carte">';
					first = true;
					$.each(_this.plans, function( index, plan ) {
						html += '<div id="zoom_carte_'+plan.floor+'" class="element_floor element_floor_'+plan.floor+'" style="';
						if (!first) html += 'display:none;';
						html +='">';
						html +='<img src="<?php echo $URL_WYCA;?>/plans/'+plan.image+'" id="zoom_carte_mapBox_'+plan.floor+'" class="img-responsive"/>';
						html +='<img src="<?php echo $URL_WYCA;?>/plans/rotate_'+plan.image+'" id="zoom_carte_mapBoxRotate_'+plan.floor+'" class="img-responsive" />';
						html +='<div id="zone_zoom_'+plan.floor+'" class="zone_zoom"></div>';
						html +='<div id="zone_zoom_click_'+plan.floor+'" class="zone_zoom_click"></div>';
						html +='</div>';
						first = false;
					});
					html +='</div>';
					
					first = true;
					$.each(_this.plans, function( index, plan ) {
						html +='<div id="overflow_div_'+plan.floor+'" class="overflow_div element_floor element_floor_'+plan.floor+'"';
						if (!first) html += 'display:none;';
						html +='">';
						html +='<div id="all_map_'+plan.floor+'" class="all_map">';
						html +='<div class="map_navigation" id="map_navigation_'+plan.floor+'">';
						html +='<img src="<?php echo $URL_WYCA;?>/plans/'+plan.image+'" id="mapBox_'+plan.floor+'" class="img-responsive mapBox" />';
						html +='<img src="<?php echo $URL_WYCA;?>/plans/rotate_'+plan.image+'" id="mapBoxRotate_'+plan.floor+'" class="img-responsive mapBox" />';
						html +='<div id="robotOnMap_'+plan.floor+'" class="robotOnMap"><i class="fa fa-map-marker fa-2x"></i></div>';
						html +='<div id="robotDestination_'+plan.floor+'" class="robotDestination hidden battery-ok"><i class="fa fa-map-marker"></i></div>';
						html +='<div id="boxsmap_'+plan.floor+'" class="boxsmap"></div>';
						html +='</div>';
						html +='<div style="clear:both;"></div>';
						html +='</div>';
						html +='</div>';
						first = false;
					});
					
					return_function(html);
				}
			}
		});
	}
	this.MapInit = function(maxWidth, maxHeight)
	{
		if ($('#map_wyca').length == 0)
		{
			throw new Error('WycaAPI - you need to add HTML on your page before call init')
			return;
		}
		
		$('#map_wyca').css('max-width', maxWidth+'px');
		$('#map_wyca').css('max-height', maxHeight+'px');
		$('#map_wyca .overflow_div').css('max-width', maxWidth+'px');
		$('#map_wyca .overflow_div').css('max-height', maxHeight+'px');
		
		$('#map_wyca #zoom_plus').click(function(e) { e.preventDefault(); z = _this.zoom_carte;	if (z < 1) z = z*2; else z++; _this.zoom_carte = z; _this.AppliquerZoom(); });
		$('#map_wyca #zoom_moins').click(function(e) { e.preventDefault(); z = _this.zoom_carte; if (z <= 1) z = 1; else z--; if (_this.zoom_carte != z) { _this.zoom_carte = z; _this.AppliquerZoom(); }});
		
		$('#map_wyca #btn_floor_up').click(function(e) { e.preventDefault();	if (_this.current_floor_view+1<_this.nb_floor) { _this.current_floor_view++; 	_this.RefreshFloor(); } });
		$('#map_wyca #btn_floor_down').click(function(e) { e.preventDefault(); if (_this.current_floor_view>0) { _this.current_floor_view--; _this.RefreshFloor(); } });
		$('#map_wyca .btn_etage').click(function(e) { e.preventDefault(); _this.current_floor_view = $(this).data('floor'); _this.RefreshFloor(); });
		
		$('#map_wyca .overflow_div').scroll(function(e) { _this.RefreshZoomView(); });
		$('#map_wyca .zone_zoom_click').click(function(e) {
            e.preventDefault();
			
			w = $('#map_wyca #zoom_carte_'+_this.current_floor_view).width();
			h = $('#map_wyca #zoom_carte_'+_this.current_floor_view).height();
			
			wAll = $('#map_wyca #all_map_'+_this.current_floor_view).width();
			hAll = $('#map_wyca #all_map_'+_this.current_floor_view).height();
			
			wOver = $('#map_wyca #overflow_div_'+_this.current_floor_view).width();
			hOver = $('#map_wyca #overflow_div_'+_this.current_floor_view).height();
			
			wZoom = $('#map_wyca #zone_zoom_'+_this.current_floor_view).width();
			hZoom = $('#map_wyca #zone_zoom_'+_this.current_floor_view).height();
			
			x = e.offsetX - wZoom / 2;
			y = e.offsetY - hZoom / 2;
			
			$('#overflow_div_'+_this.current_floor_view).scrollLeft(x / w * wAll);
			$('#overflow_div_'+_this.current_floor_view).scrollTop(y / h * hAll);
			
        });
		
		for (i=0; i < this.nb_floor; i++)
		{
			this.couleursMap[i] = {};
			if (this.contenuCarte[i] != undefined)
			{
				for(var p in this.contenuCarte[i].paths)
				{
					if (this.contenuCarte[i].paths[p].name.substr(0,5) == "route")
					{
						this.couleursMap[i][p] = "#EEEEEE";
					}
				}
			}
		}
		
		this.current_floor_view = this.current_floor;
		$('.element_floor').hide();
		$('.element_floor_'+this.current_floor_view).show();
		
		if (!this.alreadyInitCarte)
			this.alreadyInitCarte = true; 
		else
		{
			this.couleursTemp = {};
			
			for (i=0; i < this.nb_floor; i++)
			{
				$('#map_wyca #boxsmap_'+i+' path').each(function(index, element) {
					$(this).attr('fill',$(this).attr('original')); 
				});
			}
			
			this.RefreshFloor();
			return;
		}
		
		if (this.largeurSVG > this.hauteurSVG)
		{
			if (maxWidth > maxHeight)
				this.rotation = false;
			else
				this.rotation = true;
		}
		else
		{
			if (maxWidth < maxHeight)
				this.rotation = false;
			else
				this.rotation = true;
		}
		
		if (this.rotation)
		{
			t = this.hauteurSVG;
			this.hauteurSVG = this.largeurSVG;
			this.largeurSVG = t;
			
			for (i=0; i < this.nb_floor; i++)
			{
				$('#map_wyca #mapBoxRotate_'+i).show();
				$('#map_wyca #mapBox_'+i).hide();
				$('#map_wyca #zoom_carte_mapBoxRotate_'+i).show();
				$('#map_wyca #zoom_carte_mapBox_'+i).hide();	
			}
		}
		else
		{
			for (i=0; i < this.nb_floor; i++)
			{
				$('#map_wyca #mapBoxRotate_'+i).hide();
				$('#map_wyca #mapBox_'+i).show();
				$('#map_wyca #zoom_carte_mapBoxRotate_'+i).hide();
				$('#map_wyca #zoom_carte_mapBox_'+i).show();	
			}
		}
		
		this.saveWidth = maxWidth; //$('#map_wyca').width();
		this.saveHeight = this.saveWidth * this.hauteurSVG / this.largeurSVG;
		
		if (this.saveWidth * this.hauteurSVG / this.largeurSVG > maxHeight)
		{
			this.saveHeight = maxHeight;
			this.saveWidth = this.saveHeight * this.largeurSVG / this.hauteurSVG;
		}
		
		for (i=0; i < this.nb_floor; i++)
			$('#map_wyca #map_navigation_'+i).height($('#map_wyca #map_navigation_'+i).width() * this.hauteurSVG / this.largeurSVG);
		
		if (this.rotation)
		{
			for (i=0; i < this.nb_floor; i++)
			{
				if (this.saveHeight < $('#map_wyca #map_navigation_'+i).height())
				{
					
					$('#map_wyca #map_navigation_'+i).height(this.saveHeight);	
					$('#map_wyca #mapBoxRotate_'+i).height(this.saveHeight);	
					$('#map_wyca #boxsmap_'+i).width($('#map_wyca #map_navigation_'+i).height() * this.largeurSVG / this.hauteurSVG);
					$('#map_wyca #boxsmap_'+i).height($('#map_wyca #map_navigation_'+i).height());
				}
				else
				{
					$('#map_wyca #boxsmap_'+i).width($('#map_wyca #map_navigation_'+i).width());
					$('#map_wyca #boxsmap_'+i).height($('#map_wyca #map_navigation_'+i).width() * this.hauteurSVG / this.largeurSVG);
				}
			}
		}
		else
		{
			for (i=0; i < this.nb_floor; i++)
			{
				if (this.saveHeight < $('#map_wyca #map_navigation_'+i).height())
				{	
					$('#map_wyca #mapBox_'+i).height(this.saveHeight);	
					$('#map_wyca #map_navigation_'+i).height(this.saveHeight);	
					$('#map_wyca #boxsmap_'+i).width($('#map_wyca #map_navigation_'+i).height() * this.largeurSVG / this.hauteurSVG);
					$('#map_wyca #boxsmap_'+i).height($('#map_wyca #map_navigation_'+i).height());
				}
				else
				{
					$('#map_wyca #boxsmap_'+i).width($('#map_wyca #map_navigation_'+i).width());
					$('#map_wyca #boxsmap_'+i).height($('#map_wyca #map_navigation_'+i).width() * this.hauteurSVG / this.largeurSVG);
				}
			}
		}
		
		var offsetMap;
		
		for (f=0; f < this.nb_floor; f++)
		{
			var mapToLoad = 'planjson'+f;
			if (this.rotation) mapToLoad = 'planjsonRotate'+f;
			
			this.indexMap++;
			
			couleurs = this.couleursMap[f];
			
			$('#map_wyca #boxsmap_'+f).vectorMap({
				map: mapToLoad,
				hoverOpacity: 0,
				hoverColor: "#B7BF0D",
				backgroundColor: "transparent",
				color: "#F5F0EA",
				colors: this.couleursMap[f],
				borderColor: "#000000",
				borderWidth: 1,
				selectedColor: "#F0802E",
				enableZoom: false,
				showTooltip: false,
				showLabels: false,
				onLoad: function (event, map) {
					
					offsetMap= $('#map_wyca #map_navigation_'+f).offset();
					var availableTags = [];
					
					nbTailleOK = 0;
					nbTailleKO = 0;
					
					jQuery.each(_this.contenuCarte[f].paths, function(i, val) {
					  
					  if (val.numbox != undefined)
					  {
						l = jQuery('<div/>').addClass('jqvmap-nom jqvmap-nom').appendTo($('#map_navigation_'+f))
						
						l.attr('id', 'jqvmap-nom-'+i);
						
						path = $('#map_wyca #boxsmap_'+f+' #jqvmap'+_this.indexMap+'_'+i);
						offsetRegion = $('#boxsmap_'+f+' #jqvmap'+_this.indexMap+'_'+i).position();
						
						l.html(val.numbox);
						
						bc = $('#map_wyca #boxsmap_'+f+' #jqvmap'+_this.indexMap+'_'+i)[0].getBoundingClientRect();
					
						w = bc.width;
						h = bc.height;
						
						bcl = l[0].getBoundingClientRect();
						
						l.css('left', offsetRegion.left - offsetMap.left + w / 2 - bcl.width / 2 );
						l.css('top', offsetRegion.top - offsetMap.top + h / 2 - bcl.height / 2);
						
						if (l.width() > w && l.height() > h)
							_this.nbTailleKO++;
						else
							_this.nbTailleOK++;
						
						availableTags.push(val.numbox);
					  }
					  
					});
					
					if (_this.nbTailleOK > _this.nbTailleKO)
					  $('#map_wyca #map_navigation_'+f+' .jqvmap-nom').show();
					else
					  $('#map_wyca #map_navigation_'+f+' .jqvmap-nom').hide();
					
					_this.InitNomMap(f);
					
				},
				onRegionOver: function (event, code, region) {
					if (region.length >= 5 && region.substr(0, 5) == "route") event.preventDefault();
				},
				onRegionOut: function (event, code, region) {
					if (region.length >= 5 && region.substr(0, 5) == "route") event.preventDefault();				
				},
				onRegionClick: function (element, events, code, region) {
					
					jQuery('#map_wyca #boxsmap_'+_this.current_floor_view).vectorMap('set', 'selectedRegions', '');
					
					// route
					events.preventDefault();
					
					var offset = $('#map_wyca #map_navigation_'+_this.current_floor_view).offset();
					
					if (events.pageX != undefined)
					{
						x = events.pageX - offset.left;
						y = events.pageY - offset.top;
					}
					else
					{
						offsetMap= $('#map_wyca #map_navigation_'+_this.current_floor_view).offset();
						offsetRegion = $('#map_wyca #boxsmap_'+_this.current_floor_view+' #jqvmap'+(_this.current_floor_view+1)+'_'+code).position();
						
						x = offsetRegion.left - offsetMap.left + $('#map_wyca #boxsmap_'+_this.current_floor_view+' #jqvmap'+(_this.current_floor_view+1)+'_'+code)[0].getBoundingClientRect().width / 2;
						y = offsetRegion.top - offsetMap.top + $('#map_wyca #boxsmap_'+_this.current_floor_view+' #jqvmap'+(_this.current_floor_view+1)+'_'+code)[0].getBoundingClientRect().height / 2;
					}
					
					$('#map_wyca #robotDestination_'+_this.current_floor_view).css('left', x - 7);
					$('#map_wyca #robotDestination_'+_this.current_floor_view).css('bottom', $('#map_navigation_'+_this.current_floor_view).height() - y);
					$('#map_wyca #robotDestination_'+_this.current_floor_view).removeClass('hidden');
					
					if (_this.rotation)
					{	
						//x = $('#mapBox_'+_this.current_floor_view).width() - x;
										
						yt = x / $('#boxsmap_'+_this.current_floor_view).width() * _this.hauteurRos;
						xt = y / $('#boxsmap_'+_this.current_floor_view).width() * _this.hauteurRos;
						
						x = xt;
						y = yt;
					}
					else
					{
						y = $('#mapBox_'+_this.current_floor_view).height() - y;

						x = x / $('#boxsmap_'+_this.current_floor_view).width() * _this.largeurRos;
						y = y / $('#boxsmap_'+_this.current_floor_view).width() * _this.largeurRos;
					}
					
					x = x * _this.plan_ros_resolution / 100;
					y = y * _this.plan_ros_resolution / 100;
					
					if (region.substr(0,5) == 'route')
					{
						if (_this.options.onMapRouteClick != undefined)
						{
							_this.options.onMapRouteClick({'x':x, 'y':y});
						}
					}
					else
					{
						if (_this.options.onMapBoxClick != undefined)
						{
							numbox = $('#map_navigation_'+_this.current_floor_view+' #jqvmap-nom-'+code).html();
							_this.options.onMapBoxClick('box'+numbox);
						}
					}
				},
				onRegionSelect: function (event, code, region) {
					event.preventDefault();
				},
				onLabelShow: function (event, label, code)
				{
					event.preventDefault();
				}
			});
		}
		
		couleurs = _this.couleursMap[_this.current_floor];
		
		this.saveWidth = 0;
		this.RefreshFloor();
	}
	this.InitNomMap = function(i)
	{
		$('#map_wyca #map_navigation_'+i+' .jqvmap-nom').hover(function(e)
		{
			index = $(this).attr('id').split('-');
			index = index[index.length-1];
			$('#map_wyca #boxsmap_'+i+' #jqvmap'+(i+1)+'_'+index).mouseenter();
		}, function (e)
		{
			index = $(this).attr('id').split('-');
			index = index[index.length-1];
			$('#map_wyca #boxsmap_'+i+' #jqvmap'+(i+1)+'_'+index).mouseleave();
		});
		
		$('#map_wyca #map_navigation_'+i+' .jqvmap-nom').click(function(e) {
			index = $(this).attr('id').split('-');
			index = index[index.length-1];
			$('#map_wyca #boxsmap_'+i+' #jqvmap'+(i+1)+'_'+index).click();
		});
	}
	this.RefreshFloor = function()
	{
		$('#map_wyca .element_floor').hide();
		$('#map_wyca .element_floor_'+this.current_floor_view).show();
		
		this.zoom_carte = 1;
		this.AppliquerZoom();
		
		$('#map_wyca #btn_floor_up').removeClass('disabled');
		$('#map_wyca #btn_floor_down').removeClass('disabled');
		if (this.current_floor_view == 0) $('#map_wyca #btn_floor_down').addClass('disabled');
		if (this.current_floor_view+1 == this.nb_floor) $('#map_wyca #btn_floor_up').addClass('disabled');
		
		$('#map_wyca .btn_etage').removeClass('current_floor');
		$('#map_wyca .btn_etage_'+this.current_floor_view).addClass('current_floor');
		
	}
	this.AppliquerZoom = function()
	{
		$('#map_wyca .jqvmap-nom').hide();
		
		if (this.saveWidth == 0)
		{
			this.saveWidth = $('#map_wyca #boxsmap_'+this.current_floor_view).width();
			if ($('#map_wyca #boxsmap_'+this.current_floor_view).height() > $('#map_wyca #overflow_div_'+this.current_floor_view).height())		
			{
				$('#map_wyca #boxsmap_'+this.current_floor_view).height($('#map_wyca #overflow_div_'+this.current_floor_view).height())
				$('#map_wyca #boxsmap_'+this.current_floor_view).width( $('#map_wyca #overflow_div_'+this.current_floor_view).height() * this.largeurSVG / this.hauteurSVG);
				
				this.saveWidth = $('#boxsmap_'+this.current_floor_view).width();
			}
		}
		
		$('#map_wyca #all_map_'+this.current_floor_view).width(this.saveWidth * this.zoom_carte);
		$('#map_wyca #map_navigation_'+this.current_floor_view).width(this.saveWidth * this.zoom_carte);
		$('#map_wyca #map_navigation_'+this.current_floor_view).height($('#map_wyca #map_navigation_'+this.current_floor_view).width() * this.hauteurSVG / this.largeurSVG);
		$('#map_wyca #mapBox_'+this.current_floor_view).width(this.saveWidth * this.zoom_carte);
		$('#map_wyca #mapBox_'+this.current_floor_view).height('auto');
		$('#map_wyca #mapBoxRotate_'+this.current_floor_view).width(this.saveWidth * this.zoom_carte);
		$('#map_wyca #mapBoxRotate_'+this.current_floor_view).height('auto');
		
		$('#map_wyca #boxsmap_'+this.current_floor_view).width(this.saveWidth * this.zoom_carte);
		$('#map_wyca #boxsmap_'+this.current_floor_view).height($('#map_wyca #map_navigation_'+this.current_floor_view).width() * this.hauteurSVG / this.largeurSVG);
		
		$('#map_wyca #boxsmap_'+this.current_floor_view).resize();
		
		this.PositionneRobot(this.lastCoordRobot);
		this.RefreshZoomView();
		this.ReplaceNumBox();
		
		setTimeout(function() { $('#map_wyca #boxsmap_'+_this.current_floor_view).resize(); }, 500);
		setTimeout(function() { _this.ReplaceNumBox(); }, 200);
		setTimeout(function() { _this.ReplaceNumBox(); }, 500);
	}
	
	this.RefreshZoomView = function()
	{
		w = $('#map_wyca #zoom_carte_'+this.current_floor_view).width();
		h = $('#map_wyca #zoom_carte_'+this.current_floor_view).height();
		
		wAll = $('#map_wyca #all_map_'+this.current_floor_view).width();
		hAll = $('#map_wyca #all_map_'+this.current_floor_view).height();
		
		wOver = $('#map_wyca #overflow_div_'+this.current_floor_view).width();
		hOver = $('#map_wyca #overflow_div_'+this.current_floor_view).height();
		
		wNew = w * wOver/wAll;
		if (wNew > w) wNew = w;
		hNew = h * hOver/hAll;
		if (hNew > h) hNew = h;
		
		$('#map_wyca #zone_zoom_'+this.current_floor_view).width(wNew - 2);
		$('#map_wyca #zone_zoom_'+this.current_floor_view).height(hNew - 2);
		
		t = document.getElementById('overflow_div_'+this.current_floor_view).scrollTop;
		l = document.getElementById('overflow_div_'+this.current_floor_view).scrollLeft;
				
		$('#map_wyca #zone_zoom_'+this.current_floor_view).css('top', t/hAll * h - 1);
		$('#map_wyca #zone_zoom_'+this.current_floor_view).css('left', l/wAll * w -1);
		
	}
	this.lastCoordRobot = '';
	this.PositionneRobot = function (coord)
	{
		if (coord == undefined || coord.x == undefined) return;
		this.lastCoordRobot = coord;
		
		$('#map_wyca .robotOnMap').hide();
		
		if (_this.rotation)
		{
			x = (coord.y * 100 / this.plan_ros_resolution) / this.largeurRos * $('#map_wyca #boxsmap_'+this.current_floor).height() - 8;
			y = (coord.x * 100 / this.plan_ros_resolution) / this.largeurRos * $('#map_wyca #boxsmap_'+this.current_floor).height();
			//x = $('#boxsmap').width() - x;
			y = $('#map_wyca #boxsmap_'+i).height() - y;
		}
		else
		{
			x = (coord.x * 100 / this.plan_ros_resolution) / this.largeurRos * $('#map_wyca #boxsmap_'+this.current_floor).width() - 8;
			y = (coord.y * 100 / this.plan_ros_resolution) / this.largeurRos * $('#map_wyca #boxsmap_'+this.current_floor).width();
		}
		
		$('#map_wyca #robotOnMap_'+this.current_floor).css('left', x);
		$('#map_wyca #robotOnMap_'+this.current_floor).css('bottom', y);
		
		y = $('#map_wyca #boxsmap_'+this.current_floor).height() - y;
		
		$('#map_wyca #robotOnMap_'+this.current_floor).show();
		
		if (!$('#map_wyca #robotDestination_'+this.current_floor).hasClass('hidden'))
		{
			if ($('#map_wyca #robotDestination_'+this.current_floor).length > 0)
			{
				p = $('#map_wyca #robotDestination_'+this.current_floor).position();
				p.top += 24;
				if (x-15 <= p.left && p.left <= x+15
				&& y-15 <= p.top && p.top <= y+15)
				{
					$('#map_wyca #robotDestination_'+this.current_floor).addClass('hidden');
				}
			}
		}
	}
	this.replaceIndex = 0;
	this.ReplaceNumBox = function()
	{
		this.replaceIndex++;
		var replaceIndexLocal = this.replaceIndex;
		offsetMap= $('#map_wyca #map_navigation_'+this.current_floor_view).offset();
		
		$('#map_wyca .jqvmap-pin').hide();
		
		this.nbTailleOK = 0;
		this.nbTailleKO = 0;
		//$('.jqvmap-nom').hide();
		
		w = 20;
		h = 12;
		
		jQuery.each(this.contenuCarte[this.current_floor_view].paths, function(i, val) {
		  if (replaceIndexLocal == _this.replaceIndex)
		  {
			  if (val.numbox != undefined)
			  {
				l = $('#map_wyca #map_navigation_'+_this.current_floor_view+' #jqvmap-nom-'+i);
				
				path = $('#map_wyca #map_navigation_'+_this.current_floor_view+' #jqvmap'+(_this.current_floor_view+1)+'_'+i);
				offsetRegion = $('#map_wyca #map_navigation_'+_this.current_floor_view+' #jqvmap'+(_this.current_floor_view+1)+'_'+i).position();
				
				if ($('#map_wyca #map_navigation_'+_this.current_floor_view+' #jqvmap'+(_this.current_floor_view+1)+'_'+i).length > 0)
				{
					bc = $('#map_wyca #map_navigation_'+_this.current_floor_view+' #jqvmap'+(_this.current_floor_view+1)+'_'+i)[0].getBoundingClientRect();
					w = bc.width;
					h = bc.height;
				}
				
				bcl = l[0].getBoundingClientRect();
				
				if (bcl.width == 0) bcl.width = l.html().lenght * 3.812 + 1.876;
				if (bcl.height == 0) bcl.height = 14;
				
				l.css('left', offsetRegion.left - offsetMap.left + w / 2 - bcl.width / 2 );
				l.css('top', offsetRegion.top - offsetMap.top + h / 2 - bcl.height / 2);
				
				if (l.width() > w && l.height() > h)
					_this.nbTailleKO++;
				else
					_this.nbTailleOK++;
				
			  }
		  }
		  else return false
		  	
		});
	  
	  if (this.nbTailleOK > this.nbTailleKO)
	  	$('.jqvmap-nom').show();
	  else
	  	$('.jqvmap-nom').hide();
	}
	
	
	/*** WEBRTC ***/
	
	this.SetRoom = function(room)
	{
		this.options.room = room;
	}
	
	
	this.WithVideo = function(use_video)
	{
		this.options.with_video = use_video;
	}
	this.WithAudio = function(use_audio)
	{
		this.options.with_audio = use_audio;
	}
	
	this.StartWebRTCWithRobot = function ()
	{
		this.call_from_admin = true;
		if (this.options.room == '' || this.options.room == undefined)
			this.options.room = "Room";
		this.SendServerMessageToRobot('StartCall|'+_this.options.room);
		this.StartWebRTC(false);
	}
	
	this.StartWebRTC = function(reply)
	{
		this.reply = reply;
		isStarted = true;
		if (pc_config != null)
		{
			index = 1;
			indexVideo = 0;
			
			var _this = this;
			
			if (_this.options.room == undefined || _this.options.room == '')
				_this.options.room = "Room"+_this.options.nick;
			
			if (this.options.with_video)
			{
				if (this.options.webcam_name != '')
				{
					navigator.mediaDevices.enumerateDevices().then(function (devices) {
					  trouve = false;	
					
					  for (var i = 0; i !== devices.length; ++i) {
						  var device = devices[i];
						  if (device.kind === 'videoinput' && device.label == _this.options.webcam_name) {
							  trouve = true;
							  mediaoptions = {"audio": _this.options.with_audio, "video": { "deviceId": device.deviceId }};
							  _this.StartWebRTCReal(reply, mediaoptions);
						  }
					  }
					  
					  if (!trouve)
					  {
						  if(_this.options.webcam_id != '')
							mediaoptions = {"audio": _this.options.with_audio, "video": { "deviceId": _this.options.webcam_id }};
						  else
							mediaoptions = {"audio": _this.options.with_audio, "video": true };
						  _this.StartWebRTCReal(reply, mediaoptions);
					  }
					});
				}
				else
				{
					if(this.options.webcam_id != '')
						mediaoptions = {"audio": _this.options.with_audio, "video": { "deviceId": _this.options.webcam_id }};
					else
						mediaoptions = {"audio": _this.options.with_audio, "video": true };
						
					this.StartWebRTCReal(reply, mediaoptions);
				}
			}
			else
			{
				mediaoptions = {"audio": _this.options.with_audio, "video": false };
				this.StartWebRTCReal(reply, mediaoptions);
			}
		}
	}
	
	this.StartWebRTCReal = function(reply, mediaoptions)
	{	
		
		_this.webrtc = new WycaWebRTC({
			// immediately ask for camera access
			localVideoEl: _this.options.video_element_id,
			autoRequestMedia: true,
			media: mediaoptions,
			nick: _this.options.nick,
			peerConnectionConfig:pc_config
		});
		
		
		_this.webrtc.on('readyToCall', function () {
			if (!_this.options.with_audio && !_this.options.with_video) // Pas d'audio ni de video
			{
				if (_this.options.onEquipmentOK  != undefined)
					_this.options.onEquipmentOK();
				
				if (!_this.reply)
				{
					if (!_this.call_from_admin)
						_this.SendServerMessage('StartCall|'+_this.options.room);
				}
				
				_this.reply = false;
			}
			
			_this.webrtc.joinRoom(_this.options.room);
		});
		
		_this.webrtc.on('channelClose', function (data) {
			if (data.label == 'wycawebrtc' && data.readyState == 'closed')
			{
				if (!_this.closing)
				{
					if (_this.options.onLostConnection  != undefined)
						_this.options.onLostConnection();
					if (_this.options.checkLostConnection && timerFinCall == null)
						timerFinCall = setTimeout(_this.finCallDeconnect, _this.options.delay_lost_connexion * 1000);
				}
				else
				{
					_this.closing = false;
					//if (_this.options.onSessionClosed  != undefined)
					//	_this.options.onSessionClosed();
				}
			}
		});
		_this.webrtc.on('channelOpen', function (data) {
			if (data.label == 'wycawebrtc' && data.readyState == 'open')
			{
				if (_this.options.nick != 'robot') 
				{
					_this.webrtc.sendToAll('ros', {message: { action: 'connect'}, nick: _this.webrtc.config.nick});
					_this.SubscribeData();
					
					<?php
					// Init sur demande
					$id_services_topics = $user->GetIdServicesAndTopicsToInit();
					foreach($id_services_topics as $id_service => $id_topics)
					{
						if (isset($services_by_id[$id_service]))
						{
							$conds = array();
							foreach($id_topics as $id_topic)
							{
								$conds[] = '_this.options.'.$topics_by_id[$id_topic]->event_name.' != undefined';
							}
							echo 'if ('.implode(' || ', $conds).') _this.'.$services_by_id[$id_service]->function_name.'();
					';
						}
					}
					?>					
				}
				if (_this.options.onChannelOpen  != undefined)
					_this.options.onChannelOpen();
					
				if (timerNoResponceCall != null)
				{
					clearTimeout(timerNoResponceCall);
					timerNoResponceCall = null;
				}
				if (timerFinCall != null)
				{
					if (_this.options.onRestoreConnection  != undefined)
						_this.options.onRestoreConnection();
					clearTimeout(timerFinCall);
					timerFinCall = null;
				}
			}
		});
		
		_this.webrtc.on('videoAdded', function (video, peer) {
			
			_this.other_id = peer.id;
			
			if (!_this.options.with_audio)
				video.volume = 0;
			if (_this.options.onVideoAdded != undefined)
				_this.options.onVideoAdded(peer.nick, video);
			
			if (timerNoResponceCall != null)
			{
				clearTimeout(timerNoResponceCall);
				timerNoResponceCall = null;
			}
			if (timerFinCall != null)
			{
				if (_this.options.onRestoreConnection  != undefined)
					_this.options.onRestoreConnection();
				clearTimeout(timerFinCall);
				timerFinCall = null;
			}
			
			
		});
		
		_this.webrtc.connection.on('message', function(data){
			if (data.payload != undefined && data.payload.nick != _this.nick)
			{
				if(data.type === 'ros')
				{
					if (_this.options.nick == 'robot')
						_this.ROSMessageReceivedFromPC(data.payload.message);
					else
						_this.ROSMessageFromWebRTC(data.payload.message);
				}
				else if(data.type === 'wyca')
				{
					if (data.payload.message == 'CloseSession')
					{
						_this.CloseWebRTC('CloseFromOther');
					}
					else
					{
						if (_this.options.onNewWebRTCMessage != undefined)
							_this.options.onNewWebRTCMessage(data.payload.message);
					}
				}
			}
		});
		_this.webrtc.on('signalingStateChange', function(param)
		{
		});
		_this.webrtc.on('videoRemoved', function (video, peer) {
			
			if (_this.other_id == peer.id) // On n'emet que si c'est le dernier connecté (sinon pb en cas de courpure de connexion temporaire)
			{
				if (_this.options.onVideoRemoved != undefined)
					_this.options.onVideoRemoved(peer.nick, video);
				
				/*
				if (!_this.closing)
				{
					if (_this.options.onLostConnection  != undefined)
						_this.options.onLostConnection();
					if (_this.options.checkLostConnection && timerFinCall == null)
						timerFinCall = setTimeout(_this.finCallDeconnect, _this.options.delay_lost_connexion * 1000);
				}
				*/
			}
		});
		
		_this.webrtc.on('iceFailed', function (peer) {
			if (_this.options.onLostConnection  != undefined)
				_this.options.onLostConnection();
			if (_this.options.checkLostConnection && timerFinCall == null)
				timerFinCall = setTimeout(_this.finCallDeconnect, _this.options.delay_lost_connexion * 1000);
		});
		
		_this.webrtc.on('connectivityError', function (peer) {
			if (_this.options.onLostConnection  != undefined)
				_this.options.onLostConnection();
			if (_this.options.checkLostConnection && timerFinCall == null)
				timerFinCall = setTimeout(_this.finCallDeconnect, _this.options.delay_lost_connexion * 1000);
		});
		
		_this.webrtc.on('localMediaError', function (err) {
			
			if (_this.options.with_video && _this.options.on_error_webcam_try_without)
			{
				if (_this.options.onEquipmentErrorTryWithoutWebcam != undefined)
					_this.options.onEquipmentErrorTryWithoutWebcam();
					
				try { _this.webrtc.stopLocalVideo(); } catch (e) {}
				try { _this.webrtc.mute(); } catch (e) {}
				try { _this.webrtc.leaveRoom(); } catch (e) {}
				_this.webrtc.connection.disconnect();
				
				try { window.stream.getTracks()[0].stop(); } catch (e) {}
				try { window.stream.getTracks()[1].stop(); } catch (e) {}
				
				if (timerNoResponceCall != null)
				{
					clearTimeout(timerNoResponceCall);
					timerNoResponceCall = null;
				}
				if (timerFinCall != null)
				{
					clearTimeout(timerFinCall);
					timerFinCall = null;
				}
				_this.closing = false;
				
				
				// On relance qu'avec l'audio
				
				_this.options.with_video = false;
				_this.StartWebRTC();
			}
			else
			{
				if (_this.options.onEquipmentError != undefined)
					_this.options.onEquipmentError();
			}
		
		});
		
		
		_this.webrtc.on('localMediaAdded', function (err) {
			
			if (_this.options.onEquipmentOK  != undefined)
				_this.options.onEquipmentOK();
			
			if (!_this.reply && !_this.call_from_admin)
			{
				_this.SendServerMessage('StartCall|'+_this.options.room);
			}
			
			_this.reply = false;
		});

		if (timerNoResponceCall != null)
		{
			clearTimeout(timerNoResponceCall);
			timerNoResponceCall = null;
		}
		if (_this.options.checkLostConnection)
			timerNoResponceCall = setTimeout(_this.finCallNoResponse, _this.options.delay_no_reply * 1000);
	}
	
	this.ROSMessageSendToPC = function (message)
	{
		if (_this.webrtc != null) _this.webrtc.sendToAll('ros', {message: message, nick: _this.webrtc.config.nick});
	}
	
	this.ROSMessageFromWebRTC = function(data)
	{
		if (data == 'onRobotConnexionError')
		{
			if (this.options.onRobotConnexionError != undefined)
			{
				this.options.onRobotConnexionError();
			}
		}
		else if (data == 'onRobotConnexionOpen')
		{
			if (this.options.onRobotConnexionOpen != undefined)
			{
				this.options.onRobotConnexionOpen();
			}
		}
		else if (data == 'onRobotConnexionClose')
		{
			if (this.options.onRobotConnexionClose != undefined)
			{
				this.options.onRobotConnexionClose();
			}
		}
		else if (data == 'connection')
		{
			if (this.options.onRobotConnexionOpen != undefined)
			{
				this.options.onRobotConnexionOpen();
			}
		}
		else if (data.topic != undefined)
		{
			switch(data.topic)
			{
			<?php
			$i=0;
			foreach($topics as $topic)
			{
				$i++;
				if ($topic->event_name != '')
				{
				?>
				case <?php echo $topic->id_topic;?>:
					if (_this.options.<?php echo $topic->event_name;?> != undefined)
					{
						_this.options.<?php echo $topic->event_name;?>(data.data);
					}
					
					<?php if ($topic->nom == '/keylo_api/navigation/robot_pose'){
							?>_this.PositionneRobot(data.data);<?php 
					}?> 
					<?php if ($topic->nom == '/keylo_api/navigation/current_goal'){
							?>_this.SaveCurrentGoal(data.data);<?php 
					}?> 
					<?php if ($topic->nom == '/keylo_arduino/current_floor'){
							?>_this.SaveCurrentFloor(data.data);<?php 
					}?> 
					<?php if ($topic->nom == '/keylo_api/navigation/robot_state'){
							?>_this.SaveRobotState(data.data);<?php 
					}?>
					
					break;
				<?php
				}
				elseif($topic->publish_name != '')
				{
				}
			}
			?>
			}
		}
		else if (data.action_feedback != undefined)
		{
			if (_this.ros_actions_feedback[data.action_feedback] != undefined)
				_this.ros_actions_feedback[data.action_feedback](data.data);
		}
		else if (data.action_result != undefined)
		{
			if (_this.ros_actions_result[data.action_result] != undefined)
				_this.ros_actions_result[data.action_result](data.data);
		}
		else if (data.action_status != undefined)
		{
			if (_this.ros_actions_status[data.action_status] != undefined)
				_this.ros_actions_status[data.action_status](data.data);
		}		
		else if (data.service != undefined)
		{
			if (typeof _this.ros_services[data.service] === "function") {
				_this.ros_services[data.service](data.result);
			}
		}
		else
		{
		 
		}
	}
	
	this.ROSMessageReceivedFromPC = function(message)
	{
		
		switch(message.action)
		{
			case 'connect':
				ROSuseWebRTC = true;
				if (socketStarted)
					_this.ROSMessageSendToPC('connection');
				else if (socketError)
					_this.ROSMessageSendToPC('error');
				else
					_this.ROSMessageSendToPC('not_connected');
				break;
			case 'publishTopic':
				if (_this.id_telop_topic == message.name)
				{
					twist = {
							angular: {
								x:0,
								y:0,
								z:message.data.t
							},
							linear: {
								x:message.data.x,
								y:0,
								z:0
							}
						};
						
					var msg = new ROSLIB.Message(twist);
					_this.ros_topic_pubs[message.name].publish(msg);
				}
				else
				{
					var msg = new ROSLIB.Message(message.data);
					_this.ros_topic_pubs[message.name].publish(msg);
				}
				break;
			case 'addTopic':
				if (!_this.ros_topics_subscribed[message.name])
				{
					this.ros_topics[message.name].subscribe(function(message) { data = message; if (message.data != undefined) data = message.data; _this.ROSMessageSendToPC({ topic: message.name, data: data }); } );
				}
				else
					_this.ros_topics_subscribed_by_pc[message.name] = true;
				break;
			case 'callService':
				if (message.name == <?php echo $serviceTakePhotoCamNav->id_service;?>)
				{
					_this.TakePhotoCamNav();
				}
				else if (message.name == <?php echo $serviceTakePhotoCamCustomer->id_service;?>)
				{
					_this.TakePhotoCamCustomer();
				}
				else
					_this.ros_services[message.name].callService(message.params, function (result) { _this.ROSMessageSendToPC({ service: message.name, result: result }); });
				break;
			case 'callAction':
				func = '_this.'+message.fname;
				eval(func);
				/*
				_this.ros_goal_actions[message.name].goalMessage = message.params;
				_this.ros_goal_actions[message.name].send();
				*/
				break;
			case 'callActionCancel':
				_this.ros_goal_actions[message.name].cancel();
				break;
		}
	}
	
	this.StartCloseWebRTC = function()
	{
		this.CloseWebRTC('CloseFromMe');
	}
	
	this.CloseWebRTC = function(reason)
	{
		_this.closing = true;
		this.SendWebRTCMessage('CloseSession');
		this.SendServerMessage('CloseSession');
		
		$('#'+_this.options.video_element_id).html('');
		
		if (this.options.onStartSessionClose  != undefined)
			this.options.onStartSessionClose(reason);
		
		this.CloseWebRTCReal();
		
		//if (reason == 'CloseFromOther' || reason == 'NoReply')
		//{
			if (_this.options.onSessionClosed  != undefined)
				_this.options.onSessionClosed();
		//}
	}
	
	this.CloseWebRTCReal = function()
	{			
		try { _this.webrtc.stopLocalVideo(); } catch (e) {}
		try { _this.webrtc.mute(); } catch (e) {}
		try { _this.webrtc.leaveRoom(); } catch (e) {}
		_this.webrtc.connection.disconnect();
		
		try { window.stream.getTracks()[0].stop(); } catch (e) {}
		try { window.stream.getTracks()[1].stop(); } catch (e) {}
		
		if (timerNoResponceCall != null)
		{
			clearTimeout(timerNoResponceCall);
			timerNoResponceCall = null;
		}
		if (timerFinCall != null)
		{
			clearTimeout(timerFinCall);
			timerFinCall = null;
		}
	}
	
	this.finCallDeconnect = function()
	{
		timerFinCall = null;
		_this.CloseWebRTC('LostConnexion');
	}
	
	this.finCallNoResponse = function()
	{
		timerNoResponceCall = null;
		_this.CloseWebRTC('NoReply');
	}
}


/*!
 * JQVMap: jQuery Vector Map Library
 * @author JQVMap <me@peterschmalfeldt.com>
 * @version 1.5.1
 * @link http://jqvmap.com
 * @license https://github.com/manifestinteractive/jqvmap/blob/master/LICENSE
 * @builddate 2016/05/18
 */

var VectorCanvas = function (width, height, params) {
  this.mode = window.SVGAngle ? 'svg' : 'vml';
  this.params = params;

  if (this.mode === 'svg') {
    this.createSvgNode = function (nodeName) {
      return document.createElementNS(this.svgns, nodeName);
    };
  } else {
    try {
      if (!document.namespaces.rvml) {
        document.namespaces.add('rvml', 'urn:schemas-microsoft-com:vml');
      }
      this.createVmlNode = function (tagName) {
        return document.createElement('<rvml:' + tagName + ' class="rvml">');
      };
    } catch (e) {
      this.createVmlNode = function (tagName) {
        return document.createElement('<' + tagName + ' xmlns="urn:schemas-microsoft.com:vml" class="rvml">');
      };
    }

    document.createStyleSheet().addRule('.rvml', 'behavior:url(#default#VML)');
  }

  if (this.mode === 'svg') {
    this.canvas = this.createSvgNode('svg');
  } else {
    this.canvas = this.createVmlNode('group');
    this.canvas.style.position = 'absolute';
  }

  this.setSize(width, height);
};

VectorCanvas.prototype = {
  svgns: 'http://www.w3.org/2000/svg',
  mode: 'svg',
  width: 0,
  height: 0,
  canvas: null
};

var ColorScale = function (colors, normalizeFunction, minValue, maxValue) {
  if (colors) {
    this.setColors(colors);
  }
  if (normalizeFunction) {
    this.setNormalizeFunction(normalizeFunction);
  }
  if (minValue) {
    this.setMin(minValue);
  }
  if (minValue) {
    this.setMax(maxValue);
  }
};

ColorScale.prototype = {
  colors: []
};

var JQVMap = function (params) {
  params = params || {};
  var map = this;
  var mapData = JQVMap.maps[params.map];
  var mapPins;

	

  if( !mapData){
    throw new Error('Invalid "' + params.map + '" map parameter. Please make sure you have loaded this map file in your HTML.');
  }

  this.selectedRegions = [];
  this.multiSelectRegion = params.multiSelectRegion;

  this.container = params.container;

  this.defaultWidth = mapData.width;
  this.defaultHeight = mapData.height;

  this.color = params.color;
  this.selectedColor = params.selectedColor;
  this.hoverColor = params.hoverColor;
  this.hoverColors = params.hoverColors;
  this.hoverOpacity = params.hoverOpacity;
  this.setBackgroundColor(params.backgroundColor);

  this.width = params.container.width();
  this.height = params.container.height();

  this.resize();

  jQuery(window).resize(function () {
    var newWidth = params.container.width();
    var newHeight = params.container.height();

    if(newWidth && newHeight){
      map.width = newWidth;
      map.height = newHeight;
      map.resize();
      map.canvas.setSize(map.width, map.height);
      map.applyTransform();

      var resizeEvent = jQuery.Event('resize.jqvmap');
      jQuery(params.container).trigger(resizeEvent, [newWidth, newHeight]);

      if(mapPins){
        jQuery('.jqvmap-pin').remove();
        map.pinHandlers = false;
        map.placePins(mapPins.pins, mapPins.mode);
      }
    }
  });

  this.canvas = new VectorCanvas(this.width, this.height, params);
  params.container.append(this.canvas.canvas);

  this.makeDraggable();

  this.rootGroup = this.canvas.createGroup(true);

  this.index = JQVMap.mapIndex;
  this.label = jQuery('<div/>').addClass('jqvmap-label').appendTo(jQuery('body')).hide();

  if (params.enableZoom) {
    jQuery('<div/>').addClass('jqvmap-zoomin').text('+').appendTo(params.container);
    jQuery('<div/>').addClass('jqvmap-zoomout').html('&#x2212;').appendTo(params.container);
  }

  map.countries = [];

  for (var key in mapData.paths) {
    var path = this.canvas.createPath({
      path: mapData.paths[key].path
    });

    path.setFill(this.color);
    path.id = map.getCountryId(key);
    map.countries[key] = path;

    if (this.canvas.mode === 'svg') {
      path.setAttribute('class', 'jqvmap-region');
    } else {
      jQuery(path).addClass('jqvmap-region');
    }

    jQuery(this.rootGroup).append(path);
  }

  jQuery(params.container).delegate(this.canvas.mode === 'svg' ? 'path' : 'shape', 'mouseover mouseout', function (e) {
    var containerPath = e.target,
      code = e.target.id.split('_').pop(),
      labelShowEvent = jQuery.Event('labelShow.jqvmap'),
      regionMouseOverEvent = jQuery.Event('regionMouseOver.jqvmap');

    code = code.toLowerCase();

    if (e.type === 'mouseover') {
      jQuery(params.container).trigger(regionMouseOverEvent, [code, mapData.paths[code].name]);
      if (!regionMouseOverEvent.isDefaultPrevented()) {
        map.highlight(code, containerPath);
      }
      if (params.showTooltip) {
        map.label.text(mapData.paths[code].name);
        jQuery(params.container).trigger(labelShowEvent, [map.label, code]);

        if (!labelShowEvent.isDefaultPrevented()) {
          map.label.show();
          map.labelWidth = map.label.width();
          map.labelHeight = map.label.height();
        }
      }
    } else {
      map.unhighlight(code, containerPath);

      map.label.hide();
      jQuery(params.container).trigger('regionMouseOut.jqvmap', [code, mapData.paths[code].name]);
    }
  });

  jQuery(params.container).delegate(this.canvas.mode === 'svg' ? 'path' : 'shape', 'click', function (regionClickEvent) {

    var targetPath = regionClickEvent.target;
    var code = regionClickEvent.target.id.split('_').pop();
    var mapClickEvent = jQuery.Event('regionClick.jqvmap');

    code = code.toLowerCase();

    jQuery(params.container).trigger(mapClickEvent, [regionClickEvent, code, mapData.paths[code].name]);

    if ( !params.multiSelectRegion && !mapClickEvent.isDefaultPrevented()) {
      for (var keyPath in mapData.paths) {
        map.countries[keyPath].currentFillColor = map.countries[keyPath].getOriginalFill();
        map.countries[keyPath].setFill(map.countries[keyPath].getOriginalFill());
      }
    }

    if ( !mapClickEvent.isDefaultPrevented()) {
      if (map.isSelected(code)) {
        map.deselect(code, targetPath);
      } else {
		  if (mapData.paths[code].name.lenght < 5 || mapData.paths[code].name.substr(0, 5) != "route")
	        map.select(code, targetPath);
      }
    }
  });

  if (params.showTooltip) {
    params.container.mousemove(function (e) {
      if (map.label.is(':visible')) {
        var left = e.pageX - 15 - map.labelWidth;
        var top = e.pageY - 15 - map.labelHeight;

        if(left < 0) {
          left = e.pageX + 15;
        }
        if(top < 0) {
          top = e.pageY + 15;
        }

        map.label.css({
          left: left,
          top: top
        });
      }
    });
  }

  this.setColors(params.colors);

  this.canvas.canvas.appendChild(this.rootGroup);

  this.applyTransform();

  this.colorScale = new ColorScale(params.scaleColors, params.normalizeFunction, params.valueMin, params.valueMax);

  if (params.values) {
    this.values = params.values;
    this.setValues(params.values);
  }

  if (params.selectedRegions) {
    if (params.selectedRegions instanceof Array) {
      for(var k in params.selectedRegions) {
        this.select(params.selectedRegions[k].toLowerCase());
      }
    } else {
      this.select(params.selectedRegions.toLowerCase());
    }
  }

  this.bindZoomButtons();

  if(params.pins) {
    mapPins = {
      pins: params.pins,
      mode: params.pinMode
    };

    this.pinHandlers = false;
    this.placePins(params.pins, params.pinMode);
  }

  if(params.showLabels){
    this.pinHandlers = false;

    var pins = {};
    for (key in map.countries){
      if (typeof map.countries[key] !== 'function') {
        if( !params.pins || !params.pins[key] ){
          pins[key] = key.toUpperCase();
        }
      }
    }

    mapPins = {
      pins: pins,
      mode: 'content'
    };

    this.placePins(pins, 'content');
  }

  JQVMap.mapIndex++;
};

JQVMap.prototype = {
  transX: 0,
  transY: 0,
  scale: 1,
  baseTransX: 0,
  baseTransY: 0,
  baseScale: 1,
  width: 0,
  height: 0,
  countries: {},
  countriesColors: {},
  countriesData: {},
  zoomStep: 1.4,
  zoomMaxStep: 4,
  zoomCurStep: 1
};

JQVMap.xlink = 'http://www.w3.org/1999/xlink';
JQVMap.mapIndex = 1;
JQVMap.maps = {};

(function(){

  var apiParams = {
    colors: 1,
    values: 1,
    backgroundColor: 1,
    scaleColors: 1,
    normalizeFunction: 1,
    enableZoom: 1,
    showTooltip: 1,
    borderColor: 1,
    borderWidth: 1,
    borderOpacity: 1,
    selectedRegions: 1,
    multiSelectRegion: 1
  };

  var apiEvents = {
    onLabelShow: 'labelShow',
    onLoad: 'load',
    onRegionOver: 'regionMouseOver',
    onRegionOut: 'regionMouseOut',
    onRegionClick: 'regionClick',
    onRegionSelect: 'regionSelect',
    onRegionDeselect: 'regionDeselect',
    onResize: 'resize'
  };

  jQuery.fn.vectorMap = function (options) {

    var defaultParams = {
      map: 'world_en',
      backgroundColor: '#a5bfdd',
      color: '#f4f3f0',
      hoverColor: '#c9dfaf',
      hoverColors: {},
      selectedColor: '#c9dfaf',
      scaleColors: ['#b6d6ff', '#005ace'],
      normalizeFunction: 'linear',
      enableZoom: true,
      showTooltip: true,
      borderColor: '#818181',
      borderWidth: 1,
      borderOpacity: 0.25,
      selectedRegions: null,
      multiSelectRegion: false
    }, map = this.data('mapObject');

    if (options === 'addMap') {
      JQVMap.maps[arguments[1]] = arguments[2];
    } else if (options === 'set' && apiParams[arguments[1]]) {
      map['set' + arguments[1].charAt(0).toUpperCase() + arguments[1].substr(1)].apply(map, Array.prototype.slice.call(arguments, 2));
    } else if (typeof options === 'string' &&
      typeof map[options] === 'function') {
      return map[options].apply(map, Array.prototype.slice.call(arguments, 1));
    } else {
      jQuery.extend(defaultParams, options);
      defaultParams.container = this;
      this.css({ position: 'relative', overflow: 'hidden' });

      map = new JQVMap(defaultParams);

      this.data('mapObject', map);

      this.unbind('.jqvmap');

      for (var e in apiEvents) {
        if (defaultParams[e]) {
          this.bind(apiEvents[e] + '.jqvmap', defaultParams[e]);
        }
      }

      var loadEvent = jQuery.Event('load.jqvmap');
      jQuery(defaultParams.container).trigger(loadEvent, map);

      return map;
    }
  };

})(jQuery);

ColorScale.arrayToRgb = function (ar) {
  var rgb = '#';
  var d;
  for (var i = 0; i < ar.length; i++) {
    d = ar[i].toString(16);
    rgb += d.length === 1 ? '0' + d : d;
  }
  return rgb;
};

ColorScale.prototype.getColor = function (value) {
  if (typeof this.normalize === 'function') {
    value = this.normalize(value);
  }

  var lengthes = [];
  var fullLength = 0;
  var l;

  for (var i = 0; i < this.colors.length - 1; i++) {
    l = this.vectorLength(this.vectorSubtract(this.colors[i + 1], this.colors[i]));
    lengthes.push(l);
    fullLength += l;
  }

  var c = (this.maxValue - this.minValue) / fullLength;

  for (i = 0; i < lengthes.length; i++) {
    lengthes[i] *= c;
  }

  i = 0;
  value -= this.minValue;

  while (value - lengthes[i] >= 0) {
    value -= lengthes[i];
    i++;
  }

  var color;
  if (i === this.colors.length - 1) {
    color = this.vectorToNum(this.colors[i]).toString(16);
  } else {
    color = (this.vectorToNum(this.vectorAdd(this.colors[i], this.vectorMult(this.vectorSubtract(this.colors[i + 1], this.colors[i]), (value) / (lengthes[i]))))).toString(16);
  }

  while (color.length < 6) {
    color = '0' + color;
  }
  return '#' + color;
};

ColorScale.rgbToArray = function (rgb) {
  rgb = rgb.substr(1);
  return [parseInt(rgb.substr(0, 2), 16), parseInt(rgb.substr(2, 2), 16), parseInt(rgb.substr(4, 2), 16)];
};

ColorScale.prototype.setColors = function (colors) {
  for (var i = 0; i < colors.length; i++) {
    colors[i] = ColorScale.rgbToArray(colors[i]);
  }
  this.colors = colors;
};

ColorScale.prototype.setMax = function (max) {
  this.clearMaxValue = max;
  if (typeof this.normalize === 'function') {
    this.maxValue = this.normalize(max);
  } else {
    this.maxValue = max;
  }
};

ColorScale.prototype.setMin = function (min) {
  this.clearMinValue = min;

  if (typeof this.normalize === 'function') {
    this.minValue = this.normalize(min);
  } else {
    this.minValue = min;
  }
};

ColorScale.prototype.setNormalizeFunction = function (f) {
  if (f === 'polynomial') {
    this.normalize = function (value) {
      return Math.pow(value, 0.2);
    };
  } else if (f === 'linear') {
    delete this.normalize;
  } else {
    this.normalize = f;
  }
  this.setMin(this.clearMinValue);
  this.setMax(this.clearMaxValue);
};

ColorScale.prototype.vectorAdd = function (vector1, vector2) {
  var vector = [];
  for (var i = 0; i < vector1.length; i++) {
    vector[i] = vector1[i] + vector2[i];
  }
  return vector;
};

ColorScale.prototype.vectorLength = function (vector) {
  var result = 0;
  for (var i = 0; i < vector.length; i++) {
    result += vector[i] * vector[i];
  }
  return Math.sqrt(result);
};

ColorScale.prototype.vectorMult = function (vector, num) {
  var result = [];
  for (var i = 0; i < vector.length; i++) {
    result[i] = vector[i] * num;
  }
  return result;
};

ColorScale.prototype.vectorSubtract = function (vector1, vector2) {
  var vector = [];
  for (var i = 0; i < vector1.length; i++) {
    vector[i] = vector1[i] - vector2[i];
  }
  return vector;
};

ColorScale.prototype.vectorToNum = function (vector) {
  var num = 0;
  for (var i = 0; i < vector.length; i++) {
    num += Math.round(vector[i]) * Math.pow(256, vector.length - i - 1);
  }
  return num;
};

JQVMap.prototype.setSelectedRegions = function(keys){
    for (var key in this.countries) {
        this.deselect(key, undefined);
    }
    var array = keys.split(",");

    for (i=0;i<array.length;i++) {
        //alert(array[i])
        this.select(array[i], undefined);
    }
};

JQVMap.prototype.applyTransform = function () {
  var maxTransX, maxTransY, minTransX, minTransY;
  if (this.defaultWidth * this.scale <= this.width) {
    maxTransX = (this.width - this.defaultWidth * this.scale) / (2 * this.scale);
    minTransX = (this.width - this.defaultWidth * this.scale) / (2 * this.scale);
  } else {
    maxTransX = 0;
    minTransX = (this.width - this.defaultWidth * this.scale) / this.scale;
  }

  if (this.defaultHeight * this.scale <= this.height) {
    maxTransY = (this.height - this.defaultHeight * this.scale) / (2 * this.scale);
    minTransY = (this.height - this.defaultHeight * this.scale) / (2 * this.scale);
  } else {
    maxTransY = 0;
    minTransY = (this.height - this.defaultHeight * this.scale) / this.scale;
  }

  if (this.transY > maxTransY) {
    this.transY = maxTransY;
  } else if (this.transY < minTransY) {
    this.transY = minTransY;
  }
  if (this.transX > maxTransX) {
    this.transX = maxTransX;
  } else if (this.transX < minTransX) {
    this.transX = minTransX;
  }

  this.canvas.applyTransformParams(this.scale, this.transX, this.transY);
};

JQVMap.prototype.bindZoomButtons = function () {
  var map = this;
  this.container.find('.jqvmap-zoomin').click(function(){
    map.zoomIn();
  });
  this.container.find('.jqvmap-zoomout').click(function(){
    map.zoomOut();
  });
};

JQVMap.prototype.deselect = function (cc, path) {
  cc = cc.toLowerCase();
  path = path || jQuery('#' + this.getCountryId(cc))[0];

  if (this.isSelected(cc)) {
    this.selectedRegions.splice(this.selectIndex(cc), 1);

    jQuery(this.container).trigger('regionDeselect.jqvmap', [cc]);
	
	path.currentFillColor = path.getOriginalFill();
	path.setFill(path.getOriginalFill());
	
  } else {
    for (var key in this.countries) {
      this.selectedRegions.splice(this.selectedRegions.indexOf(key), 1);
	  	if (couleurs != undefined && couleurs[key] != undefined)
		{
			this.countries[key].currentFillColor = couleurs[key];
		  	this.countries[key].setFill(couleurs[key]);
		}
		else
		{
		  this.countries[key].currentFillColor = this.color;
		  this.countries[key].setFill(this.color);
		}
    }
  }
};

JQVMap.prototype.getCountryId = function (cc) {
  return 'jqvmap' + this.index + '_' + cc;
};

JQVMap.prototype.getPin = function(cc){
  var pinObj = jQuery('#' + this.getPinId(cc));
  return pinObj.html();
};

JQVMap.prototype.getPinId = function (cc) {
  return this.getCountryId(cc) + '_pin';
};

JQVMap.prototype.getPins = function(){
  var pins = this.container.find('.jqvmap-pin');
  var ret = {};
  jQuery.each(pins, function(index, pinObj){
    pinObj = jQuery(pinObj);
    var cc = pinObj.attr('for').toLowerCase();
    var pinContent = pinObj.html();
    ret[cc] = pinContent;
  });
  return JSON.stringify(ret);
};

JQVMap.prototype.highlight = function (cc, path) {
  path = path || jQuery('#' + this.getCountryId(cc))[0];
  if (this.hoverOpacity) {
    path.setOpacity(this.hoverOpacity);
  } else if (this.hoverColors && (cc in this.hoverColors)) {
    path.currentFillColor = path.getFill() + '';
    path.setFill(this.hoverColors[cc]);
  } else if (this.hoverColor) {
    path.currentFillColor = path.getFill() + '';
    path.setFill(this.hoverColor);
  }
};

JQVMap.prototype.isSelected = function(cc) {
  return this.selectIndex(cc) >= 0;
};

JQVMap.prototype.makeDraggable = function () {
  var mouseDown = false;
  var oldPageX, oldPageY;
  var self = this;

  self.isMoving = false;
  self.isMovingTimeout = false;

  var lastTouchCount;
  var touchCenterX;
  var touchCenterY;
  var touchStartDistance;
  var touchStartScale;
  var touchX;
  var touchY;

  this.container.mousemove(function (e) {

    if (mouseDown) {
      self.transX -= (oldPageX - e.pageX) / self.scale;
      self.transY -= (oldPageY - e.pageY) / self.scale;

      self.applyTransform();

      oldPageX = e.pageX;
      oldPageY = e.pageY;

      self.isMoving = true;
      if (self.isMovingTimeout) {
        clearTimeout(self.isMovingTimeout);
      }

      self.container.trigger('drag');
    }

    return false;

  }).mousedown(function (e) {

    mouseDown = true;
    oldPageX = e.pageX;
    oldPageY = e.pageY;

    return false;

  }).mouseup(function () {

    mouseDown = false;

    clearTimeout(self.isMovingTimeout);
    self.isMovingTimeout = setTimeout(function () {
      self.isMoving = false;
    }, 100);

    return false;

  }).mouseout(function () {

    if(mouseDown && self.isMoving){

      clearTimeout(self.isMovingTimeout);
      self.isMovingTimeout = setTimeout(function () {
        mouseDown = false;
        self.isMoving = false;
      }, 100);

      return false;
    }
  });

  jQuery(this.container).bind('touchmove', function (e) {

    var offset;
    var scale;
    var touches = e.originalEvent.touches;
    var transformXOld;
    var transformYOld;

    if (touches.length === 1) {
      if (lastTouchCount === 1) {

        if(touchX === touches[0].pageX && touchY === touches[0].pageY){
          return;
        }

        transformXOld = self.transX;
        transformYOld = self.transY;

        self.transX -= (touchX - touches[0].pageX) / self.scale;
        self.transY -= (touchY - touches[0].pageY) / self.scale;

        self.applyTransform();

        if (transformXOld !== self.transX || transformYOld !== self.transY) {
          e.preventDefault();
        }

        self.isMoving = true;
        if (self.isMovingTimeout) {
          clearTimeout(self.isMovingTimeout);
        }
      }

      touchX = touches[0].pageX;
      touchY = touches[0].pageY;

    } else if (touches.length === 2) {

      if (lastTouchCount === 2) {
        scale = Math.sqrt(
            Math.pow(touches[0].pageX - touches[1].pageX, 2) +
            Math.pow(touches[0].pageY - touches[1].pageY, 2)
          ) / touchStartDistance;

        self.setScale(
          touchStartScale * scale,
          touchCenterX,
          touchCenterY
        );

        e.preventDefault();

      } else {

        offset = jQuery(self.container).offset();
        if (touches[0].pageX > touches[1].pageX) {
          touchCenterX = touches[1].pageX + (touches[0].pageX - touches[1].pageX) / 2;
        } else {
          touchCenterX = touches[0].pageX + (touches[1].pageX - touches[0].pageX) / 2;
        }

        if (touches[0].pageY > touches[1].pageY) {
          touchCenterY = touches[1].pageY + (touches[0].pageY - touches[1].pageY) / 2;
        } else {
          touchCenterY = touches[0].pageY + (touches[1].pageY - touches[0].pageY) / 2;
        }

        touchCenterX -= offset.left;
        touchCenterY -= offset.top;
        touchStartScale = self.scale;

        touchStartDistance = Math.sqrt(
          Math.pow(touches[0].pageX - touches[1].pageX, 2) +
          Math.pow(touches[0].pageY - touches[1].pageY, 2)
        );
      }
    }

    lastTouchCount = touches.length;
  });

  jQuery(this.container).bind('touchstart', function () {
    lastTouchCount = 0;
  });

  jQuery(this.container).bind('touchend', function () {
    lastTouchCount = 0;
  });
};

JQVMap.prototype.placePins = function(pins, pinMode){
  var map = this;

  if(!pinMode || (pinMode !== 'content' && pinMode !== 'id')) {
    pinMode = 'content';
  }

  if(pinMode === 'content') {//treat pin as content
    jQuery.each(pins, function(index, pin){
      if(jQuery('#' + map.getCountryId(index)).length === 0){
        return;
      }

      var pinIndex = map.getPinId(index);
      var $pin = jQuery('#' + pinIndex);
      if($pin.length > 0){
        $pin.remove();
      }
      map.container.append('<div id="' + pinIndex + '" for="' + index + '" class="jqvmap-pin" style="position:absolute">' + pin + '</div>');
    });
  } else { //treat pin as id of an html content
    jQuery.each(pins, function(index, pin){
      if(jQuery('#' + map.getCountryId(index)).length === 0){
        return;
      }
      var pinIndex = map.getPinId(index);
      var $pin = jQuery('#' + pinIndex);
      if($pin.length > 0){
        $pin.remove();
      }
      map.container.append('<div id="' + pinIndex + '" for="' + index + '" class="jqvmap-pin" style="position:absolute"></div>');
      $pin.append(jQuery('#' + pin));
    });
  }

  this.positionPins();
  if(!this.pinHandlers){
    this.pinHandlers = true;
    var positionFix = function(){
      map.positionPins();
    };
    this.container.bind('zoomIn', positionFix)
      .bind('zoomOut', positionFix)
      .bind('drag', positionFix);
  }
};

JQVMap.prototype.positionPins = function(){
  var map = this;
  var pins = this.container.find('.jqvmap-pin');
  jQuery.each(pins, function(index, pinObj){
    pinObj = jQuery(pinObj);
    var countryId = map.getCountryId(pinObj.attr('for').toLowerCase());
    var countryObj = jQuery('#' + countryId);

    var bbox = document.getElementById(countryId).getBBox();
    var position = countryObj.position();

    var scale = map.scale;

    var left = position.left + (bbox.width / 2) * scale - pinObj.width() / 2,
      top = position.top + (bbox.height / 2) * scale - pinObj.height() / 2;

    pinObj.css('left', left).css('top', top);
  });
};

JQVMap.prototype.removePin = function(cc) {
  cc = cc.toLowerCase();
  jQuery('#' + this.getPinId(cc)).remove();
};

JQVMap.prototype.removePins = function(){
  this.container.find('.jqvmap-pin').remove();
};

JQVMap.prototype.reset = function () {
  for (var key in this.countries) {
    this.countries[key].setFill(this.color);
  }
  this.scale = this.baseScale;
  this.transX = this.baseTransX;
  this.transY = this.baseTransY;
  this.applyTransform();
};

JQVMap.prototype.resize = function () {
  var curBaseScale = this.baseScale;
  if (this.width / this.height > this.defaultWidth / this.defaultHeight) {
    this.baseScale = this.height / this.defaultHeight;
    this.baseTransX = Math.abs(this.width - this.defaultWidth * this.baseScale) / (2 * this.baseScale);
  } else {
    this.baseScale = this.width / this.defaultWidth;
    this.baseTransY = Math.abs(this.height - this.defaultHeight * this.baseScale) / (2 * this.baseScale);
  }
  this.scale *= this.baseScale / curBaseScale;
  this.transX *= this.baseScale / curBaseScale;
  this.transY *= this.baseScale / curBaseScale;
};

JQVMap.prototype.select = function (cc, path) {
  cc = cc.toLowerCase();
  path = path || jQuery('#' + this.getCountryId(cc))[0];

  if (!this.isSelected(cc)) {
    if (this.multiSelectRegion) {
      this.selectedRegions.push(cc);
    } else {
      this.selectedRegions = [cc];
    }

    jQuery(this.container).trigger('regionSelect.jqvmap', [cc]);
    if (this.selectedColor && path) {
      path.currentFillColor = this.selectedColor;
      path.setFill(this.selectedColor);
    }
  }
};

JQVMap.prototype.selectIndex = function (cc) {
  cc = cc.toLowerCase();
  for (var i = 0; i < this.selectedRegions.length; i++) {
    if (cc === this.selectedRegions[i]) {
      return i;
    }
  }
  return -1;
};

JQVMap.prototype.setBackgroundColor = function (backgroundColor) {
  this.container.css('background-color', backgroundColor);
};

JQVMap.prototype.setColors = function (key, color) {
  if (typeof key === 'string') {
    this.countries[key].setFill(color);
    this.countries[key].setAttribute('original', color);
  } else {
    var colors = key;

    for (var code in colors) {
      if (this.countries[code]) {
        this.countries[code].setFill(colors[code]);
        this.countries[code].setAttribute('original', colors[code]);
      }
    }
  }
};

JQVMap.prototype.setNormalizeFunction = function (f) {
  this.colorScale.setNormalizeFunction(f);

  if (this.values) {
    this.setValues(this.values);
  }
};

JQVMap.prototype.setScale = function (scale) {
  this.scale = scale;
  this.applyTransform();
};

JQVMap.prototype.setScaleColors = function (colors) {
  this.colorScale.setColors(colors);

  if (this.values) {
    this.setValues(this.values);
  }
};

JQVMap.prototype.setValues = function (values) {
  var max = 0,
    min = Number.MAX_VALUE,
    val;

  for (var cc in values) {
    cc = cc.toLowerCase();
    val = parseFloat(values[cc]);

    if (isNaN(val)) {
      continue;
    }
    if (val > max) {
      max = values[cc];
    }
    if (val < min) {
      min = val;
    }
  }

  if (min === max) {
    max++;
  }

  this.colorScale.setMin(min);
  this.colorScale.setMax(max);

  var colors = {};
  for (cc in values) {
    cc = cc.toLowerCase();
    val = parseFloat(values[cc]);
    colors[cc] = isNaN(val) ? this.color : this.colorScale.getColor(val);
  }
  this.setColors(colors);
  this.values = values;
};

JQVMap.prototype.unhighlight = function (cc, path) {
  cc = cc.toLowerCase();
  path = path || jQuery('#' + this.getCountryId(cc))[0];
  path.setOpacity(1);
  if (path.currentFillColor) {
    path.setFill(path.currentFillColor);
  }
};

JQVMap.prototype.zoomIn = function () {
  var map = this;
  var sliderDelta = (jQuery('#zoom').innerHeight() - 6 * 2 - 15 * 2 - 3 * 2 - 7 - 6) / (this.zoomMaxStep - this.zoomCurStep);

  if (map.zoomCurStep < map.zoomMaxStep) {
    map.transX -= (map.width / map.scale - map.width / (map.scale * map.zoomStep)) / 2;
    map.transY -= (map.height / map.scale - map.height / (map.scale * map.zoomStep)) / 2;
    map.setScale(map.scale * map.zoomStep);
    map.zoomCurStep++;

    var $slider = jQuery('#zoomSlider');

    $slider.css('top', parseInt($slider.css('top'), 10) - sliderDelta);

    map.container.trigger('zoomIn');
  }
};

JQVMap.prototype.zoomOut = function () {
  var map = this;
  var sliderDelta = (jQuery('#zoom').innerHeight() - 6 * 2 - 15 * 2 - 3 * 2 - 7 - 6) / (this.zoomMaxStep - this.zoomCurStep);

  if (map.zoomCurStep > 1) {
    map.transX += (map.width / (map.scale / map.zoomStep) - map.width / map.scale) / 2;
    map.transY += (map.height / (map.scale / map.zoomStep) - map.height / map.scale) / 2;
    map.setScale(map.scale / map.zoomStep);
    map.zoomCurStep--;

    var $slider = jQuery('#zoomSlider');

    $slider.css('top', parseInt($slider.css('top'), 10) + sliderDelta);

    map.container.trigger('zoomOut');
  }
};

VectorCanvas.prototype.applyTransformParams = function (scale, transX, transY) {
  if (this.mode === 'svg') {
    this.rootGroup.setAttribute('transform', 'scale(' + scale + ') translate(' + transX + ', ' + transY + ')');
  } else {
    this.rootGroup.coordorigin = (this.width - transX) + ',' + (this.height - transY);
    this.rootGroup.coordsize = this.width / scale + ',' + this.height / scale;
  }
};

VectorCanvas.prototype.createGroup = function (isRoot) {
  var node;
  if (this.mode === 'svg') {
    node = this.createSvgNode('g');
  } else {
    node = this.createVmlNode('group');
    node.style.width = this.width + 'px';
    node.style.height = this.height + 'px';
    node.style.left = '0px';
    node.style.top = '0px';
    node.coordorigin = '0 0';
    node.coordsize = this.width + ' ' + this.height;
  }

  if (isRoot) {
    this.rootGroup = node;
  }
  return node;
};

VectorCanvas.prototype.createPath = function (config) {
  var node;
  if (this.mode === 'svg') {
    node = this.createSvgNode('path');
    node.setAttribute('d', config.path);

    if (this.params.borderColor !== null) {
      node.setAttribute('stroke', this.params.borderColor);
    }
	node.setAttribute('stroke-width', this.params.borderWidth);
    if (this.params.borderWidth > 0) {
      node.setAttribute('stroke-linecap', 'round');
      node.setAttribute('stroke-linejoin', 'round');
    }
    if (this.params.borderOpacity > 0) {
      node.setAttribute('stroke-opacity', this.params.borderOpacity);
    }

    node.setFill = function (color) {
      this.setAttribute('fill', color);
      if (this.getAttribute('original') === null) {
        this.setAttribute('original', color);
      }
    };

    node.getFill = function () {
      return this.getAttribute('fill');
    };

    node.getOriginalFill = function () {
      return this.getAttribute('original');
    };

    node.setOpacity = function (opacity) {
      this.setAttribute('fill-opacity', opacity);
    };
  } else {
    node = this.createVmlNode('shape');
    node.coordorigin = '0 0';
    node.coordsize = this.width + ' ' + this.height;
    node.style.width = this.width + 'px';
    node.style.height = this.height + 'px';
    node.fillcolor = JQVMap.defaultFillColor;
    node.stroked = false;
    node.path = VectorCanvas.pathSvgToVml(config.path);

    var scale = this.createVmlNode('skew');
    scale.on = true;
    scale.matrix = '0.01,0,0,0.01,0,0';
    scale.offset = '0,0';

    node.appendChild(scale);

    var fill = this.createVmlNode('fill');
    node.appendChild(fill);

    node.setFill = function (color) {
      this.getElementsByTagName('fill')[0].color = color;
      if (this.getAttribute('original') === null) {
        this.setAttribute('original', color);
      }
    };

    node.getFill = function () {
      return this.getElementsByTagName('fill')[0].color;
    };
    node.getOriginalFill = function () {
      return this.getAttribute('original');
    };
    node.setOpacity = function (opacity) {
      this.getElementsByTagName('fill')[0].opacity = parseInt(opacity * 100, 10) + '%';
    };
  }
  return node;
};

VectorCanvas.prototype.pathSvgToVml = function (path) {
  var result = '';
  var cx = 0, cy = 0, ctrlx, ctrly;

  return path.replace(/([MmLlHhVvCcSs])((?:-?(?:\d+)?(?:\.\d+)?,?\s?)+)/g, function (segment, letter, coords) {
    coords = coords.replace(/(\d)-/g, '$1,-').replace(/\s+/g, ',').split(',');
    if (!coords[0]) {
      coords.shift();
    }

    for (var i = 0, l = coords.length; i < l; i++) {
      coords[i] = Math.round(100 * coords[i]);
    }

    switch (letter) {
      case 'm':
        cx += coords[0];
        cy += coords[1];
        result = 't' + coords.join(',');
        break;

      case 'M':
        cx = coords[0];
        cy = coords[1];
        result = 'm' + coords.join(',');
        break;

      case 'l':
        cx += coords[0];
        cy += coords[1];
        result = 'r' + coords.join(',');
        break;

      case 'L':
        cx = coords[0];
        cy = coords[1];
        result = 'l' + coords.join(',');
        break;

      case 'h':
        cx += coords[0];
        result = 'r' + coords[0] + ',0';
        break;

      case 'H':
        cx = coords[0];
        result = 'l' + cx + ',' + cy;
        break;

      case 'v':
        cy += coords[0];
        result = 'r0,' + coords[0];
        break;

      case 'V':
        cy = coords[0];
        result = 'l' + cx + ',' + cy;
        break;

      case 'c':
        ctrlx = cx + coords[coords.length - 4];
        ctrly = cy + coords[coords.length - 3];
        cx += coords[coords.length - 2];
        cy += coords[coords.length - 1];
        result = 'v' + coords.join(',');
        break;

      case 'C':
        ctrlx = coords[coords.length - 4];
        ctrly = coords[coords.length - 3];
        cx = coords[coords.length - 2];
        cy = coords[coords.length - 1];
        result = 'c' + coords.join(',');
        break;

      case 's':
        coords.unshift(cy - ctrly);
        coords.unshift(cx - ctrlx);
        ctrlx = cx + coords[coords.length - 4];
        ctrly = cy + coords[coords.length - 3];
        cx += coords[coords.length - 2];
        cy += coords[coords.length - 1];
        result = 'v' + coords.join(',');
        break;

      case 'S':
        coords.unshift(cy + cy - ctrly);
        coords.unshift(cx + cx - ctrlx);
        ctrlx = coords[coords.length - 4];
        ctrly = coords[coords.length - 3];
        cx = coords[coords.length - 2];
        cy = coords[coords.length - 1];
        result = 'c' + coords.join(',');
        break;

      default:
        break;
    }

    return result;

  }).replace(/z/g, '');
};

VectorCanvas.prototype.setSize = function (width, height) {
  if (this.mode === 'svg') {
    this.canvas.setAttribute('width', width);
    this.canvas.setAttribute('height', height);
  } else {
    this.canvas.style.width = width + 'px';
    this.canvas.style.height = height + 'px';
    this.canvas.coordsize = width + ' ' + height;
    this.canvas.coordorigin = '0 0';
    if (this.rootGroup) {
      var paths = this.rootGroup.getElementsByTagName('shape');
      for (var i = 0, l = paths.length; i < l; i++) {
        paths[i].coordsize = width + ' ' + height;
        paths[i].style.width = width + 'px';
        paths[i].style.height = height + 'px';
      }
      this.rootGroup.coordsize = width + ' ' + height;
      this.rootGroup.style.width = width + 'px';
      this.rootGroup.style.height = height + 'px';
    }
  }
  this.width = width;
  this.height = height;
};
