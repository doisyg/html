<?php 
require_once ('../../config/initSite.php');
if (!isset($_SESSION["id_developer"])) { header("location:../login.php"); }

$sectionMenu = "api_documentation";

$messages = array();
$messages['sensor_msgs/Joy'] = 'header           /* timestamp in the header is the time the data is received from the joystick */
{
	seq		/* uint32 */
	stamp		/* time */
	frame_id 	/* string */
}
float32[] axes          /* the axes measurements from a joystick */
int32[] buttons         /* the buttons measurements from a joystick */';
$messages['keylo_api/arrived'] = 'arrived			/* bool */
name_position		/* string */';
$messages['keylo_api/arrived_poi'] = 'arrived			/* bool */
poi_name		/* string */';
$messages['keylo_api/arrived_box'] = 'arrived			/* bool */
box_name		/* string */';
$messages['geometry_msgs/PoseStamped'] = 'header
{
	seq		/* uint32 */
	stamp		/* time */
	frame_id 	/* string */
}
pose
{
	position		/* This contains the position of a point in free space */
	{
		x			/* float64 */
		y			/* float64 */
		z			/* float64 */
	}
	orientation	 	/* This represents an orientation in free space in quaternion form. */
	{
		x			/* float64 */
		y			/* float64 */
		z			/* float64 */
		w			/* float64 */
	}
}';
$messages['geometry_msgs/Pose2D'] = 'x			/* float64 */
y			/* float64 */
z			/* float64 */';
$messages['keylo_api/SafetyData'] = 'is_safety_stop_logical		/* bool, If the logical emergency stop of the motors is activated */
is_safety_stop_button		/* bool, If the emergency stop button is pushed */
is_safety_stop_ir		/* bool, If the ir void sensor trigered a stop of the motors */';
$messages['keylo_arduino/AnimLedObject'] = 'anim			/* uint8, id de l\'animation désiré */
R			/* uint8, Niveau de rouge de la couleur */
G			/* uint8, Niveau de vert de la couleur */
B			/* uint8, Niveau de bleu de la couleur */
vitesseGauche		/* uint8, Niveau de bleu de la couleur */
vitesseDroite		/* uint8, Niveau de bleu de la couleur */';
$messages['keylo_arduino/SensorsObject'] = 'temperature	/* float32, Temperature Celcuis */
pressure	/* float32, Pressure Pa*/
altitude	/* float32, Altitude meter */';
$messages['keylo_sterela/SafetyData'] = 'is_safety_stop_logical		/* bool */ 
is_safety_stop_button		/* bool */ 
is_safety_stop_ir		/* bool */ ';
$messages['roboclaw_node/Wheels_speeds'] = 'wheel1		/* float32 */
wheel2		/* float32 */';

$currentPage = 'reference';
include (dirname(__FILE__).'/../template/header.php');
?>
<div class="row">

	<?php
	$topics = $userConnected->GetApiTopics();
	$services = $userConnected->GetApiServices();
	$actions = $userConnected->GetApiActions();
	
	$groupes = array();
	
	$topicsParGroupe = array();
	foreach($topics as $topic)
	{
		$groupes[$topic->groupe] = 1;
		if (!isset($topicsParGroupe[$topic->groupe])) $topicsParGroupe[$topic->groupe] = array();
		$topicsParGroupe[$topic->groupe][] = $topic;
	}
	
	$servicesParGroupe = array();
	foreach($services as $service)
	{
		$groupes[$service->groupe] = 1;
		if (!isset($servicesParGroupe[$service->groupe])) $servicesParGroupe[$service->groupe] = array();
		$servicesParGroupe[$service->groupe][] = $service;
	}
	
	$actionsParGroupe = array();
	foreach($actions as $action)
	{
		$groupes[$action->groupe] = 1;
		if (!isset($actionsParGroupe[$action->groupe])) $actionsParGroupe[$action->groupe] = array();
		$actionsParGroupe[$action->groupe][] = $action;
	}
	
	ksort($groupes);
	
	?>

<?php include (dirname(__FILE__).'/template/colonne_gauche.php');?>

<div class="col-md-12">
<div class="row call-panel">
<div class="panel-content">

<h1 id="robot">Robot</h1>

    <p>This API allow you to access to the functionnality of your robot.</p>

	<h2>Connexion</h2>
	<h3>Events</h3>
    
    	<div class="panel panel-default">
            <div class="panel-heading" id="robot_events_onRobotConnexionOpen">onRobotConnexionOpen</div>
            <div class="panel-body">
            <table class="table-striped table-bordered table" style="width:auto;">
                <tbody>
                    <tr>
                        <th>Message type</th>
                        <td>Bool</td>
                    </tr>
                </tbody>
            </table>
            </div>
        </div>
        
        
        <div class="panel panel-default">
            <div class="panel-heading" id="robot_events_onRobotConnexionError">onRobotConnexionError</div>
            <div class="panel-body">
            <table class="table-striped table-bordered table" style="width:auto;">
                <tbody>
                    <tr>
                        <th>Message type</th>
                        <td>Bool</td>
                    </tr>
                </tbody>
            </table>
            </div>
        </div>
        
        
        <div class="panel panel-default">
            <div class="panel-heading" id="robot_events_onRobotConnexionClose">onRobotConnexionClose</div>
            <div class="panel-body">
            <table class="table-striped table-bordered table" style="width:auto;">
                <tbody>
                    <tr>
                        <th>Message type</th>
                        <td>Bool</td>
                    </tr>
                </tbody>
            </table>
            </div>
        </div>
        
    <?php
	foreach($groupes as $groupe => $t)
	{
		if ($groupe == 'Leds') continue;
		?>
        <h2 id="robot_group_<?php echo $groupe;?>"><?php echo $groupe;?></h2>
        
        <?php
		if (isset($topicsParGroupe[$groupe]) && count($topicsParGroupe[$groupe]) > 0)
		{
			?>
            <h3>Events</h3>
            <?php
            foreach($topicsParGroupe[$groupe] as $topic)
            {
                if ($topic->event_name != '')
                {
                    ?>
                    <div class="panel panel-default">
                      <div class="panel-heading" id="robot_events_<?php echo $topic->event_name;?>"><?php echo $topic->event_name;?></div>
                      <div class="panel-body">
                        <table class="table-striped table-bordered table" style="width:auto;">
                            <tbody>
                                <tr>
                                    <th>Message type</th>
                                    <td><!--<pre class=""><code class="language-js">-->
                                        <?php echo isset($messages[$topic->messageType])?'<pre class=""><code class="language-js">'.$messages[$topic->messageType].'</code></pre>':str_replace('std_msgs/', '', $topic->messageType);?>
                                    <!--</code></pre>-->
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                      </div>
                    </div>
                    <?php
                }
            }
		}
		?>
        
        <?php
		if (isset($actionsParGroupe[$groupe]) && count($actionsParGroupe[$groupe]) > 0)
		{
			if (isset($topicsParGroupe[$groupe]) && count($topicsParGroupe[$groupe]) > 0) {}
			else
			{
			?>
            <h3>Events</h3>
			<?php
			}
			?>
			<?php
            foreach($actionsParGroupe[$groupe] as $action)
            {
                if ($action->function_name != '')
                {
                    // On récupère les params d'entrée
                    $params = $action->GetParams();
                    $entrees = array();
                    ?>
                    <div class="panel panel-default">
                      <div class="panel-heading" id="robot_events_on<?php echo $action->function_name;?>Feedback">on<?php echo $action->function_name;?>Feedback</div>
                      <div class="panel-body">
                        <table class="table-striped table-bordered table" style="width:auto;">
                            <tbody>
                                <tr>
                                    <th>Message type</th>
                                    <td><pre class=""><code class="language-js"><?php
										foreach($params['feedback'] as $param)
										{
										echo $param['nom'].'		/* type : '.$param['type'].', '.trim($param['description'], "\r\n").' */
									';
										}?></code></pre>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                      </div>
                    </div>
                    <div class="panel panel-default">
                      <div class="panel-heading" id="robot_events_on<?php echo $action->function_name;?>Result">on<?php echo $action->function_name;?>Result</div>
                      <div class="panel-body">
                        <table class="table-striped table-bordered table" style="width:auto;">
                            <tbody>
                                <tr>
                                    <th>Message type</th>
                                    <td><pre class=""><code class="language-js"><?php
										foreach($params['sortie'] as $param)
										{
										echo $param['nom'].'		/* type : '.$param['type'].', '.trim($param['description'], "\r\n").' */
									';
										}?></code></pre>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                      </div>
                    </div>
                    <?php
                }
            }
		}
		?>
        
        <?php
		if (isset($servicesParGroupe[$groupe]) && count($servicesParGroupe[$groupe]) > 0)
		{
			?>
            <h3>Functions</h3>
			<?php
            foreach($servicesParGroupe[$groupe] as $service)
            {
                if ($service->function_name != '')
                {
                    // On récupère les params d'entrée
                    $params = $service->GetParams();
                    $entrees = array();
                    ?>
                    <div class="panel panel-default">
                      <div class="panel-heading" id="robot_events_<?php echo $service->function_name;?>"><?php echo $service->function_name;?></div>
                      <div class="panel-body">
                        <table class="table-striped table-bordered table" style="width:auto;">
                            <tbody>
                                <tr>
                                    <th>Parameters</th>
                                    <td><pre class=""><code class="language-js"><?php
    foreach($params['entree'] as $param)
    {
    echo $param['nom'].'	/* type : '.$param['type'].', '.trim($param['description'], "\r\n").' */
    ';
    }?>function_return /* function called at the end of action */</code></pre></td>
                                </tr>
                                <tr>
                                    <th>Return</th>
                                    <td><pre class=""><code class="language-js">Object
    {
    <?php
    foreach($params['sortie'] as $param)
    {
    echo '	'.$param['nom'].'		/* type : '.$param['type'].', '.trim($param['description'], "\r\n").' */
    ';
    }?>
    }</code></pre>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                      </div>
                    </div>
                    <?php
                }
            }
		}
		?>
        
        <?php
		if (isset($actionsParGroupe[$groupe]) && count($actionsParGroupe[$groupe]) > 0)
		{
			if (isset($servicesParGroupe[$groupe]) && count($servicesParGroupe[$groupe]) > 0) {}
			else
			{
			?>
            <h3>Functions</h3>
			<?php
			}
			?>
			<?php
            foreach($actionsParGroupe[$groupe] as $action)
            {
                if ($action->function_name != '')
                {
                    // On récupère les params d'entrée
                    $params = $action->GetParams();
                    $entrees = array();
                    ?>
                    <div class="panel panel-default">
                      <div class="panel-heading" id="robot_events_<?php echo $action->function_name;?>"><?php echo $action->function_name;?></div>
                      <div class="panel-body">
                        <table class="table-striped table-bordered table" style="width:auto;">
                            <tbody>
                                <tr>
                                    <th>Parameters</th>
                                    <td><pre class=""><code class="language-js"><?php
    foreach($params['entree'] as $param)
    {
    echo $param['nom'].'	/* type : '.$param['type'].', '.trim($param['description'], "\r\n").' */
    ';
    }?></code></pre></td>
                                </tr>
                            </tbody>
                        </table>
                      </div>
                    </div>
                    <?php
                }
            }
		}
	}
    
    ?>
    	
    	
        
        <h1 id="messaging">Messaging</h1>

    <p>This API allow you to exchange message between mutiple page connexted to the same robot with API.</p>

	<h2 id="messaging_events">Events</h2>
    
    <div class="panel panel-default">
        <div class="panel-heading" id="robot_events_onRobotConnexionError">onNewMessage</div>
        <div class="panel-body">
        <table class="table-striped table-bordered table" style="width:auto;">
            <tbody>
                <tr>
                    <th>Message type</th>
                    <td>string</td>
                </tr>
            </tbody>
        </table>
        </div>
    </div>	
    
    <div class="panel panel-default">
        <div class="panel-heading" id="robot_events_onRobotConnexionError">onNewWebRTCMessage</div>
        <div class="panel-body">
        <table class="table-striped table-bordered table" style="width:auto;">
            <tbody>
                <tr>
                    <th>Message type</th>
                    <td>string</td>
                </tr>
            </tbody>
        </table>
        </div>
    </div>	
		
	<h2 id="messaging_functions">Functions</h2>
    
    <div class="panel panel-default">
      <div class="panel-heading" id="message_functions_SendMessage">SendMessage</div>
      <div class="panel-body">
        <table class="table-striped table-bordered table" style="width:auto;">
            <tbody>
                <tr>
                    <th>Parameters</th>
                    <td><pre class=""><code class="language-js">recipient	/* name of the page recipient of the message : <a href="https://stephane.wyca-solutions.com/developers/documentation/messaging.php#events">'message_to'</a> value of the other page.  */
message		/* message to send */</code></pre></td>
                </tr>
            </tbody>
        </table>
      </div>
    </div>
    
    <div class="panel panel-default">
      <div class="panel-heading" id="message_functions_SendMessage">SendWebRTCMessage</div>
      <div class="panel-body">
        <table class="table-striped table-bordered table" style="width:auto;">
            <tbody>
                <tr>
                    <th>Parameters</th>
                    <td><pre class=""><code class="language-js">message		/* message to send */</code></pre></td>
                </tr>
            </tbody>
        </table>
      </div>
    </div>
    
    

<h1 id="leds">LEDs</h1>
	<p>This API allow you to customized LEDs on robot.</p>

	
	<h2 id="leds_params">Params</h2>
    
    	<div class="panel panel-default">
          <div class="panel-heading" id="leds_params_ROBOT_STATE">Robot state</div>
          <div class="panel-body">
        	<table class="table-striped table-bordered table" style="width:auto;">
            	<tbody>
                    <tr>
                    	<th>1 - ROBOT_STATE_SAFETY</th>
                        <td>When safety error are detected.</td>
                    </tr>
                    <tr>
                    	<th>2 - ROBOT_STATE_MOVE</th>
                        <td>When robot move.</td>
                    </tr>
                    <tr>
                    	<th>3 - ROBOT_STATE_CHARGING</th>
                        <td>When robot charging.</td>
                    </tr>
                	<tr>
                    	<th>4 - ROBOT_STATE_STOPPED</th>
                        <td>When robot are not docking and not in move.</td>
                    </tr>
                    <tr>
                    	<th>5 - ROBOT_STATE_MANUAL</th>
                        <td>When animation led is in manual mode.</td>
                    </tr>
                    <tr>
                    	<th>6 - ROBOT_STATE_LIGHT</th>
                        <td>When animation led is in light mode.</td>
                    </tr>
                </tbody>
            </table>
          </div>
        </div>
        
    	<style>
		.led { display:inline-block; margin:0 5px; width:20px; height:20px; border-radius:20pc; background-color:transparent; border:1px solid #CCC;}
		.led.active { background-color:#00CC33; }
		</style>
        
        <script>
		$(document).ready(function(e) {
         	setTimeout(AnimLed, 500);
         	setTimeout(AnimLedRapide, 200);
			
			AnimLight();
        });
		
		function AnimLed()
		{
			AnimProgress();
			AnimProgressCenter();
			AnimK2000();
			AnimClignote();
			AnimClignote2();
			AnimMove();
			
			setTimeout(AnimLed, 500);
		}
		function AnimLedRapide()
		{
			AnimPolice();
			
			setTimeout(AnimLedRapide, 200);
		}
		
		var nbLed = 10;
		
		var indexProgress = -1;
		function AnimProgress()
		{
			indexProgress++;
			$('#LED_ANIM_PROGRESS .led').removeClass('active');
			for (i=0; i<= indexProgress; i++)
			{
				$('#LED_ANIM_PROGRESS .led_g_'+i).addClass('active');				
				$('#LED_ANIM_PROGRESS .led_d_'+i).addClass('active');				
			}
			if (indexProgress >= nbLed) indexProgress = -1;
		}
		var indexProgressCenter = -1;
		function AnimProgressCenter()
		{
			indexProgressCenter++;
			$('#LED_ANIM_PROGRESS_CENTER .led').removeClass('active');
			for (i=0; i<= indexProgressCenter; i++)
			{
				$('#LED_ANIM_PROGRESS_CENTER .led_g_'+(5+i)).addClass('active');				
				$('#LED_ANIM_PROGRESS_CENTER .led_g_'+(5-i)).addClass('active');
				$('#LED_ANIM_PROGRESS_CENTER .led_d_'+(5+i)).addClass('active');				
				$('#LED_ANIM_PROGRESS_CENTER .led_d_'+(5-i)).addClass('active');			
			}
			if (indexProgressCenter >= nbLed / 2) indexProgressCenter = -1;
		}
		var indexK2000 = -1;
		var indexK20001 = indexK2000-1;
		var indexK20002 = indexK2000-2;
		var indexK20003 = indexK2000-3;
		var sensK2000 = 0;
		var sensK20001 = 0;
		var sensK20002 = 0;
		var sensK20003 = 0;
		function AnimK2000()
		{
			if (sensK2000 == 0) indexK2000++; else indexK2000--;
			if (sensK20001 == 0) indexK20001++; else indexK20001--;
			if (sensK20002 == 0) indexK20002++; else indexK20002--;
			if (sensK20003 == 0) indexK20003++; else indexK20003--;
			
			if (indexK2000 == nbLed) sensK2000=1;
			if (indexK20001 == nbLed) sensK20001=1;
			if (indexK20002 == nbLed) sensK20002=1;
			if (indexK20003 == nbLed) sensK20003=1;
			if (indexK2000 == -1) sensK2000=0;
			if (indexK20001 == -1) sensK20001=0;
			if (indexK20002 == -1) sensK20002=0;
			if (indexK20003 == -1) sensK20003=0;
			
			$('#LED_ANIM_K2000 .led').removeClass('active');
			$('#LED_ANIM_K2000 .led').css('opacity', '1');	
			
			$('#LED_ANIM_K2000 .led_g_'+(indexK2000)).addClass('active');	
			$('#LED_ANIM_K2000 .led_g_'+(indexK2000)).css('opacity', '1');
			$('#LED_ANIM_K2000 .led_g_'+(indexK20001)).addClass('active');	
			$('#LED_ANIM_K2000 .led_g_'+(indexK20001)).css('opacity', '0.75');				
			$('#LED_ANIM_K2000 .led_g_'+(indexK20002)).addClass('active');	
			$('#LED_ANIM_K2000 .led_g_'+(indexK20002)).css('opacity', '0.5');				
			$('#LED_ANIM_K2000 .led_g_'+(indexK20003)).addClass('active');	
			$('#LED_ANIM_K2000 .led_g_'+(indexK20003)).css('opacity', '0.25');	
			
			
			$('#LED_ANIM_K2000 .led_d_'+(indexK2000)).addClass('active');	
			$('#LED_ANIM_K2000 .led_d_'+(indexK2000)).css('opacity', '1');
			$('#LED_ANIM_K2000 .led_d_'+(indexK20001)).addClass('active');	
			$('#LED_ANIM_K2000 .led_d_'+(indexK20001)).css('opacity', '0.75');				
			$('#LED_ANIM_K2000 .led_d_'+(indexK20002)).addClass('active');	
			$('#LED_ANIM_K2000 .led_d_'+(indexK20002)).css('opacity', '0.5');				
			$('#LED_ANIM_K2000 .led_d_'+(indexK20003)).addClass('active');	
			$('#LED_ANIM_K2000 .led_d_'+(indexK20003)).css('opacity', '0.25');				
				
			if (indexK2000 >= nbLed) indexK2000 = -1;
		}
		var indexClignote = 0;
		function AnimClignote()
		{
			indexClignote++;
			$('#LED_ANIM_CLIGNOTE .led').removeClass('active');
			if (indexClignote%2 == 0)
			{
				for (i=0; i<= nbLed; i++)
				{
					$('#LED_ANIM_CLIGNOTE .led_g_'+i).addClass('active');				
					$('#LED_ANIM_CLIGNOTE .led_d_'+i).addClass('active');				
				}
			}
		}
		var indexClignote2 = 0;
		function AnimClignote2()
		{
			indexClignote2++;
			$('#LED_ANIM_CLIGNOTE_2 .led').removeClass('active');
			if (indexClignote2%2 == 0)
			{
				$('#LED_ANIM_CLIGNOTE_2 .led_g_1').addClass('active');				
				$('#LED_ANIM_CLIGNOTE_2 .led_g_2').addClass('active');
				$('#LED_ANIM_CLIGNOTE_2 .led_g_5').addClass('active');				
				$('#LED_ANIM_CLIGNOTE_2 .led_g_6').addClass('active');
				$('#LED_ANIM_CLIGNOTE_2 .led_g_9').addClass('active');				
				$('#LED_ANIM_CLIGNOTE_2 .led_g_10').addClass('active');
				
				$('#LED_ANIM_CLIGNOTE_2 .led_d_1').addClass('active');				
				$('#LED_ANIM_CLIGNOTE_2 .led_d_2').addClass('active');
				$('#LED_ANIM_CLIGNOTE_2 .led_d_5').addClass('active');				
				$('#LED_ANIM_CLIGNOTE_2 .led_d_6').addClass('active');
				$('#LED_ANIM_CLIGNOTE_2 .led_d_9').addClass('active');				
				$('#LED_ANIM_CLIGNOTE_2 .led_d_10').addClass('active');

			}
			else
			{
				for (i=0; i<= nbLed; i++)
				{
					$('#LED_ANIM_CLIGNOTE_2 .led_g_0').addClass('active');
					$('#LED_ANIM_CLIGNOTE_2 .led_g_3').addClass('active');				
					$('#LED_ANIM_CLIGNOTE_2 .led_g_4').addClass('active');
					$('#LED_ANIM_CLIGNOTE_2 .led_g_7').addClass('active');				
					$('#LED_ANIM_CLIGNOTE_2 .led_g_8').addClass('active');
					
					$('#LED_ANIM_CLIGNOTE_2 .led_d_1').addClass('active');				
					$('#LED_ANIM_CLIGNOTE_2 .led_d_2').addClass('active');
					$('#LED_ANIM_CLIGNOTE_2 .led_d_5').addClass('active');				
					$('#LED_ANIM_CLIGNOTE_2 .led_d_6').addClass('active');
					$('#LED_ANIM_CLIGNOTE_2 .led_d_9').addClass('active');				
					$('#LED_ANIM_CLIGNOTE_2 .led_d_10').addClass('active');
				}
			}
		}
		
		function AnimLight()
		{
			$('#LED_ANIM_LIGHT .led').removeClass('active');
			for (i=0; i<= nbLed; i++)
			{
				$('#LED_ANIM_LIGHT .led_g_'+i).addClass('active');				
				$('#LED_ANIM_LIGHT .led_d_'+i).addClass('active');				
			}
		}
		
		var indexPolice1 = 0;
		var indexPolice2 = 0;
		var centre = 5;
		var fin  = 10;
		var debut = 0;
		function AnimPolice()
		{
			$('#LED_ANIM_POLICE .led').removeClass('active');
			$('#LED_ANIM_POLICE .led').css( "backgroundColor", "transparent" );
	
			if (indexPolice2 < 5)
			{
				if (indexPolice1 == 0 || indexPolice1 == 2)
				{
					for (i = centre + 3; i <= fin; i++)
					{
						$('#LED_ANIM_POLICE .led_g_'+i).addClass('active');
						$('#LED_ANIM_POLICE .led_g_'+i).css( "backgroundColor", "blue" );
						$('#LED_ANIM_POLICE .led_d_'+i).addClass('active');
						$('#LED_ANIM_POLICE .led_d_'+i).css( "backgroundColor", "blue" );
					}
					for (i = centre - 2; i <= centre + 2; i++)
					{
						$('#LED_ANIM_POLICE .led_g_'+i).addClass('active');
						$('#LED_ANIM_POLICE .led_g_'+i).css( "backgroundColor", "#666666" );
						$('#LED_ANIM_POLICE .led_d_'+i).addClass('active');
						$('#LED_ANIM_POLICE .led_d_'+i).css( "backgroundColor", "#666666" );
					}
				}
				if (indexPolice1 == 4 || indexPolice1 == 6)
				{
					for (i = debut; i <= centre - 3; i++)
					{
						$('#LED_ANIM_POLICE .led_g_'+i).addClass('active');
						$('#LED_ANIM_POLICE .led_g_'+i).css( "backgroundColor", "red" );
						$('#LED_ANIM_POLICE .led_d_'+i).addClass('active');
						$('#LED_ANIM_POLICE .led_d_'+i).css( "backgroundColor", "red" );
					}
					for (i = centre - 2; i <= centre + 2; i++)
					{
						$('#LED_ANIM_POLICE .led_g_'+i).addClass('active');
						$('#LED_ANIM_POLICE .led_g_'+i).css( "backgroundColor", "#666666" );
						$('#LED_ANIM_POLICE .led_d_'+i).addClass('active');
						$('#LED_ANIM_POLICE .led_d_'+i).css( "backgroundColor", "#666666" );
					}
				}
			}
			else if (indexPolice2 < 10)
			{
				if (indexPolice1 == 0)
				{
					for (i = centre + 10; i <= fin; i++)
					{
						$('#LED_ANIM_POLICE .led_g_'+i).addClass('active');
						$('#LED_ANIM_POLICE .led_g_'+i).css( "backgroundColor", "blue" );
						$('#LED_ANIM_POLICE .led_d_'+i).addClass('active');
						$('#LED_ANIM_POLICE .led_d_'+i).css( "backgroundColor", "blue" );
					}
					for (i = debut; i <= centre - 10; i++)
					{
						$('#LED_ANIM_POLICE .led_g_'+i).addClass('active');
						$('#LED_ANIM_POLICE .led_g_'+i).css( "backgroundColor", "red" );
						$('#LED_ANIM_POLICE .led_d_'+i).addClass('active');
						$('#LED_ANIM_POLICE .led_d_'+i).css( "backgroundColor", "red" );
					}
				}
				if (indexPolice1 == 2 || indexPolice1 == 4)
				{
					for (i = centre - 10; i <= centre - 3; i++)
					{
						$('#LED_ANIM_POLICE .led_g_'+i).addClass('active');
						$('#LED_ANIM_POLICE .led_g_'+i).css( "backgroundColor", "red" );
						$('#LED_ANIM_POLICE .led_d_'+i).addClass('active');
						$('#LED_ANIM_POLICE .led_d_'+i).css( "backgroundColor", "red" );
					}
					for (i = centre + 3; i <= centre + 10; i++)
					{
						$('#LED_ANIM_POLICE .led_g_'+i).addClass('active');
						$('#LED_ANIM_POLICE .led_g_'+i).css( "backgroundColor", "blue" );
						$('#LED_ANIM_POLICE .led_d_'+i).addClass('active');
						$('#LED_ANIM_POLICE .led_d_'+i).css( "backgroundColor", "blue" );
					}
					for (i = centre - 2; i <= centre + 2; i++)
					{
						$('#LED_ANIM_POLICE .led_g_'+i).addClass('active');
						$('#LED_ANIM_POLICE .led_g_'+i).css( "backgroundColor", "#666666" );
						$('#LED_ANIM_POLICE .led_d_'+i).addClass('active');
						$('#LED_ANIM_POLICE .led_d_'+i).css( "backgroundColor", "#666666" );
					}
				}
			}
			else
			{
				if (indexPolice1 == 0 || indexPolice1 == 2)
				{
					for (i = centre + 10; i <= fin; i++)
					{
						$('#LED_ANIM_POLICE .led_g_'+i).addClass('active');
						$('#LED_ANIM_POLICE .led_g_'+i).css( "backgroundColor", "blue" );
						$('#LED_ANIM_POLICE .led_d_'+i).addClass('active');
						$('#LED_ANIM_POLICE .led_d_'+i).css( "backgroundColor", "blue" );
					}
				}
				if (indexPolice1 == 4 || indexPolice1 == 6)
				{
					for (i = centre - 10; i <= centre - 3; i++)
					{
						$('#LED_ANIM_POLICE .led_g_'+i).addClass('active');
						$('#LED_ANIM_POLICE .led_g_'+i).css( "backgroundColor", "red" );
						$('#LED_ANIM_POLICE .led_d_'+i).addClass('active');
						$('#LED_ANIM_POLICE .led_d_'+i).css( "backgroundColor", "red" );
					}
					for (i = centre + 3; i <= centre + 10; i++)
					{
						$('#LED_ANIM_POLICE .led_g_'+i).addClass('active');
						$('#LED_ANIM_POLICE .led_g_'+i).css( "backgroundColor", "red" );
						$('#LED_ANIM_POLICE .led_d_'+i).addClass('active');
						$('#LED_ANIM_POLICE .led_d_'+i).css( "backgroundColor", "red" );
					}
					for (i = centre - 2; i <= centre + 2; i++)
					{
						$('#LED_ANIM_POLICE .led_g_'+i).addClass('active');
						$('#LED_ANIM_POLICE .led_g_'+i).css( "backgroundColor", "#666666" );
						$('#LED_ANIM_POLICE .led_d_'+i).addClass('active');
						$('#LED_ANIM_POLICE .led_d_'+i).css( "backgroundColor", "#666666" );
					}
				}
				if (indexPolice1 == 8 || indexPolice1 == 10)
				{
					for (i = debut; i <= centre - 10; i++)
					{
						$('#LED_ANIM_POLICE .led_g_'+i).addClass('active');
						$('#LED_ANIM_POLICE .led_g_'+i).css( "backgroundColor", "red" );
						$('#LED_ANIM_POLICE .led_d_'+i).addClass('active');
						$('#LED_ANIM_POLICE .led_d_'+i).css( "backgroundColor", "red" );
					}
				}
			}
	
			indexPolice1++;
			if (indexPolice2 < 5)
			{
				if (indexPolice1 > 8)
				{
					indexPolice1 = 0;
					indexPolice2++;
				}
			}
			else if (indexPolice2 < 10)
			{
				if (indexPolice1 > 6)
				{
					indexPolice1 = 0;
					indexPolice2++;
				}
			}
			else
			{
				if (indexPolice1 > 10)
				{
					indexPolice1 = 0;
					indexPolice2++;
					if (indexPolice2 >= 15) indexPolice2 = 0;
				}
			}
	
		}
		
		var indexMove = -1;
		function AnimMove()
		{
			indexMove++;
			$('#LED_ANIM_MOVE .led').removeClass('active');
			$('#LED_ANIM_K2000 .led').css('opacity', '1');	

			$('#LED_ANIM_MOVE .led_g_'+indexMove).addClass('active');				
			$('#LED_ANIM_MOVE .led_d_'+indexMove).addClass('active');
			$('#LED_ANIM_MOVE .led_g_'+(indexMove)).css('opacity', '0.3');				
			$('#LED_ANIM_MOVE .led_d_'+(indexMove)).css('opacity', '0.3');
			$('#LED_ANIM_MOVE .led_g_'+(indexMove+1)).addClass('active');				
			$('#LED_ANIM_MOVE .led_d_'+(indexMove+1)).addClass('active');
			$('#LED_ANIM_MOVE .led_g_'+(indexMove+1)).css('opacity', '0.6');				
			$('#LED_ANIM_MOVE .led_d_'+(indexMove+1)).css('opacity', '0.6');					
			$('#LED_ANIM_MOVE .led_g_'+(indexMove+2)).addClass('active');				
			$('#LED_ANIM_MOVE .led_d_'+(indexMove+2)).addClass('active');				
			$('#LED_ANIM_MOVE .led_g_'+(indexMove+2)).css('opacity', '1');				
			$('#LED_ANIM_MOVE .led_d_'+(indexMove+2)).css('opacity', '1');
			
			
			$('#LED_ANIM_MOVE .led_g_'+(indexMove+6)).addClass('active');				
			$('#LED_ANIM_MOVE .led_d_'+(indexMove+6)).addClass('active');	
			$('#LED_ANIM_MOVE .led_g_'+(indexMove+6)).css('opacity', '0.3');				
			$('#LED_ANIM_MOVE .led_d_'+(indexMove+6)).css('opacity', '0.3');			
			$('#LED_ANIM_MOVE .led_g_'+(indexMove+7)).addClass('active');				
			$('#LED_ANIM_MOVE .led_d_'+(indexMove+7)).addClass('active');
			$('#LED_ANIM_MOVE .led_g_'+(indexMove+7)).css('opacity', '0.6');				
			$('#LED_ANIM_MOVE .led_d_'+(indexMove+7)).css('opacity', '0.6');					
			$('#LED_ANIM_MOVE .led_g_'+(indexMove+8)).addClass('active');				
			$('#LED_ANIM_MOVE .led_d_'+(indexMove+8)).addClass('active');			
			$('#LED_ANIM_MOVE .led_g_'+(indexMove+8)).css('opacity', '1');				
			$('#LED_ANIM_MOVE .led_d_'+(indexMove+8)).css('opacity', '1');					

			if (indexMove >= 3) indexMove = -1;
		}
		</script>
    
    	<div class="panel panel-default">
          <div class="panel-heading" id="leds_params_LED_ANIM">LEDs animation</div>
          <div class="panel-body">
        	<table class="table-striped table-bordered table" style="width:auto;">
            	<thead>
                	<tr>
                    	<th></th>
                        <th>Left</th>
                        <th>Right</th>
                    </tr>
                </thead>
            	<tbody>
                	<tr id="LED_ANIM_PROGRESS">
                    	<th>1 - LED_ANIM_PROGRESS</th>
                        <td>
                        <?php for ($i=10; $i>=0; $i--){?><span class="led led_g_<?php echo $i;?>"></span><?php }?>
                        </td>
                        <td>
                        <?php for ($i=0; $i<11; $i++){?><span class="led led_d_<?php echo $i;?>"></span><?php }?>
                        </td>
                    </tr>
                    <tr id="LED_ANIM_PROGRESS_CENTER">
                    	<th>2 - LED_ANIM_PROGRESS_CENTER</th>
                        <td><?php for ($i=10; $i>=0; $i--){?><span class="led led_g_<?php echo $i;?>"></span><?php }?></td>
                        <td><?php for ($i=0; $i<11; $i++){?><span class="led led_d_<?php echo $i;?>"></span><?php }?></td>
                    </tr>
                    <tr id="LED_ANIM_RAINBOW">
                    	<th>3 - LED_ANIM_RAINBOW</th>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr id="LED_ANIM_K2000">
                    	<th>4 - LED_ANIM_K2000</th>
                        <td><?php for ($i=10; $i>=0; $i--){?><span class="led led_g_<?php echo $i;?>"></span><?php }?></td>
                        <td><?php for ($i=0; $i<11; $i++){?><span class="led led_d_<?php echo $i;?>"></span><?php }?></td>
                    </tr>
                    <tr id="LED_ANIM_CLIGNOTE">
                    	<th>5 - LED_ANIM_CLIGNOTE</th>
                        <td><?php for ($i=10; $i>=0; $i--){?><span class="led led_g_<?php echo $i;?>"></span><?php }?></td>
                        <td><?php for ($i=0; $i<11; $i++){?><span class="led led_d_<?php echo $i;?>"></span><?php }?></td>
                    </tr>
                    <tr id="LED_ANIM_CLIGNOTE_2">
                    	<th>6 - LED_ANIM_CLIGNOTE_2</th>
                        <td><?php for ($i=10; $i>=0; $i--){?><span class="led led_g_<?php echo $i;?>"></span><?php }?></td>
                        <td><?php for ($i=0; $i<11; $i++){?><span class="led led_d_<?php echo $i;?>"></span><?php }?></td>
                    </tr>
                    <tr id="LED_ANIM_POLICE">
                    	<th>7 - LED_ANIM_POLICE</th>
                        <td><?php for ($i=10; $i>=0; $i--){?><span class="led led_g_<?php echo $i;?>"></span><?php }?></td>
                        <td><?php for ($i=0; $i<11; $i++){?><span class="led led_d_<?php echo $i;?>"></span><?php }?></td>
                    </tr>
                    <tr>
                    	<th>8 - LED_ANIM_FONDU</th>
                        <td></td>
                    </tr>
                    <tr id="LED_ANIM_MOVE">
                    	<th>9 - LED_ANIM_MOVE</th>
                        <td><?php for ($i=10; $i>=0; $i--){?><span class="led led_g_<?php echo $i;?>"></span><?php }?></td>
                        <td><?php for ($i=0; $i<11; $i++){?><span class="led led_d_<?php echo $i;?>"></span><?php }?></td>
                    </tr>
                    <tr id="LED_ANIM_LIGHT">
                    	<th>10 - LED_ANIM_LIGHT</th>
                        <td><?php for ($i=10; $i>=0; $i--){?><span class="led led_g_<?php echo $i;?>"></span><?php }?></td>
                        <td><?php for ($i=0; $i<11; $i++){?><span class="led led_d_<?php echo $i;?>"></span><?php }?></td>
                    </tr>
                </tbody>
            </table>
          </div>
        </div>   
        
        <div class="panel panel-default">
          <div class="panel-heading" id="leds_params_ROBOT_STATE">Default values</div>
          <div class="panel-body">
        	<table class="table-striped table-bordered table" style="width:auto;">
            	<thead>
                	<tr>
                    	<th>Robot state</th>
                    	<th>LEDs animation</th>
                        <th>Color</th>
                </thead>
            	<tbody>
                    <tr>
                    	<td>1 - ROBOT_STATE_SAFETY</td>
                        <td>5 - LED_ANIM_CLIGNOTE</td>
                        <td><span style="min-width:60px; display:inline-block;">R : 204</span><span style="min-width:60px; display:inline-block;">V : 0</span><span style="min-width:60px; display:inline-block;">B : 0</span></td>
                    </tr>
                    <tr>
                    	<td>2 - ROBOT_STATE_MOVE</td>
                        <td>9 - LED_ANIM_MOVE</td>
                        <td><span style="min-width:60px; display:inline-block;">R : 0</span><span style="min-width:60px; display:inline-block;">V : 0</span><span style="min-width:60px; display:inline-block;">B : 255</span></td>
                    </tr>
                    <tr>
                    	<td>3 - ROBOT_STATE_CHARGING</td>
                        <td>2 - LED_ANIM_PROGRESS_CENTER</td>
                        <td><span style="min-width:60px; display:inline-block;">R : 0</span><span style="min-width:60px; display:inline-block;">V : 215</span><span style="min-width:60px; display:inline-block;">B : 0</span></td>
                    </tr>
                	<tr>
                    	<td>4 - ROBOT_STATE_STOPPED</td>
                        <td>4 - LED_ANIM_K2000</td>
                        <td><span style="min-width:60px; display:inline-block;">R : 0</span><span style="min-width:60px; display:inline-block;">V : 0</span><span style="min-width:60px; display:inline-block;">B : 255</span></td>
                    </tr>
                    <tr>
                    	<td>5 - ROBOT_STATE_MANUAL</td>
                        <td>4 - LED_ANIM_K2000</td>
                        <td><span style="min-width:60px; display:inline-block;">R : 0</span><span style="min-width:60px; display:inline-block;">V : 0</span><span style="min-width:60px; display:inline-block;">B : 255</span></td>
                    </tr>
                    <tr>
                    	<td>6 - ROBOT_STATE_LIGHT</td>
                        <td>10 - LED_ANIM_LIGHT</td>
                        <td><span style="min-width:60px; display:inline-block;">R : 255</span><span style="min-width:60px; display:inline-block;">V : 255</span><span style="min-width:60px; display:inline-block;">B : 255</span></td>
                    </tr>
                </tbody>
            </table>
          </div>
        </div>
        
    <?php
		foreach($topicsParGroupe as $groupe => $topics)
		{
			if ($groupe != 'Leds') continue;
			?>
            <h2 id="leds_events">Events</h2>
            
            <?php
			$topic = new ApiTopic();
			foreach($topics as $topic)
			{
				if ($topic->event_name != '')
				{
					?>
					<div class="panel panel-default">
					  <div class="panel-heading" id="robot_events_<?php echo $topic->event_name;?>"><?php echo $topic->event_name;?></div>
					  <div class="panel-body">
						<table class="table-striped table-bordered table" style="width:auto;">
							<tbody>
								<tr>
									<th>Message type</th>
									<td><!--<pre class=""><code class="language-js">-->
										<?php echo isset($messages[$topic->messageType])?'<pre class=""><code class="language-js">'.$messages[$topic->messageType].'</code></pre>':str_replace('std_msgs/', '', $topic->messageType);?>
									<!--</code></pre>-->
									</td>
								</tr>
							</tbody>
						</table>
					  </div>
					</div>
					<?php
				}
			}
		}
		?>
        
        <?php
		foreach($servicesParGroupe as $groupe => $services)
		{
			if ($groupe != 'Leds') continue;
			?>
            <h2 id="leds_functions">Functions</h2>
            <?php
			$topic = new ApiTopic();
			foreach($services as $service)
			{
				if ($service->function_name != '')
				{
					// On récupère les params d'entrée
					$params = $service->GetParams();
					$entrees = array();
					?>
					<div class="panel panel-default">
					  <div class="panel-heading" id="robot_events_<?php echo $service->function_name;?>"><?php echo $service->function_name;?></div>
					  <div class="panel-body">
						<table class="table-striped table-bordered table" style="width:auto;">
                            <tbody>
                                <tr>
                                    <th>Parameters</th>
                                    <td><pre class=""><code class="language-js"><?php
foreach($params['entree'] as $param)
{
	echo $param['nom'].'	/* type : '.$param['type'].', '.trim($param['description'], "\r\n").' */
';
}?>function_return /* function called at the end of action */</code></pre></td>
                                </tr>
                                <tr>
                                    <th>Return</th>
                                    <td><pre class=""><code class="language-js">Object
{
<?php
foreach($params['sortie'] as $param)
{
	echo '	'.$param['nom'].'		/* type : '.$param['type'].', '.trim($param['description'], "\r\n").' */
';
}?>
}</code></pre>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
					  </div>
					</div>
					<?php
				}
			}
		}
		?>
        

<h1 id="video">Video</h1>

    <p>This API allow you to access to create a video chat.</p>
    
    <h2 id="options">Options</h2>
    
    
    <div class="tabs">
        <ul class="nav nav-tabs">
          <li role="presentation" class="active"><a data-toggle="tab" href="#init_api_js">Javascript</a></li>
          <li role="presentation"><a data-toggle="tab" href="#init_api_params">Parameters</a></li>
        </ul>
            
        <div class="tab-content">
          <div class="tab-pane active" id="init_api_js" role="tabpanel">
            <pre class="line-numbers"><code class="language-js">$(document).ready(function(e) {
        wycaApi = new WycaAPI({
            'api_key':'YOUR API KEY',
            'id_site':'YOUR SITE ID',
            'id_robot':'YOUR ROBOT ID / not_robot',

            'webcam_name':'NAME_OF_THE_WEBCAM',
            'video_element_id':'webcam_local',
            'nick':'robot_1',
            'delay_no_reply': 30,
            'delay_lost_connexion': 30,
            'checkLostConnection':true,
            'with_audio': false,
            'with_video': false,
            'on_error_webcam_try_without':true
            });
     });</code></pre>
          </div>
          
          <div class="tab-pane" id="init_api_params" role="tabpanel" style="padding:20px;">
          	<ul>
            	<li><code>webcam_name</code> : the name of webcam : 'r200_nav' or 'r200_customer' on robot</li>
            	<li><code>video_element_id</code> : the ID of HTML element for display your video</li>
            	<li><code>nick</code> : a name to identify the differents video</li>
            	<li><code>delay_no_reply</code> : delay in seconds between the start call and the close connexion if no reply</li>
            	<li><code>delay_lost_connexion</code> : delay in seconds between the start of lost connexion and the close connexion</li>
            	<li><code>checkLostConnection</code> : check or not deconnection and no reply to close automticaly the session.</li>
            	<li><code>with_audio</code> : bool, use audio</li>
            	<li><code>with_video</code> : bool, use video</li>
            	<li><code>on_error_webcam_try_without</code> : bool, if use video and equipment error, try to restart call without video</li>
            </ul>
          </div>
        </div>
    </div>

	<h2 id="video_events">Events</h2>
        
        <div class="panel panel-default">
            <div class="panel-heading" id="video_events_onChannelOpen">onChannelOpen</div>
            <div class="panel-body">
            <table class="table-striped table-bordered table" style="width:auto;">
                <tbody>
                    <tr>
                        <td>Fired when WebRTC data channel is open</td>
                    </tr>
                </tbody>
            </table>
            </div>
        </div>
        
        <div class="panel panel-default">
            <div class="panel-heading" id="video_events_onVideoAdded">onVideoAdded</div>
            <div class="panel-body">
            <table class="table-striped table-bordered table" style="width:auto;">
                <tbody>
                    <tr>
                        <th>nick</th>
                        <td>string</td>
                    </tr>
                    <tr>
                        <th>video</th>
                        <td>video HTML element</td>
                    </tr>
                    <tr>
                        <th>Example</th>
                        <td><pre class=""><code class="language-js">onVideoAdded: function (nick, video) { 
    $('#webcam_robot').html(''); // We clean div before add new video
    var remotes = document.getElementById('webcam_operateur');
    remotes.appendChild(video);
    video.oncontextmenu = function () { return false; };
},</code></pre></td>
                    </tr>
                </tbody>
            </table>
            </div>
        </div>
        
        <div class="panel panel-default">
            <div class="panel-heading" id="video_events_onVideoRemoved">onVideoRemoved</div>
            <div class="panel-body">
            <table class="table-striped table-bordered table" style="width:auto;">
                <tbody>
                    <tr>
                        <th>nick</th>
                        <td>string</td>
                    </tr>
                    <tr>
                        <th>video</th>
                        <td>video HTML element</td>
                    </tr>
                    <tr>
                        <th>Example</th>
                        <td><pre class=""><code class="language-js">onVideoRemoved: function (nick, video) { 
   $('#webcam_robot').html('');
},</code></pre></td>
                    </tr>
                </tbody>
            </table>
            </div>
        </div>
        
        <div class="panel panel-default">
            <div class="panel-heading" id="video_events_onChannelOpen">onLostConnection</div>
            <div class="panel-body">
            <table class="table-striped table-bordered table" style="width:auto;">
                <tbody>
                    <tr>
                        <td>Fired when WebRTC connexion is lost</td>
                    </tr>
                </tbody>
            </table>
            </div>
        </div>
        
        <div class="panel panel-default">
            <div class="panel-heading" id="video_events_onChannelOpen">onRestoreConnection</div>
            <div class="panel-body">
            <table class="table-striped table-bordered table" style="width:auto;">
                <tbody>
                    <tr>
                        <td>Fired when WebRTC connexion is restored after a lost connexion</td>
                    </tr>
                </tbody>
            </table>
            </div>
        </div>
        <div class="panel panel-default">
            <div class="panel-heading" id="video_events_onChannelOpen">onStartSessionClose</div>
            <div class="panel-body">
            <table class="table-striped table-bordered table" style="width:auto;">
                <tbody>
                    <tr>
                        <td>Fired when session start closing</td>
                    </tr>
                </tbody>
            </table>
            </div>
        </div>
        <div class="panel panel-default">
            <div class="panel-heading" id="video_events_onChannelOpen">onSessionClosed</div>
            <div class="panel-body">
            <table class="table-striped table-bordered table" style="width:auto;">
                <tbody>
                    <tr>
                        <td>Fired when session is closed</td>
                    </tr>
                </tbody>
            </table>
            </div>
        </div>
        
        <div class="panel panel-default">
            <div class="panel-heading" id="video_events_onChannelOpen">onEquipmentErrorTryWithoutWebcam</div>
            <div class="panel-body">
            <table class="table-striped table-bordered table" style="width:auto;">
                <tbody>
                    <tr>
                        <td>Fired when equipement error (no webcam and/or no microphone) if :
                        	<ul>
                                <li>call with video</li>
                                <li>option <em>on_error_webcam_try_without</em> is set to <em>true</em>.</li>
                            </ul>
                            After fired this event, the API try to call without video.</td>
                    </tr>
                </tbody>
            </table>
            </div>
        </div>
        
        <div class="panel panel-default">
            <div class="panel-heading" id="video_events_onChannelOpen">onEquipmentError</div>
            <div class="panel-body">
            <table class="table-striped table-bordered table" style="width:auto;">
                <tbody>
                    <tr>
                        <td>Fired when equipement error (no webcam and/or no microphone)</td>
                    </tr>
                </tbody>
            </table>
            </div>
        </div>
    
	<h2 id="video_functions">Functions</h2>
    
    <div class="panel panel-default">
      <div class="panel-heading" id="video_functions_WithVideo">WithVideo</div>
      <div class="panel-body">
        <table class="table-striped table-bordered table" style="width:auto;">
            <tbody>
                <tr>
                    <th>Parameters</th>
                    <td><pre class=""><code class="language-js">use_it		/* bool */</code></pre></td>
                </tr>
            </tbody>
        </table>
      </div>
    </div>
    
    <div class="panel panel-default">
      <div class="panel-heading" id="video_functions_WithAudio">WithAudio</div>
      <div class="panel-body">
        <table class="table-striped table-bordered table" style="width:auto;">
            <tbody>
                <tr>
                    <th>Parameters</th>
                    <td><pre class=""><code class="language-js">use_it		/* bool */</code></pre></td>
                </tr>
            </tbody>
        </table>
      </div>
    </div>
    
    <div class="panel panel-default">
      <div class="panel-heading" id="video_functions_StartWebRTCWithRobot">StartWebRTCWithRobot</div>
      <div class="panel-body">
        <table class="table-striped table-bordered table" style="width:auto;">
            <tbody>
                <tr>
                    <th>Parameters</th>
                    <td><pre class=""><code class="language-js">id_robot	/* int, id of the robot */</code></pre></td>
                </tr>
            </tbody>
        </table>
      </div>
    </div>
    
    <div class="panel panel-default">
      <div class="panel-heading" id="video_functions_StartWebRTCWithRobot">StartWebRTC</div>
      <div class="panel-body">
        <table class="table-striped table-bordered table" style="width:auto;">
            <tbody>
                <tr>
                    <th>Parameters</th>
                    <td><pre class=""><code class="language-js">reply		/* bool, default : false, set at true to replay to a call from robot  */</code></pre></td>
                </tr>
            </tbody>
        </table>
      </div>
    </div>
    
    <div class="panel panel-default">
      <div class="panel-heading" id="video_functions_StartWebRTCWithRobot">StartCloseWebRTC</div>
      <div class="panel-body">
      </div>
    </div>
    
    <div class="panel panel-default">
      <div class="panel-heading" id="video_functions_StartWebRTCWithRobot">SetRoom</div>
      <div class="panel-body">
        <table class="table-striped table-bordered table" style="width:auto;">
            <tbody>
                <tr>
                    <th>Parameters</th>
                    <td><pre class=""><code class="language-js">room_name	/* string the name of the room */</code></pre></td>
                </tr>
            </tbody>
        </table>
      </div>
    </div>
    
</div>
</div>
</div>

</div>

<?php include (dirname(__FILE__).'/../template/footer.php');?>    
    	