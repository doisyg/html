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

if (isset($_SESSION['id_lang']))
	$currentIdLang = $_SESSION['id_lang'];
else
{
	$currentIdLang = 2;
	$_SESSION['id_lang'] = $currentIdLang;
}

$currentLang = new Lang($currentIdLang);
$translate = new Translate($currentLang->iso);

if (!isset($notCloseSession)) session_write_close();


?>
