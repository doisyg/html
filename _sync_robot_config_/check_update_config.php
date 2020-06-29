<?php
require_once('../config/initSite.php');

if (!isset($_POST['files_upd']) || !isset($_POST['c']) || !isset($_POST['id_c'])) { die (json_encode(array('success' => false, 'message' => 'Incorrect parameters 1'))); }


$fichiers_upd_json = Tools::WycaDecrypt($_POST['files_upd'], $_POST['c']);

$fichiers_upd = json_decode($fichiers_upd_json);

$currentConfig = new RobotConfig($_POST['id_c']);
if ($_POST['id_c'] != -1) { die (json_encode(array('success' => false, 'message' => 'Incorrect parameters'))); }

$last_config = RobotConfig::GetLastConfig();
$haveChangementVersion = ($last_config->id_robot_config != $currentConfig->id_robot_config);
$haveUpdatedFileOnRobot = $currentConfig->CheckHaveUpdateFilesOnRobot($fichiers_upd);

if (!$haveChangementVersion && !$haveUpdatedFileOnRobot)
{
	die(json_encode(array('success' => true, 'message' => Tools::WycaCrypt('No update'))));
}

if ($haveChangementVersion && $haveUpdatedFileOnRobot)
{
	// Horreur double modif
	// Il faut essayer de faire une nouvelle version avec les 2 configs
	
	// A minimal, on fait juste fichier par fichier si 2 fichier identique erreur à traiter manuellement
	$reponse = array();
	$reponse['todo'] = 'All';
	$reponse['id_config'] = $last_config->id_robot_config;
	$reponse['SendFileToServer'] = $currentConfig->GetListUpdateFilesOnRobot($fichiers_upd);
	$reponse['DownloadNewConfig'] = $currentConfig->GetListUpdateFilesOnServer($fichiers_upd);
	
	echo json_encode(array('success' => true, 'reponse' => Tools::WycaCrypt(json_encode($reponse))));
}
elseif ($haveUpdatedFileOnRobot)
{
	$reponse = array();
	$reponse['todo'] = 'SendFileToServer';
	$reponse['data'] = $currentConfig->GetListUpdateFilesOnRobot($fichiers_upd);
	
	echo json_encode(array('success' => true, 'reponse' => Tools::WycaCrypt(json_encode($reponse))));
}
elseif ($haveChangementVersion)
{
	$reponse = array();
	$reponse['todo'] = 'DownloadNewConfig';
	$reponse['id_config'] = $last_config->id_robot_config;
	$reponse['data'] = $last_config->GetListUpdateFilesOnServer($fichiers_upd);
	
	echo json_encode(array('success' => true, 'reponse' => Tools::WycaCrypt(json_encode($reponse))));
	//Config::Compare($id_config1, $id_config2);	
}