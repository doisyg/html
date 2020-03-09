<?php 
require_once ('../config/initSite.php');
if (!isset($_SESSION["id_user"])) die();
if ($userConnected->id_groupe_user > 2) die();

Top::DesactivateAll();
$top = new Top($_POST['id_top']);
$top->available = 1;
$top->active = 1;
$top->Save();

$confStep = Configuration::GetFromVariable('INSTALL_STEP');
$confStep->valeur = 5;
$confStep->Save();

echo json_encode(array('error' => ''));

?>