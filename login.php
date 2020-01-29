<?php $notCloseSession = true; include_once('./config/initSite.php');

Update::CheckUpdate();

if (isset($_POST['email']))
{
	if (User::CheckConnexion($_POST['email'], $_POST['password']))
	{
		$_SESSION["id_user"] = User::GetIdConnexion($_POST['email'], $_POST['password']);
		$_SESSION["IP"] = $_SERVER['REMOTE_ADDR'];

		session_write_close();

		header('location:index.php');
	}
	else
	{
		session_write_close();
		$message = __('Adresse email ou mot de passe invalide.');
		$erreur = true;
	}
}

$msgOk = '';
$erreurMdp = '';
$affForgotPwd = false;
if (isset($_POST['email_lost']))
{
	if (!User::EmailIsUsed($_POST['email_lost']))
	{
		$message = __('Adresse email inconnue.');
		$erreur = true;
		$affForgotPwd = true;
	}
	else
	{
		User::SendNewPassword($_POST['email_lost']);
		$message = __('Votre nouveau mot de passe vient de vous &ecirc;tre envoy&eacute; par email.');
	}
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
		<link rel="stylesheet" href="<?php echo $_CONFIG['URL'];?>assets/vendor/magnific-popup/magnific-popup.css" />
		<link rel="stylesheet" href="<?php echo $_CONFIG['URL'];?>assets/vendor/bootstrap-datepicker/css/datepicker3.css" />

		<link rel="stylesheet" href="<?php echo $_CONFIG['URL'];?>assets/stylesheets/theme.css" />

		<link rel="stylesheet" href="<?php echo $_CONFIG['URL'];?>assets/stylesheets/skins/default.css" />

		<link rel="stylesheet" href="<?php echo $_CONFIG['URL'];?>assets/stylesheets/theme-custom.css">

		<script src="<?php echo $_CONFIG['URL'];?>assets/vendor/modernizr/modernizr.js"></script>

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
						<form method="post">
							<div class="form-group mb-lg">
								<label><?php echo __('Email');?></label>
								<div class="input-group input-group-icon">
									<input name="email" type="text" class="form-control input-lg" />
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
									<input name="password" type="password" class="form-control input-lg" />
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
                

				<p class="text-center text-muted mt-md mb-md">&copy; Copyright <?php echo date('Y');?>. <?php echo __('All rights reserved.');?></p>
			</div>
		</section>
		
        <script src="<?php echo $_CONFIG['URL'];?>assets/vendor/jquery/jquery.js"></script>
		<script src="<?php echo $_CONFIG['URL'];?>assets/vendor/jquery-browser-mobile/jquery.browser.mobile.js"></script>
		<script src="<?php echo $_CONFIG['URL'];?>assets/vendor/bootstrap/js/bootstrap.js"></script>
		<script src="<?php echo $_CONFIG['URL'];?>assets/vendor/nanoscroller/nanoscroller.js"></script>
		<script src="<?php echo $_CONFIG['URL'];?>assets/vendor/bootstrap-datepicker/js/bootstrap-datepicker.js"></script>
		<script src="<?php echo $_CONFIG['URL'];?>assets/vendor/magnific-popup/magnific-popup.js"></script>
		<script src="<?php echo $_CONFIG['URL'];?>assets/vendor/jquery-placeholder/jquery.placeholder.js"></script>
		
		<script src="<?php echo $_CONFIG['URL'];?>assets/javascripts/theme.js"></script>
		
		<script src="<?php echo $_CONFIG['URL'];?>assets/javascripts/theme.custom.js"></script>
		
		<script src="<?php echo $_CONFIG['URL'];?>assets/javascripts/theme.init.js"></script>
        
        
        <script>
			$(document).ready(function(e) {
                $('#bLostPassword').click(function(e) {
                    e.preventDefault();
					$('#divLostPassword').show();
					$('#divLogin').hide();
                });
                $('#bLogin').click(function(e) {
                    e.preventDefault();
					$('#divLogin').show();
					$('#divLostPassword').hide();
                });
            });
		</script>

	</body>
</html>