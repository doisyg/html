<!doctype html>
<html>
<head>
<title>WebSocket++ Telemetry Client</title>
<script src="../assets/vendor/jquery/jquery.js"></script>
<script type="text/javascript">
var ws;
var url;

function connect() {
	url = document.getElementById("server_url").value;
	
	if ("WebSocket" in window) {
		ws = new WebSocket(url);
	} else if ("MozWebSocket" in window) {
		ws = new MozWebSocket(url);
	} else {
		document.getElementById("messages").innerHTML += "This Browser does not support WebSockets<br />";
		return;
	}
	ws.onopen = function(e) {
		document.getElementById("messages").innerHTML += "Client: A connection to "+ws.url+" has been opened.<br />";
		
		document.getElementById("server_url").disabled = true;
		document.getElementById("toggle_connect").innerHTML = "Disconnect";

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
					params: donnees
				  };		
				
				ws.send(JSON.stringify(auth));					
			}, this)
		});
	};
	
	ws.onerror = function(e) {
		document.getElementById("messages").innerHTML += "Client: An error occured, see console log for more details.<br />";
		console.log(e);
	};
	
	ws.onclose = function(e) {
		document.getElementById("messages").innerHTML += "Client: The connection to "+url+" was closed. ["+e.code+(e.reason != "" ? ","+e.reason : "")+"]<br />";
	    cleanup_disconnect();
	};
	
	ws.onmessage = function(e) {
		console.log(JSON.parse(e.data));
		document.getElementById("messages").innerHTML += "Server: "+e.data+"<br />";
	};
}

function disconnect() {
	ws.close();
	cleanup_disconnect();
}

function cleanup_disconnect() {
    document.getElementById("server_url").disabled = false;
	document.getElementById("toggle_connect").innerHTML = "Connect";
}

function toggle_connect() {
	if (document.getElementById("server_url").disabled === false) {
		connect();
	} else {
		disconnect();
	}
}
</script>

<style>
body,html {
	margin: 0px;
	padding: 0px;
}
#controls {
	float:right;
	background-color: #999;
}

</style>

</head>
<body>



<div id="controls">
	<div id="server">
	<input type="text" name="server_url" id="server_url" value="ws://192.168.0.18:9095" /><br />
	<button id="toggle_connect" onClick="toggle_connect();">Connect</button>
	</div>
</div>
<div id="messages"></div>

</body>
</html>