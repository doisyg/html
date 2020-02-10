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

if (isset($_SESSION["id_user"]))
{
	$userConnected = new User($_SESSION["id_user"]);
	$userConnected->last_connection = date('Y-m-d H:i:s');
	if (isset($_GET['lang']))
	{
		$userConnected->id_lang = Lang::GetIdByIso($_GET['lang']);
	}
	else
	{
		if (!isset($_COOKIE['id_lang']) || $_COOKIE['id_lang'] != $userConnected->id_lang)
		{
			$l = new Lang($userConnected->id_lang);
			$_COOKIE['lang']=$l->iso; setcookie("lang", $l->iso, time()+2592000);
			$_COOKIE['id_lang'] = $userConnected->id_lang;
			setcookie("id_lang", $userConnected->id_lang, time()+2592000);
		}
	}
	$userConnected->Save();
	
	$currentIdSite = Configuration::GetValue('CURRENT_SITE');
	$currentIdPlan = Configuration::GetValue('CURRENT_MAP');
	$currentIdMap = $currentIdPlan;
	$currentSite = new Site($currentIdSite);
	$currentMap = new Plan($currentIdPlan);
}


if (isset($_SESSION["id_developer"]))
{
	$userConnected = new User($_SESSION["id_developer"]);
	$userConnected->last_connection = date('Y-m-d H:i:s');
	$userConnected->Save();
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
		

if (!isset($_COOKIE['lang']))
{ 
	$_COOKIE['lang']='fr'; setcookie("lang", 'fr', time()+2592000);
	$_COOKIE['id_lang'] = Lang::GetIdByIso($_COOKIE['lang']);
	setcookie("id_lang", $_COOKIE['id_lang'], time()+2592000);
}

if (isset($_GET['lang']))
{ 
	$_COOKIE['lang']=$_GET['lang']; setcookie("lang", $_GET['lang'], time()+2592000);
	$_COOKIE['id_lang'] = Lang::GetIdByIso($_COOKIE['lang']);
	setcookie("id_lang", $_COOKIE['id_lang'], time()+2592000);
}

$translate = new Translate($_COOKIE['lang']);

if (!isset($notCloseSession)) session_write_close();


?>
