<?php 
require_once ('../config/initSite.php');
if (!isset($_SESSION["id_user"])) die();
if ($userConnected->id_groupe_user > 2) die();

$confStep = Configuration::GetFromVariable('INSTALL_STEP');
$confStep->valeur = 2;
$confStep->Save();

echo json_encode(array('error' => ''));

?>