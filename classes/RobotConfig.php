<?php
class RobotConfig extends RobotConfigCore
{

	private static function TraiterDossier($id_config, $robot, $dir, $parent = '')
	{
		$modifications = '';
		
		$fichiers = scandir($dir);
		foreach($fichiers as $fichier)
		{
			if ($fichier == '.' || $fichier == '..') continue;
			
			if (is_dir($dir.$fichier))
			{
				$modifications .= self::TraiterDossier($id_config, $robot, $dir.$fichier.'/', $parent.'/'.$fichier);
			}
			else
			{
				$extension = explode(".", $fichier);
				$extension = $extension[count($extension)-1];
				switch($extension)
				{
					case 'secret':
					case 'yaml':
						$conf = new RobotConfigValue();
						$conf->id_robot_config = $id_config;
						$conf->directory = $parent;
						$conf->file = $fichier;
						$conf->data = file_get_contents($dir.$fichier);
						$conf->date_upd_server = date('Y-m-d H:i:s', filemtime($dir.$fichier));
						$conf->is_file = 0;
						
						if ($fichier == 'interface_urls.yaml')
						{
							$conf->data = 'page_list: "https://traxdev.wyca-solutions.com/robot_hmi/mapping/robot.php?id_robot='.$robot->id_robot.'&code='.$robot->code.'"';
						}
						elseif ($fichier == 'port.yaml')
						{
							$conf->data = 'port: 9090';
						}
						elseif ($fichier == 'valid.secret')
						{
							$conf->data = $robot->ros_hash;
						}
						
						$conf->Save();
						
						$modifications .= 'Add file '.$parent.'/'.$fichier."\n";
						
						break;
					default:
						
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
				}
			}
		}
		
		return $modifications;
	}
	
	public static function InitConfig($id_robot)
	{
		global $_CONFIG;
		
		$robot = new Robot($id_robot);
		
		$config = new RobotConfig();
		$config->id_robot = $id_robot;
		$config->date = date('Y-m-d H:i:s');
		$config->modifications = '';
		$config->Save();
		
		$config->modifications = self::TraiterDossier($config->id_robot_config, $robot, $_CONFIG['DIR_SECURE'].'default/');
		$config->Save();
	}
	
	private $_config_values = null;
	public function GetConfigValues($order = "", $order_sens = "")
	{
		if ($this->_config_values == null)
		{
			$query = "SELECT * FROM robot_config_value WHERE id_robot_config=".(int)$this->id_robot_config;
			if ($order!="")
				$query .= " ORDER BY ".mysqli_real_escape_string(DB::$connexion, $order)." ".mysqli_real_escape_string(DB::$connexion, $order_sens);
			else 
				$query .= " ORDER BY id_robot_config_value ASC";
			$result = mysqli_query(DB::$connexion, $query);
			$this->_config_values = array();
			while ($row = @mysqli_fetch_object( $result ) )
			{
				$this->_config_values[] = new RobotConfigValue($row, true);
			}
			@mysqli_free_result( $result );
		}
		return $this->_config_values;
	}
	
	public function GetListByFile()
	{
		$values = $this->GetConfigValues();
		$fichiers = array();
		foreach($values as $value)
		{
			$fichiers[$value->directory.'/'.$value->file] = $value;
		}
		
		return $fichiers;
	}
	
	public function CheckHaveUpdateFilesOnRobot($fichiers_robot)
	{
		$fichiersServeur = $this->GetListByFile();
		
		foreach($fichiers_robot as $fichier_robot)
		{
			if (!isset($fichiersServeur[$fichier_robot->file])) return true;
			if ($fichier_robot->date_upd != $fichiersServeur[$fichier_robot->file]->date_upd_robot) return true;
			
			unset($fichiersServeur[$fichier_robot->file]);
		}
		
		if (count($fichiersServeur) > 0) return true;
		
	}
	
	public function GetListUpdateFilesOnRobot($fichiers_robot)
	{
		$fichierToUpdate = array();
		$fichiersServeur = $this->GetListByFile();
		
		foreach($fichiers_robot as $fichier_robot)
		{
			if (!isset($fichiersServeur[$fichier_robot->file])) $fichierToUpdate[] = array('file' => $fichier_robot->file, 'sens' => 'rts', 'type' => 'copy');
			else
			{
				if ($fichier_robot->date_upd != $fichiersServeur[$fichier_robot->file]->date_upd_robot) $fichierToUpdate[] = array('file' => $fichier_robot->file, 'sens' => 'rts', 'type' => 'update');
				unset($fichiersServeur[$fichier_robot->file]);
			}
		}
		
		foreach($fichiersServeur as $fichier)
		{
			 $fichierToUpdate[] = array('file' => $fichier->directory.'/'.$fichier->file, 'sens' => 'rts', 'type' => 'delete');
		}
		
		return $fichierToUpdate;
	}
	
	
	public function GetListUpdateFilesOnServer($fichiers_robot)
	{
		$fichierToUpdate = array();
		$fichiersServeur = $this->GetListByFile();
		
		foreach($fichiers_robot as $fichier_robot)
		{
			if (!isset($fichiersServeur[$fichier_robot->file])) $fichierToUpdate[] = array('file' => $fichier_robot->file, 'sens' => 'str', 'type' => 'delete');
			else
			{
				if ($fichier_robot->date_upd != $fichiersServeur[$fichier_robot->file]->date_upd_robot) $fichierToUpdate[] = array('file' => $fichier_robot->file, 'sens' => 'str', 'type' => 'update', 'content' => $fichiersServeur[$fichier_robot->file]->data);
				
				unset($fichiersServeur[$fichier_robot->file]);
			}
		}
		
		foreach($fichiersServeur as $fichier)
		{
			 $fichierToUpdate[] = array('file' => $fichier->directory.'/'.$fichier->file, 'sens' => 'str', 'type' => 'copy', 'content' => $fichier->data);
		}
		
		return $fichierToUpdate;
	}
	
	public function Dupliquer()
	{
		$values = $this->GetConfigValues();
		
		$this->id_robot_config = -1;
		$this->date = date('Y-m-d H:i:s');
		$this->Save();
		
		foreach($values as $value)
		{
			$value->id_robot_config_value = -1;
			$value->id_robot_config = $this->id_robot_config;
			$value->Save();
		}
		
		$this->_config_values = null;
	}
	
	public function GetValue($dir, $file)
	{
		$query = "SELECT * FROM robot_config_value WHERE id_robot_config=".(int)$this->id_robot_config." AND directory='".$dir."' AND file='".$file."'";
		$result = mysqli_query(DB::$connexion, $query);
		$config = null;
		while ($row = @mysqli_fetch_object( $result ) )
		{
			$config = new RobotConfigValue($row, true);
		}
		@mysqli_free_result( $result );
		return $config;
	}
	
	public static function GetLastConfig()
	{
		$query='SELECT * FROM robot_config WHERE 1 ORDER BY date DESC LIMIT 1';
		$result = mysqli_query(DB::$connexion, $query);
		$config = null;
		if ($row = @mysqli_fetch_object( $result ) )
		{
			$config = new RobotConfig($row, true);
		}
		@mysqli_free_result( $result );
		return $config;
	}
}
?>