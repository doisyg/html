<?php
require_once('../config/initSite.php');


do { $nom_dir_temp = uniqid(); } while (is_dir(dirname(__FILE__).'/tmp/'.$nom_dir_temp));


$cheminDossier = dirname(__FILE__).'/tmp/'.$nom_dir_temp.'/';

$zip = new ZipArchive;
$res = $zip->open('default.zip');
$zip->extractTo($cheminDossier);
$zip->close();


function TraiterDossier($id_config, $dir, $parent = '')
{
	$modifications = '';
	
	$fichiers = scandir($dir);
	foreach($fichiers as $fichier)
	{
		if ($fichier == '.' || $fichier == '..') continue;
		
		if (is_dir($dir.$fichier))
		{
			$modifications .= TraiterDossier($id_config, $dir.$fichier.'/', $parent.'/'.$fichier);
		}
		else
		{
			$extension = explode(".", $fichier);
			$extension = $extension[count($extension)-1];
			switch($extension)
			{
				case 'secret':
				case 'yaml':
				default:
					
					$conf = new RobotConfigValue();
					$conf->id_robot_config = $id_config;
					$conf->directory = $parent;
					$conf->file = $fichier;
					$conf->data = file_get_contents($dir.$fichier);
					$conf->date_upd_server = date('Y-m-d H:i:s', filemtime($dir.$fichier));
					$conf->is_file = 0;
					$conf->Save();
					
					$modifications .= 'Add file '.$parent.'/'.$fichier."\n";
					
					break;
					/*
					$modifications .= 'Add file '.$parent.'/'.$fichier."\n";
					
					do { $nom_fichier_temp = uniqid(); } while (file_exists(dirname(__FILE__).'/fichiers/'.$nom_fichier_temp));
					
					copy($dir.$fichier, dirname(__FILE__).'/fichiers/'.$nom_fichier_temp);
					
					$conf = new RobotConfigValue();
					$conf->id_robot_config = $id_config;
					$conf->directory = $parent;
					$conf->file = $fichier;
					$conf->data = $nom_fichier_temp;
					$conf->date_upd_server = date('Y-m-d H:i:s', filemtime($dir.$fichier));
					$conf->is_file = 1;
					$conf->Save();
					
					break;
					*/
					
			}
		}
	}
	
	return $modifications;
}

$config = new RobotConfig();
$config->date = date('Y-m-d H:i:s');
$config->modifications = '';
$config->Save();

$config->modifications = TraiterDossier($config->id_robot_config, $cheminDossier);
$config->Save();


Tools::DeleteDir($cheminDossier);

?><pre><?php echo $config->modifications;?></pre>