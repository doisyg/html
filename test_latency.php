<?php 
require_once ('./config/initSite.php');
?><!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Document sans titre</title>
</head>

<body>

<a href="#" id="bTestLatency">Test latency</a>
<a href="#" id="bTestLatencyHigh">Test High</a>

<div id="log">

</div>

</body>
</html>
<script src="<?php echo $_CONFIG['URL'];?>assets/vendor/jquery/jquery.js"></script>
<script src="<?php echo $_CONFIG['URL_API'];?>extern/roslib.js"></script>
<script src="<?php echo $_CONFIG['URL_API'];?>webrtc.wyca2.min.js"></script>
<script src="<?php echo $_CONFIG['URL_API'];?>wyca_api.latest.min.php?api_key=5LGU.LaYMMncJaA0i42HwsX9ZX-RCNgj-9V17ROFXt71st&v=20191127"></script>
<script>

var index = -1;
var timeStart = Array();

function StartLantency()
{
	index++;
	$('#log').html($('#log').html() + 'Start latency test ' + index + '<br />');
	timeStart[index] = new Date().getTime();
	wycaApi.LatencyStart(index);
}

var nbTest = 0;
var totalTest = 0;
var minTest = 100000;
var maxTest = 0;

var indexHigh = 0;
function High()
{
	indexHigh++;
	if (indexHigh > 100)
	{
		setTimeout(function() {
			$('#log').html($('#log').html() + 'Min : ' + minTest + ' ms<br />');
			$('#log').html($('#log').html() + 'Max : ' + maxTest + ' ms<br />');
			$('#log').html($('#log').html() + 'Moyenne : ' + (totalTest / nbTest)  + ' ms<br />');
		}, 1000);
	}
	else
	{
		StartLantency();
		setTimeout(High, 10);
	}
}

$(document).ready(function(e) {
    $('#bTestLatency').click(function(e) {
        e.preventDefault();
		StartLantency();
    });
	
	$('#bTestLatencyHigh').click(function(e) {
        e.preventDefault();
		indexHigh = 0;
		High();
    });
	
	
	var optionsDefault = {
		api_key:'5LGU.LaYMMncJaA0i42HwsX9ZX-RCNgj-9V17ROFXt71st',
		id_robot:3,
		//host:'elodie.wyca-solutions.com:9090', //192.168.1.32:9090', // host:'192.168.100.245:9090',
		host:'192.168.100.165:9090',
		nick:'robot',
		delay_no_reply : 30,
		delay_lost_connexion : 30,
		with_audio: false,
		with_video: false,
		onRobotConnexionError: function(data){
			console.log('connexion erreur');
		},
		onRobotConnexionOpen: function(data){
			console.log('connexion open');
		},
		onRobotConnexionClose: function(data){
			console.log('connexion closed');
		},
		onLatencyReturn: function(data){
            var timeReturn = new Date().getTime();
			
			elapse = timeReturn - timeStart[data];
			nbTest++;
			totalTest += elapse;
			if (elapse < minTest) minTest = elapse;
			if (elapse > maxTest) maxTest = elapse;
			
			$('#log').html($('#log').html() + ' ' + 'Result ' + data);
			$('#log').html($('#log').html() + ' ' + 'Latency : ' + elapse + ' ms<br/>');
		},
	};
	
	if (typeof optionsWyca !== 'undefined')
		$.extend(true, optionsDefault, optionsDefault, optionsWyca);
	
	wycaApi = new WycaAPI(optionsDefault);
	
	wycaApi.init();	
});
</script>