<?php
class RobotConfigCore
{
	public $id_robot_config = -1;
	public $id_site = -1;
	public $date = "";
	public $modifications = "";
	public $update_by = "Server";

	public function __construct( $id_robot_config = null, $byrow=false ) 
	{
		if ($byrow)
		{
			$this->Copy($id_robot_config);
		}
		elseif(! is_null($id_robot_config) && $id_robot_config != -1 )
		{
			$object = RobotConfig::getRobotConfig( $id_robot_config );
			if ($object)
			{
				$this->Copy($object);
			}
		}
	}

	protected function Copy($object)
	{
		$this->id_robot_config = $object->id_robot_config;
		$this->id_site = $object->id_site;
		$this->date = $object->date;
		$this->modifications = $object->modifications;
		$this->update_by = $object->update_by;
	}

	public static function getRobotConfig( $id_robot_config )
	{
		$query = "SELECT * FROM robot_config a1 WHERE id_robot_config = '".mysqli_real_escape_string(DB::$connexion, $id_robot_config)."'";
		$resultat=mysqli_query(DB::$connexion, $query);
		return mysqli_fetch_object($resultat);
	}

	public function Save()
	{
		if( $this->id_robot_config == -1 || is_null($this->id_robot_config) )
		{
			$this->Insert( );	
		}
		else
		{
			$this->Update( );
		}
	}

	public function Insert()
	{
		global $_CONFIG;
		$query = "INSERT INTO robot_config ( id_site, date, modifications, update_by ) VALUES ( 

			'". mysqli_real_escape_string(DB::$connexion, $this->id_site) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->date) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->modifications) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->update_by) ."'
			) ";
		$insert=mysqli_query(DB::$connexion, $query) or die ('ERREUR Insert RobotConfig : '.$query.'<br />'.mysqli_error(DB::$connexion).'<br /><br />');
		$this->id_robot_config = mysqli_insert_id(DB::$connexion);
	}

	public function Update( )
	{
		global $_CONFIG;
		$query = "UPDATE robot_config SET

			id_site = '". mysqli_real_escape_string(DB::$connexion,  $this->id_site )."', 
			date = '". mysqli_real_escape_string(DB::$connexion,  $this->date )."', 
			modifications = '". mysqli_real_escape_string(DB::$connexion,  $this->modifications )."', 
			update_by = '". mysqli_real_escape_string(DB::$connexion,  $this->update_by )."'
		WHERE id_robot_config = '". mysqli_real_escape_string(DB::$connexion, $this->id_robot_config)."'";
		$update=mysqli_query(DB::$connexion, $query) or die ('ERREUR Update RobotConfig : '.$query.'<br />'.mysqli_error(DB::$connexion).'<br /><br />');
	}
	
	public function Supprimer()
	{
		$query="DELETE FROM robot_config WHERE id_robot_config = '".mysqli_real_escape_string(DB::$connexion, $this->id_robot_config)."'";
		$delete=mysqli_query(DB::$connexion, $query) or die ('ERREUR Delete RobotConfig : '.$query.'<br />'.mysqli_error(DB::$connexion).'<br /><br />');
	}

	public static function GetRobotConfigs($order = "", $order_sens = "")
	{
		$query = "SELECT * FROM robot_config";
		if ($order!="")
			$query .= " ORDER BY ".mysqli_real_escape_string(DB::$connexion, $order)." ".mysqli_real_escape_string(DB::$connexion, $order_sens);
		else 
			$query .= " ORDER BY id_robot_config ASC";
		$result = mysqli_query(DB::$connexion, $query);
		$array = array();
		while ($row = @mysqli_fetch_object( $result ) )
		{
			$array[] = new RobotConfig($row, true);
		}
		@mysqli_free_result( $result );
		return $array;
	}
}
?>