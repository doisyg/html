<?php 
require_once ('../config/initSite.php');
if (!isset($_SESSION["id_user"])) die();
if ($_SESSION['id_groupe_user'] > 2) die();


if (isset($_POST['id_map']))
{
	$plan = new Map($_POST['id_map']);
	
	$forbiddens = $plan->GetForbiddenAreas();
	foreach($forbiddens as $forbidden)
	{
		$forbidden->GetPoints();
	}
	$areas = $plan->GetAreas();
	foreach($areas as $area)
	{
		$area->GetPoints();
		$area->GetConfigs();
	}
	$docks = $plan->GetStationRecharges();
	$pois = $plan->GetPois();
	
	echo json_encode(array(
		'id_map' => $plan->id_map, 
		'forbiddens' => $forbiddens, 
		'areas' => $areas, 
		'docks' => $docks, 
		'pois' => $pois,
		'plan' => $plan,
		'error' => ''
	));
}
else
	echo json_encode(array('id_map' => -1, 'error' => 'no param'));
?>
