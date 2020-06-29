<?php
require_once('../config/initSite.php');

if (!isset($_POST['files_upd']) || !isset($_POST['c']) || !isset($_POST['id_c'])) { die (json_encode(array('success' => false, 'message' => 'Incorrect parameters'))); }

$fichiers_upd_json = Tools::WycaDecrypt($_POST['files_upd'], $_POST['c']);

$fichiers_upd = json_decode($fichiers_upd_json);

$currentConfig = new RobotConfig($_POST['id_c']);
if ($currentConfig->id_robot_config <= 0) { die (json_encode(array('success' => false, 'message' => 'Incorrect parameters'))); }

$fichiers = $currentConfig->GetListByFile();

foreach($fichiers_upd as $fichier)
{
	if ($fichier->type == 'delete')
	{
	}
	else
	{
		$fichiers[$fichier->file]->date_upd_robot = $fichier->date_upd;
		$fichiers[$fichier->file]->Save();
	}
}


$currentConfig->Save();

echo json_encode(array('success' => true, 'reponse' => ''));

