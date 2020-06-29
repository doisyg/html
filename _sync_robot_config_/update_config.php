<?php
require_once('../config/initSite.php');

if (!isset($_POST['files_upd']) || !isset($_POST['c']) || !isset($_POST['id_c'])) { die (json_encode(array('success' => false, 'message' => 'Incorrect parameters'))); }

$fichiers_upd_json = Tools::WycaDecrypt($_POST['files_upd'], $_POST['c']);

$fichiers_upd = json_decode($fichiers_upd_json);

$currentConfig = new RobotConfig($_POST['id_c']);
if ($currentConfig->id_robot_config <= 0) { die (json_encode(array('success' => false, 'message' => 'Incorrect parameters'))); }

$currentConfig->Dupliquer();
$currentConfig->update_by = 'Robot';
$currentConfig->modifications = '';

$fichiers = $currentConfig->GetListByFile();

foreach($fichiers_upd as $fichier)
{
	if ($fichier->type == 'delete')
	{
		$currentConfig->modifications .= 'Delete file '.$fichier->file."\n";
		$fichiers[$fichier->file]->Supprimer();
	}
	elseif ($fichier->type == 'copy')
	{
		$currentConfig->modifications .= 'Update file '.$fichier->file."\n";
		$configValue = new RobotConfigValue();
		$configValue->id_robot_config = $currentConfig->id_robot_config;
		
		$part = explode('/',$fichier->file);
		$configValue->file = array_pop($part);
		$configValue->directory = implode('/', $part);
		$configValue->data = $fichier->content;
		$configValue->date_upd_robot = $fichier->date_upd;
		$configValue->is_file = 0;
		$configValue->Save();
	}
	else
	{
		$currentConfig->modifications .= 'Add file '.$fichier->file."\n";
		$fichiers[$fichier->file]->data = $fichier->content;
		$fichiers[$fichier->file]->date_upd_robot = $fichier->date_upd;
		$fichiers[$fichier->file]->Save();
	}
}


$currentConfig->Save();

echo json_encode(array('success' => true, 'reponse' => Tools::WycaCrypt(json_encode(array('new_id_config' => $currentConfig->id_robot_config)))));

