<!doctype html>
<html>
<head>
<title>WebSocket++ Telemetry Client</title>
<script src="./assets/vendor/jquery/jquery.js"></script>
<script src="./API/wyca_socket_api.js"></script>
</head>
<body>



<a href="#" id="bTestLatency">Test latency</a>
<a href="#" id="bTestLatencyHigh">Test High</a>

<div id="log">

</div>

</body>
</html>
<script type="text/javascript">



var index = -1;
var timeStart = Array();

function StartLantency()
{
	index++;
	$('#log').html($('#log').html() + 'Start latency test ' + index + '<br />');
	timeStart[index] = new Date().getTime();
	wycaApi.LatencyStart(index, function(e) { console.log('retour_service', e);});
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
			moy = (totalTest / nbTest);
			$('#log').html($('#log').html() + 'Moyenne : ' + moy  + ' ms<br />');
		}, 1000);
	}
	else
	{
		StartLantency();
		setTimeout(High, 10);
	}
}


$(document).ready(function(e) {
	wycaApi = new WycaAPI({
		host:'192.168.0.18:9095', // host:'192.168.100.245:9090',
		nick:'robot',
		onRobotConnexionError: function(data){
			connectedToTheRobot = false;
			$('#connexion_robot').show();
		},
		onRobotConnexionOpen: function(data){
			connectedToTheRobot = true;
			$('#connexion_robot').hide();
		},
		onRobotConnexionClose: function(data){
			connectedToTheRobot = false;
			$('#connexion_robot').show();
		},
		onLatencyReturn: function(data){
			var timeReturn = new Date().getTime();
			console.log(timeReturn);
			data = parseInt(data/1000000);
			console.log(data);
			
			console.log("toto");
			elapse = timeReturn - data;
			nbTest++;
			totalTest += elapse;
			if (elapse < minTest) minTest = elapse;
			if (elapse > maxTest) maxTest = elapse;
			
			$('#log').html($('#log').html() + ' ' + 'Result ' + data);
			$('#log').html($('#log').html() + ' ' + 'Latency : ' + elapse + ' ms<br/>');
		},
		onInitialized: function(){
		},
        onIsPoweredChange: function(data){
            initPoweredState(data);
        },
        onSOCChange: function(data){
			initBatteryState(data);
        },
        onIsSafetyStopChange: function(data){
            if (data)
                $('.safety_stop').show();
            else
                $('.safety_stop').hide();
            lastEStop = data;
        },
		onNavigationStateChange: function(data) {
			navLaunched = data;
			if (data)
			{
				$('.no_navigation').hide();
				$('.only_navigation').show();
			}
			else
			{
				$('.no_navigation').show();
				$('.only_navigation').hide();
			}
		},
		onMappingStateChange: function(data) {
			mappingLaunched = data;
		},
		onRobotPoseChange:function(pose){
			lastRobotPose = pose;
			InitRobotPose(pose);
		},
        onMappingRobotPoseChange: function(data){
            mappingLastPose = data;
            InitPosCarteMapping();
		},
        onMapInConstruction: function(data){
            var img = document.getElementById("install_by_step_mapping_img_map_saved");
            img.src = 'data:image/png;base64,' + data.map_trinary.data;
            mappingLastOrigin = {'x':data.x_origin, 'y':data.y_origin };
        },
	});
	
	
	wycaApi.init();	
	
	$('#bTestLatency').click(function(e) {
        e.preventDefault();
		StartLantency();
    });
	
	$('#bTestLatencyHigh').click(function(e) {
        e.preventDefault();
		indexHigh = 0;
		High();
    });
});
</script>