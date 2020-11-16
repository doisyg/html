<?php 
require_once ('./config/initSite.php');

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
		
		<link rel="preconnect" href="https://fonts.gstatic.com">
		<link href="https://fonts.googleapis.com/css2?family=Open+Sans+Condensed:ital,wght@0,300;1,300&display=swap" rel="stylesheet">
		
		<link rel="stylesheet" href="<?php echo $_CONFIG['URL'];?>assets/stylesheets/anim_elodie.css" />
		<style>
			
		</style>
	</head>
	<body >
		<div class="welcome_wrapper">
			<div style="width:unset">
				<h1 class="welcome anim">&nbsp;&nbsp;Welcome</h1>
				<h1 class="welcome anim">&nbsp;&nbsp;Welcome</h1>
			</div>
		</div>
		
	</body>
</html>
<script src="<?php echo $_CONFIG['URL'];?>assets/vendor/jquery/jquery.js"></script>
<script src="<?php echo $_CONFIG['URL'];?>assets/vendor/bootstrap/js/bootstrap.js"></script>
<script>
/*
	$(function(){
		anim();
	})
	let idx = 1;
	function anim(){
		$('welcome_wrapper h1').removeClass('anim');
		let h1 = $('.welcome_wrapper h1:nth-child('+idx+')');
		if(h1.length > 0){
			lg = h1.text().length;
			h1.css('animation','nope')
			h1.css('animation','"1s steps('+lg+') 0s 1 normal none running typing, 0.75s steps(1) 0s infinite normal none running blink-caret"')
			h1.addClass('anim');
		}
	}*/
</script>