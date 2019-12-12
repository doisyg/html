<?php 
require_once ('../../config/initSite.php');
if (!isset($_SESSION["id_developer"])) { header("location:../login.php"); }

$topics = $userConnected->GetApiTopics('groupe ASC, t.event_name', 'ASC');
$services = $userConnected->GetApiServices('groupe ASC, s.function_name', 'ASC');

$topicsParGroupe = array();
foreach($topics as $topic)
{
	if (!isset($topicsParGroupe[$topic->groupe])) $topicsParGroupe[$topic->groupe] = array();
	$topicsParGroupe[$topic->groupe][] = $topic;
}

$servicesParGroupe = array();
foreach($services as $service)
{
	if (!isset($servicesParGroupe[$service->groupe])) $servicesParGroupe[$service->groupe] = array();
	$servicesParGroupe[$service->groupe][] = $service;
}

if ($_SERVER['REMOTE_ADDR'] == '127.0.0.1' || substr($_SERVER['REMOTE_ADDR'], 0, 7) == '192.168')
{
	$_CONFIG['URL'] = 'https://traxdev.wyca-solutions.com/developers/demo/';
	$_CONFIG['URL_API'] = 'https://traxdev.wyca-solutions.com/API/';
}
else
{
	$_CONFIG['URL'] = 'https://trax.wyca-solutions.com/developers/demo/';
	$_CONFIG['URL_API'] = 'https://trax.wyca-solutions.com/API/';
}

?><!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>Wyca API test - Opérateur</title>

	<link href="<?php echo $_CONFIG['URL'];?>css/bootstrap.css" rel="stylesheet">
    <link href="<?php echo $_CONFIG['URL'];?>css/bootstrap-switch.min.css" rel="stylesheet">
	<link href='https://fonts.googleapis.com/css?family=Montserrat%3A400%2C700&#038;subset=latin&#038;ver=1455269554' type='text/css' media='all' rel='stylesheet' id='anaglyph-google-fonts-anaglyph_config-css' />
	<link href="<?php echo $_CONFIG['URL'];?>css/font-awesome.min.css" rel="stylesheet">
	<link href="<?php echo $_CONFIG['URL'];?>css/operateur.css" rel="stylesheet">

	<link href="<?php echo $_CONFIG['URL_API'];?>css/map_wyca.css" rel="stylesheet">
	<script src="<?php echo $_CONFIG['URL_API'];?>extern/roslib.js"></script>
    <script src="<?php echo $_CONFIG['URL_API'];?>extern/jquery-1.11.3.min.js"></script>
    <script src="<?php echo $_CONFIG['URL_API'];?>webrtc.wyca2.min.js"></script>
    <script src="<?php echo $_CONFIG['URL_API'];?>wyca_api.latest.min.php?id_site=<?php echo $_GET['id_site'];?>&api_key=<?php echo $userConnected->api_key;?>"></script>
    
    <script src="<?php echo $_CONFIG['URL'];?>js/bootstrap.js"></script>
    
    <script>
	var in_visio = false;
	var wycaApi;

	$(document).ready(function(e) {
			
		 wycaApi = new WycaAPI({
			api_key:'<?php echo $userConnected->api_key;?>',
			id_site:'<?php echo $_GET['id_site'];?>',
			id_robot:'not_robot',
			video_element_id:'webcam_local',
			nick:'server2',
			delay_no_reply : 30,
			delay_lost_connexion : 30,
			with_audio: false,
			with_video: false,
			onChannelOpen: function () { 
				$('#mCallInProgress').hide();
				$('#mCallInProgressFromUs').hide();
				$('#functions').show();
				$('#events').show();
			},
			onVideoAdded: function (nick, video) { 
				$('#webcam_robot').html(''); // We clean div before add new video
				var remotes = document.getElementById('webcam_operateur');
				remotes.appendChild(video);
				video.oncontextmenu = function () { return false; };
				$('#mCallInProgress').hide();
				$('#mCallInProgressFromUs').hide();
			},
			onVideoRemoved: function (nick, video){
				$('#webcam_robot').html('');
			},
			onLostConnection: function (){
				$('#mConexionLost').show();
			},
			onRestoreConnection: function (){
				$('#mConexionLost').hide();
			},
			onStartSessionClose: function (){
				$('#mClossingSession').show();
				$('#functions').hide();
				$('#events').hide();
				
			},
			onSessionClosed: function (){
				$('#mCallInProgress').hide();
				$('#mCallInProgressFromUs').hide();
				$('#mClossingSession').hide();
				$('#mConexionLost').hide();
				$("#loading").hide();
				$("#visio").hide();
				$('#home').show();
				in_visio = false;
			},
			onNewServerMessage: function (message){
				// StartCall|Roomrobot_demo
				if (message != '')
				{
					data = message.data.split('|')
					switch(data[0])
					{
						case 'StartCall':
							if (!in_visio)
							{
								wycaApi.SetRoom(data[1]);
								$('#nick_robot').html(message.from);
								$('#mCallInProgress').show();
							}
							break;
						case 'CloseSession':
							if (!in_visio)
								$('#mCallInProgress').hide();
							else
							{
								$('#mClossingSession').show();
							}
							break;
					}
				}
			},
			onEquipmentError: function(){
				wycaApi.StartCloseWebRTC();
				alert('No webcam or microphone');
			},
			onNewWebRTCMessage: function(data){
				$('#messages_recu').html($('#messages_recu').html() +'<br />' + data);
			},
			onRobotConnexionError: function(data){
				$('#onRobotConnexionError').html('Erreur');
			},
			onRobotConnexionOpen: function(data){
				$('#onRobotConnexionOpen').html('Open');
			},
			onRobotConnexionClose: function(data){
				$('#onRobotConnexionClose').html('Close');
			},
			<?php
			foreach($topics as $topic)
			{
				if ($topic->event_name != '')
				{
					?>
<?php echo $topic->event_name;?>: function(data){
				if (data == undefined) data = 'ok';
				$('#<?php echo $topic->event_name;?>').html(JSON.stringify(data));
			},
			<?php
				}
			}
			?>
		});
		
		wycaApi.init();
		
		<?php
		foreach($services as $service)
		{
			if ($service->function_name != '')
			{
				$params = $service->GetParams();
				if (count($params['entree'])>0)
				{
					$values = array();
					foreach($params['entree'] as $param)
					{
						switch($param['type'])
						{
							case 'int8':
							case 'uint8':
								$values[] = 'parseInt($(\'#input_'.$service->function_name.'_'.$param['nom'].'\').val())';
								break;
							case 'string':
								$values[] = '$(\'#input_'.$service->function_name.'_'.$param['nom'].'\').val()';
								break;
							case 'bool':
								$values[] = '$(\'#input_'.$service->function_name.'_'.$param['nom'].'\').val() == "true"';
								break;
							case 'geometry_msgs/Pose2D':
							
								$values[] = '{ x : parseFloat($(\'#input_'.$service->function_name.'_'.$param['nom'].'_x\').val()), y : parseFloat($(\'#input_'.$service->function_name.'_'.$param['nom'].'_y\').val()), theta : parseFloat($(\'#input_'.$service->function_name.'_'.$param['nom'].'_t\').val()) }';
								break;
							default:
								break;
						}
					}
			?>
		$('#form_<?php echo $service->function_name;?>').submit(function(e) {
            e.preventDefault();
			wycaApi.<?php echo $service->function_name;?>(<?php echo implode(', ', $values);?>, function(reponse) { $('#reponse_<?php echo $service->function_name;?>').html(JSON.stringify(reponse)); });
			$('#modal_<?php echo $service->function_name;?>').modal('hide');
        });
		<?php
				}
				else
				{
			?>
		$('#b<?php echo $service->function_name;?>').click(function(e) {
            e.preventDefault();
			<?php
			if ($service->function_name == 'GetPOIs' || $service->function_name == 'GetBoxs')
			{
				?>$('#reponse_<?php echo $service->function_name;?>').html(JSON.stringify(wycaApi.<?php echo $service->function_name;?>()));<?php
			}
			else
			{
				?>wycaApi.<?php echo $service->function_name;?>(function(reponse) { <?php if ($service->function_name == 'MapGetHTML'){?>$('#map_top_display').html(reponse);<?php } else {?>$('#reponse_<?php echo $service->function_name;?>').html(JSON.stringify(reponse));<?php }?> });<?php
			}?>
        });
<?php		
				}
			}
		}
		?>
		
		$('#bCall').click(function(e) {
			e.preventDefault();
			
			wycaApi.WithVideo($('input[name=with_video]').is(':checked'));
			wycaApi.WithAudio($('input[name=with_audio]').is(':checked'));
			
			LaunchCall();
		});
		
		$('#bAnswer').click(function(e) {
			e.preventDefault();
	
			$('#mCallInProgress').hide();
			$("#visio").show();
			$('#home').hide();
			
			in_visio = true;
			
			wycaApi.StartWebRTC(true);	
			
		});
		
		$('#bHangUp').click(function(e) {
			e.preventDefault();
			
			wycaApi.StartCloseWebRTC();
		});
		
		$('body').on('click', '.bResumeCall', function (e){
			e.preventDefault();
	
			$('#mCallInProgress').hide();
			$("#visio").show();
			$('#home').hide();
			
			in_visio = true;
			
			wycaApi.SetRoom($(this).data('room'));
			wycaApi.StartWebRTC(true);	
		});
			
		$('#bCloseModal').click(function(e) {
			$("#divVideo video")[0].pause();
		});
		
		$('#bSendMessage').click(function(e) {
			wycaApi.SendWebRTCMessage($('#message_text').val());
		});
		
		$('#with_video').change(function(e) {
            wycaApi.WithVideo($('input[name=with_video]').is(':checked'));
        });
		$('#with_audio').change(function(e) {
			wycaApi.WithAudio($('input[name=with_audio]').is(':checked'));
        });
	});
	
	function LaunchCall()
	{
		//$('#mCallInProgress').show();
		$('#mCallInProgressFromUs').show();
		$("#visio").show();
		$('#home').hide();
		wycaApi.StartWebRTCWithRobot(<?php echo $_GET['id_robot'];?>);
	}
	
	function StopCall()
	{
		$("#loading").hide();
		$("#visio").hide();
		wycaApi.CloseWebRTC();	
	}
	</script>

</head>

<body>

    <div id="mCallInProgressFromUs" class="full-screen popup">
        <div class="notvisible"></div>
        <div class="message">
            <div>Call in progress</div>
            <i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i>
        </div>
    </div>
    <div id="mCallInProgress" class="full-screen popup">
        <div class="notvisible"></div>
        <div class="message">
            <div>Call from <span id="nick_robot"></span></div>
            
            <a id="bAnswer" class="btn btn-lg btn-primary">Answer</a>
        </div>
    </div>
    <div id="mConexionLost" class="full-screen popup">
        <div class="notvisible"></div>
        <div class="message">
            <div>Connexion lost, wait for reconnexion</div>
            <i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i>
        </div>
    </div>
    <div id="mClossingSession" class="full-screen popup">
        <div class="notvisible"></div>
        <div class="message">
            <div>Closing the session</div>
            <i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i>
        </div>
    </div>
    
    <div id="webrtc" class="col-md-4">
        <div id="home"> 
        	 No call for the moment
                    
            <div class="radio" style="margin-bottom:20px;">
              <label><input type="checkbox" name="with_video" value="1" id="with_video"> With Video</label>
              <label style="margin-left:30px;"><input type="checkbox" name="with_audio" value="1" id="with_audio"> With Audio</label>
            </div>
            <a href="#" id="bCall" class="btn btn-lg btn-primary">Call robot <?php echo $_GET['id_robot'];?></a>
        </div>
        
        <div id="visio">
            <div id="videos">
                <div id="webcams">
                    <div>
                        <h2>Opérateur</h2>
                        <div id="webcam_local"></div>
                    </div>
                    <div>
                        <h2>Robot</h2>
                        <div id="webcam_operateur"></div>
                    </div>
                </div>
                
                <a href="#" id="bHangUp" class="btn btn-lg btn-danger">Hang up</a>
                    
                <div id="message">
                    <h2>WebRTC messages</h2>
                    <div>
                    <input type="text" id="message_text" style="display:inline-block;" /><a href="#" id="bSendMessage" class="btn btn-xs btn-primary">Send</a>
                    </div>
                    <h3>Messages received</h3>
                    <div id="messages_recu">
                    
                    </div>
                </div>
            
            </div>
            
            <div id="map_top_display"></div>
        </div>
    
	</div>
    
    <div id="functions" class="col-md-4" style="display:none;">
        <h2>Functions</h2>
        <?php
        foreach($servicesParGroupe as $groupe => $groupe_services)
        {
            ?>
            <h3><?php echo $groupe;?></h3>
            <ul>
            <?php
            foreach($groupe_services as $service)
            {
                if ($service->function_name != '')
                {
                    $params = $service->GetParams();
                    if (count($params['entree'])>0)
                    {
                ?><li><a href="#" data-toggle="modal" data-target="#modal_<?php echo $service->function_name;?>"><?php echo $service->function_name;?></a> <span id="reponse_<?php echo $service->function_name;?>"></span></li>
                <?php
                    }
                    else
                    {
                ?><li><a href="#" id="b<?php echo $service->function_name;?>"><?php echo $service->function_name;?></a> <a href="#" class="bHelp"><i class="fa fa-question-circle"></i></a>
                <div class="help" style="position:absolute; display:none;">
                <pre><code>wycaApi.<?php echo $service->function_name;?>(function(reponse) {
	<?php if ($service->function_name == 'MapGetHTML'){?>$('#map_top_display').html(reponse);
<?php } else {
		if ($service->function_name == 'GetPOIs' || $service->function_name == 'GetBoxs')
		{
			?>$('#reponse_<?php echo $service->function_name;?>').html(JSON.stringify(wycaApi.<?php echo $service->function_name;?>()));<?php
		}
		else
		{
			?>$('#reponse_<?php echo $service->function_name;?>').html(JSON.stringify(reponse));
<?php }}?>
});</code></pre></div>
                <span class="reponse" id="reponse_<?php echo $service->function_name;?>"></span></li>
                <?php
                    }
                }
            }
            ?>
            </ul>
            <?php
        }
        ?>
        
    </div>
    <div id="events" class="col-md-4" style="display:none;">
        <h2>Events</h2>
        <h3>Communication</h3>
        <ul>
            <li>onRobotConnexionError <span id="onRobotConnexionError"></span></li>
            <li>onRobotConnexionOpen <span id="onRobotConnexionOpen"></span></li>
            <li>onRobotConnexionClose <span id="onRobotConnexionClose"></span></li>
        </ul>
        <?php
        foreach($topicsParGroupe as $groupe => $groupe_topics)
        {
            ?>
            <h3><?php echo $groupe;?></h3>
            <ul>
            <?php
            foreach($groupe_topics as $topic)
            {
                if ($topic->event_name != '')
                {
                    ?><li><?php echo $topic->event_name;?> <span id="<?php echo $topic->event_name;?>"></span></li>
                    <?php
                }
            }
            ?>
            </ul>
            <?php
        }
        ?>
    
        
    </div>

    

<?php
foreach($services as $service)
{
	if ($service->function_name != '')
	{
		// On récupère les params d'entrée
		$params = $service->GetParams();
		if (count($params['entree'])>0)
		{
			?>
			<div class="modal fade" id="modal_<?php echo $service->function_name;?>" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
			  <div class="modal-dialog" role="document">
				<div class="modal-content">
				  <form id="form_<?php echo $service->function_name;?>" method="post" style="text-align:left;">
					  <div class="modal-header">
						<button type="button" class="close" data-dismiss="modal" aria-label="Close">
						  <span aria-hidden="true">&times;</span>
						</button>
						<h5 class="modal-title" id="exampleModalLabel">Paramètres</h5>
					  </div>
					  <div class="modal-body">
							<?php
							foreach($params['entree'] as $param)
							{
								?>
								<div class="form-group">
									<label for="input_<?php echo $service->function_name;?>_<?php echo $param['nom'];?>"><?php echo $param['nom'];?></label>
									<?php
                                    switch($param['type'])
                                    {
                                        case 'int8':
                                            ?><input type="number" name="input_<?php echo $service->function_name;?>_<?php echo $param['nom'];?>" id="input_<?php echo $service->function_name;?>_<?php echo $param['nom'];?>" class="form-control" /><?php
                                            break;
										case 'uint8':
                                            ?><input type="number" min="0" name="input_<?php echo $service->function_name;?>_<?php echo $param['nom'];?>" id="input_<?php echo $service->function_name;?>_<?php echo $param['nom'];?>" class="form-control" /><?php
                                            break;
										case 'string':
                                            ?><input type="text" name="input_<?php echo $service->function_name;?>_<?php echo $param['nom'];?>" id="input_<?php echo $service->function_name;?>_<?php echo $param['nom'];?>" class="form-control" /><?php
                                            break;
										case 'bool':
                                            ?><select name="input_<?php echo $service->function_name;?>_<?php echo $param['nom'];?>" id="input_<?php echo $service->function_name;?>_<?php echo $param['nom'];?>" class="form-control">
                                            	<option value="true">true</option>
                                            	<option value="false">false</option>
											</select><?php
                                            break;
										case 'geometry_msgs/Pose2D':
                                            ?>
                                            <div class="input-group">
												<span class="input-group-addon" id="basic-addon1">x</span>
                                            	<input type="text" name="input_<?php echo $service->function_name;?>_<?php echo $param['nom'];?>" id="input_<?php echo $service->function_name;?>_<?php echo $param['nom'];?>_x" class="form-control" />
                                            </div>
                                            <div class="input-group">
												<span class="input-group-addon" id="basic-addon1">y</span>
											<input type="text" name="input_<?php echo $service->function_name;?>_<?php echo $param['nom'];?>" id="input_<?php echo $service->function_name;?>_<?php echo $param['nom'];?>_y" class="form-control" />
                                            </div>
                                            <div class="input-group">
												<span class="input-group-addon" id="basic-addon1">t</span>
											<input type="text" name="input_<?php echo $service->function_name;?>_<?php echo $param['nom'];?>" id="input_<?php echo $service->function_name;?>_<?php echo $param['nom'];?>_t" class="form-control" />
                                            </div><?php
											break;
                                        default:
                                            ?><script>console.log('Type <?php echo $param['type'];?> inconnu');</script><?php
                                            break;
                                    }
									?>
									<small class="form-text text-muted"><?php echo $param['description'];?></small>
								</div>
                                <?php
							}
							?>
					  </div>
					  <div class="modal-footer">
						<button type="button" class="btn btn-secondary" data-dismiss="modal">Annuler</button>
						<button type="submit" class="btn btn-primary">Call</button>
					  </div>
					  </form>
				</div>
			  </div>
			</div>
			<?php
		}
	}
}
?>

</body>
</html>