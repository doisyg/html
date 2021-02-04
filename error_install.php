<?php 
header("Access-Control-Allow-Origin: *");
include_once('./config/initSite.php');
$dir = false;
$file = false;
if($_CONFIG['MODE'] =='DEV')
	header('location:index.php');
if(is_dir(dirname(__FILE__).'/../conf/'))
	$dir = true;
if(file_exists(dirname(__FILE__).'/../conf/c.conf'))
	$file = true;
if($dir && $file)
	header('location:index.php');
$message= 'Install process not finished';
$erreur = true;

?>
<!doctype html>
<html class="fixed">
	<head>

		<meta charset="UTF-8">

		<title>Install error | Wyca Robotics</title>
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
				border-top-color:#d64742!important;
			}
			h2.title{
				background-color:#d64742!important;
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
						<h2 class="title text-uppercase text-bold m-none"><i class="fa fa-user mr-xs"></i> <?php echo __('Error');?></h2>
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

	<?php if ($server_request_scheme == 'http')
	{
		// We test if we can do https on webservice
		/*
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
		*/
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
				location.href = 'http://wyca.run/error_install.php';
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
});
</script>
