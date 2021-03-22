<?php 
require_once ('../config/initSite.php');
if (!isset($_SESSION["id_user"])) die('no_auth');
if ($_SESSION['id_groupe_user'] > 2) die('no_right');

$app_sound_str = Configuration::GetValue('APP_SOUND');
if($app_sound_str == '')
	$app_sound_str = 'false';
	
$app_sound = ($app_sound_str === 'true');
echo json_encode(array('error' => '','app_sound' => $app_sound));

?>