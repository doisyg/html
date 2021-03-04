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
        
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, viewport-fit=cover, shrink-to-fir=no, user-scalable=no, target-densityDpi=device-dpi" />
        <meta name="HandheldFriendly" content="true">

		<link href="<?php echo $_CONFIG['URL'];?>assets/stylesheets/fonts/opensans/opensans.css" rel="stylesheet" type="text/css">

		<link rel="stylesheet" href="<?php echo $_CONFIG['URL'];?>assets/vendor/bootstrap/css/bootstrap.css" />
		<link rel="stylesheet" href="<?php echo $_CONFIG['URL'];?>assets/vendor/font-awesome/css/font-awesome.css" />
        <link rel="stylesheet" href="<?php echo $_CONFIG['URL'];?>assets/vendor/bootstrap-colorpicker/css/bootstrap-colorpicker.min.css"></script>
        
        
		<link rel="stylesheet" href="<?php echo $_CONFIG['URL'];?>assets/vendor/jquery-ui/css/ui-lightness/jquery-ui-1.10.4.custom.css" />
        
		<?php $lastUpdate = $version; ?>
		<?php // $lastUpdate = ''; ?>

		<link rel="stylesheet" href="<?php echo $_CONFIG['URL'];?>assets/stylesheets/skins/default.css" />
		<link rel="stylesheet" href="<?php echo $_CONFIG['URL'];?>assets/stylesheets/skins/extension.css" />
        
		
		<link rel="stylesheet" href="<?php echo $_CONFIG['URL'];?>assets/stylesheets/wyca.css?v=<?php echo $lastUpdate;?>" />
		<link rel="stylesheet" href="<?php echo $_CONFIG['URL'];?>assets/stylesheets/map.css?v=<?php echo $lastUpdate;?>" />
			
		
		<!-- Fontawesome  -->
		<link rel="stylesheet" href="<?= $_CONFIG['URL'] ?>assets/vendor/fontawesome-free-5.13.0-web/css/all.css" />


	</head>
	<body>
        <header class="header">
        
        	<div class="menu_groupe">
            	<div class="btn-group pull-left" style="display:none" role="group" aria-label="Change group">
                	<?php if ($_SESSION['id_groupe_user'] <= 1) { ?><button id="bPagesWyca" type="button" data-groupe="pages_wyca" data-btn_class="btn-danger" class="btn_change_group btn btn-sm btn-<?php echo $_SESSION['id_groupe_user'] == 1?'danger active':'default';?>">Wyca</button><?php }?>
	            	<?php if ($_SESSION['id_groupe_user'] <= 2) { ?><button id="bPagesInstall" type="button" data-groupe="pages_install" data-btn_class="btn-warning" class="btn_change_group btn btn-sm btn-<?php echo $_SESSION['id_groupe_user'] == 2?'warning active':'default';?>">Install</button><?php }?>
                    <?php
					$INSTALL_STEP = Configuration::GetValue('INSTALL_STEP');
					if ($INSTALL_STEP == '') $INSTALL_STEP = 0;
					?>
	            	<?php if ($_SESSION['id_groupe_user'] <= 3) { ?><button id="bPagesManger" type="button" data-groupe="pages_manager" data-btn_class="btn-primary" class="btn_change_group btn btn-sm btn-<?php echo $_SESSION['id_groupe_user'] == 3?'primary active':'default';?>" <?php echo ($INSTALL_STEP < 100)?'style="display:none;"':'';?>>Manager</button><?php }?>
	            	<?php if ($_SESSION['id_groupe_user'] <= 4) { ?><button id="bPagesUser" type="button" data-groupe="pages_user" data-btn_class="btn-success" class="btn_change_group btn btn-sm btn-<?php echo $_SESSION['id_groupe_user'] == 4?'success active':'default';?>" <?php echo ($INSTALL_STEP < 100)?'style="display:none;"':'';?>>User</button><?php }?>
				</div>
				<div class="pull-right">
					<div id="icoBattery" class="icone_header" data-toggle="tooltip" data-placement="bottom" title="" data-original-title="<?php echo __('Battery level');?>">
						<i class="fa fa-battery-0"></i>
						<span>100 %</span>
					</div>  
					<div class="icone_header safety_stop" data-toggle="tooltip" data-placement="bottom" title="" data-original-title="<?php echo __('Emergency stop');?>"><img src="assets/images/emergency-stop-button.png"></div>
					<a href="#" class="stop_move btn btn-danger btn-circle" data-toggle="tooltip" data-placement="bottom" title="" data-original-title="<?php echo __('Stop move');?>"><i class="fa fa-stop battery-ko"></i></a>
					<a href="#" class="btn btn-circle btn-default" id="bHeaderInfo"><i class="fa fa-info"></i></a>
				</div>
				<div class="pull-left">
					<img class="nav_logo" src="assets/images/logo_white.png">
					<h1 class="title_section">Titre</h1>
				</div>
				<div style="clear:both;"></div>
			</div>
		</header>
        <div id="contentAll">

			