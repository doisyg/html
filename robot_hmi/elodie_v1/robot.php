<?php 
$sim = isset($_GET['simu'])?true:false;
$notCloseSession = 1;

require_once ('../../config/initSite.php');
require_once ('./config/config.php');

$_SESSION['is_robot'] = 1;
session_write_close();

// Check if http or https
if ( (! empty($_SERVER['REQUEST_SCHEME']) && $_SERVER['REQUEST_SCHEME'] == 'https') ||
	 (! empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] == 'on') ||
	 (! empty($_SERVER['SERVER_PORT']) && $_SERVER['SERVER_PORT'] == '443') ) {
	$server_request_scheme = 'https';
} else {
	$server_request_scheme = 'http';
}

/*
if($sim){

	$_CONFIG['ROBOT_HOST'] = '';
	$_CONFIG['ROBOT_HTTP'] = $server_request_scheme;
	$_CONFIG['ROBOT_HTTP'] .= '://';

	$_CONFIG['ROBOT_HOST'] = '10.0.0.72:';
	$_CONFIG['ROBOT_HOST'] .= $server_request_scheme == 'http' ? '9094' : '9095';

	$_CONFIG['ROBOT_HTTP'] .= $_CONFIG['ROBOT_HOST'];

}
*/

$_CONFIG['URL_ROOT'] = $server_request_scheme.'://wyca.run/';
$_CONFIG['URL'] = $server_request_scheme.'://wyca.run/robot_hmi/elodie_v1/';
$_CONFIG['URL_API'] = $server_request_scheme.'://wyca.run/API/';

?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml"  <?=$sim?'style="font-size:14px;"':'' ?>>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>Wyca - Robot interface</title>
	
	<link rel="shortcut icon" href="<?php echo $_CONFIG['URL'];?>images/favicon/favicon.ico" type="image/x-icon">
	<link rel="icon" href="<?php echo $_CONFIG['URL'];?>images/favicon/favicon.png" type="image/png">
	<link rel="icon" sizes="32x32" href="<?php echo $_CONFIG['URL'];?>images/favicon/favicon-32.png" type="image/png">
	<link rel="icon" sizes="64x64" href="<?php echo $_CONFIG['URL'];?>images/favicon/favicon-64.png" type="image/png">
	<link rel="icon" sizes="96x96" href="<?php echo $_CONFIG['URL'];?>images/favicon/favicon-96.png" type="image/png">
	<link rel="icon" sizes="196x196" href="<?php echo $_CONFIG['URL'];?>images/favicon/favicon-196.png" type="image/png">
	<link rel="apple-touch-icon" sizes="152x152" href="<?php echo $_CONFIG['URL'];?>images/favicon/apple-touch-icon.png">
	<link rel="apple-touch-icon" sizes="60x60" href="<?php echo $_CONFIG['URL'];?>images/favicon/apple-touch-icon-60x60.png">
	<link rel="apple-touch-icon" sizes="76x76" href="<?php echo $_CONFIG['URL'];?>images/favicon/apple-touch-icon-76x76.png">
	<link rel="apple-touch-icon" sizes="114x114" href="<?php echo $_CONFIG['URL'];?>images/favicon/apple-touch-icon-114x114.png">
	<link rel="apple-touch-icon" sizes="120x120" href="<?php echo $_CONFIG['URL'];?>images/favicon/apple-touch-icon-120x120.png">
	<link rel="apple-touch-icon" sizes="144x144" href="<?php echo $_CONFIG['URL'];?>images/favicon/apple-touch-icon-144x144.png">
	<meta name="msapplication-TileImage" content="<?php echo $_CONFIG['URL'];?>images/favicon/favicon-144.png">
	<meta name="msapplication-TileColor" content="#FFFFFF"> 
		
	<script>
		var nbDockAttemptMax = 3;
		var delayBeforeRetryDock = 30000;
		var api_key = '<?php echo (file_exists('C:\\'))?"5LGU.LaYMMncJaA0i42HwsX9ZX-RCNgj-9V17ROFXt71st":"4tEV6A6Bd8mVQtgHjUj85fGwYeJbsYkChHSRGP21HxaAIE";?>';
		var robot_host = '<?php echo $_CONFIG["ROBOT_HOST"]?>';
		var robot_http = '<?php echo $_CONFIG["ROBOT_HTTP"]?>';
		var use_ssl = <?php echo $server_request_scheme == 'http'?'false':'true';?>;
		var app_url = '<?php echo $server_request_scheme;?>://wyca.run';
		var is_simu = <?php echo $sim?'true':'false' ?>;
	</script>
	
	<link href="<?php echo $_CONFIG['URL'];?>css/bootstrap.css" rel="stylesheet">
	<link href="<?php echo $_CONFIG['URL'];?>css/bootstrap-switch.min.css" rel="stylesheet">
	<link href='https://fonts.googleapis.com/css?family=Montserrat%3A400%2C700&#038;subset=latin&#038;ver=1455269554' type='text/css' media='all' rel='stylesheet' id='anaglyph-google-fonts-anaglyph_config-css' />
	<link href="<?php echo $_CONFIG['URL'];?>css/font-awesome.min.css" rel="stylesheet">
	<link href="<?php echo $_CONFIG['URL'];?>css/robot.css?v=<?= $version ?>" rel="stylesheet">
	<link href="<?php echo $_CONFIG['URL_API'];?>css/map_wyca.css?v=<?= $version ?>" rel="stylesheet">
	
	<script src="<?php echo $_CONFIG['URL_API'];?>wyca_socket_api.js?v=<?= $version ?>"></script>
	<script src="<?php echo $_CONFIG['URL_API'];?>extern/jquery-1.11.3.min.js"></script>
	<script src="<?php echo $_CONFIG['URL_API'];?>webrtc.wyca2.min.js?v=<?= $version ?>"></script>
	
	<?php if($sim) : ?>
		<link rel="stylesheet" href="<?php echo $_CONFIG['URL'];?>css/sim_bootstrap.css" />
		<link rel="stylesheet" href="<?php echo $_CONFIG['URL'];?>css/sim_font_awesome.css" />
		<link rel="stylesheet" href="<?php echo $_CONFIG['URL'];?>css/sim_style.css?v=<?= $version ?>" />
		
		<script src="<?php echo $_CONFIG['URL'];?>js/sim_jquery.js"></script>
		<script src="<?php echo $_CONFIG['URL'];?>js/sim_bootstrap.js"></script>
		
		<script src="<?php echo $_CONFIG['URL'];?>js/sim_anim_led.js?v=<?= $version ?>"></script>
		<script src="<?php echo $_CONFIG['URL'];?>js/sim_led.js?v=<?= $version ?>"></script>
		<script src="<?php echo $_CONFIG['URL'];?>js/sim_map_svg.js?v=<?= $version ?>"></script>
	<?php 
	else:
	?>
	<script src="<?php echo $_CONFIG['URL'];?>js/bootstrap.js"></script>
    <?php
	endif; ?>
	
	<script src="<?php echo $_CONFIG['URL'];?>js/robot.js?v=<?= $version ?>"></script>
</head>

<body>
<div id="HMI_elodie" style="<?= $sim?'display:none':'' ?>">
	<span id="connection" class=""><i class="fa fa-exchange fa-rotate-90"></i></span>
	<span id="icoBattery" class="battery-ko blinking"><i class="fa fa-battery-0" aria-hidden="true"></i></span>
    	
    <div id="current_action" style="margin-top:200px; font-size:60px; text-align:center; min-height:85px;"></div>
    
    <div id="logo" style="margin-top:100px; width:100%; padding:50px; margin-bottom:100px;"><img src="images/wyca-robotics.png" width="1500" /></div>
    
    <div id="waitClick" style="font-size:68px; position:fixed; display:none; top:0; left:0; width:100%; height:100vh; background-color:rgba(255,255,255,0.5);">
    	<a id="bNextWaitClick" href="#" class="btn btn-primary" style="font-size:100px; text-align:center; margin-top:32vh; border-radius:50px; padding:100px;"><i style="" class="fa fa-forward"></i> <?= __('Next step') ?></a>
    </div>
    <div style="display:none;">
	    <div id="waitTime" style="font-size:68px; display:none; "><?= __('Wait') ?> <em></em><?= __('seconde') ?><span class="pluriel">s</span></div>
    </div>
    
</div>

<div id="HMI_simu" class="position-relative" style="<?= !$sim?'display:none':'' ?>">
	<div class="row m-0">
		<div class="col-xl-10 offset-xl-1 col-12 text-center">
			<div class="title_logo d-inline-flex flex-column" style="padding-top: 40vh;padding-bottom: 40vh;">
				<img src="<?php echo $_CONFIG['URL'];?>images/sim_logo.jpg" style="max-height: 175px;" class="img-fluid">
				<h1 class="text-right my-2">Simulation</h1>
				<h4 class="text-right m-0">Site - <span id="site_name"></span></h4>
			</div>
		</div>
		
	</div>
	<div class="row m-0 vh-100 p-3" id="dashboard">
		<div class="col-lg-9 col-12 h-100">
			<div class="w-100 h-100 d-flex justify-content-center align-items-center" id="map">
				<div class="d-flex position-relative">
					<svg id="map_svg" class="position-relative" width="0" height="0" style="display:none;">
						<image id="map_image" xlink:href="" x="0" y="0" height="0" width="0" />
					</svg>
					<div class="flex-centered tActionInProgess blinking_soft" id="tActionInProgess" style="display:none;"><i class="fas fa-map-marker-alt fa-2x"></i></div>
					<span id="tRobotNotLocalised" class="tRobotNotLocalised" style="display:none;"><i class="fas fa-exclamation-triangle"></i>The robot is not localized</span>
					
				</div>
				
				<div id="loader_map">
					<div class="loader-container">
						<div class="dot dot-1"></div>
						<div class="dot dot-2"></div>
						<div class="dot dot-3"></div>
					</div>

					<svg xmlns="http://www.w3.org/2000/svg" version="1.1">
						<defs>
							<filter id="goo">
								<feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
								<feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 21 -7"/>
							</filter>
						</defs>
					</svg>
				</div>
				
			</div>
		</div>
		<div class="col-lg-3 col-12 h-100 d-flex flex-column" style="justify-content:space-between;">
			<img src="<?php echo $_CONFIG['URL'];?>images/sim_logo.jpg" class="img-fluid my-3 my-lg-0 mx-auto" style="max-height:150px">
			
			<div class="flex-centered py-5 my-3 my-lg-0" id="battery_widget">
				<i class="fas fa-battery-full fa-5x mr-4"></i>
				<h2 class="m-0"><span id="battery_lvl">-</span> %</h2>
				<h1 class="position-absolute">Battery</h1>
			</div>
			<div class="d-flex justify-content-around align-items-center py-5  my-3 my-lg-0" id="docking_state_widget">
				<div class="d-flex justify-content-center align-items-center docking_state flex-column" id="docked">
					<i class="fas fa-charging-station fa-3x"></i>
					<p>docked</p>
				</div>
				<div class="d-flex justify-content-center align-items-center docking_state flex-column" id="docking">
					<i class="fas fa-download fa-3x"></i>
					<p>docking</p>
				</div>
				<div class="d-flex justify-content-center align-items-center docking_state flex-column" id="undocking">
					<i class="fas fa-upload fa-3x"></i>
					<p>undocking</p>
				</div>
				<div class="d-flex justify-content-center align-items-center docking_state flex-column" id="undocked">
					<i class="fas fa-route fa-3x"></i>
					<p>undocked</p>
				</div>
				<h1>Docking State</h1>
			</div>
			<div class="flex-centered py-5 my-3 my-lg-0" id="leds_widget" style="min-height:300px">
				<div class="LED_wrapper position-relative flex-centered" id="LED_wrapper">
					<img id="eloLED" src="<?php echo $_CONFIG['URL'];?>images/elo_LED.png" style="max-width: 200px;" class="position-relative img-fluid" >
				</div>
				<h1>LEDs</h1>
			</div>
		</div>
	</div>
	<span id="tVersion" class="tVersion">v = <span class="font-weight-bold"><?= $version ?></span>
</div>

<a href="#" id="bHideBouton" style="position:fixed; bottom:0px; right:0px; width:150px; height:150px;"></a>

<div id="modalAskCode" class="modal" tabindex="-1" role="dialog" data-backdrop="static" data-keyboard="false">
    <div class="modal-dialog" role="dialog">
        <div class="modal-content">
            <div class="modal-header">
            
                <div class="flex">
                    <div style="max-width:500px; margin:auto; margin-top:50px">
                        <span id="ConfigCodeError" class="text-muted text-center" style="color:#F00; display:none;font-size:50px;">
                            <?php echo __('Invalid code');?>
                        </span>
                        
                        <p id="code_aff" class="text-muted text-center" style="font-size:50px;">&nbsp;</p>
                        
                        <div id="clavier_code">
                            
                            <div class="touche btn btn-lg btn-primary btn-block">1</div>
                            <div class="touche btn btn-lg btn-primary btn-block">2</div>
                            <div class="touche btn btn-lg btn-primary btn-block">3</div>
                            <div class="touche btn btn-lg btn-primary btn-block">4</div>
                            <div class="touche btn btn-lg btn-primary btn-block">5</div>
                            <div class="touche btn btn-lg btn-primary btn-block">6</div>
                            <div class="touche btn btn-lg btn-primary btn-block">7</div>
                            <div class="touche btn btn-lg btn-primary btn-block">8</div>
                            <div class="touche btn btn-lg btn-primary btn-block">9</div>
                            <div class="touche"></div>
                            <div class="touche btn btn-lg btn-primary btn-block">0</div>
                            <div class="touche btn btn-lg btn-primary btn-block backspace"><i class="fa fa-step-backward"></i></div>
                            <div style="clear:both;"></div>        
                        </div>
                    
                        <button class="btn btn-lg btn-primary btn-block" id="connexionCode" disabled="disabled"><?php echo __('Unlock');?></button>
                        <button class="btn btn-lg btn-primary btn-block" id="cancelCode" data-dismiss="modal"><?php echo __('Cancel');?></button>
                        
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<div id="modalAdmin" class="modal" tabindex="-1" role="dialog" data-backdrop="static" data-keyboard="false">
    <div class="modal-dialog" role="dialog">
        <div class="modal-content">
            <div class="modal-header">
            
                <div class="flex">
                    <div style="max-width:500px; margin:auto; margin-top:50px">
                        
                        <div class="col-md-6"><a href="#" class="btn btn-lg btn-primary" id="bRestartWindows" style="margin:10px; font-size:24px;"><?= __('Restart in') ?><br /><?= __('windows mode') ?></a></div>
                        <div class="col-md-6"><a href="#" class="btn btn-lg btn-primary" id="bRestartKiosk" style="margin:10px; font-size:24px;"><?= __('Restart in') ?><br /><?= __('kiosk mode') ?></a></div>
                        
                        <a href="#" class="btn btn-lg btn-default" style="margin:10px; font-size:50px; margin-top:50px;" data-dismiss="modal"><?php echo __('Close');?></a>
                        
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

</body>
</html>
