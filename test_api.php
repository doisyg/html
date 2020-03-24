<?php
$_CONFIG['URL'] = 'https://elodie.wyca-solutions.com/';
?><!doctype html>
<html>
<head>
<title>Wyca test api</title>

	<link href="<?php echo $_CONFIG['URL'];?>assets/stylesheets/fonts/opensans/opensans.css" rel="stylesheet" type="text/css">

	<link rel="stylesheet" href="<?php echo $_CONFIG['URL'];?>assets/vendor/bootstrap/css/bootstrap.css" />
	<link rel="stylesheet" href="<?php echo $_CONFIG['URL'];?>assets/vendor/font-awesome/css/font-awesome.css" />
    <link rel="stylesheet" href="<?php echo $_CONFIG['URL'];?>assets/stylesheets/theme.css" />
    <link rel="stylesheet" href="<?php echo $_CONFIG['URL'];?>assets/stylesheets/skins/default.css" />
    <link rel="stylesheet" href="<?php echo $_CONFIG['URL'];?>assets/stylesheets/skins/extension.css" />
    
    <style>
	.panel-title { font-size:16px; }
	.panel-heading { padding:10px; }
	.panel-body { padding:10px; }
	.fixheight { max-height:90vh; overflow:auto; }
	</style>
        
	<script src="./assets/vendor/jquery/jquery.js"></script>
	<script src="./API/wyca_socket_api.js"></script>
</head>
<body>

    <div class="col-md-4">
        <h2>Service</h2>
        <div class="fixheight">
            <div class="col-md-6">
                    
                <section class="panel panel-featured panel-featured-primary">
                    <header class="panel-heading"><h2 class="panel-title"><a href="#" id="LatencyStart" class="btn btn-default">LatencyStart</a></h2></header>
                    <div class="panel-body">
                        <code id="LatencyStart_return"></code>
                    </div>
                </section>
                
                <section class="panel panel-featured panel-featured-primary">
                    <header class="panel-heading"><h2 class="panel-title"><a href="#" id="LatencyWait" class="btn btn-default">LatencyWait</a></h2></header>
                    <div class="panel-body">
                        <code id="LatencyWait_return"></code>
                    </div>
                </section>
                
                <section class="panel panel-featured panel-featured-primary">
                    <header class="panel-heading"><h2 class="panel-title"><a href="#" id="MappingIsStarted" class="btn btn-default">MappingIsStarted</a></h2></header>
                    <div class="panel-body">
                        <code id="MappingIsStarted_return"></code>
                    </div>
                </section>
                
                <section class="panel panel-featured panel-featured-primary">
                    <header class="panel-heading"><h2 class="panel-title"><a href="#" id="MappingStart" class="btn btn-default">MappingStart</a></h2></header>
                    <div class="panel-body">
                        <code id="MappingStart_return"></code>
                    </div>
                </section>
                
                <section class="panel panel-featured panel-featured-primary">
                    <header class="panel-heading"><h2 class="panel-title"><a href="#" id="MappingStop" class="btn btn-default">MappingStop</a></h2></header>
                    <div class="panel-body">
                        <code id="MappingStop_return"></code>
                        <img src="" id="MappingStop_map">
                    </div>
                </section>
                <section class="panel panel-featured panel-featured-primary">
                    <header class="panel-heading"><h2 class="panel-title"><a href="#" id="NavigationIsStarted" class="btn btn-default">NavigationIsStarted</a></h2></header>
                    <div class="panel-body">
                        <code id="NavigationIsStarted_return"></code>
                    </div>
                </section>
                <section class="panel panel-featured panel-featured-primary">
                    <header class="panel-heading"><h2 class="panel-title"><a href="#" id="GetRobotPose" class="btn btn-default">GetRobotPose</a></h2></header>
                    <div class="panel-body">
                        <code id="GetRobotPose_return"></code>
                    </div>
                </section>
            </div>
            <div class="col-md-6">
                
                <section class="panel panel-featured panel-featured-primary">
                    <header class="panel-heading"><h2 class="panel-title"><a href="#" id="NavigationStart" class="btn btn-default">NavigationStart</a></h2></header>
                    <div class="panel-body">
                        <code id="NavigationStart_return"></code>
                    </div>
                </section>
                
                <section class="panel panel-featured panel-featured-primary">
                    <header class="panel-heading"><h2 class="panel-title"><a href="#" id="NavigationStop" class="btn btn-default">NavigationStop</a></h2></header>
                    <div class="panel-body">
                        <code id="NavigationStop_return"></code>
                    </div>
                </section>
                
                <section class="panel panel-featured panel-featured-primary">
                    <header class="panel-heading"><h2 class="panel-title"><a href="#" id="RefreshFreewheelState" class="btn btn-default">RefreshFreewheelState</a></h2></header>
                    <div class="panel-body">
                        <code id="RefreshFreewheelState_return"></code>
                    </div>
                </section>
                
                <section class="panel panel-featured panel-featured-primary">
                    <header class="panel-heading"><h2 class="panel-title"><a href="#" id="RefreshSafetyStop" class="btn btn-default">RefreshSafetyStop</a></h2></header>
                    <div class="panel-body">
                        <code id="RefreshSafetyStop_return"></code>
                    </div>
                </section>
                
                <section class="panel panel-featured panel-featured-primary">
                    <header class="panel-heading"><h2 class="panel-title"><a href="#" id="GetDockingState" class="btn btn-default">GetDockingState</a></h2></header>
                    <div class="panel-body">
                        <code id="GetDockingState_return"></code>
                    </div>
                </section>
                <section class="panel panel-featured panel-featured-primary">
                    <header class="panel-heading"><h2 class="panel-title"><a href="#" id="ReloadMaps" class="btn btn-default">ReloadMaps</a></h2></header>
                    <div class="panel-body">
                        <code id="ReloadMaps_return"></code>
                    </div>
                </section>
            </div>
        </div>
    </div>
    <div class="col-md-4">
	    <div class="col-md-6">
            <h2>Actions</h2>
            <div class="fixheight">
                <section class="panel panel-featured panel-featured-primary">
                    <header class="panel-heading"><h2 class="panel-title"><a href="#" id="GoToPose" class="btn btn-default">GoToPose</a></h2></header>
                    <div class="panel-body">
                        <div class="input-group">
                            <div class="input-group-addon">X</div>
                            <input type="text" class="form-control" id="GoToPose_x" value="1" placeholder="X">
                        </div>
                        <div class="input-group">
                            <div class="input-group-addon">Y</div>
                            <input type="text" class="form-control" id="GoToPose_y" value="0" placeholder="Y">
                        </div>
                        <div class="input-group">
                            <div class="input-group-addon">Theta</div>
                            <input type="text" class="form-control" id="GoToPose_theta" value="0" placeholder="Theta">
                        </div>
                        <h4>Feedback</h4>
                        <code id="onGoToPoseFeedback"></code>
                        <h4>Result</h4>
                        <code id="onGoToPoseResult"></code>
                        <h4>Return</h4>
                        <code id="GoToPoseReturn"></code>
                    </div>
                </section>
                <section class="panel panel-featured panel-featured-primary">
                    <header class="panel-heading"><h2 class="panel-title"><a href="#" id="Dock" class="btn btn-default">Dock</a></h2></header>
                    <div class="panel-body">
                        <div class="input-group">
                            <div class="input-group-addon">Id</div>
                            <input type="text" class="form-control" id="Dock_id" value="-1" placeholder="Id">
                        </div>
                        <h4>Feedback</h4>
                        <code id="onDockFeedback"></code>
                        <h4>Result</h4>
                        <code id="onDockResult"></code>
                        <h4>Return</h4>
                        <code id="DockReturn"></code>
                    </div>
                </section>
                <section class="panel panel-featured panel-featured-primary">
                    <header class="panel-heading"><h2 class="panel-title"><a href="#" id="Undock" class="btn btn-default">Undock</a></h2></header>
                    <div class="panel-body">
                        <h4>Feedback</h4>
                        <code id="onUndockFeedback"></code>
                        <h4>Result</h4>
                        <code id="onUndockResult"></code>
                        <h4>Return</h4>
                        <code id="UndockReturn"></code>
                    </div>
                </section>
            </div>
        </div>
        <div class="col-md-6">        
            <h2>Topic publisher</h2>
            <div class="fixheight">
                <section class="panel panel-featured panel-featured-primary">
                    <header class="panel-heading"><h2 class="panel-title"><a href="#" id="Teleop" class="btn btn-default">Teleop Start</a></h2></header>
                    <div class="panel-body">
                        <div class="input-group">
                            <div class="input-group-addon">Interval</div>
                            <input type="text" class="form-control" id="Teleop_rate" value="200" placeholder="Rate">
                            <div class="input-group-addon">ms</div>
                        </div>
                        <div class="input-group">
                            <div class="input-group-addon">X</div>
                            <input type="text" class="form-control" id="Teleop_x" value="1" placeholder="X">
                        </div>
                        <div class="input-group">
                            <div class="input-group-addon">Z</div>
                            <input type="text" class="form-control" id="Teleop_z" value="0" placeholder="Theta">
                        </div>
                        <code id="Teleop_return"></code>
                    </div>
                </section>
                <section class="panel panel-featured panel-featured-primary">
                    <header class="panel-heading"><h2 class="panel-title"><a href="#" id="TeleopOff" class="btn btn-default">TeleopOff Start</a></h2></header>
                    <div class="panel-body">
                        <div class="input-group">
                            <div class="input-group-addon">Interval</div>
                            <input type="text" class="form-control" id="TeleopOff_rate" value="200" placeholder="Rate">
                            <div class="input-group-addon">ms</div>
                        </div>
                        <div class="input-group">
                            <div class="input-group-addon">X</div>
                            <select class="form-control" id="TeleopOff_isoff">
                                <option value="false">False</option>
                                <option value="true">True</option>
                            </select>
                        </div>
                        <code id="Teleop_return"></code>
                    </div>
                </section>
            </div>
        </div>
    </div>
    <div class="col-md-4">
        <h2>Topics</h2>
        <div class="fixheight">
            <div class="col-md-6">
                <section class="panel panel-featured panel-featured-primary">
                    <header class="panel-heading"><h2 class="panel-title">RobotConnexion</h2></header>
                    <div class="panel-body">
                        <code id="RobotConnexion"></code>
                    </div>
                </section>
                <section class="panel panel-featured panel-featured-primary">
                    <header class="panel-heading"><h2 class="panel-title">onLatencyReturn</h2></header>
                    <div class="panel-body">
                        <code id="onLatencyReturn"></code>
                    </div>
                </section>
                <section class="panel panel-featured panel-featured-primary">
                    <header class="panel-heading"><h2 class="panel-title">onLatencyReturn</h2></header>
                    <div class="panel-body">
                        <code id="onLatencyReturn"></code>
                    </div>
                </section>
                <section class="panel panel-featured panel-featured-primary">
                    <header class="panel-heading"><h2 class="panel-title">onCurrentA</h2></header>
                    <div class="panel-body">
                        <code id="onCurrentA"></code>
                    </div>
                </section>
                <section class="panel panel-featured panel-featured-primary">
                    <header class="panel-heading"><h2 class="panel-title">onIsPowered</h2></header>
                    <div class="panel-body">
                        <code id="onIsPowered"></code>
                    </div>
                </section>
                <section class="panel panel-featured panel-featured-primary">
                    <header class="panel-heading"><h2 class="panel-title">onRelativeSOCPercentage</h2></header>
                    <div class="panel-body">
                        <code id="onRelativeSOCPercentage"></code>
                    </div>
                </section>
                <section class="panel panel-featured panel-featured-primary">
                    <header class="panel-heading"><h2 class="panel-title">onRemainingCapacity</h2></header>
                    <div class="panel-body">
                        <code id="onRemainingCapacity"></code>
                    </div>
                </section>
                <section class="panel panel-featured panel-featured-primary">
                    <header class="panel-heading"><h2 class="panel-title">onTimeRemainingToEmptyMin</h2></header>
                    <div class="panel-body">
                        <code id="onTimeRemainingToEmptyMin"></code>
                    </div>
                </section>
                <section class="panel panel-featured panel-featured-primary">
                    <header class="panel-heading"><h2 class="panel-title">onTimeRemainingToFullMin</h2></header>
                    <div class="panel-body">
                        <code id="onTimeRemainingToFullMin"></code>
                    </div>
                </section>
                <section class="panel panel-featured panel-featured-primary">
                    <header class="panel-heading"><h2 class="panel-title">onLedCurrentAnimationMode</h2></header>
                    <div class="panel-body">
                        <code id="onLedCurrentAnimationMode"></code>
                    </div>
                </section>
                <section class="panel panel-featured panel-featured-primary">
                    <header class="panel-heading"><h2 class="panel-title">onLedCurrentRobotStateMode</h2></header>
                    <div class="panel-body">
                        <code id="onLedCurrentRobotStateMode"></code>
                    </div>
                </section>
            </div>
            <div class="col-md-6">
                <section class="panel panel-featured panel-featured-primary">
                    <header class="panel-heading"><h2 class="panel-title">onLedIsLightMode</h2></header>
                    <div class="panel-body">
                        <code id="onLedIsLightMode"></code>
                    </div>
                </section>
                <section class="panel panel-featured panel-featured-primary">
                    <header class="panel-heading"><h2 class="panel-title">onLedIsManualMode</h2></header>
                    <div class="panel-body">
                        <code id="onLedIsManualMode"></code>
                    </div>
                </section>
                <section class="panel panel-featured panel-featured-primary">
                    <header class="panel-heading"><h2 class="panel-title">onMappingIsStarted</h2></header>
                    <div class="panel-body">
                        <code id="onMappingIsStarted"></code>
                    </div>
                </section>
                <section class="panel panel-featured panel-featured-primary">
                    <header class="panel-heading"><h2 class="panel-title">onMappingMapInConstruction</h2></header>
                    <div class="panel-body">
                        <code id="onMappingMapInConstruction"></code>
                        <img src="" id="onMappingMapInConstruction_map">
                        <img src="" id="onMappingMapInConstruction_map_trinary">
                    </div>
                </section>
                <section class="panel panel-featured panel-featured-primary">
                    <header class="panel-heading"><h2 class="panel-title">onMappingRobotPoseInBuildingMap</h2></header>
                    <div class="panel-body">
                        <code id="onMappingRobotPoseInBuildingMap"></code>
                    </div>
                </section>
                <section class="panel panel-featured panel-featured-primary">
                    <header class="panel-heading"><h2 class="panel-title">onNavigationIsStarted</h2></header>
                    <div class="panel-body">
                        <code id="onNavigationIsStarted"></code>
                    </div>
                </section>
                <section class="panel panel-featured panel-featured-primary">
                    <header class="panel-heading"><h2 class="panel-title">onNavigationRobotPose</h2></header>
                    <div class="panel-body">
                        <code id="onNavigationRobotPose"></code>
                    </div>
                </section>
                <section class="panel panel-featured panel-featured-primary">
                    <header class="panel-heading"><h2 class="panel-title">onIsFreewheel</h2></header>
                    <div class="panel-body">
                        <code id="onIsFreewheel"></code>
                    </div>
                </section>
                <section class="panel panel-featured panel-featured-primary">
                    <header class="panel-heading"><h2 class="panel-title">onIsSafetyStop</h2></header>
                    <div class="panel-body">
                        <code id="onIsSafetyStop"></code>
                    </div>
                </section>
                <section class="panel panel-featured panel-featured-primary">
                    <header class="panel-heading"><h2 class="panel-title">onDockingState</h2></header>
                    <div class="panel-body">
                        <code id="onDockingState"></code>
                    </div>
                </section>
            </div>
        </div>        
    </div>
    

    <div id="log" style="max-height:500px; overflow:auto;">
    
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
	wycaApi.LatencyStart(index, function(e) { $('#LatencyStart_return').html(JSON.stringify(e)); console.log('retour_service', e);});
}

var nbTest = 0;
var totalTest = 0;
var minTest = 100000;
var maxTest = 0;
var started = false;

var Teleop_started = false;
var Teleop_interval = null;
var Teleop_x = 0;
var Teleop_z = 0;
function Teleop_call()
{
	wycaApi.Teleop(Teleop_x, Teleop_z);
}
var TeleopOff_started = false;
var TeleopOff_interval = null;
var TeleopOff_isoff = 0;
function TeleopOff_call()
{
	wycaApi.TeleopOff(TeleopOff_isoff);
}

$(document).ready(function(e) {
	wycaApi = new WycaAPI({
		//host:'elodie.wyca-solutions.com:9095',
		host:'192.168.0.30:9095',
		api_key:'Jnt.kK2nXB15jhVkCEGLA3NssidZWLpsdgmt4bx8GkTZL5',
		nick:'robot',
		onRobotConnexionError: function(data){
			connectedToTheRobot = false;
			$('#connexion_robot').show();
			$('#RobotConnexion').html('error');
		},
		onRobotConnexionOpen: function(data){
			connectedToTheRobot = true;
			$('#connexion_robot').hide();
			$('#RobotConnexion').html('open');
		},
		onRobotConnexionClose: function(data){
			connectedToTheRobot = false;
			$('#connexion_robot').show();
			$('#RobotConnexion').html('close');
		},
		onLatencyReturn: function(data){
			$('#onLatencyReturn').html(JSON.stringify(data));
			var timeReturn = new Date().getTime();
			data = parseInt(data/1000000);
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
		onCurrentA: function(data){
			$('#onCurrentA').html(JSON.stringify(data));
		},
		onIsPowered: function(data){
			$('#onIsPowered').html(JSON.stringify(data));
		},
		onRelativeSOCPercentage: function(data){
			$('#onRelativeSOCPercentage').html(JSON.stringify(data));
		},
		onRemainingCapacity: function(data){
			$('#onRemainingCapacity').html(JSON.stringify(data));
		},
		onTimeRemainingToEmptyMin: function(data){
			$('#onTimeRemainingToEmptyMin').html(JSON.stringify(data));
		},
		onTimeRemainingToFullMin: function(data){
			$('#onTimeRemainingToFullMin').html(JSON.stringify(data));
		},
		onLedCurrentAnimationMode: function(data){
			$('#onLedCurrentAnimationMode').html(JSON.stringify(data));
		},
		onLedCurrentRobotStateMode: function(data){
			$('#onLedCurrentRobotStateMode').html(JSON.stringify(data));
		},
		onLedIsLightMode: function(data){
			$('#onLedIsLightMode').html(JSON.stringify(data));
		},
		onLedIsManualMode: function(data){
			$('#onLedIsManualMode').html(JSON.stringify(data));
		},
		onMappingIsStarted: function(data){
			$('#onMappingIsStarted').html(JSON.stringify(data));
		},
		onMappingMapInConstruction: function(data){
			$('#onMappingMapInConstruction').html(JSON.stringify(data));
			$('#onMappingMapInConstruction_map').attr('src', 'data:image/png;base64,' + data.map);
			$('#onMappingMapInConstruction_map_trinary').attr('src', 'data:image/png;base64,' + data.map_trinary);
		},
		onMappingRobotPoseInBuildingMap: function(data){
			$('#onMappingRobotPoseInBuildingMap').html(JSON.stringify(data));
		},
		onNavigationIsStarted: function(data){
			$('#onNavigationIsStarted').html(JSON.stringify(data));
		},
		onNavigationRobotPose: function(data){
			$('#onNavigationRobotPose').html(JSON.stringify(data));
		},
		onIsFreewheel: function(data){
			$('#onIsFreewheel').html(JSON.stringify(data));
		},
		onIsSafetyStop: function(data){
			$('#onIsSafetyStop').html(JSON.stringify(data));
		},
		onDockingState: function(data){
			$('#onDockingState').html(JSON.stringify(data));
		},
		onGoToPoseFeedback: function(data){
			$('#onGoToPoseFeedback').html(JSON.stringify(data));
		},
		onGoToPoseResult: function(data){
			$('#onGoToPoseResult').html(JSON.stringify(data));
		},
		onDockFeedback: function(data){
			$('#onDockFeedback').html(JSON.stringify(data));
		},
		onDockResult: function(data){
			$('#onDockResult').html(JSON.stringify(data));
		},
		onUndockFeedback: function(data){
			$('#onUndockFeedback').html(JSON.stringify(data));
		},
		onUndockResult: function(data){
			$('#onUndockResult').html(JSON.stringify(data));
		},
	});
	
	
	wycaApi.init();	
	
	// Topic publisher
	$('#Teleop').click(function(e) {
        if (Teleop_started)
		{
			Teleop_x = 0;
			Teleop_z = 0;
			if (Teleop_interval != null)
			{
				clearInterval(Teleop_interval);
				Teleop_interval = null;
			}
			Teleop_started = false;
			$('#Teleop').html('Teleop Start');
		}
		else
		{
			Teleop_started = true;
			$('#Teleop').html('Teleop Stop');
			
			time = parseInt($('#Teleop_rate').val());
			Teleop_x = parseFloat($('#Teleop_x').val());
			Teleop_z = parseFloat($('#Teleop_z').val());
			
			if (Teleop_interval != null)
			{
				clearInterval(Teleop_interval);
				Teleop_interval = null;
			}
			Teleop_interval = setInterval(Teleop_call, time);
		}
    });
	$('#TeleopOff').click(function(e) {
        if (TeleopOff_started)
		{
			TeleopOff_isoff = true;
			if (TeleopOff_interval != null)
			{
				clearInterval(TeleopOff_interval);
				TeleopOff_interval = null;
			}
			TeleopOff_started = false;
			$('#TeleopOff').html('TeleopOff Start');
		}
		else
		{
			TeleopOff_started = true;
			$('#TeleopOff').html('TeleopOff Stop');
			
			time = parseInt($('#TeleopOff_rate').val());
			TeleopOff_isoff = $('#TeleopOff_isoff').val() == 'true'?true:false;
			
			if (TeleopOff_interval != null)
			{
				clearInterval(TeleopOff_interval);
				TeleopOff_interval = null;
			}
			TeleopOff_interval = setInterval(TeleopOff_call, time);
		}
    });
	
	// Service
	$('#LatencyStart').click(function(e) {
        e.preventDefault();
		StartLantency();

		if (!started)
		{
			started = true;
			nbTest = 0;
			totalTest = 0;
			minTest = 100000;
			maxTest = 0;
		}
		else
		{
			setTimeout(function() {
				$('#log').html($('#log').html() + 'Min : ' + minTest + ' ms<br />');
				$('#log').html($('#log').html() + 'Max : ' + maxTest + ' ms<br />');
				moy = (totalTest / nbTest);
				$('#log').html($('#log').html() + 'Moyenne : ' + moy  + ' ms<br />');
			}, 1000);
		}
	});
	
	$('#LatencyWait').click(function(e) {
		e.preventDefault();
        wycaApi.LatencyWait(function(e) { $('#LatencyWait_return').html(JSON.stringify(e)); });
	});
	$('#MappingIsStarted').click(function(e) {
		e.preventDefault();
        wycaApi.MappingIsStarted(function(e) { $('#MappingIsStarted_return').html(JSON.stringify(e)); });
	});
	$('#MappingStart').click(function(e) {
		e.preventDefault();
        wycaApi.MappingStart(function(e) { $('#MappingStartt_return').html(JSON.stringify(e)); });
	});
	$('#MappingStop').click(function(e) {
		e.preventDefault();
        wycaApi.MappingStop(function(e) { 
			$('#MappingStop_return').html(JSON.stringify(e)); 
			$('#MappingStop_map').attr('src', 'data:image/png;base64,' + data.final_map);
		});
	});
	$('#NavigationIsStarted').click(function(e) {
		e.preventDefault();
        wycaApi.NavigationIsStarted(function(e) { $('#NavigationIsStarted_return').html(JSON.stringify(e)); });
	});
	$('#NavigationStart').click(function(e) {
		e.preventDefault();
        wycaApi.NavigationStart(function(e) { $('#NavigationStart_return').html(JSON.stringify(e)); });
	});
	$('#NavigationStop').click(function(e) {
		e.preventDefault();
        wycaApi.NavigationStop(function(e) { $('#NavigationStop_return').html(JSON.stringify(e)); });
	});
	$('#RefreshFreewheelState').click(function(e) {
		e.preventDefault();
        wycaApi.RefreshFreewheelState(function(e) { $('#RefreshFreewheelState_return').html(JSON.stringify(e)); });
	});
	$('#RefreshSafetyStop').click(function(e) {
		e.preventDefault();
        wycaApi.RefreshSafetyStop(function(e) { $('#RefreshSafetyStop_return').html(JSON.stringify(e)); });
	});
	$('#GetDockingState').click(function(e) {
		e.preventDefault();
        wycaApi.GetDockingState(function(e) { $('#GetDockingState_return').html(JSON.stringify(e)); });
	});
	$('#GetRobotPose').click(function(e) {
		e.preventDefault();
        wycaApi.GetRobotPose(function(e) { $('#GetRobotPose_return').html(JSON.stringify(e)); });
	});
	$('#ReloadMaps').click(function(e) {
		e.preventDefault();
        wycaApi.ReloadMaps(function(e) { $('#ReloadMaps_return').html(JSON.stringify(e)); });
	});
	// Actions
	$('#GoToPose').click(function(e) {
		e.preventDefault();
    	wycaApi.GoToPose(parseFloat($('#GoToPose_x').val()), parseFloat($('#GoToPose_y').val()), parseFloat($('#GoToPose_theta').val()), function(e) { $('#GoToPoseReturn').html(JSON.stringify(e)); });
    });
	$('#Dock').click(function(e) {
		e.preventDefault();
		wycaApi.Dock(parseInt($('#Dock_id').val()), function(e) { $('#DockReturn').html(JSON.stringify(e)); });
    });
	$('#Undock').click(function(e) {
		e.preventDefault();
		wycaApi.Undock(function(e) { $('#UndockReturn').html(JSON.stringify(e)); });
    });
});
</script>
