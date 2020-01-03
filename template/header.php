<!doctype html>
<html class="fixed <?php echo isset($colonne_close) && $colonne_close?'sidebar-left-collapsed':'';?>">
	<head>

		<!-- Basic -->
		<meta charset="UTF-8">

		<title><?php echo $titre;?> | Wyca Robotics</title>
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
        

		<!-- Mobile Metas -->
		<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />

		<!-- Web Fonts  -->
		<link href="https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700,800|Shadows+Into+Light" rel="stylesheet" type="text/css">

		<!-- Vendor CSS -->
		<link rel="stylesheet" href="<?php echo $_CONFIG['URL'];?>assets/vendor/bootstrap/css/bootstrap.css" />
		<link rel="stylesheet" href="<?php echo $_CONFIG['URL'];?>assets/vendor/font-awesome/css/font-awesome.css" />
		<link rel="stylesheet" href="<?php echo $_CONFIG['URL'];?>assets/vendor/magnific-popup/magnific-popup.css" />
		<link rel="stylesheet" href="<?php echo $_CONFIG['URL'];?>assets/vendor/bootstrap-datepicker/css/datepicker3.css" />
		<link rel="stylesheet" href="<?php echo $_CONFIG['URL'];?>assets/vendor/bootstrap-datetimepicker/css/bootstrap-datetimepicker.css" />
		<link rel="stylesheet" href="<?php echo $_CONFIG['URL'];?>assets/vendor/bootstrap-colorpicker/css/bootstrap-colorpicker.css" />

		<link rel="stylesheet" href="<?php echo $_CONFIG['URL'];?>assets/vendor/jquery-ui/css/ui-lightness/jquery-ui-1.10.4.custom.css" />
		<link rel="stylesheet" href="<?php echo $_CONFIG['URL'];?>assets/vendor/bootstrap-multiselect/bootstrap-multiselect.css" />
		<link rel="stylesheet" href="<?php echo $_CONFIG['URL'];?>assets/vendor/morris/morris.css" />
		<link rel="stylesheet" href="<?php echo $_CONFIG['URL'];?>assets/vendor/select2/select2.css" />
		<link rel="stylesheet" href="<?php echo $_CONFIG['URL'];?>assets/vendor/jquery-datatables-bs3/assets/css/datatables.css" />
        <link rel="stylesheet" href="<?php echo $_CONFIG['URL'];?>assets/vendor/jstree/themes/default/style.css" />
		<link rel="stylesheet" href="<?php echo $_CONFIG['URL'];?>assets/vendor/codemirror/lib/codemirror.css" />
		<link rel="stylesheet" href="<?php echo $_CONFIG['URL'];?>assets/vendor/codemirror/theme/monokai.css" />
    	<link rel="stylesheet" href="<?php echo $_CONFIG['URL'];?>assets/vendor/farbtastic/farbtastic.css">
    

		<!-- Theme CSS -->
		<link rel="stylesheet" href="<?php echo $_CONFIG['URL'];?>assets/stylesheets/theme.css" />

		<!-- Skin CSS -->
		<link rel="stylesheet" href="<?php echo $_CONFIG['URL'];?>assets/stylesheets/skins/default.css" />

		<!-- Theme Custom CSS -->
		<link rel="stylesheet" href="<?php echo $_CONFIG['URL'];?>assets/stylesheets/theme-custom.css?v=20191210">
		<link rel="stylesheet" href="<?php echo $_CONFIG['URL'];?>assets/stylesheets/map.css?v=20191214">
        
		<!-- Head Libs -->
		<script src="<?php echo $_CONFIG['URL'];?>assets/vendor/modernizr/modernizr.js"></script>

	</head>
	<body>
		<section class="body">

			<!-- start: header -->
			<header class="header">
				<div class="logo-container">
					<a href="<?php echo $_CONFIG['URL'];?>" class="logo">
						<img src="<?php echo $_CONFIG['URL'];?>assets/images/logo.png" height="35" alt="Wyca Robotics" />
					</a>
                    
                    
                    <div id="icoBattery" class="icone_header" data-toggle="tooltip" data-placement="bottom" title="" data-original-title="<?php echo __('Battery level');?>"><span></span> <i class="fa fa-battery-0"></i></div>
                    
                    <div id="icoConnected" class="icone_header" data-toggle="tooltip" data-placement="bottom" title="" data-original-title="<?php echo __('Connection to the robot');?>"><i class="fa fa-exchange fa-rotate-90"></i></div>
                    
                   <div class="icone_header safety_stop" style="display:none;" data-toggle="tooltip" data-placement="bottom" title="" data-original-title="<?php echo __('Emergency stop');?>"><i class="fa fa-exclamation-circle battery-ko"></i></div>
                    
                    
					<div id="bJoystickPanel" class="visible-xs gamepad-left" data-toggle="modal" data-target="#modalJoystick" data-toggle="tooltip" data-placement="bottom" title="" data-original-title="<?php echo __('Control robot');?>">
						<i class="fa fa-gamepad"></i>
					</div>
					<div class="visible-xs toggle-sidebar-left" data-toggle-class="sidebar-left-opened" data-target="html" data-fire-event="sidebar-left-opened" data-toggle="tooltip" data-placement="bottom" title="" data-original-title="<?php echo __('Menu');?>">
						<i class="fa fa-bars" aria-label="Toggle sidebar"></i>
					</div>
                      
				</div>
			</header>
			<!-- end: header -->

			