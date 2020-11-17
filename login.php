<?php 
header("Access-Control-Allow-Origin: *");
include_once('./config/initSite.php');
?>
<!doctype html>
<html class="fixed">
	<head>

		<meta charset="UTF-8">

		<title>Login | Wyca Robotics</title>
		<meta name="author" content="Wyca Robotics">
            
            
        <link rel="shortcut icon" href="<?php echo $_CONFIG['URL'];?>/assets/images/favicon/favicon.ico" type="image/x-icon">
        <link rel="icon" href="<?php echo $_CONFIG['URL'];?>/assets/images/favicon/favicon.png" type="image/png">
        <link rel="icon" sizes="32x32" href="<?php echo $_CONFIG['URL'];?>/assets/images/favicon/favicon-32.png" type="image/png">
        <link rel="icon" sizes="64x64" href="<?php echo $_CONFIG['URL'];?>/assets/images/favicon/favicon-64.png" type="image/png">
        <link rel="icon" sizes="96x96" href="<?php echo $_CONFIG['URL'];?>/assets/images/favicon/favicon-96.png" type="image/png">
        <link rel="icon" sizes="196x196" href="<?php echo $_CONFIG['URL'];?>/assets/images/favicon/favicon-196.png" type="image/png">
        <link rel="apple-touch-icon" sizes="152x152" href="<?php echo $_CONFIG['URL'];?>/assets/images/favicon/apple-touch-icon.png">
        <link rel="apple-touch-icon" sizes="60x60" href="<?php echo $_CONFIG['URL'];?>/assets/images/favicon/apple-touch-icon-60x60.png">
        <link rel="apple-touch-icon" sizes="76x76" href="<?php echo $_CONFIG['URL'];?>/assets/images/favicon/apple-touch-icon-76x76.png">
        <link rel="apple-touch-icon" sizes="114x114" href="<?php echo $_CONFIG['URL'];?>/assets/images/favicon/apple-touch-icon-114x114.png">
        <link rel="apple-touch-icon" sizes="120x120" href="<?php echo $_CONFIG['URL'];?>/assets/images/favicon/apple-touch-icon-120x120.png">
        <link rel="apple-touch-icon" sizes="144x144" href="<?php echo $_CONFIG['URL'];?>/assets/images/favicon/apple-touch-icon-144x144.png">
        <meta name="msapplication-TileImage" content="<?php echo $_CONFIG['URL'];?>/assets/images/favicon/favicon-144.png">
        <meta name="msapplication-TileColor" content="#FFFFFF"> 

		<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />

		<link href="<?php echo $_CONFIG['URL'];?>assets/stylesheets/fonts/opensans/opensans.css" rel="stylesheet" type="text/css">

		<link rel="stylesheet" href="<?php echo $_CONFIG['URL'];?>assets/vendor/bootstrap/css/bootstrap.css" />
		<link rel="stylesheet" href="<?php echo $_CONFIG['URL'];?>assets/vendor/font-awesome/css/font-awesome.css" />
        
		<link rel="stylesheet" href="<?php echo $_CONFIG['URL'];?>assets/stylesheets/theme.css" />

		<link rel="stylesheet" href="<?php echo $_CONFIG['URL'];?>assets/stylesheets/login.css" />

	</head>
	<body>
		<section class="body-sign">
			<div class="center-sign">
				<a href="/" class="logo pull-left">
					<img src="<?php echo $_CONFIG['URL'];?>assets/images/logo.png" height="54" alt="Wyca Robotics" />
				</a>

				<div id="divLogin" class="panel panel-sign">
					<div class="panel-title-sign mt-xl text-right">
						<h2 class="title text-uppercase text-bold m-none"><i class="fa fa-user mr-xs"></i> <?php echo __('Sign In');?></h2>
					</div>
					<div class="panel-body">
						<?php if (isset($message))
                        {
                            ?>
                            <div class="alert <?php if (isset($erreur)){?> alert-danger <?php } else {?> alert-success <?php }?>">
                                <p class="m-none text-semibold h6"><?php echo $message;?></p>
                            </div>
                            <?php
                        }?>
						<form method="post" id="formLogin">
							<div class="form-group mb-lg">
								<label><?php echo __('Login');?></label>
								<div class="input-group input-group-icon">
									<input id="login_email" name="email" type="text" class="form-control input-lg" />
									<span class="input-group-addon">
										<span class="icon icon-lg">
											<i class="fa fa-user"></i>
										</span>
									</span>
								</div>
							</div>

							<div class="form-group mb-lg">
								<div class="clearfix">
									<label class="pull-left"><?php echo __('Password');?></label>
									<!--<a href="#" id="bLostPassword" class="pull-right"><?php echo __('Lost Password?');?></a>-->
								</div>
								<div class="input-group input-group-icon">
									<input id="login_password" name="password" type="password" class="form-control input-lg" />
									<span class="input-group-addon">
										<span class="icon icon-lg">
											<i class="fa fa-lock"></i>
										</span>
									</span>
								</div>
							</div>

							<div class="row">
								<div class="col-sm-12 text-right">
									<button type="submit" class="btn btn-primary hidden-xs"><?php echo __('Sign In');?></button>
									<button type="submit" class="btn btn-primary btn-block btn-lg visible-xs mt-lg"><?php echo __('Sign In');?></button>
								</div>
							</div>

						</form>
					</div>
				</div>
			</div>
		</section>
        
        <div class="popup_error">
        	<section class="panel panel-secondary" data-portlet-item="">
                <header class="panel-heading">
                    <div class="panel-actions">
                        <a href="#" class="fa fa-times"></a>
                    </div>
                    <h2 class="panel-title">Error</h2>
                </header>
                <div class="panel-body"></div>
            </section>
        </div>
		
        <script src="<?php echo $_CONFIG['URL'];?>assets/vendor/jquery/jquery.js"></script>
		<script src="<?php echo $_CONFIG['URL'];?>assets/vendor/bootstrap/js/bootstrap.js"></script>
	</body>
</html>
<script>

function DisplayError(text)
{
	 $('.popup_error .panel-body').html(text);
	 $('.popup_error').show();
}

var ws;
var use_ssl = <?php echo $server_request_scheme == 'http'?'false':'true';?>;
var save_msg;

$(document).ready(function(e) {

	if(screen.height < 600)
	{
		DisplayError('The screen\'s height of your telephone is too small for the app. Some features can be impacted');
	}

	<?php if ($server_request_scheme == 'http')
	{
		// We test if we can do https on webservice
		?>
		$.ajax({
			type: "GET",
			url: 'https://wyca.run:9095',
			success: function(data) {
				// HTTPS OK
				location.href = 'https://wyca.run/login.php';
			},
			error: function(e) {
				// No HTTPS available, pb chrome to validate certificate
			}
		});
		<?php
	}
	else
	{
		// We are in https but maybe with security exception
		?>
		$.ajax({
			type: "GET",
			url: 'https://wyca.run:9095',
			success: function(data) {
				// HTTPS OK
				
			},
			error: function(e) {
				location.href = 'http://wyca.run/login.php';
				// No HTTPS available, pb chrome to validate certificate
			}
		});
		<?php
	}
	?>
	
	$('.popup_error .panel-heading .fa-times').click(function(e) {
        e.preventDefault();
		$(this).closest('.popup_error').hide();
    });
	
    $('#formLogin').submit(function(e) {
        e.preventDefault();
	
		if ($('#login_email').val() == '' || $('#login_password').val() == '')
		{
			DisplayError('Login and password required.');
		}
		else
		{
			var robot_host = '<?php echo (file_exists('C:\\'))?((file_exists('C:\\Users\\F'))?'10.0.0.39:'.($server_request_scheme == 'http'?'9094':'9095'):'192.168.0.33:'.($server_request_scheme == 'http'?'9094':'9095')):'wyca.run:'.($server_request_scheme == 'http'?'9094':'9095');?>';
			//var robot_host = '<?php echo (file_exists('C:\\'))?'10.0.0.44:'.($server_request_scheme == 'http'?'9094':'9095'):'wyca.run:'.($server_request_scheme == 'http'?'9094':'9095');?>';
			
			if ("WebSocket" in window) {
				ws = new WebSocket((use_ssl?'wss':'ws') + '://'+ robot_host);
			} else if ("MozWebSocket" in window) {
				ws = new MozWebSocket((use_ssl?'wss':'ws') + '://'+ robot_host);
			} else {
				throw new Error('This Browser does not support WebSockets')
			}
			ws.onopen = function(e) {
				var auth = {
				"O": 0x6108, // CHECK_USER_CONNEXION
				"P": {
					"L":$('#login_email').val(),
					"P":$('#login_password').val()
				}
			  };		
			
			  ws.send(JSON.stringify(auth));
			};
			ws.onerror = function(e) { DisplayError('Communication with the robot impossible'); };
			ws.onclose = function(e) { };
			ws.onmessage = function(e) { 
			
				if (e.data == 'ack') return;
				msg = JSON.parse(e.data);
				
				ws.close();
				
				if (msg.A > 0)
				{
					DisplayError(msg.M);
				}
				else
				{
					// Connexion OK, on save l'api_key
					save_msg = msg;
					$.ajax({
						type: "POST",
						url: 'ajax/connection.php',
						data: {
							id: msg.D.ID,
							k: msg.D.KEY,
							g: msg.D.GROUP
						},
						success: function(data) {
							
							if (save_msg.D.NCP)
								//location.href = 'index.php';
								location.href = 'change_password.php';
							else
								location.href = 'index.php';
						},
						error: function(e) {
							alert(e.responseText);
						}
					});
				}
			};
		}
			
    });
});
</script>
