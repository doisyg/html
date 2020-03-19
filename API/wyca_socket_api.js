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
					//if (isStarted) _this.StartWebRTC();
				}
				else
				{
					throw new Error('WycaAPI API KEY not valid')
				}
			}
	});
	
	this.init = function (){
		
		if (this.options.nick == 'robot')
		{
			if ("WebSocket" in window) {
				this.ws = new WebSocket('wss://'+this.options.host);
			} else if ("MozWebSocket" in window) {
				this.ws = new MozWebSocket('wss://'+this.options.host);
			} else {
				throw new Error('This Browser does not support WebSockets')
			}
			this.ws.onopen = jQuery.proxy(this.wsOnOpen, this);
			this.ws.onerror = jQuery.proxy(this.wsOnError, this);
			this.ws.onclose = jQuery.proxy(this.wsOnClose , this);
			this.ws.onmessage = jQuery.proxy(this.wsOnMessage , this);
		}
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
			async: true,
			data: { },
			error: function(jqXHR, textStatus, errorThrown) {
			},
			success: jQuery.proxy(function(data, textStatus, jqXHR) {
				donnees = JSON.parse(data);
			
				var auth = {
					op : 'auth',
					id : ++_this.idMessage,
					params: donnees
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
			_this.timeoutReconnect = setTimeout(_this.RosReconnect, 1000);
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
			_this.timeoutReconnect = setTimeout(_this.RosReconnect, 1000);
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
				if (this.callbacks[this.idMessage] !=undefined) { delete data.op; delete data.id; this.callbacks[this.idMessage](data); }
				break;
			/********** Topics *********/
			case 'latency_return':
				if (_this.options.onLatencyReturn != undefined) { _this.options.onLatencyReturn(data.params); }
				break;
			/********** Actions *********/
		}
	}
	
	var _this = this;
	
	this.RosReconnect = function()
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
		if (_this.options.onLatencyReturn != undefined) { var subscribe = {	op : 'subscribe', id : ++_this.idMessage, params: { event:'latency_return', throttle_rate:1 }}; _this.ws.send(JSON.stringify(subscribe)); }
		
		
		
		if (_this.options.onInitialized != undefined) _this.options.onInitialized();
	}
	
	this.TeleopRobot = function(x, t)
	{
		var action = {
			op: 'TeleopRobot',
			id : ++_this.idMessage,
			params: {
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
			}
		};
		_this.ws.send(JSON.stringify(action));	
	}
	
	this.JoystickIsSafeOff = function(data) {
		var action = {
			op: 'JoystickIsSafeOff',
			id : ++_this.idMessage,
			params: data
		};
		_this.ws.send(JSON.stringify(action));
	}
	
	this.DisableStaticCostmap = function(data) {
		var action = {
			op: 'DisableStaticCostmap',
			id : ++_this.idMessage,
			params: data
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
			params: num
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

}
