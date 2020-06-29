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
                    <header class="panel-heading"><h2 class="panel-title"><a href="#" id="InstallNewTop" class="btn btn-default">Install new top</a></h2></header>
                    <div class="panel-body">
                        <code id="InstallNewTop_return"></code>
                    </div>
                </section>
                    
                <section class="panel panel-featured panel-featured-primary">
                    <header class="panel-heading"><h2 class="panel-title"><a href="#" id="MappingIsStarted" class="btn btn-default">MappingIsStarted</a></h2></header>
                    <div class="panel-body">
                        <code id="MappingIsStarted_return"></code>
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
                <section class="panel panel-featured panel-featured-primary">
                    <header class="panel-heading"><h2 class="panel-title"><a href="#" id="GetLedIsLightMode" class="btn btn-default">GetLedIsLightMode</a></h2></header>
                    <div class="panel-body">
                        <code id="GetLedIsLightMode_return"></code>
                    </div>
                </section>
                <section class="panel panel-featured panel-featured-primary">
                    <header class="panel-heading"><h2 class="panel-title"><a href="#" id="GetLedIsManualMode" class="btn btn-default">GetLedIsManualMode</a></h2></header>
                    <div class="panel-body">
                        <code id="GetLedIsManualMode_return"></code>
                    </div>
                </section>
                <section class="panel panel-featured panel-featured-primary">
                    <header class="panel-heading"><h2 class="panel-title"><a href="#" id="GetLedAnimationMode" class="btn btn-default">GetLedAnimationMode</a></h2></header>
                    <div class="panel-body">
                        <code id="GetLedAnimationMode_return"></code>
                    </div>
                </section>
                <section class="panel panel-featured panel-featured-primary">
                    <header class="panel-heading"><h2 class="panel-title"><a href="#" id="GetLedRobotState" class="btn btn-default">GetLedRobotState</a></h2></header>
                    <div class="panel-body">
                        <code id="GetLedRobotState_return"></code>
                    </div>
                </section>
                <section class="panel panel-featured panel-featured-primary">
                    <header class="panel-heading"><h2 class="panel-title"><a href="#" id="GetWifiList" class="btn btn-default">GetWifiList</a></h2></header>
                    <div class="panel-body">
                        <code id="GetWifiList_return"></code>
                    </div>
                </section>
                <section class="panel panel-featured panel-featured-primary">
                    <header class="panel-heading"><h2 class="panel-title"><a href="#" id="WifiConnection" class="btn btn-default">WifiConnection</a></h2></header>
                    <div class="panel-body">
                    	<div class="input-group">
                            <div class="input-group-addon">ssid</div>
                            <input type="text" class="form-control" id="WifiConnection_ssid" value="" placeholder="ssid">
                        </div>
                        <div class="input-group">
                            <div class="input-group-addon">password</div>
                            <input type="password" class="form-control" id="WifiConnection_password" value="" placeholder="password">
                        </div>
                        <code id="WifiConnection_return"></code>
                    </div>
                </section>
                <section class="panel panel-featured panel-featured-primary">
                    <header class="panel-heading"><h2 class="panel-title"><a href="#" id="ConfLedAnim" class="btn btn-default">ConfLedAnim</a></h2></header>
                    <div class="panel-body">
                    	<div class="input-group">
                            <div class="input-group-addon">Robot state</div>
                            <select class="form-control" id="ConfLedAnim_state">
                            	<option value="1">Safety</option>
                            	<option value="2">MOVE</option>
                            	<option value="3">CHARGING</option>
                            	<option value="4">STOPPED</option>
                            	<option value="5">MANUAL</option>
                            	<option value="6">LIGHT</option>
                            </select>
                        </div>
                    	<div class="input-group">
                            <div class="input-group-addon">Led animation</div>
                            <select class="form-control" id="ConfLedAnim_anim">
                            	<option value="1">PROGRESS</option>
                            	<option value="2">PROGRESS_CENTER</option>
                            	<option value="3">RAINBOW</option>
                            	<option value="4">K2000</option>
                            	<option value="5">CLIGNOTE</option>
                            	<option value="6">CLIGNOTE_2</option>
                            	<option value="7">POLICE</option>
                            	<option value="8">FONDU</option>
                            	<option value="9">MOVE</option>
                            	<option value="10">LIGHT</option>
                            	<option value="11">PROGRESS_CENTER_CHARGE</option>
                            	<option value="12">PROGRESS_CENTER_CHARGE_BLINK</option>
                            	<option value="13">FADE_FR_FLAG</option>
                            </select>
                        </div>
                        <div class="input-group">
                            <div class="input-group-addon">Color Red</div>
                            <input type="text" class="form-control" id="ConfLedAnim_color_r" value="0" placeholder="Color R">
                        </div>
                        <div class="input-group">
                            <div class="input-group-addon">Color Green</div>
                            <input type="text" class="form-control" id="ConfLedAnim_color_g" value="0" placeholder="Color G">
                        </div>
                        <div class="input-group">
                            <div class="input-group-addon">Color Blue</div>
                            <input type="text" class="form-control" id="ConfLedAnim_color_b" value="0" placeholder="Color B">
                        </div>
                        <code id="ConfLedAnim_return"></code>
                    </div>
                </section>
                <section class="panel panel-featured panel-featured-primary">
                    <header class="panel-heading"><h2 class="panel-title"><a href="#" id="SetLedIsLightMode" class="btn btn-default">SetLedIsLightMode</a></h2></header>
                    <div class="panel-body">
                    	<div class="input-group">
                            <div class="input-group-addon">Is light mode</div>
                            <select class="form-control" id="SetLedIsLightMode_enable">
                            	<option value="false">False</option>
                            	<option value="true">True</option>
                            </select>
                        </div>
                        <code id="SetLedIsLightMode_return"></code>
                    </div>
                </section>
                <section class="panel panel-featured panel-featured-primary">
                    <header class="panel-heading"><h2 class="panel-title"><a href="#" id="SetLedIsManualMode" class="btn btn-default">SetLedIsManualMode</a></h2></header>
                    <div class="panel-body">
                    	<div class="input-group">
                            <div class="input-group-addon">Is manual mode</div>
                            <select class="form-control" id="SetLedIsManualMode_enable">
                            	<option value="false">False</option>
                            	<option value="true">True</option>
                            </select>
                        </div>
                        <code id="SetLedIsManualMode_return"></code>
                    </div>
                </section>
            </div>
            <div class="col-md-6">
                
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
                <section class="panel panel-featured panel-featured-primary">
                    <header class="panel-heading"><h2 class="panel-title"><a href="#" id="ReflectorDetectionEnable" class="btn btn-default">ReflectorDetectionEnable</a></h2></header>
                    <div class="panel-body">
                        <div class="input-group">
                            <div class="input-group-addon">Enable</div>
                            <select id="ReflectorDetectionEnable_enable">
                            	<option value="true">True</option>
                            	<option value="false">False</option>
                            </select>
                        </div>
                        <code id="ReflectorDetectionEnable_return"></code>
                    </div>
                </section>
                <section class="panel panel-featured panel-featured-primary">
                    <header class="panel-heading"><h2 class="panel-title"><a href="#" id="GetFiducialsVisible" class="btn btn-default">GetFiducialsVisible</a></h2></header>
                    <div class="panel-body">
                        <code id="GetFiducialsVisible_return"></code>
                    </div>
                </section>
                <section class="panel panel-featured panel-featured-primary">
                    <header class="panel-heading"><h2 class="panel-title"><a href="#" id="SetFiducialsRecorded" class="btn btn-default">SetFiducialsRecorded</a></h2></header>
                    <div class="panel-body">
                        <div class="input-group">
                            <div class="input-group-addon">Enable</div>
                            <select id="SetFiducialsRecorded_enable">
                            	<option value="true">True</option>
                            	<option value="false">False</option>
                            </select>
                        </div>
                        <code id="SetFiducialsRecorded_return"></code>
                    </div>
                </section>
                <section class="panel panel-featured panel-featured-primary">
                    <header class="panel-heading"><h2 class="panel-title"><a href="#" id="GetFiducialsRecorded" class="btn btn-default">GetFiducialsRecorded</a></h2></header>
                    <div class="panel-body">
                        <code id="GetFiducialsRecorded_return"></code>
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
                    <header class="panel-heading"><h2 class="panel-title"><a href="#" id="MappingStart" class="btn btn-default">MappingStart</a></h2></header>
                    <div class="panel-body">
                        <h4>Feedback</h4>
                        <code id="onMappingStartFeedback"></code>
                        <h4>Result</h4>
                        <code id="onMappingStartResult"></code>
                        <h4>Return</h4>
                        <code id="MappingStartReturn"></code>
                    </div>
                </section>
                <section class="panel panel-featured panel-featured-primary">
                    <header class="panel-heading"><h2 class="panel-title"><a href="#" id="NavigationStart" class="btn btn-default">NavigationStart</a></h2></header>
                    <div class="panel-body">
                        <div class="input-group">
                            <div class="input-group-addon">Init from mapping</div>
                            <select class="form-control" id="NavigationStart_init_from_mapping">
                            	<option value="true">True</option>
                            	<option value="false">False</option>
                            </select>
                        </div>
                        <h4>Feedback</h4>
                        <code id="onNavigationStartFeedback"></code>
                        <h4>Result</h4>
                        <code id="onNavigationStartResult"></code>
                        <h4>Return</h4>
                        <code id="NavigationStartReturn"></code>
                    </div>
                </section>
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
                    <header class="panel-heading"><h2 class="panel-title"><a href="#" id="GoToPoi" class="btn btn-default">GoToPoi</a> <a href="#" id="GoToPoiCancel" class="btn btn-default">Cancel</a></h2></header>
                    <div class="panel-body">
                        <div class="input-group">
                            <div class="input-group-addon">ID</div>
                            <input type="text" class="form-control" id="GoToPoi_id" value="1" placeholder="ID">
                        </div>
                        <h4>Feedback</h4>
                        <code id="onGoToPoiFeedback"></code>
                        <h4>Result</h4>
                        <code id="onGoToPoiResult"></code>
                        <h4>Return</h4>
                        <code id="GoToPoiReturn"></code>
                        <h4>Cancel Return</h4>
                        <code id="GoToPoiCancelReturn"></code>
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
                <section class="panel panel-featured panel-featured-primary">
                    <header class="panel-heading"><h2 class="panel-title"><a href="#" id="RecoveryFromFiducial" class="btn btn-default">RecoveryFromFiducial</a></h2></header>
                    <div class="panel-body">
                        <h4>Feedback</h4>
                        <code id="onRecoveryFromFiducialFeedback"></code>
                        <h4>Result</h4>
                        <code id="onRecoveryFromFiducialResult"></code>
                        <h4>Return</h4>
                        <code id="RecoveryFromFiducialReturn"></code>
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
                    <header class="panel-heading"><h2 class="panel-title">onBatteryState</h2></header>
                    <div class="panel-body">
                        <code id="onBatteryState"></code>
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
                <section class="panel panel-featured panel-featured-primary">
                    <header class="panel-heading"><h2 class="panel-title">onPOIsDetect</h2></header>
                    <div class="panel-body">
                        <code id="onPOIsDetect"></code>
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
	wycaApi.LatencyStart(index, function(data) { $('#LatencyStart_return').html(JSON.stringify(data)); console.log('retour_service', e);});
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

$(document).ready(function(e) {
	wycaApi = new WycaAPI({
		//host:'elodie.wyca-solutions.com:9095',
		host:'192.168.0.30:9095',
		//host:'10.0.0.44:9095',
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
		onInitialized: function(){
		},
		onBatteryState: function(data){
			$('#onBatteryState').html(JSON.stringify(data));
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
			$('#onMappingMapInConstruction_map').attr('src', 'data:image/png;base64,' + data.M);
			$('#onMappingMapInConstruction_map_trinary').attr('src', 'data:image/png;base64,' + data.MT);
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
		onGoToPoiFeedback: function(data){
			$('#onGoToPoiFeedback').html(JSON.stringify(data));
		},
		onGoToPoiResult: function(data){
			$('#onGoToPoiResult').html(JSON.stringify(data));
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
		onMappingStartFeedback: function(data){
			$('#onMappingStartFeedback').html(JSON.stringify(data));
		},
		onMappingStartResult: function(data){
			$('#onMappingStartResult').html(JSON.stringify(data));
		},
		onNavigationStartFeedback: function(data){
			$('#onNavigationStartFeedback').html(JSON.stringify(data));
		},
		onNavigationStartResult: function(data){
			$('#onNavigationStartResult').html(JSON.stringify(data));
		},
		onPOIsDetect: function(data){
			$('#onPOIsDetect').html(JSON.stringify(data));
		},
		onRecoveryFromFiducialFeedback: function(data){
			$('#onRecoveryFromFiducialFeedback').html(JSON.stringify(data));
		},
		onRecoveryFromFiducialResult: function(data){
			$('#onRecoveryFromFiducialResult').html(JSON.stringify(data));
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
	
	// Service
	$('#InstallNewTop').click(function(e) {
		e.preventDefault();
		$('#InstallNewTop_return').html('');
        wycaApi.InstallNewTop('A GENRER', '<?php echo base64_encode(file_get_contents('./test/export Top steph.wyca'));?>', function(data) { $('#InstallNewTop_return').html(JSON.stringify(data)); });
	});
	
	$('#MappingIsStarted').click(function(e) {
		e.preventDefault();
		$('#MappingIsStarted_return').html('');
        wycaApi.MappingIsStarted(function(data) { $('#MappingIsStarted_return').html(JSON.stringify(data)); });
	});
	$('#MappingStop').click(function(e) {
		e.preventDefault();
		$('#MappingStop_return').html('');
        wycaApi.MappingStop(function(data) { 
			$('#MappingStop_return').html(JSON.stringify(data)); 
			$('#MappingStop_map').attr('src', 'data:image/png;base64,' + data.D);
		});
	});
	$('#NavigationIsStarted').click(function(e) {
		e.preventDefault();
		$('#NavigationIsStarted_return').html('');
        wycaApi.NavigationIsStarted(function(data) { $('#NavigationIsStarted_return').html(JSON.stringify(data)); });
	});
	$('#NavigationStop').click(function(e) {
		e.preventDefault();
		$('#NavigationStop_return').html('');
        wycaApi.NavigationStop(function(data) { $('#NavigationStop_return').html(JSON.stringify(data)); });
	});
	$('#RefreshFreewheelState').click(function(e) {
		e.preventDefault();
		$('#RefreshFreewheelState_return').html('');
        wycaApi.RefreshFreewheelState(function(data) { $('#RefreshFreewheelState_return').html(JSON.stringify(data)); });
	});
	$('#RefreshSafetyStop').click(function(e) {
		e.preventDefault();
		$('#RefreshSafetyStop_return').html('');
        wycaApi.RefreshSafetyStop(function(data) { $('#RefreshSafetyStop_return').html(JSON.stringify(data)); });
	});
	$('#GetDockingState').click(function(e) {
		e.preventDefault();
		$('#GetDockingState_return').html('');
        wycaApi.GetDockingState(function(data) { $('#GetDockingState_return').html(JSON.stringify(data)); });
	});
	$('#GetRobotPose').click(function(e) {
		e.preventDefault();
		$('#GetRobotPose_return').html('');
        wycaApi.GetRobotPose(function(data) { $('#GetRobotPose_return').html(JSON.stringify(data)); });
	});
	$('#ReloadMaps').click(function(e) {
		e.preventDefault();
		$('#ReloadMaps_return').html('');
        wycaApi.ReloadMaps(function(data) { $('#ReloadMaps_return').html(JSON.stringify(data)); });
	});
	$('#ReflectorDetectionEnable').click(function(e) {
		e.preventDefault();
		$('#ReflectorDetectionEnable_return').html('');
        wycaApi.ReflectorDetectionEnable($('#ReflectorDetectionEnable_enable').val() == "true" ? true:false, function(data) { $('#ReflectorDetectionEnable_return').html(JSON.stringify(data)); });
	});
	$('#GetLedIsLightMode').click(function(e) {
		e.preventDefault();
		$('#GetLedIsLightMode_return').html('');
        wycaApi.GetLedIsLightMode(function(data) { $('#GetLedIsLightMode_return').html(JSON.stringify(data)); });
	});
	$('#GetLedIsManualMode').click(function(e) {
		e.preventDefault();
		$('#GetLedIsManualMode_return').html('');
        wycaApi.GetLedIsManualMode(function(data) { $('#GetLedIsManualMode_return').html(JSON.stringify(data)); });
	});
	$('#SetLedIsLightMode').click(function(e) {
		e.preventDefault();
		$('#SetLedIsLightMode_return').html('');
        wycaApi.SetLedIsLightMode($('#SetLedIsLightMode_enable').val() == "true" ? true:false, function(data) { $('#SetLedIsLightMode_return').html(JSON.stringify(data)); });
	});
	$('#SetLedIsManualMode').click(function(e) {
		e.preventDefault();
		$('#SetLedIsManualMode_return').html('');
        wycaApi.SetLedIsManualMode($('#SetLedIsManualMode_enable').val() == "true" ? true:false, function(data) { $('#SetLedIsManualMode_return').html(JSON.stringify(data)); });
	});
	$('#GetLedAnimationMode').click(function(e) {
		e.preventDefault();
		$('#GetLedAnimationMode_return').html('');
        wycaApi.GetLedAnimationMode(function(data) { $('#GetLedAnimationMode_return').html(JSON.stringify(data)); });
	});
	$('#GetLedRobotState').click(function(e) {
		e.preventDefault();
		$('#GetLedRobotState_return').html('');
        wycaApi.GetLedRobotState(function(data) { $('#GetLedRobotState_return').html(JSON.stringify(data)); });
	});
	
	$('#ConfLedAnim').click(function(e) {
		e.preventDefault();
		$('#ConfLedAnim_return').html('');
        wycaApi.ConfLedAnim(parseInt($('#ConfLedAnim_state').val()), parseInt($('#ConfLedAnim_anim').val()), parseInt($('#ConfLedAnim_color_r').val()), parseInt($('#ConfLedAnim_color_g').val()), parseInt($('#ConfLedAnim_color_b').val()), function(data) { $('#ConfLedAnim_return').html(JSON.stringify(data)); });
	});
	
	$('#GetWifiList').click(function(e) {
		e.preventDefault();
		$('#GetWifiList_return').html('');
        wycaApi.GetWifiList(function(data) { $('#GetWifiList_return').html(JSON.stringify(data)); });
	});
	$('#WifiConnection').click(function(e) {
		e.preventDefault();
		$('#WifiConnection_return').html('');
        wycaApi.WifiConnection($('#WifiConnection_ssid').val(), $('#WifiConnection_password').val(), function(data) { $('#WifiConnection_return').html(JSON.stringify(data)); });
	});
	
	$('#GetFiducialsVisible').click(function(e) {
		e.preventDefault();
		$('#GetFiducialsVisible_return').html('');
        wycaApi.GetFiducialsVisible(function(data) { $('#GetFiducialsVisible_return').html(JSON.stringify(data)); });
	});
	$('#SetFiducialsRecorded').click(function(e) {
		e.preventDefault();
		$('#SetFiducialsRecorded_return').html('');
        wycaApi.SetFiducialsRecorded($('#SetFiducialsRecorded_enable').val() == "true" ? true:false, function(data) { $('#SetFiducialsRecorded_return').html(JSON.stringify(data)); });
	});
	$('#GetFiducialsRecorded').click(function(e) {
		e.preventDefault();
		$('#GetFiducialsRecorded_return').html('');
        wycaApi.GetFiducialsRecorded(function(data) { $('#GetFiducialsRecorded_return').html(JSON.stringify(data)); });
	});
	
	// Actions
	$('#GoToPose').click(function(e) {
		e.preventDefault();
		$('#GoToPoseReturn').html('');
		$('#onGoToPoseFeedback').html('');
		$('#onGoToPoseResult').html('');
    	wycaApi.GoToPose(parseFloat($('#GoToPose_x').val()), parseFloat($('#GoToPose_y').val()), parseFloat($('#GoToPose_theta').val()), function(data) { $('#GoToPoseReturn').html(JSON.stringify(data)); });
    });
	$('#GoToPoi').click(function(e) {
		e.preventDefault();
		$('#GoToPoiReturn').html('');
		$('#onGoToPoiFeedback').html('');
		$('#onGoToPoiResult').html('');
    	wycaApi.GoToPoi(parseFloat($('#GoToPoi_id').val()), function(data) { $('#GoToPoiReturn').html(JSON.stringify(data)); });
    });
	$('#GoToPoiCancel').click(function(e) {
		wycaApi.GoToPoiCancel(function(data) { $('#GoToPoiCancelReturn').html(JSON.stringify(data)); });
    });
	$('#Dock').click(function(e) {
		e.preventDefault();
		$('#DockReturn').html('');
		$('#onDockFeedback').html('');
		$('#onDockResult').html('');
		wycaApi.Dock(parseInt($('#Dock_id').val()), function(data) { $('#DockReturn').html(JSON.stringify(data)); });
    });
	$('#Undock').click(function(e) {
		e.preventDefault();
		$('#UndockReturn').html('');
		$('#onUndockFeedback').html('');
		$('#onUndockResult').html('');
		wycaApi.Undock(function(data) { $('#UndockReturn').html(JSON.stringify(data)); });
    });
	$('#RecoveryFromFiducial').click(function(e) {
		e.preventDefault();
		$('#RecoveryFromFiducialReturn').html('');
		$('#onRecoveryFromFiducialFeedback').html('');
		$('#onRecoveryFromFiducialResult').html('');
		wycaApi.RecoveryFromFiducial(function(data) { $('#RecoveryFromFiducialReturn').html(JSON.stringify(data)); });
    });
	$('#MappingStart').click(function(e) {
		e.preventDefault();
		$('#MappingStartReturn').html('');
		$('#onMappingStartFeedback').html('');
		$('#onMappingStartResult').html('');
		wycaApi.MappingStart(function(data) { $('#MappingStartReturn').html(JSON.stringify(data)); });
    });
	$('#NavigationStart').click(function(e) {
		e.preventDefault();
		init_from_mapping = false;
		$('#NavigationStartReturn').html('');
		$('#onNavigationStartFeedback').html('');
		$('#onNavigationStartResult').html('');
		if ($('#NavigationStart_init_from_mapping').val() == 'true')
			init_from_mapping = true;
			
        wycaApi.NavigationStart(init_from_mapping, function(data) { $('#NavigationStartReturn').html(JSON.stringify(data)); });
	});
});
</script>
