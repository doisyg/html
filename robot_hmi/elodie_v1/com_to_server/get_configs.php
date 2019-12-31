<?php 
require_once ('../../../config/initSite.php');
require_once ('../config/config.php');

if (!isset($_SESSION['is_robot'])) die();

$configs = array();
$configs['level_min_gotodock'] = Configuration::GetValue('level_min_gotodock');
$configs['level_min_gotodock_aftertask'] = Configuration::GetValue('level_min_gotodock_aftertask');
$configs['level_min_dotask'] = Configuration::GetValue('level_min_dotask');

$configs['pois'] = array();
$pois = $currentMap->GetPois();
foreach($pois as $poi)
{
	$configs['pois'][$poi->id_poi] = $poi;
}

echo json_encode($configs);
