function WycaAPI(options){


// START PAD 20200328 
// Declaration Hoisted, placée ici pour plus de claretée
var LastIndiceACK = 0; // Memorisation du dernier ACK recu, mis à jour dans la fonction 
// END PAD 20200328 

	
   	if (typeof jQuery === 'undefined') {
	  throw new Error('WycaAPI requires jQuery')
	}
	var defaults = {
		serveurWyca : 'https://elodie.wyca-solutions.com/',
		host : 'elodie.wyca-solutions.com:9095',
		api_key:''
    };
    this.options = jQuery.extend({}, defaults, options || {});

	if ("WebSocket" in window) {
	} else if ("MozWebSocket" in window) {
	} else {
		throw new Error('This Browser does not support WebSockets')
	}
	
	this.socketStarted = false;
	this.socketError = false;
	this.timeoutReconnect = null;
	this.idMessage = 0;
	_this = this;

// START PAD 20200328 

	// Assesseur idMessage
	this.GetidMessage = function (){
		return _this.idMessage;
	};

	// Assesseur LastIndiceACK
	this.GetLastACKindice = function (){
		return LastIndiceACK;
	};	
// END PAD 20200328 

	
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
		
		if (_this.timeoutReconnect == null)
			_this.timeoutReconnect = setTimeout(_this.Connect, 1000);
	}
	
	this.wsOnClose = function(e)
	{
		_this.socketStarted = false;
		//_this.ROSMessageSendToPC('onRobotConnexionClose');
		if (_this.timeoutReconnect == null)
			_this.timeoutReconnect = setTimeout(_this.Connect, 1000);
	}
	
	this.wsOnMessage = function(e)
	{
		data = JSON.parse(e.data);
// START PAD 20200328 
		LastIndiceACK = data; // CODE NEED TO BE UPDATED IF USED IN PRODUCTION : on actual test, we assume return value in data is ACK indice number echoing Message Indice
		if(isNaN(LastIndiceACK))
			LastIndiceACK=this.GetidMessage();
// END PAD 20200328 

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
	
	this.Teleop = function(x, z)
	{
		_this.action = {
			op: 'Teleop',
			id : ++_this.idMessage,
			data: { x:x, z:z}
		};
		_this.ws.send(JSON.stringify(_this.action));
		setTimeout(function() { _this.ws.send("{op:'FORCE'}");}, 100);
	}
}
