function WycaAPI(options){

	this.AnswerCode = {
		NO_ERROR                    : 0x000,
		FORMAT_ERROR_MISSING_DATA   : 0x001,
		FORMAT_ERROR_INVALID_DATA   : 0x002,
		NOT_ALLOW                   : 0x003,
		COULD_NOT_PARSE_JSON        : 0x004,
		UNKNOW_API_OPERATION        : 0x005,
		NOT_IMPLEMENTED             : 0x006,
		INVALID_ID                  : 0x007,
	
		DETAILS_IN_MESSAGE          : 0x064,
		AUTH_KO                     : 0x065,
		AUTH_NEEDED                 : 0x066,
	
		NO_ACTION_IN_PROGRESS       : 0x0C8,
		ACTION_ALREADY_STARTED      : 0x0C9,
		CANCELED		            : 0x0CA,
	    SERVICE_UNAVAILABLE         : 0x0CB,
	    BATTERY_TOO_LOW		        : 0x0CC,
		
		NAVIGTION_IS_NOT_STARTED    : 0x12C,
		NAVIGTION_IS_ACTIVE		    : 0x12D,
		MAPPING_IS_NOT_STARTED  	: 0x12E,
		MAPPING_IS_ACTIVE		    : 0x12F,
		MAP_NOT_IN_SITE			    : 0x130,
		UNDOCKING                   : 0x131, // Robot trying to undock
		DOCKED                      : 0x132, // Robot is docked
		NO_DOCK                     : 0x133, // No dock detected
		NOT_DOCKABLE                : 0x134, // The robot is not dockable (bad position)
		MOVE_FAILED                 : 0x135, // Moving step failed
		NO_DOCKING_STATION          : 0x136,
		INVALID_START_POSE          : 0x140,
		NO_VALID_GLOBAL_PATH        : 0x141,
		INVALID_TARGET_POSE         : 0x142,
		OBSTACLE_FAIL               : 0x143,
		WRONG_UNDOCK_PATH           : 0x144,
		UNKNOW_REFLECTOR            : 0x145,
		NO_REFLECTOR_DETECTED       : 0x146,
		DOCKING   				    : 0x147,
		UNDOCKED			        : 0x148,
		WRONG_GOAL					: 0x149,
		CLOSE_FAILURE				: 0x14A
	};
	
	// API Commands list
	this.CommandCode = {
	 
		// Topics publishers
		JOYSTICK_TWIST_SAFE_TO_BE			: 0x2201,
	 
	// General
		GET_LAST_STATUT			: 0x1107,
		INSTALL_NEW_TOP			: 0x1105,
		AUTH_TOP			: 0x1101,
		AUTH_USER			: 0x1102,
		SINK			: 0x1108,
		FACTORY_DATA_RESET			: 0x1104,
		SUBSCRIBE_ON_EVENT			: 0x110B,
		SUBSCRIBE_ON_CHANGE			: 0x110A,
		UNSUBSCRIBE			: 0x110C,
		UNSUBSCRIBE_ALL			: 0x110D,
		INSTALL_NEW_TOP_WITHOUT_KEY			: 0x1106,
	 
		CANCEL_CURRENT_ACTION			: 0x1103,
	 
	// Services
		START_LATENCY			: 0x1109,
		WAIT_LATENCY			: 0x110E,
		MAPPING_GET_IS_STARTED			: 0x4101,
		MAPPING_START			: 0x4102,
		MAPPING_START_CANCEL			: 0x4103,
		MAPPING_STOP			: 0x4104,
		GET_LAST_MAPPING			: 0x4105,
		NAVIGATION_GET_IS_STARTED			: 0x0110,
		NAVIGATION_START_FROM_MAPPING			: 0x0112,
		NAVIGATION_START_FROM_POSE			: 0x0113,
		NAVIGATION_START_CANCEL			: 0x0111,
		NAVIGATION_STOP			: 0x0114,
		REFRESH_FREEWHEEL_STATE			: 0x3101,
		REFRESH_SAFETY_STOP			: 0x3102,
	 
		GET_DOCKING_STATE			: 0x0105,
		SET_DOCKING_STATE			: 0x0106,
		GET_ROBOT_POSE			: 0x011B,
		RELOAD_MAPS			: 0x0119,
	 
		GET_LED_IS_LIGHT_MODE			: 0x5104,
		SET_LED_IS_LIGHT_MODE			: 0x5105,
		GET_LED_IS_MANUAL_MODE			: 0x5106,
		SET_LED_IS_MANUAL_MODE			: 0x5107,
		GET_LED_CURRENT_LED_ANIMATION_MODE			: 0x5102,
		GET_LED_CURRENT_LED_ROBOT_STATE			: 0x5103,
		CONF_LED_ANIMATION			: 0x5101,
	 
		GET_MAP_FIDUCIALS_VISIBLES			: 0x010F,
		GET_ROBOT_FIDUCIALS_VISIBLES			: 0x011A,
		SET_FIDUCIALS_RECORD			: 0x0107,
		GET_FIDUCIALS_RECORDED			: 0x0108,
	 
		TELEOP_START			: 0x2110,
		TELEOP_STOP			: 0x2111,
		TELEOP_IS_STARTED			: 0x210F,
	 
		GET_PATH			: 0x0115,
		GET_PATH_FROM_CURRENT_POSE			: 0x0116,
		GET_MOVE_IN_PROGRESS			: 0x011F,
	 
	// Services DB
		CHECK_USER_KEY			: 0x6109,
		CHECK_USER_CONNECTION			: 0x6108,
		CHECK_TOP_KEY			: 0x6107,
		GET_USER			: 0x613C,
		SET_USER			: 0x613D,
		DELETE_USER			: 0x613E,
		GET_USERS_LIST			: 0x613F,
		GET_SITE			: 0x612E,
		SET_SITE			: 0x612F,
		DELETE_SITE			: 0x6130,
		GET_SITES_LIST			: 0x6132,
		GET_CURRENT_SITE			: 0x610D,
		SET_SITE_AS_CURRENT			: 0x6131,
		GET_MAP			: 0x611E,
		GET_MAP_COMPLETE			: 0x6122,
		SET_MAP			: 0x611F,
		DELETE_MAP			: 0x6120,
		SET_MAP_DATA			: 0x6123,
		GET_CURRENT_MAP			: 0x610A,
		GET_CURRENT_MAP_COMPLETE			: 0x610B,
		SET_MAP_AS_CURRENT			: 0x6121,
		GET_MAPS_LIST			: 0x6124,
		GET_AREA			: 0x6102,
		SET_AREA			: 0x6103,
		DELETE_AREA			: 0x6104,
		GET_AREAS_LIST			: 0x6105,
		GET_DOCKING_STATION			: 0x610F,
		SET_DOCKING_STATION			: 0x6110,
		DELETE_DOCKING_STATION			: 0x6111,
		SET_DOCKING_STATION_MASTER			: 0x6113,
		GET_DOCKING_STATIONS_LIST			: 0x6112,
		GET_LOG_ROS			: 0x6116,
		SET_LOG_ROS			: 0x6117,
		DELETE_LOG_ROS			: 0x6118,
		GET_LOGS_ROS_LIST			: 0x6119,
		GET_LOG_SYSTEM			: 0x611A,
		SET_LOG_SYSTEM			: 0x611B,
		DELETE_LOG_SYSTEM			: 0x611C,
		GET_LOGS_SYSTEM_LIST			: 0x611D,
		GET_POI			: 0x6125,
		SET_POI			: 0x6126,
		DELETE_POI			: 0x6127,
		GET_POIS_LIST			: 0x6128,
		GET_TOP			: 0x6135,
		SET_TOP			: 0x6136,
		DELETE_TOP			: 0x6137,
		GET_TOPS_LIST			: 0x613B,
		SET_AVAILABLE_TOPS			: 0x6106,
		SET_ACTIVE_TOP			: 0x6101,
		GET_CURRENT_TOP			: 0x610E,
		SET_TOP_AS_CURRENT			: 0x6138,
		GET_ROBOT_CONFIG			: 0x6129,
		SET_ROBOT_CONFIG			: 0x612A,
		DELETE_ROBOT_CONFIG			: 0x612B,
		GET_ROBOT_CONFIGS_LIST			: 0x612D,
		GET_CURRENT_ROBOT_CONFIG			: 0x610C,
		SET_ROBOT_CONFIG_AS_CURRENT			: 0x612C,
		GET_SERVICE_BOOK			: 0x6140,
		SET_SERVICE_BOOK			: 0x6141,
		GET_SERVICE_BOOKS_LIST			: 0x6142,
		GET_GLOBAL_VEHICULE_PERSISTANTE_DATA_STORAGE			: 0x6114,
		SET_GLOBAL_VEHICULE_PERSISTANTE_DATA_STORAGE			: 0x6115,
		SIZE_GLOBAL_VEHICULE_PERSISTANTE_DATA_STORAGE			: 0x6133,
		GET_TOP_PERSISTANTE_DATA_STORAGE			: 0x6139,
		SET_TOP_PERSISTANTE_DATA_STORAGE			: 0x613A,
		SIZE_TOP_PERSISTANTE_DATA_STORAGE			: 0x6134,
	 
	 
	// Actions
		STOP_MOVE			: 0x011C,
		GO_TO_POSE			: 0x010D,
		GO_TO_POSE_CANCEL			: 0x010E,
		DOCK			: 0x0101,
		DOCK_CANCEL			: 0x0102,
		UNDOCK			: 0x011D,
		UNDOCK_CANCEL			: 0x011E,
		GO_TO_CHARGE			: 0x0109,
		GO_TO_CHARGE_CANCEL			: 0x010A,
		GO_TO_POI			: 0x010B,
		GO_TO_POI_CANCEL			: 0x010C,
		DOCK_RECOVERY			: 0x0103,
		DOCK_RECOVERY_CANCEL			: 0x0104,
		RECOVERY_FROM_FIDUCIAL			: 0x0117,
		RECOVERY_FROM_FIDUCIAL_CANCEL			: 0x0118,
	 
	// Wifi
		GET_WIFI_LIST			: 0x7102,
		CONNECT_WIFI			: 0x7101,
		GET_ENERGY_CONFIGURATION			: 0x7103,
		SET_ENERGY_CONFIGURATION			: 0x7104,
	};
	
	// API Events list
	this.EventCode = {
		// Topics
		BATTERY_STATE			: 0x3001,
		BMS_TIME_REMAINING_TO_EMPTY			: 0x3002,
		BMS_TIME_REMAINING_TO_FULL			: 0x3003,
		LED_CURRENT_LED_ANIMATION_MODE			: 0x5001,
		LED_CURRENT_LED_ROBOT_STATE			: 0x5002,
		LED_IS_LIGHT_MODE			: 0x5003,
		LED_IS_MANUAL_MODE			: 0x5004,
		MAPPING_IS_STARTED			: 0x4001,
		MAPPING_MAP_IN_CONSTRUCTION			: 0x4002,
		MAPPING_ROBOT_POSE_CURRENT_MAP			: 0x4003,
		NAVIGATION_IS_STARTED			: 0x000C,
		NAVIGATION_ROBOT_POSE			: 0x000D,
		IS_FREEWHEEL			: 0x3004,
		IS_SAFETY_STOP			: 0x3005,
		DOCKING_STATE			: 0x0005,
		POI_POSES			: 0x0010,
		LATENCY_RETURN			: 0x3006,
		MOVE_IN_PROGRESS			: 0x0015,
	 
	// Actions
		MAPPING_START_FEEDBACK			: 0x4004,
		MAPPING_START_RESULT			: 0x4005,
		NAVIGATION_START_FEEDBACK			: 0x000E,
		NAVIGATION_START_RESULT			: 0x000F,
		GO_TO_CHARGE_FEEDBACK			: 0x0006,
		GO_TO_CHARGE_RESULT			: 0x0007,
		GO_TO_POI_FEEDBACK			: 0x0008,
		GO_TO_POI_RESULT			: 0x0009,
		DOCK_RECOVERY_FEEDBACK			: 0x0002,
		DOCK_RECOVERY_RESULT			: 0x0003,
		RECOVERY_FROM_FIDUCIAL_FEEDBACK			: 0x0011,
		RECOVERY_FROM_FIDUCIAL_RESULT			: 0x0012,
		GO_TO_POSE_FEEDBACK			: 0x000A,
		GO_TO_POSE_RESULT			: 0x000B,
		DOCK_FEEDBACK			: 0x0001,
		DOCK_RESULT			: 0x0004,
		UNDOCK_FEEDBACK			: 0x0013,
		UNDOCK_RESULT			: 0x0014,
		SET_ACTIVE_TOP_FEEDBACK			: 0x6001,
		SET_ACTIVE_TOP_RESULT			: 0x6002,
		INSTALL_NEW_TOP_FEEDBACK		: 0x1001,
		INSTALL_NEW_TOP_RESULT			: 0x1002,
	 
	};

	this.ROBOT_STATE = {
		SAFETY 		: 1,
		MOVE 		: 2,
		CHARGING 	: 3,
		STOPPED 	: 4,
		MANUAL 		: 5,
		LIGHT 		: 6
	};
	
	this.LED_ANIM = {
		PROGRESS 		: 1,
		PROGRESS_CENTER : 2,
		RAINBOW 		: 3,
		K2000 			: 4,
		CLIGNOTE 		: 5,
		CLIGNOTE_2 		: 6,
		POLICE 			: 7,
		FONDU 			: 8,
		MOVE 			: 9,
		LIGHT 			: 10,
		PROGRESS_CENTER_CHARGE : 11,
		PROGRESS_CENTER_CHARGE_BLINK: 12,
		FADE_FR_FLAG	: 13
	};
	
	this.ACTION_STATUS = {
		PENDING 	: 0,
		ACTIVE		: 1,
		PREEMPTED	: 2,
		SUCCEEDED   : 3,
		ABORTED     : 4,
		REJECTED    : 5,
		PREEMPTING  : 6,
		RECALLING   : 7,
		RECALLED    : 8,
		LOST        : 9
	}
	
   	if (typeof jQuery === 'undefined') {
	  throw new Error('WycaAPI requires jQuery')
	}
	
	if ("WebSocket" in window) {
	} else if ("MozWebSocket" in window) {
	} else {
		throw new Error('This Browser does not support WebSockets')
	}
	
	var defaults = {
		id_robot: 'not_init',
        webcam_name : 'default',
		with_audio : true,
		with_video : true,
		delay_no_reply : 30,
	  	delay_lost_connexion : 30,
		checkLostConnection: true,
		webcam_id : "",
		webcam_name: "",
		serveurWyca : 'https://integrator.wyca-solutions.com/',
		on_error_webcam_try_without : true,
		host : 'elodie.wyca-solutions.com:9095',
		api_key:''
    };
    this.options = $.extend({}, defaults, options || {});
   	
	if (this.options.id_robot == undefined || this.options.id_robot == '')
		throw new Error('WycaAPI - you need to indicate id_robot in options')
		
	if (this.options.nick == '' && this.options.id_robot != 'not_init')
	{
		if (this.options.id_robot != 'not_robot')
			this.options.nick = 'robot'+this.options.id_robot;
		else
			this.options.nick = 'server';
	}
	
	
	this.websocketStarted = false;
	this.websocketAuthed = false;
	this.websocketError = false;
	this.timeoutReconnect = null;
	this.callbacks = Array();
	this.authentificated = false;
	this.timerSink = null;
	
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
	this.reply = false;
	
	this.connectedTodo = false;
	this.socketTodo;
	this.connectedWebRTC = false;
	
	this.subscribeOnWebrtc = Array();
	
	var _this = this;
	
	pc_config = {"iceServers": 
		[
			{"urls":["stun:wyca-solutions.com:3478"], "username":"wyca", "credential":"wyca2016"},
			{"urls":["turn:wyca-solutions.com:3478"], "username":"wyca", "credential":"wyca2016"}
		]
	  };
	if (isStarted) _this.StartWebRTC();
	
	this.setIdRobot = function (_id_robot)
	{
		_this.options.id_robot = _id_robot;
		if (this.options.nick == '' || this.options.nick == 'robotnot_init')
		{
			if (_this.options.id_robot != 'not_robot')
				_this.options.nick = 'robot'+this.options.id_robot;
			else
				_this.options.nick = 'server';
		}
		
		_this.init();
	},
	
	
	this.init = function (){
		
		if (_this.options.id_robot != 'not_init')
		{
			$.getScript('https://integrator.wyca-solutions.com:7458/socket.io/socket.io.js', function()
			{
				_this.socketTodo = io('https://integrator.wyca-solutions.com:7458');
				_this.socketTodo.on('connect', function(){
					_this.socketTodo.emit('authentication', {id_robot: _this.options.id_robot, id_user:-1, t:"t", api_key: _this.options.api_key});
				});
				_this.socketTodo.on('authenticated', function() {
					_this.connectedTodo = true;
					if (_this.options.id_robot != 'not_robot')
						_this.socketTodo.emit('set_robot_name', 'robot_' + _this.options.id_robot);
					else
					{
						if (_this.options.nick != '')
							_this.socketTodo.emit('set_server_name', _this.options.nick);
						else
							_this.socketTodo.emit('set_server_name', 'server_' + _this.options.id_robot);
					}
					
					if (_this.options.onServerMessageOpen != undefined)
						_this.options.onServerMessageOpen();
				});
				_this.socketTodo.on('unauthorized', function(err){
					console.log("There was an error with the authentication:", err.message);
				});
				
				_this.socketTodo.on('message', function(msg){
					
				});
				_this.socketTodo.on('message_todo', function(msg){
					//_this.socketTodo.emit('sendMessageToServer', { "to":"all","message":{ "action":"received", "details":msg.message.action } }, function(result) { });
					if (_this.options.onNewServerMessage != undefined)
						_this.options.onNewServerMessage(msg);
				});
				
				_this.socketTodo.on('disconnect', function(){
					_this.connectedTodo = false;
				});
			});
		}
		
		if (_this.options.id_robot != 'not_robot')
			this.WsConnect();
	};
	
	/*** FUNCTIONS MESSAGING ***/
	
	
	this.SendWebRTCMessage = function(message)
	{
		_this.webrtc.sendToAll('wyca', {message: message, nick: _this.webrtc.config.nick});
	}
	
	this.SendServerMessage = function(data) {
		if (_this.connectedTodo)
			_this.socketTodo.emit('sendMessageToServer', { "to":"all","message":data }, function(result) { });
	}
	this.SendServerMessageToServer = function(server_name, data) {
		if (_this.connectedTodo)
			_this.socketTodo.emit('sendMessageToServer', { "to":server_name, "message":data }, function(result) { });
	}
	this.SendServerMessageToRobot = function(id_robot, data) {
		
		if (_this.connectedTodo)
			_this.socketTodo.emit('sendMessageToRobot', { "to":"robot_"+id_robot,"message":data }, function(result) { });
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
	
	this.StartWebRTCWithRobot = function (id_robot)
	{
		this.call_from_admin = true;
		if (this.options.room == '' || this.options.room == undefined)
			this.options.room = "Room"+id_robot;
		this.SendServerMessageToRobot(id_robot, 'StartCall|'+_this.options.room);
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
				_this.connectedWebRTC = false;
				if (_this.options.id_robot != 'not_robot')
					_this.UnsubscribeWebRTC();
					
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
				_this.connectedWebRTC = true;
				_this.subscribeOnWebrtc = Array();
				
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
				
				if (_this.options.id_robot == 'not_robot')
				{
					_this.Subscribe();
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
				if(data.type === 'wyca')
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
				else if(data.type === 'wyca_api')
				{
					// Transférer à la partie WS + stockage si abo event pour transfert après et call op pour réponse
					if (_this.options.id_robot != 'not_robot')
					{
						// On sauvegarde si c'est un abonnement au topic pour pouvoir le retransférer plus tard
						json = JSON.parse(data.payload.message);
						
						doTransfert = true;
						
						if (json.O == _this.CommandCode.SUBSCRIBE_ON_EVENT ||
							json.O == _this.CommandCode.SUBSCRIBE_ON_CHANGE)
						{
							
							if (json.O == _this.CommandCode.SUBSCRIBE_ON_EVENT)
									event_code = json.P.E;
							else
									event_code = json.P;
							
							_this.subscribeOnWebrtc[event_code] = 'subscribed';
							
							switch (event_code)
							{
								/********** Actions *********/
								case _this.EventCode.GO_TO_CHARGE_FEEDBACK: 
								case _this.EventCode.GO_TO_CHARGE_RESULT:
								case _this.EventCode.GO_TO_POI_FEEDBACK:
								case _this.EventCode.GO_TO_POI_RESULT:
								case _this.EventCode.GO_TO_POSE_FEEDBACK:
								case _this.EventCode.GO_TO_POSE_RESULT:
								case _this.EventCode.DOCK_FEEDBACK:
								case _this.EventCode.DOCK_RESULT:
								case _this.EventCode.UNDOCK_FEEDBACK:
								case _this.EventCode.UNDOCK_RESULT:
								case _this.EventCode.MAPPING_START_FEEDBACK:
								case _this.EventCode.MAPPING_START_RESULT:
								case _this.EventCode.NAVIGATION_START_FEEDBACK:
								case _this.EventCode.NAVIGATION_START_RESULT:
								case _this.EventCode.DOCK_RECOVERY_FEEDBACK:
								case _this.EventCode.DOCK_RECOVERY_RESULT:
								case _this.EventCode.RECOVERY_FROM_FIDUCIAL_FEEDBACK:
								case _this.EventCode.RECOVERY_FROM_FIDUCIAL_RESULT:
								case _this.EventCode.SET_ACTIVE_TOP_FEEDBACK:
								case _this.EventCode.SET_ACTIVE_TOP_RESULT:
								case _this.EventCode.INSTALL_NEW_TOP_FEEDBACK:
								case _this.EventCode.INSTALL_NEW_TOP_RESULT:
									doTransfert = false;
									break;
							}
						}
						
						if (json.O == _this.CommandCode.UNSUBSCRIBE)
						{
							_this.subscribeOnWebrtc[json.P] = 'notsubscribed';
							doTransfert = false; // TODO A améliorer : à retourner si le robot lui même n'est pas abonné
						}
						
						// On sauvegarde les abonnement au réponses des actions
						if (json.O == _this.CommandCode.GO_TO_POSE)
						{
							_this.subscribeOnWebrtc[_this.EventCode.GO_TO_POSE_FEEDBACK] = 'subscribed';
							_this.subscribeOnWebrtc[_this.EventCode.GO_TO_POSE_RESULT] = 'subscribed';
						}
						if (json.O == _this.CommandCode.DOCK)
						{
							_this.subscribeOnWebrtc[_this.EventCode.DOCK_FEEDBACK] = 'subscribed';
							_this.subscribeOnWebrtc[_this.EventCode.DOCK_RESULT] = 'subscribed';
						}
						if (json.O == _this.CommandCode.UNDOCK)
						{
							_this.subscribeOnWebrtc[_this.EventCode.UNDOCK_FEEDBACK] = 'subscribed';
							_this.subscribeOnWebrtc[_this.EventCode.UNDOCK_RESULT] = 'subscribed';
						}
						if (json.O == _this.CommandCode.GO_TO_CHARGE)
						{
							_this.subscribeOnWebrtc[_this.EventCode.GO_TO_CHARGE_FEEDBACK] = 'subscribed';
							_this.subscribeOnWebrtc[_this.EventCode.GO_TO_CHARGE_RESULT] = 'subscribed';
						}
						if (json.O == _this.CommandCode.GO_TO_POI)
						{
							_this.subscribeOnWebrtc[_this.EventCode.GO_TO_POI_FEEDBACK] = 'subscribed';
							_this.subscribeOnWebrtc[_this.EventCode.GO_TO_POI_RESULT] = 'subscribed';
						}
						if (json.O == _this.CommandCode.DOCK_RECOVERY)
						{
							_this.subscribeOnWebrtc[_this.EventCode.DOCK_RECOVERY_FEEDBACK] = 'subscribed';
							_this.subscribeOnWebrtc[_this.EventCode.DOCK_RECOVERY_RESULT] = 'subscribed';
						}
						if (json.O == _this.CommandCode.RECOVERY_FROM_FIDUCIAL)
						{
							_this.subscribeOnWebrtc[_this.EventCode.RECOVERY_FROM_FIDUCIAL_FEEDBACK] = 'subscribed';
							_this.subscribeOnWebrtc[_this.EventCode.RECOVERY_FROM_FIDUCIAL_RESULT] = 'subscribed';
						}
						if (json.O == _this.CommandCode.SET_ACTIVE_TOP)
						{
							_this.subscribeOnWebrtc[_this.EventCode.SET_ACTIVE_TOP_FEEDBACK] = 'subscribed';
							_this.subscribeOnWebrtc[_this.EventCode.SET_ACTIVE_TOP_RESULT] = 'subscribed';
						}
						if (json.O == _this.CommandCode.INSTALL_NEW_TOP)
						{
							_this.subscribeOnWebrtc[_this.EventCode.INSTALL_NEW_TOP_FEEDBACK] = 'subscribed';
							_this.subscribeOnWebrtc[_this.EventCode.INSTALL_NEW_TOP_RESULT] = 'subscribed';
						}
												
						// On transfère au robot
						if (doTransfert) _this.wycaSend(data.payload.message);
					}
					else
					{
						// On traite la réponse du robot
						_this.ProcessMessage(data.payload.message);
					}
				}
			}
		});
		_this.webrtc.on('signalingStateChange', function(param){
		});
		_this.webrtc.on('videoRemoved', function (video, peer) {
			
			if (_this.other_id == peer.id) // On n'emet que si c'est le dernier connecté (sinon pb en cas de courpure de connexion temporaire)
			{
				if (_this.options.onVideoRemoved != undefined)
					_this.options.onVideoRemoved(peer.nick, video);
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
	
	this.UnsubscribeWebRTC = function()
	{
		this.UnsubscribeAll();
		this.subscribeOnWebrtc = Array();
		this.Subscribe();
	}
	
	/****************/
	/** Websockets **/
	/****************/
	
	this.wsOnOpen = function(e)
	{
		_this.websocketStarted = true;
		//_this.ROSMessageSendToPC('onRobotConnexionOpen');
		if (_this.options.onRobotConnexionOpen != undefined)
		{
			_this.options.onRobotConnexionOpen();
		}
		
		if (this.options.api_key != '')
		{
			var auth = {
				"O": this.CommandCode.AUTH_USER,
				"P": this.options.api_key
			  };		
			
			_this.ws.send(JSON.stringify(auth));
		}
	}
	
	this.wsOnError = function(error)
	{
		//_this.websocketStarted = false;
		//_this.websocketAuthed = false;
		_this.websocketError = true;
		//_this.ROSMessageSendToPC('onRobotConnexionError');
		if (_this.options.onRobotConnexionError != undefined)
		{
			_this.options.onRobotConnexionError();
		}
		
		if (_this.timeoutReconnect == null)
			_this.timeoutReconnect = setTimeout(_this.WsConnect, 1000);
	}
	
	this.wsOnClose = function(e)
	{
		_this.websocketStarted = false;
		_this.websocketAuthed = false;
		//_this.ROSMessageSendToPC('onRobotConnexionClose');
		if (_this.options.onRobotConnexionClose != undefined)
		{
			_this.options.onRobotConnexionClose();
		}
		
		if (_this.timeoutReconnect == null)
			_this.timeoutReconnect = setTimeout(_this.WsConnect, 1000);
	}
	
	this.wsOnMessage = function(e)
	{
		_this.ProcessMessage(e.data);
	}
	
	this.ProcessMessage = function(msg_raw)
	{
		
		if (msg_raw == 'ack') return;
		msg = JSON.parse(msg_raw);
		
		//console.log(msg);
		if (msg.A > 0)
		{
			console.log("ERROR", msg);
			console.log(_this.AnswerCodeToString(msg.A));
		}
		if (msg.O != undefined)
		{
			if (_this.options.id_robot != 'not_robot' && _this.connectedWebRTC)
			{
				_this.webrtc.sendToAll('wyca_api', {message: JSON.stringify(msg), nick: _this.webrtc.config.nick});
			}
			
			switch(msg.O)
			{
				case this.CommandCode.SINK: break;
				case this.CommandCode.AUTH_USER:
					if (msg.A == _this.AnswerCode.NO_ERROR)
					{
						_this.websocketAuthed = true;
						_this.Subscribe();
					}
					else
					{
						console.log('Error auth', msg);
					}
					break;
				case this.CommandCode.SUBSCRIBE_ON_EVENT:
				case this.CommandCode.SUBSCRIBE_ON_CHANGE:
					switch(msg.D.E)
					{
						/********** Topics *********/
						case this.EventCode.BATTERY_STATE:
							if (_this.options.onBatteryState != undefined) { _this.options.onBatteryState(msg.D.D); }
							break;
						case this.EventCode.BMS_TIME_REMAINING_TO_EMPTY:
							if (_this.options.onTimeRemainingToEmptyMin != undefined) { _this.options.onTimeRemainingToEmptyMin(msg.D.D); }
							break;
						case this.EventCode.BMS_TIME_REMAINING_TO_FULL:
							if (_this.options.onTimeRemainingToFullMin != undefined) { _this.options.onTimeRemainingToFullMin(msg.D.D); }
							break;
						case this.EventCode.LED_CURRENT_LED_ANIMATION_MODE:
							if (_this.options.onLedCurrentAnimationMode != undefined) { _this.options.onLedCurrentAnimationMode(msg.D.D); }
							break;
						case this.EventCode.LED_CURRENT_LED_ROBOT_STATE:
							if (_this.options.onLedCurrentRobotStateMode != undefined) { _this.options.onLedCurrentRobotStateMode(msg.D.D); }
							break;
						case this.EventCode.LED_IS_LIGHT_MODE:
							if (_this.options.onLedIsLightMode != undefined) { _this.options.onLedIsLightMode(msg.D.D); }
							break;
						case this.EventCode.LED_IS_MANUAL_MODE:
							if (_this.options.onLedIsManualMode != undefined) { _this.options.onLedIsManualMode(msg.D.D); }
							break;
						case this.EventCode.MAPPING_IS_STARTED:
							if (_this.options.onMappingIsStarted != undefined) { _this.options.onMappingIsStarted(msg.D.D); }
							break;
						case this.EventCode.MAPPING_MAP_IN_CONSTRUCTION:
							if (_this.options.onMappingMapInConstruction != undefined) { _this.options.onMappingMapInConstruction(msg.D.D); }
							break;
						case this.EventCode.MAPPING_ROBOT_POSE_CURRENT_MAP:
							if (_this.options.onMappingRobotPoseInBuildingMap != undefined) { _this.options.onMappingRobotPoseInBuildingMap(msg.D.D); }
							break;
						case this.EventCode.NAVIGATION_IS_STARTED:
							if (_this.options.onNavigationIsStarted != undefined) { _this.options.onNavigationIsStarted(msg.D.D); }
							break;
						case this.EventCode.NAVIGATION_ROBOT_POSE:
							if (_this.options.onNavigationRobotPose != undefined) { _this.options.onNavigationRobotPose(msg.D.D); }
							break;
						case this.EventCode.IS_FREEWHEEL:
							if (_this.options.onIsFreewheel != undefined) { _this.options.onIsFreewheel(msg.D.D); }
							break;
						case this.EventCode.IS_SAFETY_STOP:
							if (_this.options.onIsSafetyStop != undefined) { _this.options.onIsSafetyStop(msg.D.D); }
							break;
						case this.EventCode.DOCKING_STATE:
							if (_this.options.onDockingState != undefined) { _this.options.onDockingState(msg.D.D); }
							break;
						case this.EventCode.POI_POSES:
							if (_this.options.onPOIsDetect != undefined) { _this.options.onPOIsDetect(msg.D.D); }
							break;
						case this.EventCode.MOVE_IN_PROGRESS:
							if (_this.options.onMoveInProgress != undefined) { _this.options.onMoveInProgress(msg.D.D); }
							break;
					}				
					break;
				case this.CommandCode.UNSUBSCRIBE:
				case this.CommandCode.UNSUBSCRIBE_ALL:
					break;
				default:
					if (_this.callbacks[msg.O] !=undefined) { id_op = msg.O; delete msg.O; _this.callbacks[id_op](msg); }
					break;
			}
		}
		
		if (msg.E != undefined) // False pour test retour subscribe
		{
			if (_this.options.id_robot != 'not_robot' && _this.connectedWebRTC)
			{
				if (_this.subscribeOnWebrtc[msg.E] != undefined && _this.subscribeOnWebrtc[msg.E] == 'subscribed')
				{
					_this.webrtc.sendToAll('wyca_api', {message: JSON.stringify(msg), nick: _this.webrtc.config.nick});
				}
			}
			
			switch(msg.E)
			{
				/********** Actions *********/
				case this.EventCode.GO_TO_CHARGE_FEEDBACK:
					if (_this.options.onGoToChargeFeedback != undefined) { delete msg.E; _this.options.onGoToChargeFeedback(msg); }
					break;
				case this.EventCode.GO_TO_CHARGE_RESULT:
					if (_this.options.onGoToChargeResult != undefined) { delete msg.E; _this.options.onGoToChargeResult(msg); }
					break;
				case this.EventCode.GO_TO_POI_FEEDBACK:
					if (_this.options.onGoToPoiFeedback != undefined) { delete msg.E; _this.options.onGoToPoiFeedback(msg); }
					break;
				case this.EventCode.GO_TO_POI_RESULT:
					if (_this.options.onGoToPoiResult != undefined) { delete msg.E; _this.options.onGoToPoiResult(msg); }
					break;
				case this.EventCode.GO_TO_POSE_FEEDBACK:
					if (_this.options.onGoToPoseFeedback != undefined) { delete msg.E; _this.options.onGoToPoseFeedback(msg); }
					break;
				case this.EventCode.GO_TO_POSE_RESULT:
					if (_this.options.onGoToPoseResult != undefined) { delete msg.E; _this.options.onGoToPoseResult(msg); }
					break;
				case this.EventCode.DOCK_FEEDBACK:
					if (_this.options.onDockFeedback != undefined) { delete msg.E; _this.options.onDockFeedback(msg); }
					break;
				case this.EventCode.DOCK_RESULT:
					if (_this.options.onDockResult != undefined) {delete msg.E; _this.options.onDockResult(msg); }
					break;
				case this.EventCode.UNDOCK_FEEDBACK:
					if (_this.options.onUndockFeedback != undefined) { delete msg.E; _this.options.onUndockFeedback(msg); }
					break;
				case this.EventCode.UNDOCK_RESULT:
					if (_this.options.onUndockResult != undefined) { delete msg.E; _this.options.onUndockResult(msg); }
					break;
				case _this.EventCode.SET_ACTIVE_TOP_FEEDBACK:
					if (_this.options.onSetActiveTopFeedback != undefined) { delete msg.E; _this.options.onSetActiveTopFeedback(msg); }
					break;
				case _this.EventCode.SET_ACTIVE_TOP_RESULT:
					if (_this.options.onSetActiveTopResult != undefined) { delete msg.E; _this.options.onSetActiveTopResult(msg); }
					break;
				case _this.EventCode.INSTALL_NEW_TOP_FEEDBACK:
					if (_this.options.onInstallNewTopFeedback != undefined) { delete msg.E; _this.options.onInstallNewTopFeedback(msg); }
					break;
				case _this.EventCode.INSTALL_NEW_TOP_RESULT:
					if (_this.options.onInstallNewTopResult != undefined) { delete msg.E; _this.options.onInstallNewTopResult(msg); }
					break;
				case this.EventCode.MAPPING_START_FEEDBACK:
					if (_this.options.onMappingStartFeedback != undefined) { delete msg.E; _this.options.onMappingStartFeedback(msg); }
					break;
				case this.EventCode.MAPPING_START_RESULT:
					if (_this.options.onMappingStartResult != undefined) { delete msg.E; _this.options.onMappingStartResult(msg); }
					break;
				case this.EventCode.NAVIGATION_START_FEEDBACK:
					if (_this.options.onNavigationStartFeedback != undefined) { delete msg.E; _this.options.onNavigationStartFeedback(msg); }
					break;
				case this.EventCode.NAVIGATION_START_RESULT:
					if (_this.options.onNavigationStartResult != undefined) { delete msg.E; _this.options.onNavigationStartResult(msg); }
					break;
				case this.EventCode.DOCK_RECOVERY_FEEDBACK:
					if (_this.options.onDockRecoveryFeedback != undefined) { delete msg.E; _this.options.onDockRecoveryFeedback(msg); }
					break;
				case this.EventCode.DOCK_RECOVERY_RESULT:
					if (_this.options.onDockRecoveryResult != undefined) { delete msg.E; _this.options.onDockRecoveryResult(msg); }
					break;
				case this.EventCode.RECOVERY_FROM_FIDUCIAL_FEEDBACK:
					if (_this.options.onRecoveryFromFiducialFeedback != undefined) { delete msg.E; _this.options.onRecoveryFromFiducialFeedback(msg); }
					break;
				case this.EventCode.RECOVERY_FROM_FIDUCIAL_RESULT:
					if (_this.options.onRecoveryFromFiducialResult != undefined) { delete msg.E; _this.options.onRecoveryFromFiducialResult(msg); }
					break;
				/********** Topics *********/
				case this.EventCode.BATTERY_STATE:
					if (_this.options.onBatteryState != undefined) { _this.options.onBatteryState(msg.D); }
					break;
				case this.EventCode.BMS_TIME_REMAINING_TO_EMPTY:
					if (_this.options.onTimeRemainingToEmptyMin != undefined) { _this.options.onTimeRemainingToEmptyMin(msg.D); }
					break;
				case this.EventCode.BMS_TIME_REMAINING_TO_FULL:
					if (_this.options.onTimeRemainingToFullMin != undefined) { _this.options.onTimeRemainingToFullMin(msg.D); }
					break;
				case this.EventCode.LED_CURRENT_LED_ANIMATION_MODE:
					if (_this.options.onLedCurrentAnimationMode != undefined) { _this.options.onLedCurrentAnimationMode(msg.D); }
					break;
				case this.EventCode.LED_CURRENT_LED_ROBOT_STATE:
					if (_this.options.onLedCurrentRobotStateMode != undefined) { _this.options.onLedCurrentRobotStateMode(msg.D); }
					break;
				case this.EventCode.LED_IS_LIGHT_MODE:
					if (_this.options.onLedIsLightMode != undefined) { _this.options.onLedIsLightMode(msg.D); }
					break;
				case this.EventCode.LED_IS_MANUAL_MODE:
					if (_this.options.onLedIsManualMode != undefined) { _this.options.onLedIsManualMode(msg.D); }
					break;
				case this.EventCode.MAPPING_IS_STARTED:
					if (_this.options.onMappingIsStarted != undefined) { _this.options.onMappingIsStarted(msg.D); }
					break;
				case this.EventCode.MAPPING_MAP_IN_CONSTRUCTION:
					if (_this.options.onMappingMapInConstruction != undefined) { _this.options.onMappingMapInConstruction(msg.D); }
					break;
				case this.EventCode.MAPPING_ROBOT_POSE_CURRENT_MAP:
					if (_this.options.onMappingRobotPoseInBuildingMap != undefined) { _this.options.onMappingRobotPoseInBuildingMap(msg.D); }
					break;
				case this.EventCode.NAVIGATION_IS_STARTED:
					if (_this.options.onNavigationIsStarted != undefined) { _this.options.onNavigationIsStarted(msg.D); }
					break;
				case this.EventCode.NAVIGATION_ROBOT_POSE:
					if (_this.options.onNavigationRobotPose != undefined) { _this.options.onNavigationRobotPose(msg.D); }
					break;
				case this.EventCode.IS_FREEWHEEL:
					if (_this.options.onIsFreewheel != undefined) { _this.options.onIsFreewheel(msg.D); }
					break;
				case this.EventCode.IS_SAFETY_STOP:
					if (_this.options.onIsSafetyStop != undefined) { _this.options.onIsSafetyStop(msg.D); }
					break;
				case this.EventCode.DOCKING_STATE:
					if (_this.options.onDockingState != undefined) { _this.options.onDockingState(msg.D); }
					break;
				case this.EventCode.POI_POSES:
					if (_this.options.onPOIsDetect != undefined) { _this.options.onPOIsDetect(msg.D); }
					break;
				case this.EventCode.MOVE_IN_PROGRESS:
					if (_this.options.onMoveInProgress != undefined) { _this.options.onMoveInProgress(msg.D); }
					break;
			}
		}
	}
	
	this.WsConnect = function()
	{
		_this.timeoutReconnect = null;
		if (_this.options.id_robot != 'not_robot')
		{
			if ("WebSocket" in window) {
				_this.ws = new WebSocket('wss://'+_this.options.host);
			} else if ("MozWebSocket" in window) {
				_this.ws = new MozWebSocket('wss://'+_this.options.host);
			} else {
				throw new Error('This Browser does not support WebSockets')
			}
			_this.ws.onopen = jQuery.proxy(_this.wsOnOpen, _this);
			_this.ws.onerror = jQuery.proxy(_this.wsOnError, _this);
			_this.ws.onclose = jQuery.proxy(_this.wsOnClose , _this);
			_this.ws.onmessage = jQuery.proxy(_this.wsOnMessage , _this);
		}
	}
	
	this.wycaSend = function (msg) {
		
		if (_this.options.id_robot != 'not_robot')
		{	
			if (!_this.websocketStarted)
				_this.websocketAuthed = false;
			else
			{
				if (_this.websocketAuthed)
				{
					_this.ws.send(msg);
					
					// Envoie d'une deuxième requete après 50ms pour forcer le mobile à envoyer la précédente commande.
					if (_this.timerSink != null)
					{
						clearTimeout(_this.timerSink);
						_this.timerSink = null;
					}
					_this.timerSink = setTimeout(function() { _this.timerSink = null; _this.ws.send("{\"O\":" + _this.CommandCode.SINK + "}");}, 50);
				}
				else
					console.error('No auth');
			}
		}
		else
		{
			_this.webrtc.sendToAll('wyca_api', {message: msg, nick: _this.webrtc.config.nick});
		}
	}
	
	/****************/
	/** 	API	   **/
	/****************/
	
	this.AnswerCodeToString = function(ac)
	{
		switch(ac)
		{
			case _this.AnswerCode.NO_ERROR : return 'No error'; break;
			case _this.AnswerCode.FORMAT_ERROR_MISSING_DATA : return 'Format error ; missing data'; break;
			case _this.AnswerCode.FORMAT_ERROR_INVALID_DATA : return 'Format error ; invalid data'; break;
			case _this.AnswerCode.NOT_ALLOW : return 'Not allow'; break;
			case _this.AnswerCode.COULD_NOT_PARSE_JSON : return 'Could not parse JSON'; break;
			case _this.AnswerCode.UNKNOW_API_OPERATION : return 'Unknow API operation'; break;
			case _this.AnswerCode.NOT_IMPLEMENTED : return 'Not implemented'; break;
			case _this.AnswerCode.INVALID_ID : return 'Invalid ID'; break;
			case _this.AnswerCode.DETAILS_IN_MESSAGE : return 'Details in message'; break;
			case _this.AnswerCode.AUTH_KO : return 'Auth KO'; break;
			case _this.AnswerCode.AUTH_NEEDED : return 'Auth needed'; break;
			case _this.AnswerCode.NO_ACTION_IN_PROGRESS : return 'No action in progress'; break;
			case _this.AnswerCode.ACTION_ALREADY_STARTED : return 'Action already started'; break;
			case _this.AnswerCode.CANCELED : return 'Action canceled'; break;
			case _this.AnswerCode.SERVICE_UNAVAILABLE : return 'Service unvailable'; break;
			case _this.AnswerCode.BATTERY_TOO_LOW : return 'Battery too low'; break;
			case _this.AnswerCode.NAVIGTION_IS_NOT_STARTED : return 'Navigation is not started'; break;
			case _this.AnswerCode.NAVIGTION_IS_ACTIVE : return 'Navigation is active and block current operation'; break;
			case _this.AnswerCode.MAPPING_IS_NOT_STARTED : return 'Mapping is not started'; break;
			case _this.AnswerCode.MAPPING_IS_ACTIVE : return 'Mapping is active and block current operation'; break;
			case _this.AnswerCode.MAP_NOT_IN_SITE : return 'Map not in current site'; break;
			case _this.AnswerCode.UNDOCKING : return 'Robot trying to undock'; break; // Robot trying to undock
			case _this.AnswerCode.DOCKED : return 'Robot is docked'; break; // Robot is docked
			case _this.AnswerCode.NO_DOCK : return 'No dock detected'; break; // No dock detected
			case _this.AnswerCode.NOT_DOCKABLE : return 'The robot is not dockable (bad position)'; break; // The robot is not dockable (bad position)
			case _this.AnswerCode.MOVE_FAILED : return 'Moving step failed'; break; // Moving step failed
			case _this.AnswerCode.NO_DOCKING_STATION : return 'No docking station'; break;
			case _this.AnswerCode.INVALID_START_POSE : return 'Invalid start position'; break;
			case _this.AnswerCode.NO_VALID_GLOBAL_PATH : return 'No valid global path'; break;
			case _this.AnswerCode.INVALID_TARGET_POSE : return 'Invalid target position'; break;
			case _this.AnswerCode.OBSTACLE_FAIL : return 'Obstacle fail'; break;
			case _this.AnswerCode.WRONG_UNDOCK_PATH : return 'Wrong undock path'; break;
			case _this.AnswerCode.UNKNOW_REFLECTOR : return 'Unknow reflector for the current map'; break;
			case _this.AnswerCode.NO_REFLECTOR_DETECTED : return 'No reflector detected around the robot'; break;
			case _this.AnswerCode.DOCKING : return 'Robot trying to dock'; break; // Robot trying to dock
			case _this.AnswerCode.UNDOCKED : return 'Robot is undocked'; break; // Robot is undocked
			case _this.AnswerCode.WRONG_GOAL : return 'Wrong goal: Fiducial type and id must be defined'; break;
			case _this.AnswerCode.CLOSE_FAILURE : return 'Dock fail too close to dock'; break;
			default: return 'Unknow error code';
		}
	}
		
	this.Subscribe = function()
	{
		if (_this.options.onBatteryState != undefined) { var n=_this.EventCode.BATTERY_STATE; var subscribe = { "O": _this.CommandCode.SUBSCRIBE_ON_EVENT, "P": { "E":n, "F":1000}}; _this.wycaSend(JSON.stringify(subscribe)); }
		if (_this.options.onTimeRemainingToEmptyMin != undefined) { var n=_this.EventCode.BMS_TIME_REMAINING_TO_EMPTY; var subscribe = { "O": _this.CommandCode.SUBSCRIBE_ON_CHANGE, "P": n}; _this.wycaSend(JSON.stringify(subscribe)); }
		if (_this.options.onTimeRemainingToFullMin != undefined) { var n=_this.EventCode.BMS_TIME_REMAINING_TO_FULL; var subscribe = { "O": _this.CommandCode.SUBSCRIBE_ON_CHANGE, "P": n}; _this.wycaSend(JSON.stringify(subscribe)); }
		if (_this.options.onLedCurrentAnimationMode != undefined) { var n=_this.EventCode.LED_CURRENT_LED_ANIMATION_MODE; var subscribe = { "O": _this.CommandCode.SUBSCRIBE_ON_CHANGE, "P": n}; _this.wycaSend(JSON.stringify(subscribe)); }
		if (_this.options.onLedCurrentRobotStateMode != undefined) { var n=_this.EventCode.LED_CURRENT_LED_ROBOT_STATE; var subscribe = {	"O": _this.CommandCode.SUBSCRIBE_ON_CHANGE, "P": n}; _this.wycaSend(JSON.stringify(subscribe)); }
		if (_this.options.onLedIsLightMode != undefined) { var n=_this.EventCode.LED_IS_LIGHT_MODE; var subscribe = {	"O": _this.CommandCode.SUBSCRIBE_ON_CHANGE, "P": n}; _this.wycaSend(JSON.stringify(subscribe)); }
		if (_this.options.onLedIsManualMode != undefined) { var n=_this.EventCode.LED_IS_MANUAL_MODE; var subscribe = { "O": _this.CommandCode.SUBSCRIBE_ON_CHANGE, "P": n}; _this.wycaSend(JSON.stringify(subscribe)); }
		if (_this.options.onMappingIsStarted != undefined) { var n=_this.EventCode.MAPPING_IS_STARTED; var subscribe = { "O": _this.CommandCode.SUBSCRIBE_ON_CHANGE, "P": n}; _this.wycaSend(JSON.stringify(subscribe)); }
		if (_this.options.onMappingMapInConstruction != undefined) { var n=_this.EventCode.MAPPING_MAP_IN_CONSTRUCTION; var subscribe = { "O": _this.CommandCode.SUBSCRIBE_ON_CHANGE, "P": n}; _this.wycaSend(JSON.stringify(subscribe)); }
		if (_this.options.onMappingRobotPoseInBuildingMap != undefined) { var n=_this.EventCode.MAPPING_ROBOT_POSE_CURRENT_MAP; var subscribe = { "O": _this.CommandCode.SUBSCRIBE_ON_CHANGE, "P": n}; _this.wycaSend(JSON.stringify(subscribe)); }
		if (_this.options.onNavigationIsStarted != undefined) { var n=_this.EventCode.NAVIGATION_IS_STARTED; var subscribe = { "O": _this.CommandCode.SUBSCRIBE_ON_CHANGE, "P": n}; _this.wycaSend(JSON.stringify(subscribe)); }
		if (_this.options.onNavigationRobotPose != undefined) { var n=_this.EventCode.NAVIGATION_ROBOT_POSE; var subscribe = { "O": _this.CommandCode.SUBSCRIBE_ON_CHANGE, "P": n}; _this.wycaSend(JSON.stringify(subscribe)); }
		if (_this.options.onIsFreewheel != undefined) { var n=_this.EventCode.IS_FREEWHEEL; var subscribe = { "O": _this.CommandCode.SUBSCRIBE_ON_CHANGE, "P": n}; _this.wycaSend(JSON.stringify(subscribe)); }
		if (_this.options.onIsSafetyStop != undefined) { var n=_this.EventCode.IS_SAFETY_STOP; var subscribe = { "O": _this.CommandCode.SUBSCRIBE_ON_CHANGE, "P": n}; _this.wycaSend(JSON.stringify(subscribe)); }
		if (_this.options.onDockingState != undefined) { var n=_this.EventCode.DOCKING_STATE; var subscribe = { "O": _this.CommandCode.SUBSCRIBE_ON_CHANGE, "P": n}; _this.wycaSend(JSON.stringify(subscribe)); }
		if (_this.options.onPOIsDetect != undefined) { var n=_this.EventCode.POI_POSES; var subscribe = { "O": _this.CommandCode.SUBSCRIBE_ON_CHANGE, "P": n}; _this.wycaSend(JSON.stringify(subscribe)); }
		if (_this.options.onMoveInProgress != undefined) { var n=_this.EventCode.MOVE_IN_PROGRESS; var subscribe = { "O": _this.CommandCode.SUBSCRIBE_ON_CHANGE, "P": n}; _this.wycaSend(JSON.stringify(subscribe)); }
		
		if (_this.options.onInitialized != undefined) _this.options.onInitialized();
	}
	
	this.UnsubscribeAll = function()
	{
		var unsubscribe = { "O": _this.CommandCode.UNSUBSCRIBE_ALL};
		_this.wycaSend(JSON.stringify(unsubscribe));
	}
	
	this.on = function (event_name, callback)
	{
		_this.options[event_name] = callback;
		
		ev_code = 0;
		switch (event_name)
		{
			case 'onBatteryState': ev_code = _this.EventCode.BATTERY_STATE; break;
			case 'onTimeRemainingToEmptyMin': ev_code = _this.EventCode.BMS_TIME_REMAINING_TO_EMPTY; break;
			case 'onTimeRemainingToFullMin': ev_code = _this.EventCode.BMS_TIME_REMAINING_TO_FULL; break;
			case 'onLedCurrentAnimationMode': ev_code = _this.EventCode.LED_CURRENT_LED_ANIMATION_MODE; break;
			case 'onLedCurrentRobotStateMode': ev_code = _this.EventCode.LED_CURRENT_LED_ROBOT_STATE; break;
			case 'onLedIsLightMode': ev_code = _this.EventCode.LED_IS_LIGHT_MODE; break;
			case 'onLedIsManualMode': ev_code = _this.EventCode.LED_IS_MANUAL_MODE; break;
			case 'onMappingIsStarted': ev_code = _this.EventCode.MAPPING_IS_STARTED; break;
			case 'onMappingMapInConstruction': ev_code = _this.EventCode.MAPPING_MAP_IN_CONSTRUCTION; break;
			case 'onMappingRobotPoseInBuildingMap': ev_code = _this.EventCode.MAPPING_ROBOT_POSE_CURRENT_MAP; break;
			case 'onNavigationIsStarted': ev_code = _this.EventCode.NAVIGATION_IS_STARTED; break;
			case 'onNavigationRobotPose': ev_code = _this.EventCode.NAVIGATION_ROBOT_POSE; break;
			case 'onIsFreewheel': ev_code = _this.EventCode.IS_FREEWHEEL; break;
			case 'onIsSafetyStop': ev_code = _this.EventCode.IS_SAFETY_STOP; break;
			case 'onDockingState': ev_code = _this.EventCode.DOCKING_STATE; break;
			case 'onPOIsDetect': ev_code = _this.EventCode.POI_POSES; break;
			case 'onMoveInProgress': ev_code = _this.EventCode.MOVE_IN_PROGRESS; break;
		}
		
		if (ev_code == 0 && _this.options.id_robot == 'not_robot')
		{
			// On envoi la commande, juste pour indiquer au webrtc que l'on souhaite avoir ces évènements
			switch (event_name)
			{
				/********** Actions *********/
				case 'onGoToChargeFeedback': ev_code = _this.EventCode.GO_TO_CHARGE_FEEDBACK; break;
				case 'onGoToChargeResult': ev_code = _this.EventCode.GO_TO_CHARGE_RESULT; break;
				case 'onGoToPoiFeedback': ev_code = _this.EventCode.GO_TO_POI_FEEDBACK; break;
				case 'onGoToPoiResult': ev_code = _this.EventCode.GO_TO_POI_RESULT; break;
				case 'onGoToPoseFeedback': ev_code = _this.EventCode.GO_TO_POSE_FEEDBACK; break;
				case 'onGoToPoseResult': ev_code = _this.EventCode.GO_TO_POSE_RESULT; break;
				case 'onDockFeedback': ev_code = _this.EventCode.DOCK_FEEDBACK; break;
				case 'onDockResult': ev_code = _this.EventCode.DOCK_RESULT; break;
				case 'onUndockFeedback': ev_code = _this.EventCode.UNDOCK_FEEDBACK; break;
				case 'onUndockResult': ev_code = _this.EventCode.UNDOCK_RESULT; break;
				case 'onMappingStartFeedback': ev_code = _this.EventCode.MAPPING_START_FEEDBACK; break;
				case 'onMappingStartResult': ev_code = _this.EventCode.MAPPING_START_RESULT; break;
				case 'onNavigationStartFeedback': ev_code = _this.EventCode.NAVIGATION_START_FEEDBACK; break;
				case 'onNavigationStartResult': ev_code = _this.EventCode.NAVIGATION_START_RESULT; break;
				case 'onDockRecoveryFeedback': ev_code = _this.EventCode.DOCK_RECOVERY_FEEDBACK; break;
				case 'onDockRecoveryResult': ev_code = _this.EventCode.DOCK_RECOVERY_RESULT; break;
				case 'onRecoveryFromFiducialFeedback': ev_code = _this.EventCode.RECOVERY_FROM_FIDUCIAL_FEEDBACK; break;
				case 'onRecoveryFromFiducialResult': ev_code = _this.EventCode.RECOVERY_FROM_FIDUCIAL_RESULT; break;
				case 'onSetActiveTopFeedback': ev_code = _this.EventCode.SET_ACTIVE_TOP_FEEDBACK; break;
				case 'onSetActiveTopResult': ev_code = _this.EventCode.SET_ACTIVE_TOP_RESULT; break;
				case 'onInstallNewTopFeedback': ev_code = _this.EventCode.INSTALL_NEW_TOP_FEEDBACK; break;
				case 'onInstallNewTopResult': ev_code = _this.EventCode.INSTALL_NEW_TOP_RESULT; break;
			}
		}
		
		//if (_this.options.onInitialized != undefined) _this.options.onInitialized();
		if (ev_code > 0)
		{
			var subscribe = { "O": this.CommandCode.SUBSCRIBE_ON_CHANGE, "P": ev_code}; _this.wycaSend(JSON.stringify(subscribe));
			return true;
		}
		else
			return false;
	}
	this.off = function (event_name)
	{
		_this.options[event_name] = null;
		
		ev_code = 0;
		switch (event_name)
		{
			case 'onBatteryState': ev_code = _this.CommandCode.BATTERY_STATE; break;
			case 'onTimeRemainingToEmptyMin': ev_code = _this.CommandCode.BMS_TIME_REMAINING_TO_EMPTY; break;
			case 'onTimeRemainingToFullMin': ev_code = _this.CommandCode.BMS_TIME_REMAINING_TO_FULL; break;
			case 'onLedCurrentAnimationMode': ev_code = _this.CommandCode.LED_CURRENT_LED_ANIMATION_MODE; break;
			case 'onLedCurrentRobotStateMode': ev_code = _this.CommandCode.LED_CURRENT_LED_ROBOT_STATE; break;
			case 'onLedIsLightMode': ev_code = _this.CommandCode.LED_IS_LIGHT_MODE; break;
			case 'onLedIsManualMode': ev_code = _this.CommandCode.LED_IS_MANUAL_MODE; break;
			case 'onMappingIsStarted': ev_code = _this.CommandCode.MAPPING_IS_STARTED; break;
			case 'onMappingMapInConstruction': ev_code = _this.CommandCode.MAPPING_MAP_IN_CONSTRUCTION; break;
			case 'onMappingRobotPoseInBuildingMap': ev_code = _this.CommandCode.MAPPING_ROBOT_POSE_CURRENT_MAP; break;
			case 'onNavigationIsStarted': ev_code = _this.CommandCode.NAVIGATION_IS_STARTED; break;
			case 'onNavigationRobotPose': ev_code = _this.CommandCode.NAVIGATION_ROBOT_POSE; break;
			case 'onIsFreewheel': ev_code = _this.CommandCode.IS_FREEWHEEL; break;
			case 'onIsSafetyStop': ev_code = _this.CommandCode.IS_SAFETY_STOP; break;
			case 'onDockingState': ev_code = _this.CommandCode.DOCKING_STATE; break;
			case 'onPOIsDetect': ev_code = _this.CommandCode.POI_POSES; break;
			case 'onMoveInProgress': ev_code = _this.CommandCode.MOVE_IN_PROGRESS; break;
		}
		
		if (ev_code == 0 && _this.options.id_robot == 'not_robot')
		{
			// On envoi la commande, juste pour indiquer au webrtc que l'on souhaite avoir ces évènements
			switch (event_name)
			{
				/********** Actions *********/
				case 'onGoToChargeFeedback': ev_code = _this.EventCode.GO_TO_CHARGE_FEEDBACK; break;
				case 'onGoToChargeResult': ev_code = _this.EventCode.GO_TO_CHARGE_RESULT; break;
				case 'onGoToPoiFeedback': ev_code = _this.EventCode.GO_TO_POI_FEEDBACK; break;
				case 'onGoToPoiResult': ev_code = _this.EventCode.GO_TO_POI_RESULT; break;
				case 'onGoToPoseFeedback': ev_code = _this.EventCode.GO_TO_POSE_FEEDBACK; break;
				case 'onGoToPoseResult': ev_code = _this.EventCode.GO_TO_POSE_RESULT; break;
				case 'onDockFeedback': ev_code = _this.EventCode.DOCK_FEEDBACK; break;
				case 'onDockResult': ev_code = _this.EventCode.DOCK_RESULT; break;
				case 'onUndockFeedback': ev_code = _this.EventCode.UNDOCK_FEEDBACK; break;
				case 'onUndockResult': ev_code = _this.EventCode.UNDOCK_RESULT; break;
				case 'onMappingStartFeedback': ev_code = _this.EventCode.MAPPING_START_FEEDBACK; break;
				case 'onMappingStartResult': ev_code = _this.EventCode.MAPPING_START_RESULT; break;
				case 'onNavigationStartFeedback': ev_code = _this.EventCode.NAVIGATION_START_FEEDBACK; break;
				case 'onNavigationStartResult': ev_code = _this.EventCode.NAVIGATION_START_RESULT; break;
				case 'onDockRecoveryFeedback': ev_code = _this.EventCode.DOCK_RECOVERY_FEEDBACK; break;
				case 'onDockRecoveryResult': ev_code = _this.EventCode.DOCK_RECOVERY_RESULT; break;
				case 'onRecoveryFromFiducialFeedback': ev_code = _this.EventCode.RECOVERY_FROM_FIDUCIAL_FEEDBACK; break;
				case 'onRecoveryFromFiducialResult': ev_code = _this.EventCode.RECOVERY_FROM_FIDUCIAL_RESULT; break;
				case 'onSetActiveTopFeedback': ev_code = _this.EventCode.SET_ACTIVE_TOP_FEEDBACK; break;
				case 'onSetActiveTopResult': ev_code = _this.EventCode.SET_ACTIVE_TOP_RESULT; break;
				case 'onInstallNewTopFeedback': ev_code = _this.EventCode.INSTALL_NEW_TOP_FEEDBACK; break;
				case 'onInstallNewTopResult': ev_code = _this.EventCode.INSTALL_NEW_TOP_RESULT; break;
			}
		}
		
		if (ev_code > 0)
		{
			var unsubscribe = { "O": _this.CommandCode.UNSUBSCRIBE, "P": ev_code}; _this.wycaSend(JSON.stringify(unsubscribe));
			return true;
		}
		else
			return false;
	}
	
	this.Teleop = function(x, z)
	{
		var action = {
			"O": _this.CommandCode.JOYSTICK_TWIST_SAFE_TO_BE,
			"P": { X:x, Z:z }
		};
		_this.wycaSend(JSON.stringify(action));	
	}
	this.TeleopStart  = function(callback){
		if (callback != undefined)
			this.callbacks[_this.CommandCode.TELEOP_START] = callback;
		var action = {
			"O": _this.CommandCode.TELEOP_START
		};
		_this.wycaSend(JSON.stringify(action));
	}
	this.TeleopStop  = function(callback){
		if (callback != undefined)
			this.callbacks[_this.CommandCode.TELEOP_STOP] = callback;
		var action = {
			"O": _this.CommandCode.TELEOP_STOP
		};
		_this.wycaSend(JSON.stringify(action));
	}
	this.TeleopIsStarted  = function(callback){
		if (callback != undefined)
			this.callbacks[_this.CommandCode.TELEOP_IS_STARTED] = callback;
		var action = {
			"O": _this.CommandCode.TELEOP_IS_STARTED
		};
		_this.wycaSend(JSON.stringify(action));
	}	
	this.FactoryDataReset  = function(callback){
		if (callback != undefined)
			this.callbacks[_this.CommandCode.FACTORY_DATA_RESET] = callback;
		var action = {
			"O": _this.CommandCode.FACTORY_DATA_RESET
		};
		_this.wycaSend(JSON.stringify(action));
	}
	this.InstallNewTop  = function(api_key, crypted_file_b64, callback){
		if (callback != undefined)
			this.callbacks[_this.CommandCode.INSTALL_NEW_TOP] = callback;
		var action = {
			"O": _this.CommandCode.INSTALL_NEW_TOP,
			"P": {
				"AK":api_key,
				"TI":crypted_file_b64				
			}
		};
		_this.wycaSend(JSON.stringify(action));
	}
	this.InstallNewTopWithoutKey  = function(crypted_file_b64, callback){
		if (callback != undefined)
			this.callbacks[_this.CommandCode.INSTALL_NEW_TOP_WITHOUT_KEY] = callback;
		var action = {
			"O": _this.CommandCode.INSTALL_NEW_TOP_WITHOUT_KEY,
			"P": crypted_file_b64
		};
		_this.wycaSend(JSON.stringify(action));
	}
	this.MappingIsStarted = function(callback){
		if (callback != undefined)
			this.callbacks[_this.CommandCode.MAPPING_GET_IS_STARTED] = callback;
		var action = {
			"O": _this.CommandCode.MAPPING_GET_IS_STARTED,
		};
		_this.wycaSend(JSON.stringify(action));
	}
	this.MappingStop = function(callback){
		if (callback != undefined)
			this.callbacks[_this.CommandCode.MAPPING_STOP] = callback;
		var action = {
			"O": _this.CommandCode.MAPPING_STOP,
		};
		_this.wycaSend(JSON.stringify(action));
	}
	this.GetLastMapping = function(callback){
		if (callback != undefined)
			this.callbacks[_this.CommandCode.GET_LAST_MAPPING] = callback;
		var action = {
			"O": _this.CommandCode.GET_LAST_MAPPING,
		};
		_this.wycaSend(JSON.stringify(action));
	}
	this.NavigationIsStarted = function(callback){
		if (callback != undefined)
			this.callbacks[_this.CommandCode.NAVIGATION_GET_IS_STARTED] = callback;
		var action = {
			"O": _this.CommandCode.NAVIGATION_GET_IS_STARTED,
		};
		_this.wycaSend(JSON.stringify(action));
	}
	this.NavigationStop = function(callback){
		if (callback != undefined)
			this.callbacks[_this.CommandCode.NAVIGATION_STOP] = callback;
		var action = {
			"O": _this.CommandCode.NAVIGATION_STOP,
		};
		_this.wycaSend(JSON.stringify(action));
	}
	this.GetDockingState = function(callback){
		if (callback != undefined)
			this.callbacks[_this.CommandCode.GET_DOCKING_STATE] = callback;
		var action = {
			"O": _this.CommandCode.GET_DOCKING_STATE,
		};
		_this.wycaSend(JSON.stringify(action));
	}
	this.GetRobotPose = function(callback){
		if (callback != undefined)
			this.callbacks[_this.CommandCode.GET_ROBOT_POSE] = callback;
		var action = {
			"O": _this.CommandCode.GET_ROBOT_POSE,
		};
		_this.wycaSend(JSON.stringify(action));
	}
	this.ReloadMaps = function(callback){
		if (callback != undefined)
			this.callbacks[_this.CommandCode.RELOAD_MAPS] = callback;
		var action = {
			"O": _this.CommandCode.RELOAD_MAPS,
		};
		_this.wycaSend(JSON.stringify(action));
	}
	this.GetLedIsLightMode = function(callback){
		if (callback != undefined)
			this.callbacks[_this.CommandCode.GET_LED_IS_LIGHT_MODE] = callback;
		var action = {
			"O": _this.CommandCode.GET_LED_IS_LIGHT_MODE
		};
		_this.wycaSend(JSON.stringify(action));
	}
	this.SetLedIsLightMode = function(is_light_mode, callback){
		if (callback != undefined)
			this.callbacks[_this.CommandCode.SET_LED_IS_LIGHT_MODE] = callback;
		var action = {
			"O": _this.CommandCode.SET_LED_IS_LIGHT_MODE,
			"P": is_light_mode
		};
		_this.wycaSend(JSON.stringify(action));
	}
	this.GetLedIsManualMode = function(callback){
		if (callback != undefined)
			this.callbacks[_this.CommandCode.GET_LED_IS_MANUAL_MODE] = callback;
		var action = {
			"O": _this.CommandCode.GET_LED_IS_MANUAL_MODE
		};
		_this.wycaSend(JSON.stringify(action));
	}
	this.SetLedIsManualMode = function(is_manual_mode, callback){
		if (callback != undefined)
			this.callbacks[_this.CommandCode.SET_LED_IS_MANUAL_MODE] = callback;
		var action = {
			"O": _this.CommandCode.SET_LED_IS_MANUAL_MODE,
			"P": is_manual_mode
		};
		_this.wycaSend(JSON.stringify(action));
	}
	this.GetLedAnimationMode = function(callback){
		if (callback != undefined)
			this.callbacks[_this.CommandCode.GET_LED_CURRENT_LED_ANIMATION_MODE] = callback;
		var action = {
			"O": _this.CommandCode.GET_LED_CURRENT_LED_ANIMATION_MODE
		};
		_this.wycaSend(JSON.stringify(action));
	}
	this.GetLedRobotState = function(callback){
		if (callback != undefined)
			this.callbacks[_this.CommandCode.GET_LED_CURRENT_LED_ROBOT_STATE] = callback;
		var action = {
			"O": _this.CommandCode.GET_LED_CURRENT_LED_ROBOT_STATE
		};
		_this.wycaSend(JSON.stringify(action));
	}
	this.ConfLedAnim = function(state, anim, color_r, color_g, color_b, callback){
		if (callback != undefined)
			this.callbacks[_this.CommandCode.CONF_LED_ANIMATION] = callback;
		var action = {
			"O": _this.CommandCode.CONF_LED_ANIMATION,
			"P": {
				"S": state,
				"A": anim,
				"R": color_r,
				"G": color_g,
				"B": color_b
			}
		};
		_this.wycaSend(JSON.stringify(action));
	}
	this.GetMapFiducialsVisible = function(callback){
		if (callback != undefined)
			this.callbacks[_this.CommandCode.GET_MAP_FIDUCIALS_VISIBLES] = callback;
		var action = {
			"O": _this.CommandCode.GET_MAP_FIDUCIALS_VISIBLES
		};
		_this.wycaSend(JSON.stringify(action));
	}
	this.GetRobotFiducialsVisible = function(callback){
		if (callback != undefined)
			this.callbacks[_this.CommandCode.GET_ROBOT_FIDUCIALS_VISIBLES] = callback;
		var action = {
			"O": _this.CommandCode.GET_ROBOT_FIDUCIALS_VISIBLES
		};
		_this.wycaSend(JSON.stringify(action));
	}
	this.SetFiducialsRecorded = function(enable, callback){
		if (callback != undefined)
			this.callbacks[_this.CommandCode.SET_FIDUCIALS_RECORD] = callback;
		var action = {
			"O": _this.CommandCode.SET_FIDUCIALS_RECORD,
			"P": enable
		};
		_this.wycaSend(JSON.stringify(action));
	}
	this.GetFiducialsRecorded = function(callback){
		if (callback != undefined)
			this.callbacks[_this.CommandCode.GET_FIDUCIALS_RECORD] = callback;
		var action = {
			"O": _this.CommandCode.GET_FIDUCIALS_RECORD
		};
		_this.wycaSend(JSON.stringify(action));
	}
	this.GetPath = function(x1, y1, theta1, x2, y2, theta2, callback){
		if (callback != undefined)
			this.callbacks[_this.CommandCode.GET_PATH] = callback;
		var action = {
			"O": _this.CommandCode.GET_PATH,
			"P": {
				"X1": x1,
				"Y1": y1,
				"T1": theta1,
				"X2": x2,
				"Y2": y2,
				"T2": theta2
			}
		};
		_this.wycaSend(JSON.stringify(action));
	}
	this.GetPathFromCurrentPose = function(x, y, theta, callback){
		if (callback != undefined)
			this.callbacks[_this.CommandCode.GET_PATH_FROM_CURRENT_POSE] = callback;
		var action = {
			"O": _this.CommandCode.GET_PATH_FROM_CURRENT_POSE,
			"P": {
				"X": x,
				"Y": y,
				"T": theta
			}
		};
		_this.wycaSend(JSON.stringify(action));
	}
	this.GetMoveInProgress = function(callback){
		if (callback != undefined)
			this.callbacks[_this.CommandCode.GET_MOVE_IN_PROGRESS] = callback;
		var action = {
			"O": _this.CommandCode.GET_MOVE_IN_PROGRESS
		};
		_this.wycaSend(JSON.stringify(action));
	}
	
	this.StopMove = function(id_dock, callback){
		if (callback != undefined)
			this.callbacks[_this.CommandCode.STOP_MOVE] = callback;
		var action = {
			"O": _this.CommandCode.STOP_MOVE
		};
		_this.wycaSend(JSON.stringify(action));
	}
	/* Actions */
	this.DockRecovery = function(id_dock, callback){
		if (callback != undefined)
			this.callbacks[_this.CommandCode.DOCK_RECOVERY] = callback;
		var action = {
			"O": _this.CommandCode.DOCK_RECOVERY,
			"P": id_dock
		};
		_this.wycaSend(JSON.stringify(action));
	}
	this.DockRecoveryCancel = function(callback){
		if (callback != undefined)
			this.callbacks[_this.CommandCode.DOCK_RECOVERY_CANCEL] = callback;
		var action = {
			"O": _this.CommandCode.DOCK_RECOVERY_CANCEL,
		};
		_this.wycaSend(JSON.stringify(action));
	}
	this.RecoveryFromFiducial = function(callback){
		if (callback != undefined)
			this.callbacks[_this.CommandCode.RECOVERY_FROM_FIDUCIAL] = callback;
		var action = {
			"O": _this.CommandCode.RECOVERY_FROM_FIDUCIAL
		};
		_this.wycaSend(JSON.stringify(action));
	}
	this.RecoveryFromFiducialCancel = function(callback){
		if (callback != undefined)
			this.callbacks[_this.CommandCode.RECOVERY_FROM_FIDUCIAL_CANCEL] = callback;
		var action = {
			"O": _this.CommandCode.RECOVERY_FROM_FIDUCIAL_CANCEL,
		};
		_this.wycaSend(JSON.stringify(action));
	}
	this.GoToCharge = function(id_dock, callback){
		if (callback != undefined)
			this.callbacks[_this.CommandCode.GO_TO_CHARGE] = callback;
		var action = {
			"O": _this.CommandCode.GO_TO_CHARGE,
			"P": id_dock
		};
		_this.wycaSend(JSON.stringify(action));
	}
	this.GoToChargeCancel = function(callback){
		if (callback != undefined)
			this.callbacks[_this.CommandCode.GO_TO_CHARGE_CANCEL] = callback;
		var action = {
			"O": _this.CommandCode.GO_TO_CHARGE_CANCEL,
		};
		_this.wycaSend(JSON.stringify(action));
	}
	this.GoToPoi = function(id_poi, callback){
		if (callback != undefined)
			this.callbacks[_this.CommandCode.GO_TO_POI] = callback;
		var action = {
			"O": _this.CommandCode.GO_TO_POI,
			"P": id_poi
		};
		_this.wycaSend(JSON.stringify(action));
	}
	this.GoToPoiCancel = function(callback){
		if (callback != undefined)
			this.callbacks[_this.CommandCode.GO_TO_POI_CANCEL] = callback;
		var action = {
			"O": _this.CommandCode.GO_TO_POI_CANCEL,
		};
		_this.wycaSend(JSON.stringify(action));
	}
	this.GoToPose = function(x, y, theta, callback){
		if (callback != undefined)
			this.callbacks[_this.CommandCode.GO_TO_POSE] = callback;
		var action = {
			"O": _this.CommandCode.GO_TO_POSE,
			"P": {
				"X":x,
				"Y":y,
				"T":theta
			}
		};
		_this.wycaSend(JSON.stringify(action));
	}
	this.GoToPoseCancel = function(callback){
		if (callback != undefined)
			this.callbacks[_this.CommandCode.GO_TO_POSE_CANCEL] = callback;
		var action = {
			"O": _this.CommandCode.GO_TO_POSE_CANCEL,
		};
		_this.wycaSend(JSON.stringify(action));
	}
	this.Dock = function(id_dock, callback){
		if (callback != undefined)
			this.callbacks[_this.CommandCode.DOCK] = callback;
		var action = {
			"O": _this.CommandCode.DOCK,
			"P":id_dock
		};
		_this.wycaSend(JSON.stringify(action));
	}
	this.DockCancel = function(callback){
		if (callback != undefined)
			this.callbacks[_this.CommandCode.DOCK_CANCEL] = callback;
		var action = {
			"O": _this.CommandCode.DOCK_CANCEL,
		};
		_this.wycaSend(JSON.stringify(action));
	}
	this.Undock = function(callback){
		if (callback != undefined)
			this.callbacks[_this.CommandCode.UNDOCK] = callback;
		var action = {
			"O": _this.CommandCode.UNDOCK,
		};
		_this.wycaSend(JSON.stringify(action));
	}
	this.UndockCancel = function(callback){
		if (callback != undefined)
			this.callbacks[_this.CommandCode.UNDOCK_CANCEL] = callback;
		var action = {
			"O": _this.CommandCode.UNDOCK_CANCEL,
		};
		_this.wycaSend(JSON.stringify(action));
	}
	
	this.MappingStart = function(callback){
		if (callback != undefined)
			this.callbacks[_this.CommandCode.MAPPING_START] = callback;
		var action = {
			"O": _this.CommandCode.MAPPING_START,
		};
		_this.wycaSend(JSON.stringify(action));
	}
	this.MappingStartCancel = function(callback){
		if (callback != undefined)
			this.callbacks[_this.CommandCode.MAPPING_START_CANCEL] = callback;
		var action = {
			"O": _this.CommandCode.MAPPING_START_CANCEL,
		};
		_this.wycaSend(JSON.stringify(action));
	}
	
	this.NavigationStartFromMapping = function(callback){
		if (callback != undefined)
			this.callbacks[_this.CommandCode.NAVIGATION_START_FROM_MAPPING] = callback;
		var action = {
			"O": _this.CommandCode.NAVIGATION_START_FROM_MAPPING,
		};
		_this.wycaSend(JSON.stringify(action));
	}
	this.NavigationStartFromPose = function(x, y, theta, callback){
		if (callback != undefined)
			this.callbacks[_this.CommandCode.NAVIGATION_START_FROM_POSE] = callback;
		var action = {
			"O": _this.CommandCode.NAVIGATION_START_FROM_POSE,
			"P": {
				"X": x,
				"Y": y,
				"T": theta
			}
		};
		_this.wycaSend(JSON.stringify(action));
	}
	this.NavigationStartCancel = function(callback){
		if (callback != undefined)
			this.callbacks[_this.CommandCode.NAVIGATION_START_CANCEL] = callback;
		var action = {
			"O": _this.CommandCode.NAVIGATION_START_CANCEL,
		};
		_this.wycaSend(JSON.stringify(action));
	}

	this.GetUser = function(id_user, callback){
		if (callback != undefined)
			this.callbacks[_this.CommandCode.GET_USER] = callback;
		var action = {
			"O": _this.CommandCode.GET_USER,
			"P": id_user
		};
		_this.wycaSend(JSON.stringify(action));
	}	
	this.SetUser = function(json_user, callback){
		if (callback != undefined)
			this.callbacks[_this.CommandCode.SET_USER] = callback;
		var action = {
			"O": _this.CommandCode.SET_USER,
			"P": json_user
		};
		_this.wycaSend(JSON.stringify(action));
	}
	this.DeleteUser = function(id_user, callback){
		if (callback != undefined)
			this.callbacks[_this.CommandCode.DELETE_USER] = callback;
		var action = {
			"O": _this.CommandCode.DELETE_USER,
			"P": id_user
		};
		_this.wycaSend(JSON.stringify(action));
	}
	this.GetUsersList = function(callback){
		if (callback != undefined)
			this.callbacks[_this.CommandCode.GET_USERS_LIST] = callback;
		var action = {
			"O": _this.CommandCode.GET_USERS_LIST,
		};
		_this.wycaSend(JSON.stringify(action));
	}
	
	
	this.GetSite = function(id_site, callback){
		if (callback != undefined)
			this.callbacks[_this.CommandCode.GET_SITE] = callback;
		var action = {
			"O": _this.CommandCode.GET_SITE,
			"P": id_site
		};
		_this.wycaSend(JSON.stringify(action));
	}	
	this.SetSite = function(json_site, callback){
		if (callback != undefined)
			this.callbacks[_this.CommandCode.SET_SITE] = callback;
		var action = {
			"O": _this.CommandCode.SET_SITE,
			"P": json_site
		};
		_this.wycaSend(JSON.stringify(action));
	}
	this.DeleteSite = function(id_site, callback){
		if (callback != undefined)
			this.callbacks[_this.CommandCode.DELETE_SITE] = callback;
		var action = {
			"O": _this.CommandCode.DELETE_SITE,
			"P": id_site
		};
		_this.wycaSend(JSON.stringify(action));
	}
	this.GetSitesList = function(callback){
		if (callback != undefined)
			this.callbacks[_this.CommandCode.GET_SITES_LIST] = callback;
		var action = {
			"O": _this.CommandCode.GET_SITES_LIST,
		};
		_this.wycaSend(JSON.stringify(action));
	}
	this.GetCurrentSite = function(callback){
		if (callback != undefined)
			this.callbacks[_this.CommandCode.GET_CURRENT_SITE] = callback;
		var action = {
			"O": _this.CommandCode.GET_CURRENT_SITE,
		};
		_this.wycaSend(JSON.stringify(action));
	}
	this.SetSiteAsCurrent = function(id_site, callback){
		if (callback != undefined)
			this.callbacks[_this.CommandCode.SET_SITE_AS_CURRENT] = callback;
		var action = {
			"O": _this.CommandCode.SET_SITE_AS_CURRENT,
			"P": id_site
		};
		_this.wycaSend(JSON.stringify(action));
	}	
	
	this.GetMap = function(id_map, callback){
		if (callback != undefined)
			this.callbacks[_this.CommandCode.GET_MAP] = callback;
		var action = {
			"O": _this.CommandCode.GET_MAP,
			"P": id_map
		};
		_this.wycaSend(JSON.stringify(action));
	}	
	this.GetMapComplete = function(id_map, callback){
		if (callback != undefined)
			this.callbacks[_this.CommandCode.GET_MAP_COMPLETE] = callback;
		var action = {
			"O": _this.CommandCode.GET_MAP_COMPLETE,
			"P": id_map
		};
		_this.wycaSend(JSON.stringify(action));
	}	
	this.SetMap = function(json_map, callback){
		if (callback != undefined)
			this.callbacks[_this.CommandCode.SET_MAP] = callback;
		var action = {
			"O": _this.CommandCode.SET_MAP,
			"P": json_map
		};
		_this.wycaSend(JSON.stringify(action));
	}
	this.DeleteMap = function(id_map, callback){
		if (callback != undefined)
			this.callbacks[_this.CommandCode.DELETE_MAP] = callback;
		var action = {
			"O": _this.CommandCode.DELETE_MAP,
			"P": id_map
		};
		_this.wycaSend(JSON.stringify(action));
	}	
	this.SetCurrentMapData = function(json_map_data, callback){
		if (callback != undefined)
			this.callbacks[_this.CommandCode.SET_MAP_DATA] = callback;
		var action = {
			"O": _this.CommandCode.SET_MAP_DATA,
			"P": json_map_data
		};
		_this.wycaSend(JSON.stringify(action));
	}
	this.GetMapsList = function(id_site, callback){
		if (callback != undefined)
			this.callbacks[_this.CommandCode.GET_MAPS_LIST] = callback;
		var action = {
			"O": _this.CommandCode.GET_MAPS_LIST,
			"P": id_site
		};
		_this.wycaSend(JSON.stringify(action));
	}
	this.GetCurrentMap = function(callback){
		if (callback != undefined)
			this.callbacks[_this.CommandCode.GET_CURRENT_MAP] = callback;
		var action = {
			"O": _this.CommandCode.GET_CURRENT_MAP,
		};
		_this.wycaSend(JSON.stringify(action));
	}
	this.GetCurrentMapComplete = function(callback){
		if (callback != undefined)
			this.callbacks[_this.CommandCode.GET_CURRENT_MAP_COMPLETE] = callback;
		var action = {
			"O": _this.CommandCode.GET_CURRENT_MAP_COMPLETE,
		};
		_this.wycaSend(JSON.stringify(action));
	}
	this.SetMapAsCurrent = function(id_map, callback){
		if (callback != undefined)
			this.callbacks[_this.CommandCode.SET_MAP_AS_CURRENT] = callback;
		var action = {
			"O": _this.CommandCode.SET_MAP_AS_CURRENT,
			"P": id_map
		};
		_this.wycaSend(JSON.stringify(action));
	}	
	
	this.GetArea = function(id_area, callback){
		if (callback != undefined)
			this.callbacks[_this.CommandCode.GET_AREA] = callback;
		var action = {
			"O": _this.CommandCode.GET_AREA,
			"P": id_area
		};
		_this.wycaSend(JSON.stringify(action));
	}	
	this.SetArea = function(json_area, callback){
		if (callback != undefined)
			this.callbacks[_this.CommandCode.SET_AREA] = callback;
		var action = {
			"O": _this.CommandCode.SET_AREA,
			"P": json_area
		};
		_this.wycaSend(JSON.stringify(action));
	}
	this.DeleteArea = function(id_area, callback){
		if (callback != undefined)
			this.callbacks[_this.CommandCode.DELETE_AREA] = callback;
		var action = {
			"O": _this.CommandCode.DELETE_AREA,
			"P": id_area
		};
		_this.wycaSend(JSON.stringify(action));
	}
	this.GetAreasList = function(id_map, callback){
		if (callback != undefined)
			this.callbacks[_this.CommandCode.GET_AREAS_LIST] = callback;
		var action = {
			"O": _this.CommandCode.GET_AREAS_LIST,
			"P": id_map
		};
		_this.wycaSend(JSON.stringify(action));
	}
	
	this.GetDockingStation = function(id_docking_station, callback){
		if (callback != undefined)
			this.callbacks[_this.CommandCode.GET_DOCKING_STATION] = callback;
		var action = {
			"O": _this.CommandCode.GET_DOCKING_STATION,
			"P": id_docking_station
		};
		_this.wycaSend(JSON.stringify(action));
	}	
	this.SetDockingStation = function(json_docking_station, callback){
		if (callback != undefined)
			this.callbacks[_this.CommandCode.SET_DOCKING_STATION] = callback;
		var action = {
			"O": _this.CommandCode.SET_DOCKING_STATION,
			"P": json_docking_station
		};
		_this.wycaSend(JSON.stringify(action));
	}	
	this.DeleteDockingStation = function(id_docking_station, callback){
		if (callback != undefined)
			this.callbacks[_this.CommandCode.DELETE_DOCKING_STATION] = callback;
		var action = {
			"O": _this.CommandCode.DELETE_DOCKING_STATION,
			"P": id_docking_station
		};
		_this.wycaSend(JSON.stringify(action));
	}
	this.GetDockingStationsList = function(id_map, callback){
		if (callback != undefined)
			this.callbacks[_this.CommandCode.GET_DOCKING_STATIONS_LIST] = callback;
		var action = {
			"O": _this.CommandCode.GET_DOCKING_STATIONS_LIST,
			"P": id_map
		};
		_this.wycaSend(JSON.stringify(action));
	}
	
	this.GetPoi = function(id_poi, callback){
		if (callback != undefined)
			this.callbacks[_this.CommandCode.GET_POI] = callback;
		var action = {
			"O": _this.CommandCode.GET_POI,
			"P": id_poi
		};
		_this.wycaSend(JSON.stringify(action));
	}	
	this.SetPoi = function(json_poi, callback){
		if (callback != undefined)
			this.callbacks[_this.CommandCode.SET_POI] = callback;
		var action = {
			"O": _this.CommandCode.SET_POI,
			"P": json_poi
		};
		_this.wycaSend(JSON.stringify(action));
	}	
	this.DeletePoi = function(id_poi, callback){
		if (callback != undefined)
			this.callbacks[_this.CommandCode.DELETE_POI] = callback;
		var action = {
			"O": _this.CommandCode.DELETE_POI,
			"P": id_poi
		};
		_this.wycaSend(JSON.stringify(action));
	}
	this.GetPoisList = function(id_map, callback){
		if (callback != undefined)
			this.callbacks[_this.CommandCode.GET_POIS_LIST] = callback;
		var action = {
			"O": _this.CommandCode.GET_POIS_LIST,
			"P": id_map
		};
		_this.wycaSend(JSON.stringify(action));
	}
	
	this.GetLogRos = function(id_log_ros, callback){
		if (callback != undefined)
			this.callbacks[_this.CommandCode.GET_LOG_ROS] = callback;
		var action = {
			"O": _this.CommandCode.GET_LOG_ROS,
			"P": id_log_ros
		};
		_this.wycaSend(JSON.stringify(action));
	}	
	this.SetLogRos = function(json_log_ros, callback){
		if (callback != undefined)
			this.callbacks[_this.CommandCode.SET_LOG_ROS] = callback;
		var action = {
			"O": _this.CommandCode.SET_LOG_ROS,
			"P": json_log_ros
		};
		_this.wycaSend(JSON.stringify(action));
	}	
	this.DeleteLogRos = function(id_log_ros, callback){
		if (callback != undefined)
			this.callbacks[_this.CommandCode.DELETE_LOG_ROS] = callback;
		var action = {
			"O": _this.CommandCode.DELETE_LOG_ROS,
			"P": id_log_ros
		};
		_this.wycaSend(JSON.stringify(action));
	}
	this.GetLogRossList = function(callback){
		if (callback != undefined)
			this.callbacks[_this.CommandCode.GET_LOGS_ROS_LIST] = callback;
		var action = {
			"O": _this.CommandCode.GET_LOGS_ROS_LIST,
		};
		_this.wycaSend(JSON.stringify(action));
	}
	
	this.GetLogSystem = function(id_log_system, callback){
		if (callback != undefined)
			this.callbacks[_this.CommandCode.GET_LOG_SYSTEM] = callback;
		var action = {
			"O": _this.CommandCode.GET_LOG_SYSTEM,
			"P": id_log_system
		};
		_this.wycaSend(JSON.stringify(action));
	}	
	this.SetLogSystem = function(json_log_system, callback){
		if (callback != undefined)
			this.callbacks[_this.CommandCode.SET_LOG_SYSTEM] = callback;
		var action = {
			"O": _this.CommandCode.SET_LOG_SYSTEM,
			"P": json_log_system
		};
		_this.wycaSend(JSON.stringify(action));
	}	
	this.DeleteLogSystem = function(id_log_system, callback){
		if (callback != undefined)
			this.callbacks[_this.CommandCode.DELETE_LOG_SYSTEM] = callback;
		var action = {
			"O": _this.CommandCode.DELETE_LOG_SYSTEM,
			"P": id_log_system
		};
		_this.wycaSend(JSON.stringify(action));
	}
	this.GetLogSystemsList = function(callback){
		if (callback != undefined)
			this.callbacks[_this.CommandCode.GET_LOGS_SYSTEM_LIST] = callback;
		var action = {
			"O": _this.CommandCode.GET_LOGS_SYSTEM_LIST,
		};
		_this.wycaSend(JSON.stringify(action));
	}
	
	this.GetTop = function(id_top, callback){
		if (callback != undefined)
			this.callbacks[_this.CommandCode.GET_TOP] = callback;
		var action = {
			"O": _this.CommandCode.GET_TOP,
			"P": id_top
		};
		_this.wycaSend(JSON.stringify(action));
	}	
	this.SetTop = function(json_top, callback){
		if (callback != undefined)
			this.callbacks[_this.CommandCode.SET_TOP] = callback;
		var action = {
			"O": _this.CommandCode.SET_TOP,
			"P": json_top
		};
		_this.wycaSend(JSON.stringify(action));
	}	
	this.DeleteTop = function(id_top, callback){
		if (callback != undefined)
			this.callbacks[_this.CommandCode.DELETE_TOP] = callback;
		var action = {
			"O": _this.CommandCode.DELETE_TOP,
			"P": id_top
		};
		_this.wycaSend(JSON.stringify(action));
	}
	this.GetTopsList = function(callback){
		if (callback != undefined)
			this.callbacks[_this.CommandCode.GET_TOPS_LIST] = callback;
		var action = {
			"O": _this.CommandCode.GET_TOPS_LIST,
		};
		_this.wycaSend(JSON.stringify(action));
	}
	this.SetAvailableTops = function(id_tops, callback){
		if (callback != undefined)
			this.callbacks[_this.CommandCode.SET_AVAILABLE_TOPS] = callback;
		var action = {
			"O": _this.CommandCode.SET_AVAILABLE_TOPS,
			"P": id_tops
		};
		_this.wycaSend(JSON.stringify(action));
	}
	this.SetActiveTop = function(id_top, callback){
		if (callback != undefined)
			this.callbacks[_this.CommandCode.SET_ACTIVE_TOP] = callback;
		var action = {
			"O": _this.CommandCode.SET_ACTIVE_TOP,
			"P": id_top
		};
		_this.wycaSend(JSON.stringify(action));
	}
	this.GetCurrentTop = function(callback){
		if (callback != undefined)
			this.callbacks[_this.CommandCode.GET_CURRENT_TOP] = callback;
		var action = {
			"O": _this.CommandCode.GET_CURRENT_TOP,
		};
		_this.wycaSend(JSON.stringify(action));
	}	
	this.SetTopAsCurrent = function(id_top, callback){
		if (callback != undefined)
			this.callbacks[_this.CommandCode.SET_TOP_AS_CURRENT] = callback;
		var action = {
			"O": _this.CommandCode.SET_TOP_AS_CURRENT,
			"P": id_top
		};
		_this.wycaSend(JSON.stringify(action));
	}
	
	
	this.GetRobotConfig = function(id_robot_config, callback){
		if (callback != undefined)
			this.callbacks[_this.CommandCode.GET_ROBOT_CONFIG] = callback;
		var action = {
			"O": _this.CommandCode.GET_ROBOT_CONFIG,
			"P": id_robot_config
		};
		_this.wycaSend(JSON.stringify(action));
	}	
	this.SetRobotConfig = function(json_robot_config, callback){
		if (callback != undefined)
			this.callbacks[_this.CommandCode.SET_ROBOT_CONFIG] = callback;
		var action = {
			"O": _this.CommandCode.SET_ROBOT_CONFIG,
			"P": json_robot_config
		};
		_this.wycaSend(JSON.stringify(action));
	}	
	this.DeleteRobotConfig = function(id_robot_config, callback){
		if (callback != undefined)
			this.callbacks[_this.CommandCode.DELETE_ROBOT_CONFIG] = callback;
		var action = {
			"O": _this.CommandCode.DELETE_ROBOT_CONFIG,
			"P": id_robot_config
		};
		_this.wycaSend(JSON.stringify(action));
	}
	this.GetRobotConfigsList = function(id_site, callback){
		if (callback != undefined)
			this.callbacks[_this.CommandCode.GET_ROBOT_CONFIGS_LIST] = callback;
		var action = {
			"O": _this.CommandCode.GET_ROBOT_CONFIGS_LIST,
			"P": id_site
		};
		_this.wycaSend(JSON.stringify(action));
	}
	this.GetCurrentRobotConfig = function(callback){
		if (callback != undefined)
			this.callbacks[_this.CommandCode.GET_CURRENT_ROBOT_CONFIG] = callback;
		var action = {
			"O": _this.CommandCode.GET_CURRENT_ROBOT_CONFIG,
		};
		_this.wycaSend(JSON.stringify(action));
	}	
	this.SetRobotConfigAsCurrent = function(id_robot_config, callback){
		if (callback != undefined)
			this.callbacks[_this.CommandCode.SET_ROBOT_CONFIG_AS_CURRENT] = callback;
		var action = {
			"O": _this.CommandCode.SET_ROBOT_CONFIG_AS_CURRENT,
			"P": id_robot_config
		};
		_this.wycaSend(JSON.stringify(action));
	}	
	
	this.GetServiceBook = function(id_service_book, callback){
		if (callback != undefined)
			this.callbacks[_this.CommandCode.GET_SERVICE_BOOK] = callback;
		var action = {
			"O": _this.CommandCode.GET_SERVICE_BOOK,
			"P": id_service_book
		};
		_this.wycaSend(JSON.stringify(action));
	}	
	this.SetServiceBook = function(json_service_book, callback){
		if (callback != undefined)
			this.callbacks[_this.CommandCode.SET_SERVICE_BOOK] = callback;
		var action = {
			"O": _this.CommandCode.SET_SERVICE_BOOK,
			"P": json_service_book
		};
		_this.wycaSend(JSON.stringify(action));
	}	
	this.GetServiceBooksList = function(callback){
		if (callback != undefined)
			this.callbacks[_this.CommandCode.GET_SERVICE_BOOKS_LIST] = callback;
		var action = {
			"O": _this.CommandCode.GET_SERVICE_BOOKS_LIST
		};
		_this.wycaSend(JSON.stringify(action));
	}
		
	this.GetWifiList = function(callback){
		if (callback != undefined)
			this.callbacks[_this.CommandCode.GET_WIFI_LIST] = callback;
		var action = {
			"O": _this.CommandCode.GET_WIFI_LIST
		};
		_this.wycaSend(JSON.stringify(action));
	}	
	this.WifiConnection = function(ssid, password, callback){
		if (callback != undefined)
			this.callbacks[_this.CommandCode.CONNECT_WIFI] = callback;
		var action = {
			"O": _this.CommandCode.CONNECT_WIFI,
			"P": {
				"S": ssid,
				"P": password
			}
		};
		_this.wycaSend(JSON.stringify(action));
	}
	this.GetEnergyConfiguration = function(callback){
		if (callback != undefined)
			this.callbacks[_this.CommandCode.GET_ENERGY_CONFIGURATION] = callback;
		var action = {
			"O": _this.CommandCode.GET_ENERGY_CONFIGURATION
		};
		_this.wycaSend(JSON.stringify(action));
	}
	this.SetEnergyConfiguration = function(emergency_battery_level, minimum_battery_level, callback){
		if (callback != undefined)
			this.callbacks[_this.CommandCode.SET_ENERGY_CONFIGURATION] = callback;
		var action = {
			"O": _this.CommandCode.SET_ENERGY_CONFIGURATION,
			"P":{
				"EBL":emergency_battery_level,
				"MBL":minimum_battery_level,
			}
		};
		_this.wycaSend(JSON.stringify(action));
	}
}