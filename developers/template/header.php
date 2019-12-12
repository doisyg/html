<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- The above 3 meta tags *must* come first in the head; any other head content must come *after* these tags -->
    <title><?php echo __('Wyca - Developers');?></title>
    
    <link rel="apple-touch-icon" sizes="57x57" href="<?php echo $_CONFIG['URL'];?>developers/template/images/favicon/apple-icon-57x57.png">
    <link rel="apple-touch-icon" sizes="60x60" href="<?php echo $_CONFIG['URL'];?>developers/template/images/favicon/apple-icon-60x60.png">
    <link rel="apple-touch-icon" sizes="72x72" href="<?php echo $_CONFIG['URL'];?>developers/template/images/favicon/apple-icon-72x72.png">
    <link rel="apple-touch-icon" sizes="76x76" href="<?php echo $_CONFIG['URL'];?>developers/template/images/favicon/apple-icon-76x76.png">
    <link rel="apple-touch-icon" sizes="114x114" href="<?php echo $_CONFIG['URL'];?>developers/template/images/favicon/apple-icon-114x114.png">
    <link rel="apple-touch-icon" sizes="120x120" href="<?php echo $_CONFIG['URL'];?>developers/template/images/favicon/apple-icon-120x120.png">
    <link rel="apple-touch-icon" sizes="144x144" href="<?php echo $_CONFIG['URL'];?>developers/template/images/favicon/apple-icon-144x144.png">
    <link rel="apple-touch-icon" sizes="152x152" href="<?php echo $_CONFIG['URL'];?>developers/template/images/favicon/apple-icon-152x152.png">
    <link rel="apple-touch-icon" sizes="180x180" href="<?php echo $_CONFIG['URL'];?>developers/template/images/favicon/apple-icon-180x180.png">
    <link rel="icon" type="image/png" sizes="192x192"  href="<?php echo $_CONFIG['URL'];?>developers/template/images/favicon/android-icon-192x192.png">
    <link rel="icon" type="image/png" sizes="32x32" href="<?php echo $_CONFIG['URL'];?>developers/template/images/favicon/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="96x96" href="<?php echo $_CONFIG['URL'];?>developers/template/images/favicon/favicon-96x96.png">
    <link rel="icon" type="image/png" sizes="16x16" href="<?php echo $_CONFIG['URL'];?>developers/template/images/favicon/favicon-16x16.png">
    <link rel="manifest" href="<?php echo $_CONFIG['URL'];?>developers/template/images/favicon/manifest.json">
    <meta name="msapplication-TileColor" content="#ffffff">
    <meta name="msapplication-TileImage" content="<?php echo $_CONFIG['URL'];?>developers/template/images/favicon/ms-icon-144x144.png">
    <meta name="theme-color" content="#ffffff">

	 <link rel="stylesheet" href="<?php echo $_CONFIG['URL'];?>developers/js/jquery-ui-1.11.4.custom/jquery-ui.min.css">
    <!-- Bootstrap -->
    <link href="<?php echo $_CONFIG['URL'];?>developers/css/bootstrap.css" rel="stylesheet">
    <link href="<?php echo $_CONFIG['URL'];?>developers/css/bootstrap-switch.min.css" rel="stylesheet">
    <link href="<?php echo $_CONFIG['URL'];?>developers/css/bootstrap-datetimepicker.min.css" rel="stylesheet">
	<link href='https://fonts.googleapis.com/css?family=Montserrat%3A400%2C700&#038;subset=latin&#038;ver=1455269554' type='text/css' media='all' rel='stylesheet' id='anaglyph-google-fonts-anaglyph_config-css' />
	<link href="<?php echo $_CONFIG['URL'];?>developers/css/font-awesome.min.css" rel="stylesheet">
    <link href="<?php echo $_CONFIG['URL'];?>developers/js/fancybox/source/jquery.fancybox.css?v=2.1.5" media="screen" rel="stylesheet" type="text/css" />
	<link href="<?php echo $_CONFIG['URL'];?>developers/css/custom.css" rel="stylesheet">
    
    <!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
      <script src="<?php echo $_CONFIG['URL'];?>developers/js/html5shiv.min.js"></script>
      <script src="<?php echo $_CONFIG['URL'];?>developers/js/respond.min.js"></script>
    <![endif]-->
    
    <?php
	if (isset($jquery) && $jquery==2)
	{	
    	?><script src="<?php echo $_CONFIG['URL'];?>developers/js/jquery/jquery.js"></script><?php
	}
	else
	{
    	?><script src="<?php echo $_CONFIG['URL'];?>developers/js/jquery-1.11.3.min.js"></script><?php
	}
    ?>  
    
    <script src="<?php echo $_CONFIG['URL'];?>developers/js/moment.min.js"></script>
    <script src="<?php echo $_CONFIG['URL'];?>developers/js/bootstrap-switch.min.js"></script>
    <script src="<?php echo $_CONFIG['URL'];?>developers/js/bootstrap-datetimepicker.min.js"></script>
    
    <script>
	var langStrCalling = "<?php echo addslashes(stripslashes(__('Calling')));?>";
	var langStrNotConnected = "<?php echo addslashes(stripslashes(__('Not Connected')));?>";
	var langStrOnline = "<?php echo addslashes(stripslashes(__('Online')));?>";
	var langStrOffline = "<?php echo addslashes(stripslashes(__('Offline')));?>";
	
	var currentUserIsOnline = <?php echo (true || $userConnected->online == 1)?'true':'false';?>;
	var lienIconNotify = "<?php echo $_CONFIG['URL'];?>developers/images/video_alerte.jpg";
	var id_user_connected = <?php echo $userConnected->id_user;?>;
	var id_user_group = <?php echo $userConnected->id_groupe_user;?>;
	var user_can_reprendre = <?php echo $userConnected->CanDo('repondre', '', 'edit')?'true':'false';?>;
	</script>
    
    
     
  </head>
  <body>
  <nav class="navbar navbar-inverse navbar-static-top">
   <div class="container-fluid">
		<a href="<?php echo $_CONFIG['URL'];?>developers/" class="navbar-brand">
        	<img src="<?php echo $_CONFIG['URL'];?>developers/images/wyca-horizontal-blanc.png" height="36px" alt="">
        </a>
  
  	<ul class="nav navbar-nav">
        <li><a href="<?php echo $_CONFIG['URL'];?>developers/"><i class="fa fa-home" aria-hidden="true"></i> <?php echo __('Home');?></a></li>
        
	    <li><a href="<?php echo $_CONFIG['URL'];?>developers/api_demo.php"><i class="fa fa-gamepad" aria-hidden="true"></i> <?php echo __('Demo');?></a></li>
        <li><a href="<?php echo $_CONFIG['URL'];?>developers/documentation/index.php"><i class="fa fa-question-circle " aria-hidden="true"></i> <?php echo __('Documentation');?></a></li>
        
        <?php
		if ($userConnected->id_groupe_user == 1)
		{
			?>
	        <li><a href="<?php echo $_CONFIG['URL'];?>developers/api_configuration.php"><i class="fa fa-gears" aria-hidden="true"></i> <?php echo __('API Configuration');?></a></li>
            <li><a href="<?php echo $_CONFIG['URL'];?>developers/users_configuration.php"><i class="fa fa-users" aria-hidden="true"></i> <?php echo __('User Configuration');?></a></li>
            <?php
		}
		?>
    </ul> 
    
    <!--
    <p class="navbar-text">
    	<?php
		if ($userConnected->online == 1)
		{
    		?><span id="user-status-badge" class="badge navbar-badge-online"><?php echo __('Online');?></span><?php
		}
		else
		{
    		?><span id="user-status-badge" class="badge navbar-badge-offline"><?php echo __('Offline');?></span><?php
		}
		?>
    </p>
    -->
    
    <ul class="nav navbar-nav navbar-right">
    	<li>
        	<img src="<?php echo $_CONFIG['URL'];?>developers/users/vide.jpg" class="account-menu-avatar img-circle" alt="<?php echo $userConnected->prenom.' '.$userConnected->nom;?>">
		</li>
        <li class="dropdown">
          <a href="#"><?php echo $userConnected->prenom.' '.$userConnected->nom;?></a>
			
        </li>
     </ul>
        
        
    <ul id="menu_lang" class="nav navbar-nav navbar-right">
      <?php
		$langues = Lang::GetLangs();
		foreach ($langues as $lang)
		{
			?><li<?php if ($_COOKIE['lang'] == $lang->iso){?> <?php } ?>><a href="?lang=<?php echo $lang->iso;?>"><img src="<?php echo $_CONFIG['URL'];?>assets/images/lang/<?php echo $lang->iso;?>.jpg" /></a></li><?php
		}
		?>
    </ul>
    
    <ul class="nav navbar-nav navbar-right">
    	<li><a href="mailto:tech@wyca.fr"><i class="fa fa-question-circle" aria-hidden="true"></i> <?php echo __('Support technique');?></a></li>
    </ul>

  </div>
</nav>
<div class="container-fluid">
<?php
if (isset($_GET['notallow']))
{
	?>
    <div id="message-red">
    <table border="0" width="100%" cellpadding="0" cellspacing="0">
    <tr>
        <td class="red-left"><?php echo __('Vous n\'êtes pas autorisé à faire cette action');?></td>
        <td class="red-right"><a class="close-red"><img src="<?php echo $_CONFIG['URL'];?>_admin_/template/images/table/icon_close_red.gif"   alt="" /></a></td>
    </tr>
    </table>
    </div>
    <?php
}
?>

<?php
if (isset($_GET['ok']))
{
	?>
    <div id="message-green">
    <table border="0" width="100%" cellpadding="0" cellspacing="0">
    <tr>
        <td class="green-left"><?php echo __('Modification effectuée');?></td>
        <td class="green-right"><a class="close-green"><img src="<?php echo $_CONFIG['URL'];?>_admin_/template/images/table/icon_close_green.gif" alt="" /></a></td>
    </tr>
    </table>
    </div>
    <?php
}
?>


<?php
if (isset($_GET['error']))
{
	?>
    <div id="message-red">
    <table border="0" width="100%" cellpadding="0" cellspacing="0">
    <tr>
        <td class="red-left"><?php echo $_GET['error'];?></td>
        <td class="red-right"><a class="close-red"><img src="<?php echo $_CONFIG['URL'];?>_admin_/template/images/table/icon_close_red.gif" alt="" /></a></td>
    </tr>
    </table>
    </div>
    <?php
}
?>


<div class="row">

	
	
	<div class="col-md-12 col-lg-12">
		<div class="row">

  