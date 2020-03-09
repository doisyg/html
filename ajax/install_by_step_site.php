<?php 
require_once ('../config/initSite.php');
if (!isset($_SESSION["id_user"])) die();
if ($userConnected->id_groupe_user > 2) die();

if (isset($_POST['name']) && trim($_POST['name']))
{
	$confStep = Configuration::GetFromVariable('INSTALL_STEP');
	$confStep->valeur = 7;
	$confStep->Save();
	
	$currentSite->name = $_POST['name'];
	$currentSite->Save();
	
	
	echo json_encode(array('error' => ''));
}
else
	echo json_encode(array('error' => 'no name'));
?>