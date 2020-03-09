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
		$ip_trace = new IpErrorTrace();
		$ip_trace->IP = $_SERVER['REMOTE_ADDR'];
		$ip_trace->type = 'Connect';
		$ip_trace->date = date('Y-m-d H:i:s');
		$ip_trace->Save();
	
		$log = new LogSystem();
		$log->date = date('Y-m-d H:i:s');
		$log->level = 'MEDIUM';
		$log->type = 'Connection';
		$log->detail = 'IP '.$_SERVER['REMOTE_ADDR'].' connection error with '.$_POST['email'].' login';
		$log->Save();
		
		if (IpErrorTrace::CheckIP($_SERVER['REMOTE_ADDR'])>=10)
		{
			// On block l'IP
			$ipb = new IpBlocked();
			$ipb->IP = $_SERVER['REMOTE_ADDR'];
			$ipb->date = date('Y-m-d H:i:s');
			$ipb->Insert();
			
			$log = new LogSystem();
			$log->date = date('Y-m-d H:i:s');
			$log->level = 'HIGH';
			$log->type = 'Connection';
			$log->detail = 'IP '.$_SERVER['REMOTE_ADDR'].' blocked after 10 connection attempts.';
			$log->Save();			
			
			header('location:login.php');
		}		
		
		session_write_close();
		$message = __('Invalid login or password.');
		$erreur = true;
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

		<link rel="stylesheet" href="<?php echo $_CONFIG['URL'];?>assets/stylesheets/login.css" />

	</head>
	<body style="background-image:url(../assets/images/tops/<?php echo $activeTop->image_name;?>);">
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
								<label><?php echo __('Login');?></label>
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
			</div>
		</section>
		
        <script src="<?php echo $_CONFIG['URL'];?>assets/vendor/jquery/jquery.js"></script>
		<script src="<?php echo $_CONFIG['URL'];?>assets/vendor/bootstrap/js/bootstrap.js"></script>
	</body>
</html>