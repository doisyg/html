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
	this.socketError = false;
	this.timeoutReconnect = null;
	this.idMessage = 0;
	this.callbacks = Array();
	
	_this = this;
	
	this.init = function (){
		
		this.Connect();
	};
	
	this.wsOnOpen = function(e)
	{
		_this.socketStarted = true;
		//_this.ROSMessageSendToPC('onRobotConnexionOpen');
		if (this.options.onRobotConnexionOpen != undefined)
		{
			this.options.onRobotConnexionOpen();
		}
		
		jQuery.ajax({
			url: 'https://elodie.wyca-solutions.com/API/webservices/v1.0/json/robot/getHash',
			type: "get",
			timeout: 15000,
			beforeSend: function(x) {
				x.setRequestHeader ("Authorization", "Basic " + btoa(_this.options.api_key + ':'));
			},
			async: true,
			data: { },
			error: function(jqXHR, textStatus, errorThrown) {
			},
			success: jQuery.proxy(function(data, textStatus, jqXHR) {
				donnees = JSON.parse(data);
			
				var auth = {
					op : 'auth',
					id : ++_this.idMessage,
					data: donnees
				  };		
				
				_this.ws.send(JSON.stringify(auth));					
			}, this)
		});

	}
	
	this.wsOnError = function(error)
	{
		_this.socketStarted = false;
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
		//_this.ROSMessageSendToPC('onRobotConnexionClose');
		if (this.options.onRobotConnexionClose != undefined)
		{
			this.options.onRobotConnexionClose();
		}
		
		if (_this.timeoutReconnect == null)
			_this.timeoutReconnect = setTimeout(_this.Connect, 1000);
	}
	
	this.wsOnMessage = function(e)
	{
		data = JSON.parse(e.data);
		console.log(data);
		switch(data.op)
		{
			case 'auth':
				if (data.message == "Auth OK") _this.Subscribe();
				break;
			/********** Services *********/
			case 'LatencyStart_return':
			case 'LatencyWait_return':
			case 'MappingIsStarted_return':
			case 'MappingStart_return':
			case 'MappingStop_return':
			case 'NavigationIsStarted_return':
			case 'NavigationStart_return':
			case 'NavigationStop_return':
			case 'RefreshFreewheelState_return':
			case 'RefreshSafetyStop_return':
			case 'GetDockingState_return':
			case 'GoToPose_return':
			case 'Dock_return':
			case 'Undock_return':
			case 'ReloadMaps_return':
			case 'GetRobotPose_return':
				if (_this.callbacks[data.id] !=undefined) { id_mes = data.id; delete data.op; delete data.id; _this.callbacks[id_mes](data); }
				break;
			/********** Actions *********/
			case 'GoToPose_feedback':
				if (_this.options.onGoToPoseFeedback != undefined) { delete data.op; delete data.id; _this.options.onGoToPoseFeedback(data); }
				break;
			case 'GoToPose_result':
				if (_this.options.onGoToPoseResult != undefined) { delete data.op; delete data.id; _this.options.onGoToPoseResult(data); }
				break;
			case 'Dock_feedback':
				if (_this.options.onDockFeedback != undefined) { delete data.op; delete data.id; _this.options.onDockFeedback(data); }
				break;
			case 'Dock_result':
				if (_this.options.onDockResult != undefined) {delete data.op; delete data.id;  _this.options.onDockResult(data); }
				break;
			case 'Undock_feedback':
				if (_this.options.onUndockFeedback != undefined) { delete data.op; delete data.id; _this.options.onUndockFeedback(data); }
				break;
			case 'Undock_result':
				if (_this.options.onUndockResult != undefined) { delete data.op; delete data.id; _this.options.onUndockResult(data); }
				break;
			/********** Topics *********/
			case 'onLatencyReturn':
				if (_this.options.onLatencyReturn != undefined) { _this.options.onLatencyReturn(data.data); }
				break;
			case 'onCurrentA':
				if (_this.options.onCurrentA != undefined) { _this.options.onCurrentA(data.data); }
				break;
			case 'onIsPowered':
				if (_this.options.onIsPowered != undefined) { _this.options.onIsPowered(data.data); }
				break;
			case 'onRelativeSOCPercentage':
				if (_this.options.onRelativeSOCPercentage != undefined) { _this.options.onRelativeSOCPercentage(data.data); }
				break;
			case 'onRemainingCapacity':
				if (_this.options.onRemainingCapacity != undefined) { _this.options.onRemainingCapacity(data.data); }
				break;
			case 'onTimeRemainingToEmptyMin':
				if (_this.options.onTimeRemainingToEmptyMin != undefined) { _this.options.onTimeRemainingToEmptyMin(data.data); }
				break;
			case 'onTimeRemainingToFullMin':
				if (_this.options.onTimeRemainingToFullMin != undefined) { _this.options.onTimeRemainingToFullMin(data.data); }
				break;
			case 'onLedCurrentAnimationMode':
				if (_this.options.onLedCurrentAnimationMode != undefined) { _this.options.onLedCurrentAnimationMode(data.data); }
				break;
			case 'onLedCurrentRobotStateMode':
				if (_this.options.onLedCurrentRobotStateMode != undefined) { _this.options.onLedCurrentRobotStateMode(data.data); }
				break;
			case 'onLedIsLightMode':
				if (_this.options.onLedIsLightMode != undefined) { _this.options.onLedIsLightMode(data.data); }
				break;
			case 'onLedIsManualMode':
				if (_this.options.onLedIsManualMode != undefined) { _this.options.onLedIsManualMode(data.data); }
				break;
			case 'onMappingIsStarted':
				if (_this.options.onMappingIsStarted != undefined) { _this.options.onMappingIsStarted(data.data); }
				break;
			case 'onMappingMapInConstruction':
				if (_this.options.onMappingMapInConstruction != undefined) { _this.options.onMappingMapInConstruction(data.data); }
				break;
			case 'onMappingRobotPoseInBuildingMap':
				if (_this.options.onMappingRobotPoseInBuildingMap != undefined) { _this.options.onMappingRobotPoseInBuildingMap(data.data); }
				break;
			case 'onNavigationIsStarted':
				if (_this.options.onNavigationIsStarted != undefined) { _this.options.onNavigationIsStarted(data.data); }
				break;
			case 'onNavigationRobotPose':
				if (_this.options.onNavigationRobotPose != undefined) { _this.options.onNavigationRobotPose(data.data); }
				break;
			case 'onIsFreewheel':
				if (_this.options.onIsFreewheel != undefined) { _this.options.onIsFreewheel(data.data); }
				break;
			case 'onIsSafetyStop':
				if (_this.options.onIsSafetyStop != undefined) { _this.options.onIsSafetyStop(data.data); }
				break;
			case 'onDockingState':
				if (_this.options.onDockingState != undefined) { _this.options.onDockingState(data.data); }
				break;
		}
	}
	
	var _this = this;
	
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
		if (_this.options.onLatencyReturn != undefined) { var subscribe = {	op : 'subscribe', id : ++_this.idMessage, params: { event:'onLatencyReturn', throttle_rate:0 }}; _this.ws.send(JSON.stringify(subscribe)); }
		if (_this.options.onCurrentA != undefined) { var subscribe = {	op : 'subscribe', id : ++_this.idMessage, params: { event:'onCurrentA', throttle_rate:1 }}; _this.ws.send(JSON.stringify(subscribe)); }
		if (_this.options.onIsPowered != undefined) { var subscribe = {	op : 'subscribe', id : ++_this.idMessage, params: { event:'onIsPowered', throttle_rate:1 }}; _this.ws.send(JSON.stringify(subscribe)); }
		if (_this.options.onRelativeSOCPercentage != undefined) { var subscribe = {	op : 'subscribe', id : ++_this.idMessage, params: { event:'onRelativeSOCPercentage', throttle_rate:1 }}; _this.ws.send(JSON.stringify(subscribe)); }
		if (_this.options.onRemainingCapacity != undefined) { var subscribe = {	op : 'subscribe', id : ++_this.idMessage, params: { event:'onRemainingCapacity', throttle_rate:1 }}; _this.ws.send(JSON.stringify(subscribe)); }
		if (_this.options.onTimeRemainingToEmptyMin != undefined) { var subscribe = {	op : 'subscribe', id : ++_this.idMessage, params: { event:'onTimeRemainingToEmptyMin', throttle_rate:1 }}; _this.ws.send(JSON.stringify(subscribe)); }
		if (_this.options.onTimeRemainingToFullMin != undefined) { var subscribe = {	op : 'subscribe', id : ++_this.idMessage, params: { event:'onTimeRemainingToFullMin', throttle_rate:1 }}; _this.ws.send(JSON.stringify(subscribe)); }
		if (_this.options.onLedCurrentAnimationMode != undefined) { var subscribe = {	op : 'subscribe', id : ++_this.idMessage, params: { event:'onLedCurrentAnimationMode', throttle_rate:0 }}; _this.ws.send(JSON.stringify(subscribe)); }
		if (_this.options.onLedCurrentRobotStateMode != undefined) { var subscribe = {	op : 'subscribe', id : ++_this.idMessage, params: { event:'onLedCurrentRobotStateMode', throttle_rate:0 }}; _this.ws.send(JSON.stringify(subscribe)); }
		if (_this.options.onLedIsLightMode != undefined) { var subscribe = {	op : 'subscribe', id : ++_this.idMessage, params: { event:'onLedIsLightMode', throttle_rate:0 }}; _this.ws.send(JSON.stringify(subscribe)); }
		if (_this.options.onLedIsManualMode != undefined) { var subscribe = {	op : 'subscribe', id : ++_this.idMessage, params: { event:'onLedIsManualMode', throttle_rate:0 }}; _this.ws.send(JSON.stringify(subscribe)); }
		if (_this.options.onMappingIsStarted != undefined) { var subscribe = {	op : 'subscribe', id : ++_this.idMessage, params: { event:'onMappingIsStarted', throttle_rate:0 }}; _this.ws.send(JSON.stringify(subscribe)); }
		if (_this.options.onMappingMapInConstruction != undefined) { var subscribe = {	op : 'subscribe', id : ++_this.idMessage, params: { event:'onMappingMapInConstruction', throttle_rate:0 }}; _this.ws.send(JSON.stringify(subscribe)); }
		if (_this.options.onMappingRobotPoseInBuildingMap != undefined) { var subscribe = {	op : 'subscribe', id : ++_this.idMessage, params: { event:'onMappingRobotPoseInBuildingMap', throttle_rate:0 }}; _this.ws.send(JSON.stringify(subscribe)); }
		if (_this.options.onNavigationIsStarted != undefined) { var subscribe = {	op : 'subscribe', id : ++_this.idMessage, params: { event:'onNavigationIsStarted', throttle_rate:0 }}; _this.ws.send(JSON.stringify(subscribe)); }
		if (_this.options.onNavigationRobotPose != undefined) { var subscribe = {	op : 'subscribe', id : ++_this.idMessage, params: { event:'onNavigationRobotPose', throttle_rate:0 }}; _this.ws.send(JSON.stringify(subscribe)); }
		if (_this.options.onIsFreewheel != undefined) { var subscribe = {	op : 'subscribe', id : ++_this.idMessage, params: { event:'onIsFreewheel', throttle_rate:0 }}; _this.ws.send(JSON.stringify(subscribe)); this.RefreshFreewheelState(); }
		if (_this.options.onIsSafetyStop != undefined) { var subscribe = {	op : 'subscribe', id : ++_this.idMessage, params: { event:'onIsSafetyStop', throttle_rate:0 }}; _this.ws.send(JSON.stringify(subscribe)); this.RefreshSafetyStop(); }
		if (_this.options.onDockingState != undefined) { var subscribe = {	op : 'subscribe', id : ++_this.idMessage, params: { event:'onDockingState', throttle_rate:0 }}; _this.ws.send(JSON.stringify(subscribe)); }
		
		
		if (_this.options.onInitialized != undefined) _this.options.onInitialized();
	}
	
	this.Teleop = function(x, z)
	{
		var action = {
			op: 'Teleop',
			id : ++_this.idMessage,
			data: { x:x, z:z }
		};
		_this.ws.send(JSON.stringify(action));	
	}
	this.TeleopOff = function(off)
	{
		var action = {
			op: 'TeleopOff',
			id : ++_this.idMessage,
			data: off
		};
		_this.ws.send(JSON.stringify(action));	
	}
	
	this.LatencyStart = function(num, callback){
		this.idMessage++;
		if (callback != undefined)
			this.callbacks[this.idMessage] = callback;
		var action = {
			op: 'LatencyStart',
			id : _this.idMessage,
			data: num
		};
		_this.ws.send(JSON.stringify(action));
	}

	this.LatencyWait = function(callback){
		this.idMessage++;
		if (callback != undefined)
			this.callbacks[this.idMessage] = callback;
		var action = {
			op: 'LatencyWait',
			id : _this.idMessage
		};
		_this.ws.send(JSON.stringify(action));
	}
	this.MappingIsStarted = function(callback){
		this.idMessage++;
		if (callback != undefined)
			this.callbacks[this.idMessage] = callback;
		var action = {
			op: 'MappingIsStarted',
			id : _this.idMessage
		};
		_this.ws.send(JSON.stringify(action));
	}
	this.MappingStart = function(callback){
		this.idMessage++;
		if (callback != undefined)
			this.callbacks[this.idMessage] = callback;
		var action = {
			op: 'MappingStart',
			id : _this.idMessage
		};
		_this.ws.send(JSON.stringify(action));
	}
	this.MappingStop = function(callback){
		this.idMessage++;
		if (callback != undefined)
			this.callbacks[this.idMessage] = callback;
		var action = {
			op: 'MappingStop',
			id : _this.idMessage
		};
		_this.ws.send(JSON.stringify(action));
	}
	this.NavigationIsStarted = function(callback){
		this.idMessage++;
		if (callback != undefined)
			this.callbacks[this.idMessage] = callback;
		var action = {
			op: 'NavigationIsStarted',
			id : _this.idMessage
		};
		_this.ws.send(JSON.stringify(action));
	}
	this.NavigationStart = function(init_from_mapping, callback){
		this.idMessage++;
		if (callback != undefined)
			this.callbacks[this.idMessage] = callback;
		var action = {
			op: 'NavigationStart',
			id : _this.idMessage,
			data: init_from_mapping
		};
		_this.ws.send(JSON.stringify(action));
	}
	this.NavigationStop = function(callback){
		this.idMessage++;
		if (callback != undefined)
			this.callbacks[this.idMessage] = callback;
		var action = {
			op: 'NavigationStop',
			id : _this.idMessage
		};
		_this.ws.send(JSON.stringify(action));
	}
	this.RefreshFreewheelState = function(callback){
		this.idMessage++;
		if (callback != undefined)
			this.callbacks[this.idMessage] = callback;
		var action = {
			op: 'RefreshFreewheelState',
			id : _this.idMessage
		};
		_this.ws.send(JSON.stringify(action));
	}
	this.RefreshSafetyStop = function(callback){
		this.idMessage++;
		if (callback != undefined)
			this.callbacks[this.idMessage] = callback;
		var action = {
			op: 'RefreshSafetyStop',
			id : _this.idMessage
		};
		_this.ws.send(JSON.stringify(action));
	}
	this.GetDockingState = function(callback){
		this.idMessage++;
		if (callback != undefined)
			this.callbacks[this.idMessage] = callback;
		var action = {
			op: 'GetDockingState',
			id : _this.idMessage
		};
		_this.ws.send(JSON.stringify(action));
	}
	this.GetRobotPose = function(callback){
		this.idMessage++;
		if (callback != undefined)
			this.callbacks[this.idMessage] = callback;
		var action = {
			op: 'GetRobotPose',
			id : _this.idMessage
		};
		_this.ws.send(JSON.stringify(action));
	}
	this.ReloadMaps = function(callback){
		this.idMessage++;
		if (callback != undefined)
			this.callbacks[this.idMessage] = callback;
		var action = {
			op: 'ReloadMaps',
			id : _this.idMessage
		};
		_this.ws.send(JSON.stringify(action));
	}
	this.GoToPose = function(x, y, theta, callback){
		this.idMessage++;
		if (callback != undefined)
			this.callbacks[this.idMessage] = callback;
		var action = {
			op: 'GoToPose',
			id : _this.idMessage,
			data: {
				x:x,
				y:y,
				theta:theta
			}
		};
		_this.ws.send(JSON.stringify(action));
	}
	this.GoToPoseCancel = function(callback){
		this.idMessage++;
		if (callback != undefined)
			this.callbacks[this.idMessage] = callback;
		var action = {
			op: 'GoToPoseCancel',
			id : _this.idMessage
		};
		_this.ws.send(JSON.stringify(action));
	}
	this.Dock = function(id_dock, callback){
		this.idMessage++;
		if (callback != undefined)
			this.callbacks[this.idMessage] = callback;
		var action = {
			op: 'Dock',
			id : _this.idMessage,
			data:id_dock
		};
		_this.ws.send(JSON.stringify(action));
	}
	this.DockCancel = function(callback){
		this.idMessage++;
		if (callback != undefined)
			this.callbacks[this.idMessage] = callback;
		var action = {
			op: 'DockCancel',
			id : _this.idMessage
		};
		_this.ws.send(JSON.stringify(action));
	}
	this.Undock = function(callback){
		this.idMessage++;
		if (callback != undefined)
			this.callbacks[this.idMessage] = callback;
		var action = {
			op: 'Undock',
			id : _this.idMessage
		};
		_this.ws.send(JSON.stringify(action));
	}
	this.UndockCancel = function(callback){
		this.idMessage++;
		if (callback != undefined)
			this.callbacks[this.idMessage] = callback;
		var action = {
			op: 'UndockCancel',
			id : _this.idMessage
		};
		_this.ws.send(JSON.stringify(action));
	}
}
