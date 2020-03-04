<!doctype html>
<html class="fixed">
	<head>

		<!-- Basic -->
		<meta charset="UTF-8">

		<title>Elodie | Wyca Robotics</title>
		<meta name="author" content="Wyca Robotics">
            
            
        <link rel="shortcut icon" href="<?php echo $_CONFIG['URL'];?>assets/images/favicon/favicon.ico" type="image/x-icon">
        <link rel="icon" href="<?php echo $_CONFIG['URL'];?>assets/images/favicon/favicon.png" type="image/png">
        <link rel="icon" sizes="32x32" href="<?php echo $_CONFIG['URL'];?>assets/images/favicon/favicon-32.png" type="image/png">
        <link rel="icon" sizes="64x64" href="<?php echo $_CONFIG['URL'];?>assets/images/favicon/favicon-64.png" type="image/png">
        <link rel="icon" sizes="96x96" href="<?php echo $_CONFIG['URL'];?>assets/images/favicon/favicon-96.png" type="image/png">
        <link rel="icon" sizes="196x196" href="<?php echo $_CONFIG['URL'];?>assets/images/favicon/favicon-196.png" type="image/png">
        <link rel="apple-touch-icon" sizes="152x152" href="<?php echo $_CONFIG['URL'];?>assets/images/favicon/apple-touch-icon.png">
        <link rel="apple-touch-icon" sizes="60x60" href="<?php echo $_CONFIG['URL'];?>assets/images/favicon/apple-touch-icon-60x60.png">
        <link rel="apple-touch-icon" sizes="76x76" href="<?php echo $_CONFIG['URL'];?>assets/images/favicon/apple-touch-icon-76x76.png">
        <link rel="apple-touch-icon" sizes="114x114" href="<?php echo $_CONFIG['URL'];?>assets/images/favicon/apple-touch-icon-114x114.png">
        <link rel="apple-touch-icon" sizes="120x120" href="<?php echo $_CONFIG['URL'];?>assets/images/favicon/apple-touch-icon-120x120.png">
        <link rel="apple-touch-icon" sizes="144x144" href="<?php echo $_CONFIG['URL'];?>assets/images/favicon/apple-touch-icon-144x144.png">
        <meta name="msapplication-TileImage" content="<?php echo $_CONFIG['URL'];?>assets/images/favicon/favicon-144.png">
        <meta name="msapplication-TileColor" content="#FFFFFF"> 
        
		<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />

		<link href="<?php echo $_CONFIG['URL'];?>assets/stylesheets/fonts/opensans/opensans.css" rel="stylesheet" type="text/css">

		<link rel="stylesheet" href="<?php echo $_CONFIG['URL'];?>assets/vendor/bootstrap/css/bootstrap.css" />
		<link rel="stylesheet" href="<?php echo $_CONFIG['URL'];?>assets/vendor/font-awesome/css/font-awesome.css" />
        
		<link rel="stylesheet" href="<?php echo $_CONFIG['URL'];?>assets/vendor/jquery-ui/css/ui-lightness/jquery-ui-1.10.4.custom.css" />
        
		<link rel="stylesheet" href="<?php echo $_CONFIG['URL'];?>assets/stylesheets/wyca.css" />
    

	</head>
	<body>
		
        <header class="header">
        
        	<div class="menu_groupe">
            	<div class="btn-group pull-left" role="group" aria-label="Change group">
	            	<?php if ($userConnected->id_groupe_user <= 1) { ?><button type="button" data-groupe="pages_wyca" data-btn_class="btn-danger" class="btn_change_group btn btn-sm btn-<?php echo $userConnected->id_groupe_user == 1?'danger active':'default';?>">Wyca</button><?php }?>
	            	<?php if ($userConnected->id_groupe_user <= 2) { ?><button type="button" data-groupe="pages_install" data-btn_class="btn-warning" class="btn_change_group btn btn-sm btn-<?php echo $userConnected->id_groupe_user == 2?'warning active':'default';?>">Install</button><?php }?>
	            	<?php if ($userConnected->id_groupe_user <= 3) { ?><button type="button" data-groupe="pages_manager" data-btn_class="btn-primary" class="btn_change_group btn btn-sm btn-<?php echo $userConnected->id_groupe_user == 3?'primary active':'default';?>">Manager</button><?php }?>
	            	<?php if ($userConnected->id_groupe_user <= 4) { ?><button type="button" data-groupe="pages_user" data-btn_class="btn-success" class="btn_change_group btn btn-sm btn-<?php echo $userConnected->id_groupe_user == 4?'success active':'default';?>">User</button><?php }?>
                </ul>
            </div>
            <div class="pull-right">
            	<a href="#" class="btn btn-circle btn-default"><i class="fa fa-question"></i></a>
            </div>
        	<div>
                <div id="icoBattery" class="icone_header" data-toggle="tooltip" data-placement="bottom" title="" data-original-title="<?php echo __('Battery level');?>">
                	<i class="fa fa-battery-0"></i>
                	<span>100 %</span>
                </div>  
                <div class="icone_header safety_stop" data-toggle="tooltip" data-placement="bottom" title="" data-original-title="<?php echo __('Emergency stop');?>"><i class="fa fa-exclamation-circle battery-ko"></i></div>
            </div>
            <div style="clear:both;"></div>
		</header>
        <div id="contentAll">

			