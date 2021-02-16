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

// GET GIT BRANCH
if(file_exists('.git/HEAD')){
	$stringfromfile = file('.git/HEAD', FILE_USE_INCLUDE_PATH);

	$firstLine = $stringfromfile[0]; //get the string from the array
	$explodedstring = explode("/", $firstLine, 3); //seperate out by the "/" in the string
	$branchname = $explodedstring[2]; //get the one that is always the branch name
	$lc = substr($branchname,-1);
	if($lc == "\n" || $lc == "\r"|| $lc == "\t");
		$branchname = substr($branchname,0,strlen($branchname)- 1);

	$bn = '';
	switch($branchname){
		case 'dev': $bn = 'dev'; break;
		case 'dev_yvan': $bn = 'dyv'; break;
		case 'master': $bn = 'mas'; break;
		case 'html_stable': $bn = 'sta'; break;
		case 'html_release': $bn = 'rel'; break;
		case 'multimap': $bn = 'mum'; break;

		default : 
			$explode = explode('_',$branchname);
			if(count($explode) > 1){
				foreach ($explode as $key => $value){
					$bn .= substr($value,0,1);
				}
			}
			else
				$bn = substr($branchname,0,2);
		break;
	}
	$version = date('Ymd').'_'.$bn;
	if($bn == 'rel'){
		// DO SMTHING SPECIAL ON RELEASE ?
		// STOCK DATE WRITE IT ON CONF FILE ?
	}
}else{
	$_CONFIG['MODE'] = 'PROD';
	$version = date('Ymd');
}
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
