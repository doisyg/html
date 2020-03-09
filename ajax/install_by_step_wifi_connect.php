<?php 
require_once ('../config/initSite.php');
if (!isset($_SESSION["id_user"])) die();
if ($userConnected->id_groupe_user > 2) die();

$result = Wifi::Connect($_POST['ssid'], $_POST['passwd']);

if (!$result['error']))
{
	$confStep = Configuration::GetFromVariable('INSTALL_STEP');
	$confStep->valeur = 2;
	$confStep->Save();
}

echo json_encode($result);

?>