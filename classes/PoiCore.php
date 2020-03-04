<?php
class PoiCore
{
	public $id_poi = -1;
	public $id_map = -1;
	public $x_ros = 0.0;
	public $y_ros = 0.0;
	public $t_ros = 0.0;
	public $name = "";
	public $comment = "";
	public $icon = "";
	public $advanced = 0;
	public $active = 1;

	public function __construct( $id_poi = null, $byrow=false ) 
	{
		if ($byrow)
		{
			$this->Copy($id_poi);
		}
		elseif(! is_null($id_poi) && $id_poi != -1 )
		{
			$object = Poi::getPoi( $id_poi );
			if ($object)
			{
				$this->Copy($object);
			}
		}
	}

	protected function Copy($object)
	{
		$this->id_poi = $object->id_poi;
		$this->id_map = $object->id_map;
		$this->x_ros = $object->x_ros;
		$this->y_ros = $object->y_ros;
		$this->t_ros = $object->t_ros;
		$this->name = $object->name;
		$this->comment = $object->comment;
		$this->icon = $object->icon;
		$this->advanced = $object->advanced;
		$this->active = $object->active;
	}

	public static function getPoi( $id_poi )
	{
		$query = "SELECT * FROM poi a1 WHERE id_poi = '".mysqli_real_escape_string(DB::$connexion, $id_poi)."'";
		$resultat=mysqli_query(DB::$connexion, $query);
		return mysqli_fetch_object($resultat);
	}

	public function Save()
	{
		if( $this->id_poi == -1 || is_null($this->id_poi) )
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
		$query = "INSERT INTO poi ( id_map, x_ros, y_ros, t_ros, name, comment, icon, advanced, active ) VALUES ( 

			'". mysqli_real_escape_string(DB::$connexion, $this->id_map) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->x_ros) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->y_ros) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->t_ros) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->name) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->comment) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->icon) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->advanced) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->active) ."'
			) ";
		$insert=mysqli_query(DB::$connexion, $query) or die ('ERREUR Insert Poi : '.$query.'<br />'.mysqli_error(DB::$connexion).'<br /><br />');
		$this->id_poi = mysqli_insert_id(DB::$connexion);
	}

	public function Update( )
	{
		global $_CONFIG;
		$query = "UPDATE poi SET

			id_map = '". mysqli_real_escape_string(DB::$connexion,  $this->id_map )."', 
			x_ros = '". mysqli_real_escape_string(DB::$connexion,  $this->x_ros )."', 
			y_ros = '". mysqli_real_escape_string(DB::$connexion,  $this->y_ros )."', 
			t_ros = '". mysqli_real_escape_string(DB::$connexion,  $this->t_ros )."', 
			name = '". mysqli_real_escape_string(DB::$connexion,  $this->name )."', 
			comment = '". mysqli_real_escape_string(DB::$connexion,  $this->comment )."', 
			icon = '". mysqli_real_escape_string(DB::$connexion,  $this->icon )."', 
			advanced = '". mysqli_real_escape_string(DB::$connexion,  $this->advanced )."', 
			active = '". mysqli_real_escape_string(DB::$connexion,  $this->active )."'
		WHERE id_poi = '". mysqli_real_escape_string(DB::$connexion, $this->id_poi)."'";
		$update=mysqli_query(DB::$connexion, $query) or die ('ERREUR Update Poi : '.$query.'<br />'.mysqli_error(DB::$connexion).'<br /><br />');
	}
	
	public function Supprimer()
	{
		$query="DELETE FROM poi WHERE id_poi = '".mysqli_real_escape_string(DB::$connexion, $this->id_poi)."'";
		$delete=mysqli_query(DB::$connexion, $query) or die ('ERREUR Delete Poi : '.$query.'<br />'.mysqli_error(DB::$connexion).'<br /><br />');
	}

	public static function GetPois($order = "", $order_sens = "")
	{
		$query = "SELECT * FROM poi";
		if ($order!="")
			$query .= " ORDER BY ".mysqli_real_escape_string(DB::$connexion, $order)." ".mysqli_real_escape_string(DB::$connexion, $order_sens);
		else 
			$query .= " ORDER BY id_poi ASC";
		$result = mysqli_query(DB::$connexion, $query);
		$array = array();
		while ($row = @mysqli_fetch_object( $result ) )
		{
			$array[] = new Poi($row, true);
		}
		@mysqli_free_result( $result );
		return $array;
	}
}
?>