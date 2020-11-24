<?php 
header("Access-Control-Allow-Origin: *");
include_once('./config/initSite.php');

if(isset($_GET['ns'])){
	$message=_("New passwords don't match");
	$erreur=true;
}
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
		<style>
			.panel-body{
				border-top-color:#ed9c28!important;
			}
			h2.title{
				background-color:#ed9c28!important;
			}
		</style>
	</head>
	<body>
		<section class="body-sign">
			<div class="center-sign">
				<a href="/" class="logo pull-left">
					<img src="<?php echo $_CONFIG['URL'];?>assets/images/logo.png" height="54" alt="Wyca Robotics" />
				</a>

				<div id="divLogin" class="panel panel-sign">
					<div class="panel-title-sign mt-xl text-right">
						<h2 class="title text-uppercase text-bold m-none"><i class="fa fa-lock mr-xs"></i> <?php echo __('Change Password');?></h2>
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
						<form method="post" id="formChangePassword">
							<div class="form-group">
								<label><?php echo __('Password');?></label>
								<div class="input-group input-group-icon">
									<input id="password" name="password" type="password" class="form-control input-lg" pattern="(?=^.{8,}$)(?=.+[*.!@$%^&(){}[\]:;<>,.?\/~_+\-=|])(?=.+[a-z])(?=.+[A-Z])(?=.+[0-9]).*$"/>
									<span class="input-group-addon">
										<span class="icon icon-lg">
											<i class="fa fa-lock"></i>
										</span>
									</span>
									
								</div>
							</div>
							<p class="password_format"><?= _('At least 6 characters, 1 letter, 1 digit')?> </p>
							<div class="form-group">
								<div class="clearfix">
									<label class="pull-left"><?php echo __('Confirm Password');?></label>
									<!--<a href="#" id="bLostPassword" class="pull-right"><?php echo __('Lost Password?');?></a>-->
								</div>
								<div class="input-group input-group-icon">
									<input id="confirm_password" name="confirm_password" type="password" class="form-control input-lg" pattern="(?=^.{8,}$)(?=.+[*.!@$%^&(){}[\]:;<>,.?\/~_+\-=|])(?=.+[a-z])(?=.+[A-Z])(?=.+[0-9]).*$"/>
									<span class="input-group-addon">
										<span class="icon icon-lg">
											<i class="fa fa-lock"></i>
										</span>
									</span>
								</div>
							</div>
							<p class="password_format"><?= _('At least 6 characters, 1 letter, 1 digit')?> </p>
							<div class="row">
								<div class="col-sm-12 text-right">
									<button type="submit" class="btn btn-primary hidden-xs"><?php echo __('Change password');?></button>
									<button type="submit" class="btn btn-primary btn-block btn-lg visible-xs mt-lg"><?php echo __('Change password');?></button>
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
        
        <script src="<?php echo $_CONFIG['URL_API'];?>wyca_socket_api.js?v=<?php echo date('Y-m-d');?>"></script>
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
var user_api_key = '<?php echo $_SESSION["api_key"];?>';

var robot_host = '<?php echo (file_exists('C:\\'))?((file_exists('C:\\Users\\F'))?'10.0.0.39:'.($server_request_scheme == 'http'?'9094':'9095'):'192.168.0.33:'.($server_request_scheme == 'http'?'9094':'9095')):'wyca.run:'.($server_request_scheme == 'http'?'9094':'9095');?>';


$(document).ready(function(e) {


	wycaApi = new WycaAPI({
		host:robot_host, //192.168.1.32:9090', // host:'192.168.100.245:9090',
		use_ssl: use_ssl,
		api_key:user_api_key,
		nick:'robot'
	});
	wycaApi.init();	


	$('.popup_error .panel-heading .fa-times').click(function(e) {
        e.preventDefault();
		$(this).closest('.popup_error').hide();
    });
	
    $('#formChangePassword').submit(function(e) {
        e.preventDefault();
	
		if ($('#password').val() == '' || $('#confirm_password').val() == '')
		{
			DisplayError('Login and password required.');
		}else if($('#password').val() != $('#confirm_password').val()){
			
			DisplayError('Passwords not matching.');
		}else if(!$('#password')[0].checkValidity() || !$('#confirm_password')[0].checkValidity()){
			
			DisplayError('Passwords needs to be 6 character long with at least one character and one digit.');
		}
		else
		{
			wycaApi.ChangePassword($('#password').val(), function(data){
			
				if (data.A == wycaApi.AnswerCode.NO_ERROR)
				{
					location.href='index.php';
				}
				else
				{
					DisplayError(wycaApi.AnswerCodeToString(data.A));
				}
			
			});
		}
			
    });
});
</script>
