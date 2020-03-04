<?php
ini_set('memory_limit', '256M');
define('_TRANS_PATTERN_', '(.*[^\\\\])');

//error_reporting(E_ALL);
//ini_set("display_errors", 1);

@session_start();
date_default_timezone_set ('Europe/Paris');

putenv('PATH='.getenv('PATH').':/usr/bin/');

if (isset($_SESSION["id_user"]) && $_SESSION["IP"] != $_SERVER["REMOTE_ADDR"] && !isset($_SESSION['signature_template']))
{
	@session_destroy();
	@session_start();
}

require_once(dirname(__FILE__)."/config.php");
require_once(dirname(__FILE__)."/../lib/lib.php");
require_once (dirname(__FILE__)."/../classes/includes.php");

DB::Connexion($_CONFIG['BD_HOST'], $_CONFIG['BD_USER'], $_CONFIG['BD_PASSWORD'], $_CONFIG['BD_BD']);

IpErrorTrace::AutoClear();
IpBlocked::AutoClear();
if (IpBlocked::IsBlocked($_SERVER['REMOTE_ADDR']))
{
	?>
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
    
        </head>
        <body>
            <h2><?php echo __('Your access is blocked!');?></h2>
            <p><?php echo __('It will be unlocked in a few minutes.');?></p>
        </body>
    </html>
    <?php
	die();
}


if (isset($_SESSION["id_user"]))
{
	$userConnected = new User($_SESSION["id_user"]);
	$userConnected->last_connection = date('Y-m-d H:i:s');
	$userConnected->Save();
		
	$currentIdSite = Configuration::GetValue('CURRENT_SITE');
	$currentIdMap = Configuration::GetValue('CURRENT_MAP');
	$currentSite = new Site($currentIdSite);
	$currentMap = new Map($currentIdMap);
}

foreach ($_GET as $key => $value)
	$_GET[$key] = xss_clean($value); 
	
foreach ($_POST as $key => $value)
	if (is_array($value))
	{
		foreach($value as $k => $v)
			if ($k != 'b64' && $k!='imageData')
				$_POST[$key][$k] = xss_clean($v); 
	}
	elseif ($key != 'b64' && $key!='imageData')
		$_POST[$key] = xss_clean($value); 
		
$currentIdLang = Configuration::GetValue('ID_LANG');
$currentLang = new Lang($currentIdLang);
$translate = new Translate($currentLang->iso);

if (!isset($notCloseSession)) session_write_close();


?>
