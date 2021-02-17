<?php
ini_set('memory_limit', '256M');
define('_TRANS_PATTERN_', '(.*[^\\\\])');

error_reporting(E_ALL);
ini_set("display_errors", 1);

@session_start();
date_default_timezone_set ('Europe/Paris');

putenv('PATH='.getenv('PATH').':/usr/bin/');

if (isset($_SESSION["id_user"]) && $_SESSION["IP"] != $_SERVER["REMOTE_ADDR"] && !isset($_SESSION['signature_template']))
{
	@session_destroy();
	@session_start();
}

require_once (dirname(__FILE__)."/config.php");

// Check if http or https
if ( (! empty($_SERVER['REQUEST_SCHEME']) && $_SERVER['REQUEST_SCHEME'] == 'https') ||
     (! empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] == 'on') ||
     (! empty($_SERVER['SERVER_PORT']) && $_SERVER['SERVER_PORT'] == '443') ) {
	$server_request_scheme = 'https';
    $_CONFIG['URL'] = "https://wyca.run/";
} else {
	$server_request_scheme = 'http';
    $_CONFIG['URL'] = "http://wyca.run/";
}
$_CONFIG['URL_API'] = $_CONFIG['URL']."API/";

$_CONFIG['MODE'] = file_exists('C:\\')? 'DEV':'PROD';
$_CONFIG['CONF_PATH'] = $_CONFIG['MODE'] == 'DEV' ? dirname(__FILE__).'/../lang/c.conf' : dirname(__FILE__).'/../../conf/c.conf';

require_once (dirname(__FILE__)."/../lib/lib.php");
require_once (dirname(__FILE__)."/../classes/includes.php");


foreach ($_GET as $key => $value)
	$_GET[$key] = xss_clean($value); 
	
foreach ($_POST as $key => $value)
	if (is_array($value))
	{
		foreach($value as $k => $v)
			if ($k != 'b64' && $k!='imageData')
				$_POST[$key][$k] = xss_clean($v); 
	}
	elseif ($key != 'b64' && $key!='imageData' && $key!='image_tri')
		$_POST[$key] = xss_clean($value); 


/*
if (isset($_SESSION['id_lang']))
	$currentIdLang = $_SESSION['id_lang'];
else
{
	$currentIdLang = 2;
	$_SESSION['id_lang'] = $currentIdLang;
}
*/
$currentIdLang = Configuration::GetValue('ID_LANG');
if ($currentIdLang == '') $currentIdLang = 2;

$currentLang = new Lang($currentIdLang);
$translate = new Translate($currentLang->iso);

$app_sound = Configuration::GetValue('APP_SOUND');
if($app_sound == '')
	$app_sound = 'false';

if (!isset($notCloseSession)) session_write_close();

?>
