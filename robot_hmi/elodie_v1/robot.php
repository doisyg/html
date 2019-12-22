<?php 
require_once ('../../config/initSite.php');
require_once ('./config/config.php');

if ($_SERVER['REMOTE_ADDR'] == '127.0.0.1' || substr($_SERVER['REMOTE_ADDR'], 0, 7) == '192.168')
{
	$_CONFIG['URL_ROOT'] = 'https://traxdev.wyca-solutions.com/';
	$_CONFIG['URL'] = 'https://traxdev.wyca-solutions.com/robot_hmi/trax_V1/';
	$_CONFIG['URL_API'] = 'https://traxdev.wyca-solutions.com/API/';
}
else
{
	$_CONFIG['URL_ROOT'] = 'https://trax.wyca-solutions.com/';
	$_CONFIG['URL'] = 'https://trax.wyca-solutions.com/robot_hmi/trax_V1/';
	$_CONFIG['URL_API'] = 'https://trax.wyca-solutions.com/API/';
}

if (!isset($_GET['id_robot']) || !isset($_GET['code'])) die('Parameters error');

$id_robot = (int)$_GET['id_robot'];
$robot = new Robot($id_robot);
if ($robot->id_robot == -1 || $robot->code != $_GET['code']) die('Parameters error');

$plans = Plan::GetPlansFromRobot($robot->id_robot);

?><!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>Wyca - Robot interface</title>

	<link href="<?php echo $_CONFIG['URL'];?>css/bootstrap.css" rel="stylesheet">
    <link href="<?php echo $_CONFIG['URL'];?>css/bootstrap-switch.min.css" rel="stylesheet">
	<link href='https://fonts.googleapis.com/css?family=Montserrat%3A400%2C700&#038;subset=latin&#038;ver=1455269554' type='text/css' media='all' rel='stylesheet' id='anaglyph-google-fonts-anaglyph_config-css' />
	<link href="<?php echo $_CONFIG['URL'];?>css/font-awesome.min.css" rel="stylesheet">
	<link href="<?php echo $_CONFIG['URL'];?>css/map.css?v=20191127_2" rel="stylesheet">
	<link href="<?php echo $_CONFIG['URL'];?>css/robot.css?v=20191128" rel="stylesheet">


	
	<link href="<?php echo $_CONFIG['URL_API'];?>css/map_wyca.css" rel="stylesheet">
    <script src="<?php echo $_CONFIG['URL_API'];?>extern/jquery-1.11.3.min.js"></script>
	<script src="<?php echo $_CONFIG['URL_API'];?>extern/roslib.js"></script>
    <script src="<?php echo $_CONFIG['URL_API'];?>webrtc.wyca2.min.js"></script>
    <script src="<?php echo $_CONFIG['URL_API'];?>wyca_api.latest.min.php?api_key=5LGU.LaYMMncJaA0i42HwsX9ZX-RCNgj-9V17ROFXt71st&v=<?php echo date('YmdHis');?>"></script>
    
    <script src="<?php echo $_CONFIG['URL'];?>js/bootstrap.js"></script>
    
    <script>
	var id_robot = <?php echo $id_robot;?>;
	var check_r = '<?php echo $_GET['code'];?>';
	var nbDockAttemptMax = <?php echo ($robot->nb_attempt_to_dock <0)?3:$robot->nb_attempt_to_dock;?>;
	var delayBeforeRetryDock = <?php echo ($robot->delay_before_new_attempt <0)?30:$robot->delay_before_new_attempt;?>000;
	</script>
    
    <script src="<?php echo $_CONFIG['URL'];?>js/pages.js?v=<?php echo date('YmdHis');?>"></script>
    <script src="<?php echo $_CONFIG['URL'];?>js/robot.js?v=<?php echo date('YmdHis');?>"></script>
    
	<script src="<?php echo $_CONFIG['URL'];?>js/pilotage/gamepad.js"></script>
    <script src="<?php echo $_CONFIG['URL'];?>js/pilotage/tester.js"></script>
    <script src="<?php echo $_CONFIG['URL'];?>js/joystick.js?v=<?php echo date('YmdHis');?>"></script>

</head>

<body>

	<div style="position:absolute; top:0; left:0; width:100%; padding:50px;">
    	<img src="images/trax.png" width="200" style="float:left" />
    	<img src="images/wyca-robotics.png" style="float:right;" />
    </div>
    
    <div id="logo" style="position:absolute; top:150px; left:0; width:100%; padding:50px;"><img src="<?php echo $_CONFIG['URL'];?>images/logo.png" /></div>

    <div id="mCallInProgress" class="full-screen popup">
        <div class="notvisible"></div>
        <div class="message">
            <div><?php echo __('Call in progress');?></div>
            <i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i>
        </div>
    </div>
    <div id="mConexionLost" class="full-screen popup">
        <div class="notvisible"></div>
        <div class="message">
            <div><?php echo __('Connexion lost, wait for reconnexion');?></div>
            <i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i>
        </div>
    </div>
    <div id="mClossingSession" class="full-screen popup">
        <div class="notvisible"></div>
        <div class="message">
            <div><?php echo __('Closing the session');?></div>
            <i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i>
        </div>
    </div>
    
    <div id="home" class="full-screen page" style="display:block;">
           
        <div id="erreur" style="display:none;">
            Message d'erreur
        </div>
        
        
        <ul id="list_actions" class="list_actions">
        </ul>
        
        <a href="#" id="bRefreshJob" class="btn btn-primary"><i class="fa fa-refresh"></i></a>
        
        <a href="#" id="bBack" class="bBack btn btn-primary"><i class="fa fa-chevron-left"></i><?php echo __('Recovery');?></a>
                
        <div id="safety_stop_fond" class="safety_stop"></div>
        <div id="safety_stop" class="safety_stop">
        	<?php echo __('E-Stop button pressed');?>
        </div>
    </div>
    
    <div id="job_execution" class="full-screen page">
           
        <div class="erreur" style="display:none;">
            Message d'erreur
        </div>
        
        
        <h1 id="messageJobExecution" style="margin-bottom:50px;"></h1>
                
        <a href="#" id="bPauseJob" class="btn btn-primary big"><i class="fa fa-pause"></i><?php echo __('Pause');?></a></li>
        
        <a href="#" id="bResumeJob" class="btn btn-primary big"><i class="fa fa-play"></i><?php echo __('Resume');?></a></li>
        <a href="#" id="bStopJob" class="btn btn-primary big"><i class="fa fa-stop"></i><?php echo __('Stop');?></a></li>
        
        <div id="safety_stop_fond" class="safety_stop"></div>
        <div id="safety_stop" class="safety_stop">
        	<?php echo __('E-Stop button pressed');?>
        </div>
    </div>
    
    <div id="actions" class="full-screen page">
           
        <div class="erreur" style="display:none;">
            Message d'erreur
        </div>
        
        
        <a href="#" id="bGotoJobs" class="btn btn-primary big"><i class="fa fa-chemin"></i><?php echo __('Jobs');?></a></li>        
        <a href="#" id="bGotoDock" class="btn btn-primary big"><i class="fa fa-download"></i><?php echo __('Go to dock station');?></a></li>
        <a href="#" id="bGotoRecovery" class="btn btn-primary big"><i class="fa fa-heartbeat"></i><?php echo __('Recovery');?></a></li>
        
        
        <div class="bStopDiv"><a href="#" class="bStop"><?php echo __('STOP');?></a></div>
        
        <div id="safety_stop_fond" class="safety_stop"></div>
        <div id="safety_stop" class="safety_stop">
        	<?php echo __('E-Stop button pressed');?>
        </div>
    </div>
    
    <div id="gotodock_execution" class="full-screen page">
           
        <div class="erreur" style="display:none;">
            Message d'erreur
        </div>
        
        <h1 style="margin-bottom:50px;">Going to dock station</h1>
                
        <a href="#" id="bPauseGotoDock" class="btn btn-primary big"><i class="fa fa-pause"></i><?php echo __('Pause');?></a></li>
        <a href="#" id="bResumeGotoDock" class="btn btn-primary big"><i class="fa fa-play"></i><?php echo __('Resume');?></a></li>
        <a href="#" id="bStopGotoDock" class="btn btn-primary big"><i class="fa fa-stop"></i><?php echo __('Stop');?></a></li>
        
        <div id="safety_stop_fond" class="safety_stop"></div>
        <div id="safety_stop" class="safety_stop">
        	<?php echo __('E-Stop button pressed');?>
        </div>
    </div>
    
    <div id="recovery" class="full-screen page">
           
        <div class="erreur" style="display:none;">
            Message d'erreur
        </div>
        
        
        <a href="#" id="bDock" class="btn btn-primary big"><i class="fa fa-download"></i><?php echo __('Dock');?></a></li> 
        <a href="#" id="bUndock" class="btn btn-primary big"><i class="fa fa-upload"></i><?php echo __('Undock');?></a></li>        
        <a href="#" id="bGotoFollowMe" class="btn btn-primary big"><i class="fa fa-user"></i><?php echo __('Follow me');?></a></li>
        <a href="#" id="bGotoJoystick" class="btn btn-primary big"><i class="fa fa-gamepad"></i><?php echo __('Joystick');?></a></li>
        
        <div class="bStopDiv"><a href="#" class="bStop"><?php echo __('STOP');?></a></div>
        
        <a href="#" class="btn btn-primary bBack bBackToActions"><i class="fa fa-chevron-left"></i><?php echo __('Back');?></a>
        
        <div id="safety_stop_fond" class="safety_stop"></div>
        <div id="safety_stop" class="safety_stop">
        	<?php echo __('E-Stop button pressed');?>
        </div>
    </div>
    
    <div id="joystick" class="full-screen page">
           
        <div class="erreur" style="display:none;">
            <?php echo __('You must disabled the joystick');?>
        </div>
        
        <div class="" style="font-size:40px;">
        	<?php echo __('Enable joystick');?><br /><br />
        	<a href="#" id="bToggleJosytick"><i class="ico_jotick fa fa-toggle-off" style="font-size:100px;"></i></a>
            
            <div style="clear:both; height:150px;"></div>
            
            <div id="joystickDiv" draggable="false">
                <div class="fond"></div>
                <div class="curseur"></div>
            </div>
            
            <div style="clear:both;"></div>
            
        </div>
        
        <a href="#" class="btn btn-primary bBack bBackToRecovery"><i class="fa fa-chevron-left"></i><?php echo __('Back');?></a>
        
        <div id="safety_stop_fond" class="safety_stop"></div>
        <div id="safety_stop" class="safety_stop">
        	<?php echo __('E-Stop button pressed');?>
        </div>
    </div>
    
    <div id="followme" class="full-screen page">
           
        <div class="erreur" style="display:none;">
            Message d'erreur
        </div>
        
        
        <div id="divVideoFollow" style="position:relative; margin:auto; display:inline-block;">
            <video id="video_follow" autoplay ></video>
        </div>
        <p><?php echo __('Cliquez sur le rond de la personne à suivre sur la vidéo');?></p>
        
        <div class="container" id="erreurFollow" style="display:none;">
            <div class="title alert alert-warning" style="position:relative;">
            <?php echo __('Nous ne vous voyons plus, merci de revenir devant le robot');?><br />
            </div>
        </div>
        
        <ul class="list_actions ifDocked" style="margin-top:10px;">
            <li id="bouton_undockFollow"><a href="#" class="btn btn-primary big"><i class="fa fa-upload"></i><?php echo __('Undock');?></a></li>
        </ul>
        
        <ul class="list_actions ifNotDocked" style="margin-top:10px;">
            <li id="bouton_gaucheFollow"><a href="#" class="btn btn-primary big"><i class="fa fa-rotate-right"></i></a></li>
            <li id="bouton_startFollow"><a href="#" class="btn btn-primary big"><i style="color:#00CC66;" class="fa fa-user"></i><?php echo __('Start').'<br />'.__('Follow me');?></a></li>
            <li id="bouton_stopFollow" style="display:none;"><a href="#" class="btn btn-primary big"><i style="color:#CC0000;" class="fa fa-user"></i><?php echo __('Stop').'<br />'.__('Follow me');?></a></li>
            <li id="bouton_droiteFollow"><a href="#" class="btn btn-primary big"><i class="fa fa-rotate-left"></i></a></li>
        </ul>

                    
        <a href="#" class="btn btn-primary bBack bBackToRecovery"><i class="fa fa-chevron-left"></i><?php echo __('Back');?></a>
        
        <div id="safety_stop_fond" class="safety_stop"></div>
        <div id="safety_stop" class="safety_stop">
        	<?php echo __('E-Stop button pressed');?>
        </div>
    </div>
    
    <span id="connection" class=""><i class="fa fa-exchange fa-rotate-90"></i></span>
	<span id="battery" class="battery-ko blinking"><i class="fa fa-battery-0" aria-hidden="true"></i></span>
    
    
	<div id="modalConfirm" class="modal fade" tabindex="-1" role="dialog" data-backdrop="static">
    	<div class="modal-dialog" role="dialog" style="width:650px;">
        	<div class="modal-content">
                <div class="modal-header">
                    <h3 style="margin-bottom:30px;"><?php echo __('Confirm');?></h3>
                    
                    
                    <?php include('map.php');?>
                    
                    
                    <button class="btn btn-default btn-lg" data-dismiss="modal" aria-hidden="true"><?php echo __('No');?></button>
                    <button id="bConfirm" data-action_index="" class="btn btn-primary btn-lg" data-dismiss="modal" aria-hidden="true"><?php echo __('Yes');?></button>
                </div>
            </div>
        </div>
    </div>
    
    <div id="popupCode" class="popupModal">
        <div class="flex">
            <div style="max-width:290px; margin:auto; margin-top:300px">
                <span id="ConfigCodeError" class="text-muted text-center" style="color:#F00; display:none;">
                    <?php echo __('Invalid code');?>
                </span>
                
                <p id="code_aff" class="text-muted text-center" style="font-size:36px;">&nbsp;</p>
                
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
                <button class="btn btn-lg btn-primary btn-block" id="cancelCode"><?php echo __('Cancel');?></button>
                
                <div style="display:none;"><video id="video_front" autoplay="" muted="" style="width:100%"></video></div>
            </div>
        </div>
    </div>
    
    <div id="popupBlocked" class="popupModal">
        <div class="flex">
            <div style=" margin:auto; margin-top:300px;">
                <p><?php echo __('ERROR');?></p>
                <p><?php echo __('Blocked interface');?></p>
                <p><?php echo __('Unlock in');?> <span id="tempsRestantAff"></span> <?php echo __('minute');?><span id="tempsRestantAffS">s</span></p>
            </div>
        </div>
    </div>
    
    <div id="popupRemoteControl" class="popupModal">
	    <div class="flex">
            <div style=" margin:auto; margin-top:300px;">
            	<h1><?php echo __('REMOTE');?><br /><?php echo __('CONTROL');?></h1>
            </div>
    	</div>	
    </div>
    
    
    <div id="popupDocking" class="popupModal">
	    <div class="flex">
            <div style=" margin:auto; margin-top:300px;">
            	<h1><?php echo __('DOCKING');?></h1>
                <div class="bStopDiv"><a href="#" class="bStop"><?php echo __('STOP');?></a></div>
            </div>
    	</div>	
    </div>
    
    
    <div id="popupUndocking" class="popupModal">
	    <div class="flex">
            <div style=" margin:auto; margin-top:300px;">
            	<h1><?php echo __('UNDOCKING');?></h1>
            </div>
    	</div>	
    </div>
    
    <div style="display:none"><canvas id="canvas" style="width:720px; height:406px;"></canvas></div>
    
    <a id="bHidenConfig" style="position:absolute; bottom:0; right:0; width:40px; height:40px; display:block; background:none; border:0;" data-toggle="modal" data-target="#ConfigLogin"></a>
    
    <div class="modal fade" id="ConfigLogin" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title" id="myModalLabel"><?php echo __('Enter maintenance code');?></h4>
          </div>
          <div class="modal-body">
            <div>
                <div style="max-width:290px; margin:auto;">
                    <input type="hidden" name="todo" value="connexion" />
                    <span id="ConfigLoginError" class="text-muted text-center" style="color:#F00; display:none;">
                        <?php echo __('Code invalide');?>
                    </span>
                    
                    <p id="code_affAdminCode" class="text-muted text-center" style="font-size:36px;">&nbsp;
                      
                    </p>
                    <input type="hidden" name="code_secret" id="code_secret" value="">
                    
                    
                    <div id="clavierAdminCode">
                        
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
                
                    <button class="btn btn-lg btn-primary btn-block" id="connexionCodeAdminCode" type="submit"><?php echo __('Connexion');?></button>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="modal fade" id="AdminConfig" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title" id="myModalLabel"><?php echo __('Administration');?></h4>
          </div>
          <div class="modal-body">
            <div>
                <div id="contentAdminConfig">
                    
                    
                     
                </div>
                <div id="logs_wyca">
                    <form method="post" id="formSaveLog">
                        <input type="hidden" name="saveLog" value="1" />
                        <input type="hidden" name="id_robot" value="<?php echo $id_robot;?>" />
                        <input type="hidden" name="c" value="<?php echo $robot->code;?>" />
                        
                        <input type="hidden" name="battery_state" id="log_battery_state" value="" />
                        <div class="row">
                            <div class="col-md-3">battery_state</div>
                            <div class="col-md-9" id="view_battery_state"></div>
                        </div>
                        <input type="hidden" name="battery_voltage" id="log_battery_voltage" value="" />
                        <div class="row">
                            <div class="col-md-3">battery_voltage</div>
                            <div class="col-md-9" id="view_battery_voltage"></div>
                        </div>
                        <input type="hidden" name="is_main_battery_charging" id="log_is_main_battery_charging" value="" />
                        <div class="row">
                            <div class="col-md-3">is_main_battery_charging</div>
                            <div class="col-md-9" id="view_is_main_battery_charging"></div>
                        </div>
                        <input type="hidden" name="is_dock_station_power_source" id="log_is_dock_station_power_source" value="" />
                        <div class="row">
                            <div class="col-md-3">is_dock_station_power_source</div>
                            <div class="col-md-9" id="view_is_dock_station_power_source"></div>
                        </div>
                        <input type="hidden" name="is_docked" id="log_is_docked" value="" />
                        <div class="row">
                            <div class="col-md-3">is_docked</div>
                            <div class="col-md-9" id="view_is_docked"></div>
                        </div>
                        <input type="hidden" name="robot_state" id="log_robot_state" value="" />
                        <div class="row">
                            <div class="col-md-3">robot_state</div>
                            <div class="col-md-9" id="view_robot_state"></div>
                        </div>
                        <input type="hidden" name="robot_pose" id="log_robot_pose" value="" />
                        <div class="row">
                            <div class="col-md-3">robot_pose</div>
                            <div class="col-md-9" id="view_robot_pose"></div>
                        </div>
                        <input type="hidden" name="current_goal" id="log_current_goal" value="" />
                        <div class="row">
                            <div class="col-md-3">current_goal</div>
                            <div class="col-md-9" id="view_current_goal"></div>
                        </div>
                        <input type="hidden" name="safety_data" id="log_safety_data" value="" />
                        <div class="row">
                            <div class="col-md-3">safety_data</div>
                            <div class="col-md-9" id="view_safety_data"></div>
                        </div>
                    </form>
                    <a href="https://127.0.0.1:<?php echo $robot->port_cam;?>/" target="_blank">Check certificat</a>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <audio id="player_beep" src="images/beep.mp3"></audio>

</body>
</html>

<?php include('map_js.php');?>