<?php 
$notCloseSession = 1;

require_once ('../../config/initSite.php');
require_once ('./config/config.php');

$_SESSION['is_robot'] = 1;
session_write_close();

//IF MODE DEV 

// 

$_CONFIG['URL_ROOT'] = $server_request_scheme.'://wyca.run/';
$_CONFIG['URL'] = $server_request_scheme.'://wyca.run/robot_hmi/elodie_v1/';
$_CONFIG['URL_API'] = $server_request_scheme.'://wyca.run/API/';

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
    <script src="<?php echo $_CONFIG['URL_API'];?>webrtc.wyca2.min.js"></script>
    <script src="<?php echo $_CONFIG['URL_API'];?>wyca_socket_api.js"></script>
    
    <script src="<?php echo $_CONFIG['URL'];?>js/bootstrap.js"></script>
    
    <script>
	var nbDockAttemptMax = 3;
	var delayBeforeRetryDock = 30000;
	var robot_host = '<?php echo (file_exists('C:\\'))?'10.0.0.72:9095':'wyca.run:9095';?>';
	var api_key = '<?php echo (file_exists('C:\\'))?"5LGU.LaYMMncJaA0i42HwsX9ZX-RCNgj-9V17ROFXt71st":"4tEV6A6Bd8mVQtgHjUj85fGwYeJbsYkChHSRGP21HxaAIE";?>';
	</script>
    
    <script src="<?php echo $_CONFIG['URL'];?>js/robot.js?v=202012141414"></script>

</head>

<body>

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
    <a href="#" id="bHideBouton" style="position:absolute; bottom:0px; right:0px; width:150px; height:150px;"></a>
	
    <div id="modalAskCode" class="modal fade" tabindex="-1" role="dialog" data-backdrop="static" data-keyboard="false">
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
    
    <div id="modalAdmin" class="modal fade" tabindex="-1" role="dialog" data-backdrop="static" data-keyboard="false">
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
