<?php
class UndockProcessCore
{
	public $id_undock_process = -1;
	public $id_docking_station = -1;
	public $id_poi = -1;
	public $position = -1;
	public $x = 0.0;
	public $y = 0.0;
	public $theta = 0.0;

	public function __construct( $id_undock_process = null, $byrow=false ) 
	{
		if ($byrow)
		{
			$this->Copy($id_undock_process);
		}
		elseif(! is_null($id_undock_process) && $id_undock_process != -1 )
		{
			$object = UndockProcess::getUndockProcess( $id_undock_process );
			if ($object)
			{
				$this->Copy($object);
			}
		}
	}

	protected function Copy($object)
	{
		$this->id_undock_process = $object->id_undock_process;
		$this->id_docking_station = $object->id_docking_station;
		$this->id_poi = $object->id_poi;
		$this->position = $object->position;
		$this->x = $object->x;
		$this->y = $object->y;
		$this->theta = $object->theta;
	}

	public static function getUndockProcess( $id_undock_process )
	{
		$query = "SELECT * FROM undock_process a1 WHERE id_undock_process = '".mysqli_real_escape_string(DB::$connexion, $id_undock_process)."'";
		$resultat=mysqli_query(DB::$connexion, $query);
		return mysqli_fetch_object($resultat);
	}

	public function Save()
	{
		if( $this->id_undock_process == -1 || is_null($this->id_undock_process) )
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
		$query = "INSERT INTO undock_process ( id_docking_station, id_poi, position, x, y, theta ) VALUES ( 

			'". mysqli_real_escape_string(DB::$connexion, $this->id_docking_station) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->id_poi) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->position) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->x) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->y) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->theta) ."'
			) ";
		$insert=mysqli_query(DB::$connexion, $query) or die ('ERREUR Insert UndockProcess : '.$query.'<br />'.mysqli_error(DB::$connexion).'<br /><br />');
		$this->id_undock_process = mysqli_insert_id(DB::$connexion);
	}

	public function Update( )
	{
		global $_CONFIG;
		$query = "UPDATE undock_process SET

			id_docking_station = '". mysqli_real_escape_string(DB::$connexion,  $this->id_docking_station )."', 
			id_poi = '". mysqli_real_escape_string(DB::$connexion,  $this->id_poi )."', 
			position = '". mysqli_real_escape_string(DB::$connexion,  $this->position )."', 
			x = '". mysqli_real_escape_string(DB::$connexion,  $this->x )."', 
			y = '". mysqli_real_escape_string(DB::$connexion,  $this->y )."', 
			theta = '". mysqli_real_escape_string(DB::$connexion,  $this->theta )."'
		WHERE id_undock_process = '". mysqli_real_escape_string(DB::$connexion, $this->id_undock_process)."'";
		$update=mysqli_query(DB::$connexion, $query) or die ('ERREUR Update UndockProcess : '.$query.'<br />'.mysqli_error(DB::$connexion).'<br /><br />');
	}
	
	public function Supprimer()
	{
		$query="DELETE FROM undock_process WHERE id_undock_process = '".mysqli_real_escape_string(DB::$connexion, $this->id_undock_process)."'";
		$delete=mysqli_query(DB::$connexion, $query) or die ('ERREUR Delete UndockProcess : '.$query.'<br />'.mysqli_error(DB::$connexion).'<br /><br />');
	}

	public static function GetUndockProcesss($order = "", $order_sens = "")
	{
		$query = "SELECT * FROM undock_process";
		if ($order!="")
			$query .= " ORDER BY ".mysqli_real_escape_string(DB::$connexion, $order)." ".mysqli_real_escape_string(DB::$connexion, $order_sens);
		else 
			$query .= " ORDER BY id_undock_process ASC";
		$result = mysqli_query(DB::$connexion, $query);
		$array = array();
		while ($row = @mysqli_fetch_object( $result ) )
		{
			$array[] = new UndockProcess($row, true);
		}
		@mysqli_free_result( $result );
		return $array;
	}
}
?>