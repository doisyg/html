<?php 
require_once ('../config/initSite.php');
if (!isset($_SESSION["id_user"])) { header("location:login.php"); }

$sectionMenu = "maps";
$sectionSousMenu = "";

if (!$userConnected->CanDo($sectionMenu, $sectionSousMenu, 'add')) { echo json_encode(array('id_map' => $plan->id_plan, 'error' => 'not allow')); exit; }

$plan = new Plan((int)$_POST['id_plan']);
if ($plan->id_plan > 0)
{
	$cm = Configuration::GetFromVariable('CURRENT_MAP');
	$cm->valeur = $plan->id_plan;
	$cm->Save();
	$plan->SetAsActive();
	
	$plan->ExportToConfig();
	
	
	// A REVOIR
	// On sauve les images directement dans le dossier de config sur le robot
	
	$dossier_config = $_CONFIG['CONFIG_PATH'];
	
	$last_config = RobotConfig::GetLastConfig();
	
	$value = $last_config->GetValue('/map', 'map_amcl.png');
	if (isset($value->data)) file_put_contents($dossier_config.'map/map_amcl.png', $value->data);
	
	$value = $last_config->GetValue('/map', 'map_forbidden.png');
	if (isset($value->data)) file_put_contents($dossier_config.'map/map_forbidden.png', $value->data);
	
	$value = $last_config->GetValue('/map', 'map_areas.png');
	if (isset($value->data)) file_put_contents($dossier_config.'map/map_areas.png', $value->data);
	
	$value = $last_config->GetValue('/map', 'map_areas.yaml');
	if (isset($value->data)) file_put_contents($dossier_config.'map/map_areas.yaml', $value->data);
	
	$value = $last_config->GetValue('/map', 'areas.yaml');
	if (isset($value->data)) file_put_contents($dossier_config.'map/areas.yaml', $value->data);
	
}
?>
