<?php
class RobotConfigValueCore
{
	public $id_robot_config_value = -1;
	public $id_robot_config = -1;
	public $directory = "";
	public $file = "";
	public $name = "";
	public $data = "";
	public $is_file = 0;
	public $date_upd_robot = "";
	public $date_upd_server = "";

	public function __construct( $id_robot_config_value = null, $byrow=false ) 
	{
		if ($byrow)
		{
			$this->Copy($id_robot_config_value);
		}
		elseif(! is_null($id_robot_config_value) && $id_robot_config_value != -1 )
		{
			$object = RobotConfigValue::getRobotConfigValue( $id_robot_config_value );
			if ($object)
			{
				$this->Copy($object);
			}
		}
	}

	protected function Copy($object)
	{
		$this->id_robot_config_value = $object->id_robot_config_value;
		$this->id_robot_config = $object->id_robot_config;
		$this->directory = $object->directory;
		$this->file = $object->file;
		$this->name = $object->name;
		$this->data = $object->data;
		$this->is_file = $object->is_file;
		$this->date_upd_robot = $object->date_upd_robot;
		$this->date_upd_server = $object->date_upd_server;
	}

	public static function getRobotConfigValue( $id_robot_config_value )
	{
		$query = "SELECT * FROM robot_config_value a1 WHERE id_robot_config_value = '".mysqli_real_escape_string(DB::$connexion, $id_robot_config_value)."'";
		$resultat=mysqli_query(DB::$connexion, $query);
		return mysqli_fetch_object($resultat);
	}

	public function Save()
	{
		if( $this->id_robot_config_value == -1 || is_null($this->id_robot_config_value) )
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
		$query = "INSERT INTO robot_config_value ( id_robot_config, directory, file, name, data, is_file, date_upd_robot, date_upd_server ) VALUES ( 

			'". mysqli_real_escape_string(DB::$connexion, $this->id_robot_config) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->directory) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->file) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->name) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->data) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->is_file) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->date_upd_robot) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->date_upd_server) ."'
			) ";
		$insert=mysqli_query(DB::$connexion, $query) or die ('ERREUR Insert RobotConfigValue : '.$query.'<br />'.mysqli_error(DB::$connexion).'<br /><br />');
		$this->id_robot_config_value = mysqli_insert_id(DB::$connexion);
	}

	public function Update( )
	{
		global $_CONFIG;
		$query = "UPDATE robot_config_value SET

			id_robot_config = '". mysqli_real_escape_string(DB::$connexion,  $this->id_robot_config )."', 
			directory = '". mysqli_real_escape_string(DB::$connexion,  $this->directory )."', 
			file = '". mysqli_real_escape_string(DB::$connexion,  $this->file )."', 
			name = '". mysqli_real_escape_string(DB::$connexion,  $this->name )."', 
			data = '". mysqli_real_escape_string(DB::$connexion,  $this->data )."', 
			is_file = '". mysqli_real_escape_string(DB::$connexion,  $this->is_file )."', 
			date_upd_robot = '". mysqli_real_escape_string(DB::$connexion,  $this->date_upd_robot )."', 
			date_upd_server = '". mysqli_real_escape_string(DB::$connexion,  $this->date_upd_server )."'
		WHERE id_robot_config_value = '". mysqli_real_escape_string(DB::$connexion, $this->id_robot_config_value)."'";
		$update=mysqli_query(DB::$connexion, $query) or die ('ERREUR Update RobotConfigValue : '.$query.'<br />'.mysqli_error(DB::$connexion).'<br /><br />');
	}
	
	public function Supprimer()
	{
		$query="DELETE FROM robot_config_value WHERE id_robot_config_value = '".mysqli_real_escape_string(DB::$connexion, $this->id_robot_config_value)."'";
		$delete=mysqli_query(DB::$connexion, $query) or die ('ERREUR Delete RobotConfigValue : '.$query.'<br />'.mysqli_error(DB::$connexion).'<br /><br />');
	}

	public static function GetRobotConfigValues($order = "", $order_sens = "")
	{
		$query = "SELECT * FROM robot_config_value";
		if ($order!="")
			$query .= " ORDER BY ".mysqli_real_escape_string(DB::$connexion, $order)." ".mysqli_real_escape_string(DB::$connexion, $order_sens);
		else 
			$query .= " ORDER BY id_robot_config_value ASC";
		$result = mysqli_query(DB::$connexion, $query);
		$array = array();
		while ($row = @mysqli_fetch_object( $result ) )
		{
			$array[] = new RobotConfigValue($row, true);
		}
		@mysqli_free_result( $result );
		return $array;
	}
}
?>