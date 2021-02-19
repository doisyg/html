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

if(file_exists(__DIR__ .'/../.git/HEAD')){
	$stringfromfile = file(__DIR__ .'/../.git/HEAD', FILE_USE_INCLUDE_PATH);
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
	if($bn == 'rel'){
		$file_version = __DIR__ .'/version.conf';
		if(file_exists($file_version))
			$json_version = json_decode(file_get_contents($file_version), true);
		if(isset($json_version) && !is_null($json_version) && isset($json_version['release']) && $json_version['release'] != '')
			$version = $json_version['release']; // GET RELEASE DATE FROM VERSION.CONF
		else{
			$version = date('Ymd'); // RELEASE NO VERSION.CONF OR INVALID
			$error_conf_release = true; // FOR TEST IN FOOTER JS
		}
	}else
		$version = date('Ymd').'_'.$bn;
}else{
	$bn = 'rel'; // NO GIT => RELEASE MODE
	$_CONFIG['MODE'] = 'PROD';
	$version = date('Ymd');
}

$_CONFIG['CONF_PATH'] = $_CONFIG['MODE'] == 'DEV' ? dirname(__FILE__).'/../lang/c.conf' : dirname(__FILE__).'/../../conf/c.conf';

/* ROBOT HOST HTTP*/
$VM = false;
if($_CONFIG['MODE'] == 'PROD'){
	$_CONFIG['ROBOT_HOST'] = 'wyca.run';
}else{
	if(file_exists('C:\\Users\\Yvan') || file_exists('C:\\Users\\F')){
		//F
		$_CONFIG['ROBOT_HOST'] = $VM ? '172.25.65.22' : '10.0.0.72';
	}else{
		//SMORILLON
		$_CONFIG['ROBOT_HOST'] = '192.168.0.33';
	}
}

$_CONFIG['ROBOT_HTTP'] = $server_request_scheme.'://'.$_CONFIG['ROBOT_HOST'];
$_CONFIG['ROBOT_HOST'] .= $server_request_scheme == 'http' ? ':9094' : ':9095';

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
