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

		<!-- Basic -->
		<meta charset="UTF-8">

		<meta name="keywords" content="HTML5 Admin Template" />
		<meta name="description" content="Porto Admin - Responsive HTML5 Template">
		<meta name="author" content="okler.net">

		<!-- Mobile Metas -->
		<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />

		<!-- Web Fonts  -->
		<link href="<?php echo $_CONFIG['URL'];?>assets/stylesheets/fonts/opensans/opensans.css" rel="stylesheet" type="text/css">-->

		<!-- Vendor CSS -->
		<link rel="stylesheet" href="<?php echo $_CONFIG['URL'];?>assets/vendor/bootstrap/css/bootstrap.css" />
		<link rel="stylesheet" href="<?php echo $_CONFIG['URL'];?>assets/vendor/font-awesome/css/font-awesome.css" />
		<link rel="stylesheet" href="<?php echo $_CONFIG['URL'];?>assets/vendor/magnific-popup/magnific-popup.css" />
		<link rel="stylesheet" href="<?php echo $_CONFIG['URL'];?>assets/vendor/bootstrap-datepicker/css/datepicker3.css" />

		<!-- Theme CSS -->
		<link rel="stylesheet" href="<?php echo $_CONFIG['URL'];?>assets/stylesheets/theme.css" />

		<!-- Skin CSS -->
		<link rel="stylesheet" href="<?php echo $_CONFIG['URL'];?>assets/stylesheets/skins/default.css" />

		<!-- Theme Custom CSS -->
		<link rel="stylesheet" href="<?php echo $_CONFIG['URL'];?>assets/stylesheets/theme-custom.css">

		<!-- Head Libs -->
		<script src="<?php echo $_CONFIG['URL'];?>assets/vendor/modernizr/modernizr.js"></script>

	</head>
	<body>
		<!-- start: page -->
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
                
                <!--
                <div id="divLostPassword" class="panel panel-sign" style="display:none;">
					<div class="panel-title-sign mt-xl text-right">
						<h2 class="title text-uppercase text-bold m-none"><i class="fa fa-user mr-xs"></i> <?php echo __('Recover Password');?></h2>
					</div>
					<div class="panel-body">
						<div class="alert alert-info">
							<p class="m-none text-semibold h6"><?php echo __('Enter your e-mail below and we will send you reset instructions!');?></p>
						</div>

						<form method="post">
							<div class="form-group mb-none">
								<div class="input-group">
									<input name="email_lost" type="email" placeholder="<?php echo __('Email');?>" class="form-control input-lg" />
									<span class="input-group-btn">
										<button class="btn btn-primary btn-lg" type="submit"><?php echo __('Reset!');?></button>
									</span>
								</div>
							</div>

							<p class="text-center mt-lg"><?php echo __('Remembered?')?> <a href="#" id="bLogin"><?php echo __('Sign In!');?></a>
						</form>
					</div>
				</div>
                -->

				<p class="text-center text-muted mt-md mb-md">&copy; Copyright <?php echo date('Y');?>. <?php echo __('All rights reserved.');?></p>
			</div>
		</section>
		<!-- end: page -->

		<!-- Vendor -->
		<script src="<?php echo $_CONFIG['URL'];?>assets/vendor/jquery/jquery.js"></script>
		<script src="<?php echo $_CONFIG['URL'];?>assets/vendor/jquery-browser-mobile/jquery.browser.mobile.js"></script>
		<script src="<?php echo $_CONFIG['URL'];?>assets/vendor/bootstrap/js/bootstrap.js"></script>
		<script src="<?php echo $_CONFIG['URL'];?>assets/vendor/nanoscroller/nanoscroller.js"></script>
		<script src="<?php echo $_CONFIG['URL'];?>assets/vendor/bootstrap-datepicker/js/bootstrap-datepicker.js"></script>
		<script src="<?php echo $_CONFIG['URL'];?>assets/vendor/magnific-popup/magnific-popup.js"></script>
		<script src="<?php echo $_CONFIG['URL'];?>assets/vendor/jquery-placeholder/jquery.placeholder.js"></script>
		
		<!-- Theme Base, Components and Settings -->
		<script src="<?php echo $_CONFIG['URL'];?>assets/javascripts/theme.js"></script>
		
		<!-- Theme Custom -->
		<script src="<?php echo $_CONFIG['URL'];?>assets/javascripts/theme.custom.js"></script>
		
		<!-- Theme Initialization Files -->
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