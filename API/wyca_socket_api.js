function WycaAPI(options){

	this.AnswerCode = {
		NO_ERROR                    : 0,
		FORMAT_ERROR_MISSING_DATA   : 1,
		FORMAT_ERROR_INVALID_DATA   : 2,
		NOT_ALLOW                   : 3,
		COULD_NOT_PARSE_JSON        : 4,
		UNKNOW_API_OPERATION        : 5,
		NOT_IMPLEMENTED             : 6,
		INVALID_ID                  : 7,
	
		DETAILS_IN_MESSAGE          : 100,
		AUTH_KO                     : 101,
		AUTH_NEEDED                 : 102,
	
		NO_ACTION_IN_PROGRESS       : 200,
		ACTION_ALREADY_STARTED      : 201,
		CANCELED		            : 202,
	    SERVICE_UNAVAILABLE         : 203,
		
		NAVIGTION_IS_NOT_STARTED    : 300,
		NAVIGTION_IS_ACTIVE		    : 301,
		MAPPING_IS_NOT_STARTED  	: 302,
		MAPPING_IS_ACTIVE		    : 303,
		MAP_NOT_IN_SITE			    : 304
	};
	
	// Liste des commandes de l'api
	this.CommandCode = {
	  // Topics publishers
		JOYSTICK_TWIST_SAFE_TO_BE                : 11002,
	
	  // General
		INSTALL_NEW_TOP                          : 1,
		AUTH_TOP                                 : 2,
		AUTH_USER                                : 3,
		SINK                                     : 4,
		FACTORY_DATA_RESET                       : 5,
		SUBSCRIBE_ON_EVENT 	                     : 10,
		SUBSCRIBE_ON_CHANGE                      : 11,
		UNSUBSCRIBE                              : 12,
		UNSUBSCRIBE_ALL                          : 13,
		INSTALL_NEW_TOP_WITHOUT_KEY              : 14,
	
		CANCEL_CURRENT_ACTION		             : 20,
	
	  // Services
		MAPPING_GET_IS_STARTED             		 : 60,
		MAPPING_START                      		 : 70,
		MAPPING_START_CANCEL            		 : 73,
		MAPPING_STOP                   		     : 80,
		NAVIGATION_GET_IS_STARTED     		     : 90,
		NAVIGATION_START_FROM_MAPPING  		     : 100,
		NAVIGATION_START_FROM_POSE	  		     : 105,
		NAVIGATION_START_CANCEL        		     : 103,
		NAVIGATION_STOP              		     : 110,
		GET_DOCKING_STATE                        : 140,
		GET_ROBOT_POSE                           : 150,
		RELOAD_MAPS                              : 160,
		GET_LED_IS_LIGHT_MODE                    : 220,
		SET_LED_IS_LIGHT_MODE                    : 221,
		GET_LED_IS_MANUAL_MODE                   : 230,
		SET_LED_IS_MANUAL_MODE                   : 231,
		GET_LED_CURRENT_LED_ANIMATION_MODE       : 240,
		GET_LED_CURRENT_LED_ROBOT_STATE          : 250,
		CONF_LED_ANIM					         : 255,
	
		GET_FIDUCIALS_VISIBLES                   : 260,
		SET_FIDUCIALS_RECORD                     : 270,
		GET_FIDUCIALS_RECORD                     : 280,
	
		TELEOP_START                             : 290,
		TELEOP_STOP                              : 300,
		TELEOP_IS_STARTED                        : 310,
		
	  // Actions
		GO_TO_POSE                               : 190,
		GO_TO_POSE_CANCEL                        : 193,
		DOCK                                     : 200,
		DOCK_CANCEL                              : 203,
		UNDOCK                                   : 210,
		UNDOCK_CANCEL                            : 213,
		
		 // Services DB
		CHECK_USER_KEY                           : 1000,
		CHECK_USER_CONNECTION                    : 1010,
		CHECK_TOP_KEY                            : 1020,
		GET_USER                                 : 1030,
		SET_USER                                 : 1040,
		GET_USERS_LIST                           : 1050,
		GET_SITE                                 : 1060,
		SET_SITE                                 : 1070,
		GET_SITES_LIST                           : 1080,
		GET_CURRENT_SITE                         : 1090,
		SET_SITE_AS_CURRENT                      : 1100,
		GET_MAP                                  : 1110,
		GET_MAP_COMPLETE                         : 1111,
		SET_MAP                                  : 1120,
		SET_MAP_DATA                             : 1121,
		GET_CURRENT_MAP                          : 1130,
		GET_CURRENT_MAP_COMPLETE                 : 1131,
		SET_MAP_AS_CURRENT                       : 1140,
		GET_MAPS_LIST                            : 1150,
		GET_AREA                                 : 1160,
		SET_AREA                                 : 1170,
		GET_AREAS_LIST                           : 1180,
		GET_DOCKING_STATION                      : 1190,
		SET_DOCKING_STATION                      : 1200,
		GET_DOCKING_STATION_LIST                 : 1210,
		GET_LOG_ROS                              : 1220,
		SET_LOG_ROS                              : 1230,
		GET_LOG_ROS_LIST                         : 1240,
		GET_LOG_SYSTEM                           : 1250,
		SET_LOG_SYSTEM                           : 1260,
		GET_LOG_SYSTEM_LIST                      : 1270,
		GET_POI                                  : 1280,
		SET_POI                                  : 1290,
		GET_POIS_LIST                            : 1300,
		GET_TOP                                  : 1310,
		SET_TOP                                  : 1320,
		GET_TOPS_LIST                            : 1330,
		SET_AVAILABLE_TOPS						 : 1335,
		SET_ACTIVE_TOP							 : 1336,
		GET_CURRENT_TOP                          : 1340,
		SET_TOP_AS_CURRENT                       : 1350,
		GET_ROBOT_CONFIG                         : 1360,
		SET_ROBOT_CONFIG                         : 1370,
		GET_ROBOT_CONFIG_LIST                    : 1380,
		GET_CURRENT_ROBOT_CONFIG                 : 1390,
		SET_ROBOT_CONFIG_AS_CURRENT              : 1400,
		
		GET_WIFI_LIST                            : 2000,
		CONNECT_WIFI                           	 : 2010,
	};
	
	this.EventCode = {
		// Topics
		BATTERY_STATE                            : 10001,
		BMS_TIME_REMAINING_TO_EMPTY              : 10005,
		BMS_TIME_REMAINING_TO_FULL               : 10006,
		LED_CURRENT_LED_ANIMATION_MODE           : 10007,
		LED_CURRENT_LED_ROBOT_STATE              : 10008,
		LED_IS_LIGHT_MODE                        : 10009,
		LED_IS_MANUAL_MODE                       : 10010,
		MAPPING_IS_STARTED                		 : 10011,
		MAPPING_MAP_IN_CONSTRUCTION        		 : 10012,
		MAPPING_ROBOT_POSE_CURRENT_MAP      	 : 10013,
		NAVIGATION_IS_STARTED               	 : 10014,
		NAVIGATION_ROBOT_POSE               	 : 10015,
		IS_FREEWHEEL                             : 10016,
		IS_SAFETY_STOP                           : 10017,
		DOCKING_STATE                            : 10018,
		POI_POSES                                : 10019,
	 
	  // Actions
		GO_TO_POSE_FEEDBACK                      : 191,
		GO_TO_POSE_RESULT                        : 192,
		DOCK_FEEDBACK                            : 201,
		DOCK_RESULT                              : 202,
		UNDOCK_FEEDBACK                          : 211,
		UNDOCK_RESULT                            : 212,
		MAPPING_START_FEEDBACK                   : 71,
		MAPPING_START_RESULT                     : 72,
		NAVIGATION_START_FEEDBACK                : 101,
		NAVIGATION_START_RESULT                  : 102
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
	var defaults = {
        webcam_name : 'default',
		with_audio : true,
		with_video : true,
		delay_no_reply : 30,
		delay_lost_connexion : 30,
		checkLostConnection: true,
		webcam_id : "",
		webcam_name: "",
		serveurWyca : 'https://elodie.wyca-solutions.com/',
		on_error_webcam_try_without : true,
		host : 'elodie.wyca-solutions.com:9090',
		api_key:''
    };
    this.options = $.extend({}, defaults, options || {});
   	
	if (this.options.nick == '')
		this.options.nick = 'server';
		
	if ("WebSocket" in window) {
	} else if ("MozWebSocket" in window) {
	} else {
		throw new Error('This Browser does not support WebSockets')
	}
	
	this.socketStarted = false;
	this.socketAuthed = false;
	this.socketError = false;
	this.timeoutReconnect = null;
	this.callbacks = Array();
	this.authentificated = false;
	this.timerSink = null;
	
	_this = this;
	
	this.init = function (){
		
		this.Connect();
	};
	
	this.wsOnOpen = function(e)
	{
		_this.socketStarted = true;
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
		//_this.socketStarted = false;
		//_this.socketAuthed = false;
		_this.socketError = true;
		//_this.ROSMessageSendToPC('onRobotConnexionError');
		if (_this.options.onRobotConnexionError != undefined)
		{
			_this.options.onRobotConnexionError();
		}
		
		if (_this.timeoutReconnect == null)
			_this.timeoutReconnect = setTimeout(_this.Connect, 1000);
	}
	
	this.wsOnClose = function(e)
	{
		_this.socketStarted = false;
		_this.socketAuthed = false;
		//_this.ROSMessageSendToPC('onRobotConnexionClose');
		if (_this.options.onRobotConnexionClose != undefined)
		{
			_this.options.onRobotConnexionClose();
		}
		
		if (_this.timeoutReconnect == null)
			_this.timeoutReconnect = setTimeout(_this.Connect, 1000);
	}
	
	this.wsOnMessage = function(e)
	{
		if (e.data == 'ack') return;
		msg = JSON.parse(e.data);
		
		
		if (_this.options.onMessageRaw != undefined) { _this.options.onMessageRaw(e); }
		
		//console.log(msg);
		if (msg.A > 0)
		{
			console.log("ERROR", msg);
			console.log(_this.AnswerCodeToString(msg.A));
		}
		if (msg.O != undefined)
		{
			switch(msg.O)
			{
				case this.CommandCode.SINK: break;
				case this.CommandCode.AUTH_USER:
					if (msg.A == _this.AnswerCode.NO_ERROR)
					{
						_this.socketAuthed = true;
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
					}				
					break;
				case this.CommandCode.UNSUBSCRIBE:
				case this.CommandCode.UNSUBSCRIBE_ALL:
					break;
				/********** Services *********/
				case this.CommandCode.MAPPING_GET_IS_STARTED:
				case this.CommandCode.MAPPING_START:
				case this.CommandCode.MAPPING_START_CANCEL:
				case this.CommandCode.MAPPING_STOP:
				case this.CommandCode.NAVIGATION_GET_IS_STARTED:
				case this.CommandCode.NAVIGATION_START_FROM_MAPPING:
				case this.CommandCode.NAVIGATION_START_FROM_POSE:
				case this.CommandCode.NAVIGATION_START_CANCEL:
				case this.CommandCode.NAVIGATION_STOP:
				case this.CommandCode.GET_DOCKING_STATE:
				case this.CommandCode.RELOAD_MAPS:
				case this.CommandCode.GET_LED_IS_LIGHT_MODE:
				case this.CommandCode.GET_LED_IS_MANUAL_MODE:
				case this.CommandCode.GET_LED_CURRENT_LED_ANIMATION_MODE:
				case this.CommandCode.GET_LED_CURRENT_LED_ROBOT_STATE:
				case this.CommandCode.GET_FIDUCIALS_VISIBLES:
				case this.CommandCode.SET_FIDUCIALS_RECORD:
				case this.CommandCode.GET_FIDUCIALS_RECORD:
				case this.CommandCode.GET_ROBOT_POSE:
				case this.CommandCode.GO_TO_POSE:
				case this.CommandCode.DOCK:
				case this.CommandCode.UNDOCK:
				case this.CommandCode.GO_TO_POSE_CANCEL:
				case this.CommandCode.DOCK_CANCEL:
				case this.CommandCode.UNDOCK_CANCEL:
				case this.CommandCode.GET_WIFI_LIST:
				case this.CommandCode.CONNECT_WIFI:
				default:
					if (_this.callbacks[msg.O] !=undefined) { id_op = msg.O; delete msg.O; _this.callbacks[id_op](msg); }
					break;
			}
		}
		
		if (msg.E != undefined) // False pour test retour subscribe
		{
			switch(msg.E)
			{
				/********** Actions *********/
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
			}
		}
	}
	
	var _this = this;
	
	this.wycaSend = function (msg) {
		if (!_this.socketStarted)
			_this.socketAuthed = false;
		else
		{
			if (_this.socketAuthed)
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
			case _this.AnswerCode.SERVICE_UNVAILABLE : return 'Service unvailable'; break;
			case _this.AnswerCode.NAVIGTION_IS_NOT_STARTED : return 'Navigation is not started'; break;
			case _this.AnswerCode.NAVIGTION_IS_ACTIVE : return 'Navigation is active and block current operation'; break;
			case _this.AnswerCode.MAPPING_IS_NOT_STARTED : return 'Mapping is not started'; break;
			case _this.AnswerCode.MAPPING_IS_ACTIVE : return 'Mapping is active and block current operation'; break;
			case _this.AnswerCode.MAP_NOT_IN_SITE : return 'Map not in current site'; break;
			default: return 'Unknow error code';
		}
	}
	
	this.Connect = function()
	{
		_this.timeoutReconnect = null;
		if (_this.options.nick == 'robot')
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
		
		if (_this.options.onInitialized != undefined) _this.options.onInitialized();
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
		}
		
		if (_this.options.onInitialized != undefined) _this.options.onInitialized();
		
		var subscribe = { "O": this.CommandCode.SUBSCRIBE_ON_CHANGE, "P": ev_code}; _this.wycaSend(JSON.stringify(subscribe));
	}
	this.off = function (event_name)
	{
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
		}
		
		var unsubscribe = { "O": _this.CommandCode.UNSUBSCRIBE, "P": ev_code}; _this.wycaSend(JSON.stringify(unsubscribe));
		_this.options[event_name] = null;
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
			this.callbacks[_this.CommandCode.CONF_LED_ANIM] = callback;
		var action = {
			"O": _this.CommandCode.CONF_LED_ANIM,
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
	this.GetFiducialsVisible = function(callback){
		if (callback != undefined)
			this.callbacks[_this.CommandCode.GET_FIDUCIALS_VISIBLES] = callback;
		var action = {
			"O": _this.CommandCode.GET_FIDUCIALS_VISIBLES
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
	
	/* Actions */
	this.GoToPose = function(x, y, theta, callback){
		if (callback != undefined)
			this.callbacks[_this.CommandCode.GO_TO_POSE] = callback;
		var action = {
			"O": _this.CommandCode.GO_TO_POSE,
			"P": {
				X:x,
				Y:y,
				T:theta
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
	this.GetSiteAsCurrent = function(id_site, callback){
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
	this.GetDockingStationsList = function(id_map, callback){
		if (callback != undefined)
			this.callbacks[_this.CommandCode.GET_DOCKING_STATION_LIST] = callback;
		var action = {
			"O": _this.CommandCode.GET_DOCKING_STATION_LIST,
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
	this.GetLogRossList = function(callback){
		if (callback != undefined)
			this.callbacks[_this.CommandCode.GET_LOG_ROS_LIST] = callback;
		var action = {
			"O": _this.CommandCode.GET_LOG_ROS_LIST,
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
	this.GetLogSystemsList = function(callback){
		if (callback != undefined)
			this.callbacks[_this.CommandCode.GET_LOG_SYSTEM_LIST] = callback;
		var action = {
			"O": _this.CommandCode.GET_LOG_SYSTEM_LIST,
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
	this.GetRobotConfigsList = function(id_site, callback){
		if (callback != undefined)
			this.callbacks[_this.CommandCode.GET_ROBOT_CONFIG_LIST] = callback;
		var action = {
			"O": _this.CommandCode.GET_ROBOT_CONFIG_LIST,
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
}
