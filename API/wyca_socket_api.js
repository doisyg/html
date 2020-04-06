function WycaAPI(options){

	this.ErrorCode = {
		NO_ERROR                    : 0,
		FORMAT_ERROR_MISSING_DATA   : 1,
		FORMAT_ERROR_INVALID_DATA   : 2,
		NOT_ALLOW                   : 3,
		COULD_NOT_PARSE_JSON        : 4,
		UNKNOW_API_OPERATION        : 5,
	
	
		DETAILS_IN_MESSAGE          : 100,
		AUTH_KO                     : 101,
		AUTH_NEEDED                 : 102,
	
		NO_ACTION_IN_PROGRESS       : 200,
		ACTION_ALREADY_STARTED      : 201,
		SERVICE_UNVAILABLE          : 202,
		
		NAVIGTION_IS_NOT_STARTED    : 300
	};
	
	// Liste des commandes de l'api
	this.CommandCode = {
		// Topics
		BMS_IS_POWERED                           : 10001,
		BMS_RELATIVE_SOC_PERCENTAGE              : 10002,
		BMS_CURRENT_A                            : 10003,
		BMS_REMAINING_CAPACITY                   : 10004,
		BMS_TIME_REMAINING_TO_EMPTY              : 10005,
		BMS_TIME_REMAINING_TO_FULL               : 10006,
		LED_CURRENT_LED_ANIMATION_MODE           : 10007,
		LED_CURRENT_LED_ROBOT_STATE              : 10008,
		LED_IS_LIGHT_MODE                        : 10009,
		LED_IS_MANUAL_MODE                       : 10010,
		WYCA_MAPPING_IS_STARTED                  : 10011,
		WYCA_MAPPING_MAP_IN_CONSTRUCTION         : 10012,
		WYCA_MAPPING_ROBOT_POSE_CURRENT_MAP      : 10013,
		WYCA_NAVIGATION_IS_STARTED               : 10014,
		WYCA_NAVIGATION_ROBOT_POSE               : 10015,
		IS_FREEWHEEL                             : 10016,
		IS_SAFETY_STOP                           : 10017,
		DOCKING_STATE                            : 10018,
		POI_POSES                                : 10019,
		LATENCY_RETURN                           : 10020,
	  // Topics publishers
		JOYSTICK_IS_SAFE_OFF                     : 11001,
		JOYSTICK_TWIST_SAFE_TO_BE                : 11003,
	
	  // General
		AUTH                                     : 1,
		SINK                                     : 2,
		SUBSCRIBE                                : 10,
		UNSUBSCRIBE                              : 20,
		UNSUBSCRIBE_ALL                          : 30,
	
	  // Services
		START_LATENCY                            : 40,
		WAIT_LATENCY                             : 50,
		WYCA_MAPPING_GET_IS_STARTED              : 60,
		WYCA_MAPPING_START                       : 70,
		WYCA_MAPPING_STOP                        : 80,
		WYCA_NAVIGATION_GET_IS_STARTED           : 90,
		WYCA_NAVIGATION_START                    : 100,
		WYCA_NAVIGATION_STOP                     : 110,
		REFRESH_FREEWHEEL_STATE                  : 120,
		REFRESH_SAFETY_STOP                      : 130,
		GET_DOCKING_STATE                        : 140,
		GET_ROBOT_POSE                           : 150,
		RELOAD_MAPS                              : 160,
		REFLECTOR_DETECTION_ENABLE               : 170,
	  // Services DB
		DB_CHECK_APIKEY                          : 180,
	
	  // Actions
		GO_TO_POSE                               : 190,
		GO_TO_POSE_FEEDBACK                      : 191,
		GO_TO_POSE_RESULT                        : 192,
		GO_TO_POSE_CANCEL                        : 193,
		DOCK                                     : 200,
		DOCK_FEEDBACK                            : 201,
		DOCK_RESULT                              : 202,
		DOCK_CANCEL                              : 203,
		UNDOCK                                   : 210,
		UNDOCK_FEEDBACK                          : 211,
		UNDOCK_RESULT                            : 212,
		UNDOCK_CANCEL                            : 213
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
		LIGHT 			: 10
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
	
	this.throttles_rate = Array();
	this.throttles_rate[this.CommandCode.LATENCY_RETURN] = 0;
	this.throttles_rate[this.CommandCode.BMS_CURRENT_A] = 1;
	this.throttles_rate[this.CommandCode.BMS_IS_POWERED] = 1;
	this.throttles_rate[this.CommandCode.BMS_RELATIVE_SOC_PERCENTAGE] = 1;
	this.throttles_rate[this.CommandCode.BMS_REMAINING_CAPACITY] = 1;
	this.throttles_rate[this.CommandCode.BMS_TIME_REMAINING_TO_EMPTY] = 1;
	this.throttles_rate[this.CommandCode.BMS_TIME_REMAINING_TO_FULL] = 1;
	this.throttles_rate[this.CommandCode.LED_CURRENT_LED_ANIMATION_MODE] = 0;
	this.throttles_rate[this.CommandCode.LED_CURRENT_LED_ROBOT_STATE] = 0;
	this.throttles_rate[this.CommandCode.LED_IS_LIGHT_MODE] = 0;
	this.throttles_rate[this.CommandCode.LED_IS_MANUAL_MODE] = 0;
	this.throttles_rate[this.CommandCode.WYCA_MAPPING_IS_STARTED] = 0;
	this.throttles_rate[this.CommandCode.WYCA_MAPPING_MAP_IN_CONSTRUCTION] = 0;
	this.throttles_rate[this.CommandCode.WYCA_MAPPING_ROBOT_POSE_CURRENT_MAP] = 0;
	this.throttles_rate[this.CommandCode.WYCA_NAVIGATION_IS_STARTED] = 0;
	this.throttles_rate[this.CommandCode.WYCA_NAVIGATION_ROBOT_POSE] = 0;
	this.throttles_rate[this.CommandCode.IS_FREEWHEEL] = 0;
	this.throttles_rate[this.CommandCode.IS_SAFETY_STOP] = 0;
	this.throttles_rate[this.CommandCode.DOCKING_STATE] = 0;
	this.throttles_rate[this.CommandCode.POI_POSES] = 1;
	
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
	this.idMessage = 0;
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
		
		var auth = {
			op : this.CommandCode.AUTH,
			id : ++_this.idMessage,
			d: this.options.api_key
		  };		
		
		_this.ws.send(JSON.stringify(auth));
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
		if (msg.ec > 0)
		{
			console.log("ERROR", msg);
			console.log(_this.ErrorCodeToString(msg.ec));
		}
		switch(msg.op)
		{
			case this.CommandCode.SINK: break;
			case this.CommandCode.AUTH:
				if (!msg.er)
				{
					_this.socketAuthed = true;
					_this.Subscribe();
				}
				else
				{
					console.log('Error auth', msg);
				}
				break;
			/********** Services *********/
			case this.CommandCode.START_LATENCY:
			case this.CommandCode.WAIT_LATENCY:
			case this.CommandCode.WYCA_MAPPING_GET_IS_STARTED:
			case this.CommandCode.WYCA_MAPPING_START:
			case this.CommandCode.WYCA_MAPPING_STOP:
			case this.CommandCode.WYCA_NAVIGATION_GET_IS_STARTED:
			case this.CommandCode.WYCA_NAVIGATION_START:
			case this.CommandCode.WYCA_NAVIGATION_STOP:
			case this.CommandCode.REFRESH_FREEWHEEL_STATE:
			case this.CommandCode.REFRESH_SAFETY_STOP:
			case this.CommandCode.GET_DOCKING_STATE:
			case this.CommandCode.RELOAD_MAPS:
			case this.CommandCode.GET_ROBOT_POSE:
			case this.CommandCode.REFLECTOR_DETECTION_ENABLE:
			case this.CommandCode.GO_TO_POSE:
			case this.CommandCode.DOCK:
			case this.CommandCode.UNDOCK:
				if (_this.callbacks[msg.id] !=undefined) { id_mes = msg.id; delete msg.op; delete msg.id; _this.callbacks[id_mes](msg); }
				break;
			/********** Actions *********/
			case this.CommandCode.GO_TO_POSE_FEEDBACK:
				if (_this.options.onGoToPoseFeedback != undefined) { delete msg.op; delete msg.id; _this.options.onGoToPoseFeedback(msg); }
				break;
			case this.CommandCode.GO_TO_POSE_RESULT:
				if (_this.options.onGoToPoseResult != undefined) { delete msg.op; delete msg.id; _this.options.onGoToPoseResult(msg); }
				break;
			case this.CommandCode.DOCK_FEEDBACK:
				if (_this.options.onDockFeedback != undefined) { delete msg.op; delete msg.id; _this.options.onDockFeedback(msg); }
				break;
			case this.CommandCode.DOCK_RESULT:
				if (_this.options.onDockResult != undefined) {delete msg.op; delete msg.id;  _this.options.onDockResult(msg); }
				break;
			case this.CommandCode.UNDOCK_FEEDBACK:
				if (_this.options.onUndockFeedback != undefined) { delete msg.op; delete msg.id; _this.options.onUndockFeedback(msg); }
				break;
			case this.CommandCode.UNDOCK_RESULT:
				if (_this.options.onUndockResult != undefined) { delete msg.op; delete msg.id; _this.options.onUndockResult(msg); }
				break;
			/********** Topics *********/
			case this.CommandCode.LATENCY_RETURN:
				if (_this.options.onLatencyReturn != undefined) { _this.options.onLatencyReturn(msg.d); }
				break;
			case this.CommandCode.BMS_CURRENT_A:
				if (_this.options.onCurrentA != undefined) { _this.options.onCurrentA(msg.d); }
				break;
			case this.CommandCode.BMS_IS_POWERED:
				if (_this.options.onIsPowered != undefined) { _this.options.onIsPowered(msg.d); }
				break;
			case this.CommandCode.BMS_RELATIVE_SOC_PERCENTAGE:
				if (_this.options.onRelativeSOCPercentage != undefined) { _this.options.onRelativeSOCPercentage(msg.d); }
				break;
			case this.CommandCode.BMS_REMAINING_CAPACITY:
				if (_this.options.onRemainingCapacity != undefined) { _this.options.onRemainingCapacity(msg.d); }
				break;
			case this.CommandCode.BMS_TIME_REMAINING_TO_EMPTY:
				if (_this.options.onTimeRemainingToEmptyMin != undefined) { _this.options.onTimeRemainingToEmptyMin(msg.d); }
				break;
			case this.CommandCode.BMS_TIME_REMAINING_TO_FULL:
				if (_this.options.onTimeRemainingToFullMin != undefined) { _this.options.onTimeRemainingToFullMin(msg.d); }
				break;
			case this.CommandCode.LED_CURRENT_LED_ANIMATION_MODE:
				if (_this.options.onLedCurrentAnimationMode != undefined) { _this.options.onLedCurrentAnimationMode(msg.d); }
				break;
			case this.CommandCode.LED_CURRENT_LED_ROBOT_STATE:
				if (_this.options.onLedCurrentRobotStateMode != undefined) { _this.options.onLedCurrentRobotStateMode(msg.d); }
				break;
			case this.CommandCode.LED_IS_LIGHT_MODE:
				if (_this.options.onLedIsLightMode != undefined) { _this.options.onLedIsLightMode(msg.d); }
				break;
			case this.CommandCode.LED_IS_MANUAL_MODE:
				if (_this.options.onLedIsManualMode != undefined) { _this.options.onLedIsManualMode(msg.d); }
				break;
			case this.CommandCode.WYCA_MAPPING_IS_STARTED:
				if (_this.options.onMappingIsStarted != undefined) { _this.options.onMappingIsStarted(msg.d); }
				break;
			case this.CommandCode.WYCA_MAPPING_MAP_IN_CONSTRUCTION:
				if (_this.options.onMappingMapInConstruction != undefined) { _this.options.onMappingMapInConstruction(msg.d); }
				break;
			case this.CommandCode.WYCA_MAPPING_ROBOT_POSE_CURRENT_MAP:
				if (_this.options.onMappingRobotPoseInBuildingMap != undefined) { _this.options.onMappingRobotPoseInBuildingMap(msg.d); }
				break;
			case this.CommandCode.WYCA_NAVIGATION_IS_STARTED:
				if (_this.options.onNavigationIsStarted != undefined) { _this.options.onNavigationIsStarted(msg.d); }
				break;
			case this.CommandCode.WYCA_NAVIGATION_ROBOT_POSE:
				if (_this.options.onNavigationRobotPose != undefined) { _this.options.onNavigationRobotPose(msg.d); }
				break;
			case this.CommandCode.IS_FREEWHEEL:
				if (_this.options.onIsFreewheel != undefined) { _this.options.onIsFreewheel(msg.d); }
				break;
			case this.CommandCode.IS_SAFETY_STOP:
				if (_this.options.onIsSafetyStop != undefined) { _this.options.onIsSafetyStop(msg.d); }
				break;
			case this.CommandCode.DOCKING_STATE:
				if (_this.options.onDockingState != undefined) { _this.options.onDockingState(msg.d); }
				break;
			case this.CommandCode.POI_POSES:
				if (_this.options.onPOIsDetect != undefined) { _this.options.onPOIsDetect(msg.d); }
				break;
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
				_this.timerSink = setTimeout(function() { _this.timerSink = null; _this.ws.send("{\"op\":" + _this.CommandCode.SINK + "}");}, 50);
			}
			else
				console.error('No auth');
		}
	}
	
	this.ErrorCodeToString = function(ec)
	{
		switch(ec)
		{
			case _this.ErrorCode.NO_ERROR : return 'No error'; break;
			case _this.ErrorCode.FORMAT_ERROR_MISSING_DATA : return 'Format error ; missing data'; break;
			case _this.ErrorCode.FORMAT_ERROR_INVALID_DATA : return 'Format error ; invalid data'; break;
			case _this.ErrorCode.NOT_ALLOW : return 'Not allow'; break;
			case _this.ErrorCode.COULD_NOT_PARSE_JSON : return 'Could not parse JSON'; break;
			case _this.ErrorCode.UNKNOW_API_OPERATION : return 'Unknow API operation'; break;
			case _this.ErrorCode.DETAILS_IN_MESSAGE : return 'Details in message'; break;
			case _this.ErrorCode.AUTH_KO : return 'Auth KO'; break;
			case _this.ErrorCode.AUTH_NEEDED : return 'Auth needed'; break;
			case _this.ErrorCode.NO_ACTION_IN_PROGRESS : return 'No action in progress'; break;
			case _this.ErrorCode.ACTION_ALREADY_STARTED : return 'Action already started'; break;
			case _this.ErrorCode.SERVICE_UNVAILABLE : return 'Service unvailable'; break;
			case _this.ErrorCode.NAVIGTION_IS_NOT_STARTED : return 'Navigation is not started'; break;
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
		if (_this.options.onLatencyReturn != undefined) { var n=_this.CommandCode.LATENCY_RETURN; var subscribe = {	op : _this.CommandCode.SUBSCRIBE, id : ++_this.idMessage, d: { ev:n, tr:_this.throttles_rate[n] }}; _this.wycaSend(JSON.stringify(subscribe)); }
		if (_this.options.onCurrentA != undefined) { var n=_this.CommandCode.BMS_CURRENT_A; var subscribe = {	op : _this.CommandCode.SUBSCRIBE, id : ++_this.idMessage, d: { ev:n, tr:_this.throttles_rate[n] }}; _this.wycaSend(JSON.stringify(subscribe)); }
		if (_this.options.onIsPowered != undefined) { var n=_this.CommandCode.BMS_IS_POWERED; var subscribe = {	op : _this.CommandCode.SUBSCRIBE, id : ++_this.idMessage, d: { ev:n, tr:_this.throttles_rate[n] }}; _this.wycaSend(JSON.stringify(subscribe)); }
		if (_this.options.onRelativeSOCPercentage != undefined) { var n=_this.CommandCode.BMS_RELATIVE_SOC_PERCENTAGE; var subscribe = {	op : _this.CommandCode.SUBSCRIBE, id : ++_this.idMessage, d: { ev:n, tr:1 }}; _this.wycaSend(JSON.stringify(subscribe)); }
		if (_this.options.onRemainingCapacity != undefined) { var n=_this.CommandCode.BMS_REMAINING_CAPACITY; var subscribe = {	op : _this.CommandCode.SUBSCRIBE, id : ++_this.idMessage, d: { ev:n, tr:_this.throttles_rate[n] }}; _this.wycaSend(JSON.stringify(subscribe)); }
		if (_this.options.onTimeRemainingToEmptyMin != undefined) { var n=_this.CommandCode.BMS_TIME_REMAINING_TO_EMPTY; var subscribe = {	op : _this.CommandCode.SUBSCRIBE, id : ++_this.idMessage, d: { ev:n, tr:_this.throttles_rate[n] }}; _this.wycaSend(JSON.stringify(subscribe)); }
		if (_this.options.onTimeRemainingToFullMin != undefined) { var n=_this.CommandCode.BMS_TIME_REMAINING_TO_FULL; var subscribe = {	op : _this.CommandCode.SUBSCRIBE, id : ++_this.idMessage, d: { ev:n, tr:_this.throttles_rate[n] }}; _this.wycaSend(JSON.stringify(subscribe)); }
		if (_this.options.onLedCurrentAnimationMode != undefined) { var n=_this.CommandCode.LED_CURRENT_LED_ANIMATION_MODE; var subscribe = {	op : _this.CommandCode.SUBSCRIBE, id : ++_this.idMessage, d: { ev:n, tr:_this.throttles_rate[n] }}; _this.wycaSend(JSON.stringify(subscribe)); }
		if (_this.options.onLedCurrentRobotStateMode != undefined) { var n=_this.CommandCode.LED_CURRENT_LED_ROBOT_STATE; var subscribe = {	op : _this.CommandCode.SUBSCRIBE, id : ++_this.idMessage, d: { ev:n, tr:_this.throttles_rate[n] }}; _this.wycaSend(JSON.stringify(subscribe)); }
		if (_this.options.onLedIsLightMode != undefined) { var n=_this.CommandCode.LED_IS_LIGHT_MODE; var subscribe = {	op : _this.CommandCode.SUBSCRIBE, id : ++_this.idMessage, d: { ev:n, tr:_this.throttles_rate[n] }}; _this.wycaSend(JSON.stringify(subscribe)); }
		if (_this.options.onLedIsManualMode != undefined) { var n=_this.CommandCode.LED_IS_MANUAL_MODE; var subscribe = {	op : _this.CommandCode.SUBSCRIBE, id : ++_this.idMessage, d: { ev:n, tr:_this.throttles_rate[n] }}; _this.wycaSend(JSON.stringify(subscribe)); }
		if (_this.options.onMappingIsStarted != undefined) { var n=_this.CommandCode.WYCA_MAPPING_IS_STARTED; var subscribe = {	op : _this.CommandCode.SUBSCRIBE, id : ++_this.idMessage, d: { ev:n, tr:_this.throttles_rate[n] }}; _this.wycaSend(JSON.stringify(subscribe)); }
		if (_this.options.onMappingMapInConstruction != undefined) { var n=_this.CommandCode.WYCA_MAPPING_MAP_IN_CONSTRUCTION; var subscribe = {	op : _this.CommandCode.SUBSCRIBE, id : ++_this.idMessage, d: { ev:n, tr:_this.throttles_rate[n] }}; _this.wycaSend(JSON.stringify(subscribe)); }
		if (_this.options.onMappingRobotPoseInBuildingMap != undefined) { var n=_this.CommandCode.WYCA_MAPPING_ROBOT_POSE_CURRENT_MAP; var subscribe = {	op : _this.CommandCode.SUBSCRIBE, id : ++_this.idMessage, d: { ev:n, tr:_this.throttles_rate[n] }}; _this.wycaSend(JSON.stringify(subscribe)); }
		if (_this.options.onNavigationIsStarted != undefined) { var n=_this.CommandCode.WYCA_NAVIGATION_IS_STARTED; var subscribe = {	op : _this.CommandCode.SUBSCRIBE, id : ++_this.idMessage, d: { ev:n, tr:_this.throttles_rate[n] }}; _this.wycaSend(JSON.stringify(subscribe)); }
		if (_this.options.onNavigationRobotPose != undefined) { var n=_this.CommandCode.WYCA_NAVIGATION_ROBOT_POSE; var subscribe = {	op : _this.CommandCode.SUBSCRIBE, id : ++_this.idMessage, d: { ev:n, tr:_this.throttles_rate[n] }}; _this.wycaSend(JSON.stringify(subscribe)); _this.GetRobotPose(); }
		if (_this.options.onIsFreewheel != undefined) { var n=_this.CommandCode.IS_FREEWHEEL; var subscribe = {	op : _this.CommandCode.SUBSCRIBE, id : ++_this.idMessage, d: { ev:n, tr:_this.throttles_rate[n] }}; _this.wycaSend(JSON.stringify(subscribe)); _this.RefreshFreewheelState(); }
		if (_this.options.onIsSafetyStop != undefined) { var n=_this.CommandCode.IS_SAFETY_STOP; var subscribe = {	op : _this.CommandCode.SUBSCRIBE, id : ++_this.idMessage, d: { ev:n, tr:_this.throttles_rate[n] }}; _this.wycaSend(JSON.stringify(subscribe)); _this.RefreshSafetyStop(); }
		if (_this.options.onDockingState != undefined) { var n=_this.CommandCode.DOCKING_STATE; var subscribe = {	op : _this.CommandCode.SUBSCRIBE, id : ++_this.idMessage, d: { ev:n, tr:_this.throttles_rate[n] }}; _this.wycaSend(JSON.stringify(subscribe)); }
		if (_this.options.onPOIsDetect != undefined) { var n=_this.CommandCode.POI_POSES; var subscribe = {	op : _this.CommandCode.SUBSCRIBE, id : ++_this.idMessage, d: { ev:n, tr:_this.throttles_rate[n] }}; _this.wycaSend(JSON.stringify(subscribe)); }
		
		if (_this.options.onInitialized != undefined) _this.options.onInitialized();
	}
	
	this.on = function (event_name, callback)
	{
		_this.options[event_name] = callback;
		
		ev_code = 0;
		switch (event_name)
		{
			case 'onLatencyReturn': ev_code = _this.CommandCode.LATENCY_RETURN; break;
			case 'onCurrentA': ev_code = _this.CommandCode.BMS_CURRENT_A; break;
			case 'onIsPowered': ev_code = _this.CommandCode.BMS_IS_POWERED; break;
			case 'onRelativeSOCPercentage': ev_code = _this.CommandCode.BMS_RELATIVE_SOC_PERCENTAGE; break;
			case 'onRemainingCapacity': ev_code = _this.CommandCode.BMS_REMAINING_CAPACITY; break;
			case 'onTimeRemainingToEmptyMin': ev_code = _this.CommandCode.BMS_TIME_REMAINING_TO_EMPTY; break;
			case 'onTimeRemainingToFullMin': ev_code = _this.CommandCode.BMS_TIME_REMAINING_TO_FULL; break;
			case 'onLedCurrentAnimationMode': ev_code = _this.CommandCode.LED_CURRENT_LED_ANIMATION_MODE; break;
			case 'onLedCurrentRobotStateMode': ev_code = _this.CommandCode.LED_CURRENT_LED_ROBOT_STATE; break;
			case 'onLedIsLightMode': ev_code = _this.CommandCode.LED_IS_LIGHT_MODE; break;
			case 'onLedIsManualMode': ev_code = _this.CommandCode.LED_IS_MANUAL_MODE; break;
			case 'onMappingIsStarted': ev_code = _this.CommandCode.WYCA_MAPPING_IS_STARTED; break;
			case 'onMappingMapInConstruction': ev_code = _this.CommandCode.WYCA_MAPPING_MAP_IN_CONSTRUCTION; break;
			case 'onMappingRobotPoseInBuildingMap': ev_code = _this.CommandCode.WYCA_MAPPING_ROBOT_POSE_CURRENT_MAP; break;
			case 'onNavigationIsStarted': ev_code = _this.CommandCode.WYCA_NAVIGATION_IS_STARTED; break;
			case 'onNavigationRobotPose': ev_code = _this.CommandCode.WYCA_NAVIGATION_ROBOT_POSE; break;
			case 'onIsFreewheel': ev_code = _this.CommandCode.IS_FREEWHEEL; break;
			case 'onIsSafetyStop': ev_code = _this.CommandCode.IS_SAFETY_STOP; break;
			case 'onDockingState': ev_code = _this.CommandCode.DOCKING_STATE; break;
			case 'onPOIsDetect': ev_code = _this.CommandCode.POI_POSES; break;
		}
		
		if (_this.options.onInitialized != undefined) _this.options.onInitialized();
		
		var subscribe = {	op : this.CommandCode.SUBSCRIBE, id : ++_this.idMessage, params: { ev:ev_code, tr:_this.throttles_rate[ev_code] }}; _this.wycaSend(JSON.stringify(subscribe));
		
		if (event_name == 'onIsFreewheel') 			_this.RefreshFreewheelState();
		if (event_name == 'onIsSafetyStop') 		_this.RefreshSafetyStop();
		if (event_name == 'onNavigationRobotPose') 	_this.GetRobotPose();
		
	}
	this.off = function (event_name)
	{
		ev_code = 0;
		switch (event_name)
		{
			case 'onLatencyReturn': ev_code = _this.CommandCode.LATENCY_RETURN; break;
			case 'onCurrentA': ev_code = _this.CommandCode.BMS_CURRENT_A; break;
			case 'onIsPowered': ev_code = _this.CommandCode.BMS_IS_POWERED; break;
			case 'onRelativeSOCPercentage': ev_code = _this.CommandCode.BMS_RELATIVE_SOC_PERCENTAGE; break;
			case 'onRemainingCapacity': ev_code = _this.CommandCode.BMS_REMAINING_CAPACITY; break;
			case 'onTimeRemainingToEmptyMin': ev_code = _this.CommandCode.BMS_TIME_REMAINING_TO_EMPTY; break;
			case 'onTimeRemainingToFullMin': ev_code = _this.CommandCode.BMS_TIME_REMAINING_TO_FULL; break;
			case 'onLedCurrentAnimationMode': ev_code = _this.CommandCode.LED_CURRENT_LED_ANIMATION_MODE; break;
			case 'onLedCurrentRobotStateMode': ev_code = _this.CommandCode.LED_CURRENT_LED_ROBOT_STATE; break;
			case 'onLedIsLightMode': ev_code = _this.CommandCode.LED_IS_LIGHT_MODE; break;
			case 'onLedIsManualMode': ev_code = _this.CommandCode.LED_IS_MANUAL_MODE; break;
			case 'onMappingIsStarted': ev_code = _this.CommandCode.WYCA_MAPPING_IS_STARTED; break;
			case 'onMappingMapInConstruction': ev_code = _this.CommandCode.WYCA_MAPPING_MAP_IN_CONSTRUCTION; break;
			case 'onMappingRobotPoseInBuildingMap': ev_code = _this.CommandCode.WYCA_MAPPING_ROBOT_POSE_CURRENT_MAP; break;
			case 'onNavigationIsStarted': ev_code = _this.CommandCode.WYCA_NAVIGATION_IS_STARTED; break;
			case 'onNavigationRobotPose': ev_code = _this.CommandCode.WYCA_NAVIGATION_ROBOT_POSE; break;
			case 'onIsFreewheel': ev_code = _this.CommandCode.IS_FREEWHEEL; break;
			case 'onIsSafetyStop': ev_code = _this.CommandCode.IS_SAFETY_STOP; break;
			case 'onDockingState': ev_code = _this.CommandCode.DOCKING_STATE; break;
			case 'onPOIsDetect': ev_code = _this.CommandCode.POI_POSES; break;
		}
		
		var unsubscribe = {	op : _this.CommandCode.UNSUBSCRIBE, id : ++_this.idMessage, params: ev_code}; _this.wycaSend(JSON.stringify(unsubscribe));
		_this.options[event_name] = null;
	}
	
	this.Teleop = function(x, z)
	{
		var action = {
			op: _this.CommandCode.JOYSTICK_TWIST_SAFE_TO_BE,
			id : ++_this.idMessage,
			d: { x:x, z:z }
		};
		_this.wycaSend(JSON.stringify(action));	
	}
	this.TeleopOff = function(off)
	{
		var action = {
			op: _this.CommandCode.JOYSTICK_IS_SAFE_OFF,
			id : ++_this.idMessage,
			d: off
		};
		_this.wycaSend(JSON.stringify(action));	
	}
	
	this.LatencyStart = function(num, callback){
		this.idMessage++;
		if (callback != undefined)
			this.callbacks[this.idMessage] = callback;
		var action = {
			op: _this.CommandCode.START_LATENCY,
			id : _this.idMessage,
			d: num
		};
		_this.wycaSend(JSON.stringify(action));
	}

	this.LatencyWait = function(callback){
		this.idMessage++;
		if (callback != undefined)
			this.callbacks[this.idMessage] = callback;
		var action = {
			op: _this.CommandCode.WAIT_LATENCY,
			id : _this.idMessage
		};
		_this.wycaSend(JSON.stringify(action));
	}
	this.MappingIsStarted = function(callback){
		this.idMessage++;
		if (callback != undefined)
			this.callbacks[this.idMessage] = callback;
		var action = {
			op: _this.CommandCode.WYCA_MAPPING_GET_IS_STARTED,
			id : _this.idMessage
		};
		_this.wycaSend(JSON.stringify(action));
	}
	this.MappingStart = function(callback){
		this.idMessage++;
		if (callback != undefined)
			this.callbacks[this.idMessage] = callback;
		var action = {
			op: _this.CommandCode.WYCA_MAPPING_START,
			id : _this.idMessage
		};
		_this.wycaSend(JSON.stringify(action));
	}
	this.MappingStop = function(callback){
		this.idMessage++;
		if (callback != undefined)
			this.callbacks[this.idMessage] = callback;
		var action = {
			op: _this.CommandCode.WYCA_MAPPING_STOP,
			id : _this.idMessage
		};
		_this.wycaSend(JSON.stringify(action));
	}
	this.NavigationIsStarted = function(callback){
		this.idMessage++;
		if (callback != undefined)
			this.callbacks[this.idMessage] = callback;
		var action = {
			op: _this.CommandCode.WYCA_NAVIGATION_GET_IS_STARTED,
			id : _this.idMessage
		};
		_this.wycaSend(JSON.stringify(action));
	}
	this.NavigationStart = function(callback){
		this.idMessage++;
		if (callback != undefined)
			this.callbacks[this.idMessage] = callback;
		var action = {
			op: _this.CommandCode.WYCA_NAVIGATION_START,
			id : _this.idMessage
		};
		_this.wycaSend(JSON.stringify(action));
	}
	this.NavigationStop = function(callback){
		this.idMessage++;
		if (callback != undefined)
			this.callbacks[this.idMessage] = callback;
		var action = {
			op: _this.CommandCode.WYCA_NAVIGATION_STOP,
			id : _this.idMessage
		};
		_this.wycaSend(JSON.stringify(action));
	}
	this.RefreshFreewheelState = function(callback){
		this.idMessage++;
		if (callback != undefined)
			this.callbacks[this.idMessage] = callback;
		var action = {
			op: _this.CommandCode.REFRESH_FREEWHEEL_STATE,
			id : _this.idMessage
		};
		_this.wycaSend(JSON.stringify(action));
	}
	this.RefreshSafetyStop = function(callback){
		this.idMessage++;
		if (callback != undefined)
			this.callbacks[this.idMessage] = callback;
		var action = {
			op: _this.CommandCode.REFRESH_SAFETY_STOP,
			id : _this.idMessage
		};
		_this.wycaSend(JSON.stringify(action));
	}
	this.GetDockingState = function(callback){
		this.idMessage++;
		if (callback != undefined)
			this.callbacks[this.idMessage] = callback;
		var action = {
			op: _this.CommandCode.GET_DOCKING_STATE,
			id : _this.idMessage
		};
		_this.wycaSend(JSON.stringify(action));
	}
	this.GetRobotPose = function(callback){
		this.idMessage++;
		if (callback != undefined)
			this.callbacks[this.idMessage] = callback;
		var action = {
			op: _this.CommandCode.GET_ROBOT_POSE,
			id : _this.idMessage
		};
		_this.wycaSend(JSON.stringify(action));
	}
	this.ReloadMaps = function(callback){
		this.idMessage++;
		if (callback != undefined)
			this.callbacks[this.idMessage] = callback;
		var action = {
			op: _this.CommandCode.RELOAD_MAPS,
			id : _this.idMessage
		};
		_this.wycaSend(JSON.stringify(action));
	}
	this.ReflectorDetectionEnable = function(enable, callback){
		this.idMessage++;
		if (callback != undefined)
			this.callbacks[this.idMessage] = callback;
		var action = {
			op: _this.CommandCode.REFLECTOR_DETECTION_ENABLE,
			id : _this.idMessage,
			d: enable
		};
		_this.wycaSend(JSON.stringify(action));
	}
	/* Actions */
	this.GoToPose = function(x, y, theta, callback){
		this.idMessage++;
		if (callback != undefined)
			this.callbacks[this.idMessage] = callback;
		var action = {
			op: _this.CommandCode.GO_TO_POSE,
			id : _this.idMessage,
			d: {
				x:x,
				y:y,
				t:theta
			}
		};
		_this.wycaSend(JSON.stringify(action));
	}
	this.GoToPoseCancel = function(callback){
		this.idMessage++;
		if (callback != undefined)
			this.callbacks[this.idMessage] = callback;
		var action = {
			op: _this.CommandCode.GO_TO_POSE_CANCEL,
			id : _this.idMessage
		};
		_this.wycaSend(JSON.stringify(action));
	}
	this.Dock = function(id_dock, callback){
		this.idMessage++;
		if (callback != undefined)
			this.callbacks[this.idMessage] = callback;
		var action = {
			op: _this.CommandCode.DOCK,
			id : _this.idMessage,
			d:id_dock
		};
		_this.wycaSend(JSON.stringify(action));
	}
	this.DockCancel = function(callback){
		this.idMessage++;
		if (callback != undefined)
			this.callbacks[this.idMessage] = callback;
		var action = {
			op: _this.CommandCode.DOCK_CANCEL,
			id : _this.idMessage
		};
		_this.wycaSend(JSON.stringify(action));
	}
	this.Undock = function(callback){
		this.idMessage++;
		if (callback != undefined)
			this.callbacks[this.idMessage] = callback;
		var action = {
			op: _this.CommandCode.UNDOCK,
			id : _this.idMessage
		};
		_this.wycaSend(JSON.stringify(action));
	}
	this.UndockCancel = function(callback){
		this.idMessage++;
		if (callback != undefined)
			this.callbacks[this.idMessage] = callback;
		var action = {
			op: _this.CommandCode.UNDOCK_CANCEL,
			id : _this.idMessage
		};
		_this.wycaSend(JSON.stringify(action));
	}
}
