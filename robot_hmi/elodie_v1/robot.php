<?php 
$notCloseSession = 1;

require_once ('../../config/initSite.php');
require_once ('./config/config.php');

$_SESSION['is_robot'] = 1;
session_write_close();

$_CONFIG['URL_ROOT'] = 'https://elodie.wyca-solutions.com/';
$_CONFIG['URL'] = 'https://elodie.wyca-solutions.com/robot_hmi/elodie_v1/';
$_CONFIG['URL_API'] = 'https://elodie.wyca-solutions.com/API/';

?><!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>Wyca - Robot interface</title>

	<link href="<?php echo $_CONFIG['URL'];?>css/bootstrap.css" rel="stylesheet">
    <link href="<?php echo $_CONFIG['URL'];?>css/bootstrap-switch.min.css" rel="stylesheet">
	<link href='https://fonts.googleapis.com/css?family=Montserrat%3A400%2C700&#038;subset=latin&#038;ver=1455269554' type='text/css' media='all' rel='stylesheet' id='anaglyph-google-fonts-anaglyph_config-css' />
	<link href="<?php echo $_CONFIG['URL'];?>css/font-awesome.min.css" rel="stylesheet">
	<link href="<?php echo $_CONFIG['URL'];?>css/robot.css?v=20191128" rel="stylesheet">
	
	<link href="<?php echo $_CONFIG['URL_API'];?>css/map_wyca.css" rel="stylesheet">
    <script src="<?php echo $_CONFIG['URL_API'];?>extern/jquery-1.11.3.min.js"></script>
	<script src="<?php echo $_CONFIG['URL_API'];?>extern/roslib.js"></script>
    <script src="<?php echo $_CONFIG['URL_API'];?>webrtc.wyca2.min.js"></script>
    <script src="<?php echo $_CONFIG['URL_API'];?>wyca_api.latest.min.php?api_key=5LGU.LaYMMncJaA0i42HwsX9ZX-RCNgj-9V17ROFXt71st&v=<?php echo date('YmdHis');?>"></script>
    
    <script src="<?php echo $_CONFIG['URL'];?>js/bootstrap.js"></script>
    
    <script>
	var nbDockAttemptMax = 3;
	var delayBeforeRetryDock = 30000;
	</script>
    
    <script src="<?php echo $_CONFIG['URL'];?>js/robot.js?v=<?php echo date('YmdHis');?>"></script>

</head>

<body>

	<span id="connection" class=""><i class="fa fa-exchange fa-rotate-90"></i></span>
	<span id="battery" class="battery-ko blinking"><i class="fa fa-battery-0" aria-hidden="true"></i></span>
    	
    
    <div id="logo" style="margin-top:300px; width:100%; padding:50px; margin-bottom:100px;"><img src="images/wyca-robotics.png" width="1500" /></div>
    
    <div id="waitClick" style="font-size:68px; position:fixed; top:0; left:0; width:100%; height:100vh; background-color:rgba(255,255,255,0.5);">
    	<a id="bNextWaitClick" href="#" class="btn btn-primary" style="font-size:100px; text-align:center; margin-top:32vh; border-radius:50px; padding:100px;"><i style="" class="fa fa-forward"></i> Next step</a>
    </div>
    <div id="waitTime" style="font-size:68px; display:none; ">Wait <em></em> seconde<span class="plutiel">s</span></div>
	
</body>
</html>
