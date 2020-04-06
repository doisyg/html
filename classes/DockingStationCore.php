<?php
class DockingStationCore
{
	public $id_docking_station = -1;
	public $id_map = -1;
	public $id_reflector = -1;
	public $x_ros = 0.0;
	public $y_ros = 0.0;
	public $t_ros = 0.0;
	public $num = -1;
	public $name = "";
	public $comment = -1;
	public $active = 1;

	public function __construct( $id_docking_station = null, $byrow=false ) 
	{
		if ($byrow)
		{
			$this->Copy($id_docking_station);
		}
		elseif(! is_null($id_docking_station) && $id_docking_station != -1 )
		{
			$object = DockingStation::getDockingStation( $id_docking_station );
			if ($object)
			{
				$this->Copy($object);
			}
		}
	}

	protected function Copy($object)
	{
		$this->id_docking_station = $object->id_docking_station;
		$this->id_map = $object->id_map;
		$this->id_reflector = $object->id_reflector;
		$this->x_ros = $object->x_ros;
		$this->y_ros = $object->y_ros;
		$this->t_ros = $object->t_ros;
		$this->num = $object->num;
		$this->name = $object->name;
		$this->comment = $object->comment;
		$this->active = $object->active;
	}

	public static function getDockingStation( $id_docking_station )
	{
		$query = "SELECT * FROM docking_station a1 WHERE id_docking_station = '".mysqli_real_escape_string(DB::$connexion, $id_docking_station)."'";
		$resultat=mysqli_query(DB::$connexion, $query);
		return mysqli_fetch_object($resultat);
	}

	public function Save()
	{
		if( $this->id_docking_station == -1 || is_null($this->id_docking_station) )
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
		$query = "INSERT INTO docking_station ( id_map, id_reflector, x_ros, y_ros, t_ros, num, name, comment, active ) VALUES ( 

			'". mysqli_real_escape_string(DB::$connexion, $this->id_map) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->id_reflector) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->x_ros) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->y_ros) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->t_ros) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->num) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->name) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->comment) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->active) ."'
			) ";
		$insert=mysqli_query(DB::$connexion, $query) or die ('ERREUR Insert DockingStation : '.$query.'<br />'.mysqli_error(DB::$connexion).'<br /><br />');
		$this->id_docking_station = mysqli_insert_id(DB::$connexion);
	}

	public function Update( )
	{
		global $_CONFIG;
		$query = "UPDATE docking_station SET

			id_map = '". mysqli_real_escape_string(DB::$connexion,  $this->id_map )."', 
			id_reflector = '". mysqli_real_escape_string(DB::$connexion,  $this->id_reflector )."', 
			x_ros = '". mysqli_real_escape_string(DB::$connexion,  $this->x_ros )."', 
			y_ros = '". mysqli_real_escape_string(DB::$connexion,  $this->y_ros )."', 
			t_ros = '". mysqli_real_escape_string(DB::$connexion,  $this->t_ros )."', 
			num = '". mysqli_real_escape_string(DB::$connexion,  $this->num )."', 
			name = '". mysqli_real_escape_string(DB::$connexion,  $this->name )."', 
			comment = '". mysqli_real_escape_string(DB::$connexion,  $this->comment )."', 
			active = '". mysqli_real_escape_string(DB::$connexion,  $this->active )."'
		WHERE id_docking_station = '". mysqli_real_escape_string(DB::$connexion, $this->id_docking_station)."'";
		$update=mysqli_query(DB::$connexion, $query) or die ('ERREUR Update DockingStation : '.$query.'<br />'.mysqli_error(DB::$connexion).'<br /><br />');
	}
	
	public function Supprimer()
	{
		$query="DELETE FROM docking_station WHERE id_docking_station = '".mysqli_real_escape_string(DB::$connexion, $this->id_docking_station)."'";
		$delete=mysqli_query(DB::$connexion, $query) or die ('ERREUR Delete DockingStation : '.$query.'<br />'.mysqli_error(DB::$connexion).'<br /><br />');
	}

	public static function GetDockingStations($order = "", $order_sens = "")
	{
		$query = "SELECT * FROM docking_station";
		if ($order!="")
			$query .= " ORDER BY ".mysqli_real_escape_string(DB::$connexion, $order)." ".mysqli_real_escape_string(DB::$connexion, $order_sens);
		else 
			$query .= " ORDER BY id_docking_station ASC";
		$result = mysqli_query(DB::$connexion, $query);
		$array = array();
		while ($row = @mysqli_fetch_object( $result ) )
		{
			$array[] = new DockingStation($row, true);
		}
		@mysqli_free_result( $result );
		return $array;
	}
}
?>