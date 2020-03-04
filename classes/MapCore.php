<?php
class MapCore
{
	public $id_map = -1;
	public $id_site = -1;
	public $name = "";
	public $comment = "";
	public $image = "";
	public $image_tri = "";
	public $ros_resolution = -1;
	public $ros_width = -1;
	public $ros_height = -1;
	public $threshold_free = -1;
	public $threshold_occupied = -1;

	public function __construct( $id_map = null, $byrow=false ) 
	{
		if ($byrow)
		{
			$this->Copy($id_map);
		}
		elseif(! is_null($id_map) && $id_map != -1 )
		{
			$object = Map::getMap( $id_map );
			if ($object)
			{
				$this->Copy($object);
			}
		}
	}

	protected function Copy($object)
	{
		$this->id_map = $object->id_map;
		$this->id_site = $object->id_site;
		$this->name = $object->name;
		$this->comment = $object->comment;
		$this->image = $object->image;
		$this->image_tri = $object->image_tri;
		$this->ros_resolution = $object->ros_resolution;
		$this->ros_width = $object->ros_width;
		$this->ros_height = $object->ros_height;
		$this->threshold_free = $object->threshold_free;
		$this->threshold_occupied = $object->threshold_occupied;
	}

	public static function getMap( $id_map )
	{
		$query = "SELECT * FROM map a1 WHERE id_map = '".mysqli_real_escape_string(DB::$connexion, $id_map)."'";
		$resultat=mysqli_query(DB::$connexion, $query);
		return mysqli_fetch_object($resultat);
	}

	public function Save()
	{
		if( $this->id_map == -1 || is_null($this->id_map) )
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
		$query = "INSERT INTO map ( id_site, name, comment, image, image_tri, ros_resolution, ros_width, ros_height, threshold_free, threshold_occupied ) VALUES ( 

			'". mysqli_real_escape_string(DB::$connexion, $this->id_site) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->name) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->comment) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->image) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->image_tri) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->ros_resolution) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->ros_width) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->ros_height) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->threshold_free) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->threshold_occupied) ."'
			) ";
		$insert=mysqli_query(DB::$connexion, $query) or die ('ERREUR Insert Map : '.$query.'<br />'.mysqli_error(DB::$connexion).'<br /><br />');
		$this->id_map = mysqli_insert_id(DB::$connexion);
	}

	public function Update( )
	{
		global $_CONFIG;
		$query = "UPDATE map SET

			id_site = '". mysqli_real_escape_string(DB::$connexion,  $this->id_site )."', 
			name = '". mysqli_real_escape_string(DB::$connexion,  $this->name )."', 
			comment = '". mysqli_real_escape_string(DB::$connexion,  $this->comment )."', 
			image = '". mysqli_real_escape_string(DB::$connexion,  $this->image )."', 
			image_tri = '". mysqli_real_escape_string(DB::$connexion,  $this->image_tri )."', 
			ros_resolution = '". mysqli_real_escape_string(DB::$connexion,  $this->ros_resolution )."', 
			ros_width = '". mysqli_real_escape_string(DB::$connexion,  $this->ros_width )."', 
			ros_height = '". mysqli_real_escape_string(DB::$connexion,  $this->ros_height )."', 
			threshold_free = '". mysqli_real_escape_string(DB::$connexion,  $this->threshold_free )."', 
			threshold_occupied = '". mysqli_real_escape_string(DB::$connexion,  $this->threshold_occupied )."'
		WHERE id_map = '". mysqli_real_escape_string(DB::$connexion, $this->id_map)."'";
		$update=mysqli_query(DB::$connexion, $query) or die ('ERREUR Update Map : '.$query.'<br />'.mysqli_error(DB::$connexion).'<br /><br />');
	}
	
	public function Supprimer()
	{
		$query="DELETE FROM map WHERE id_map = '".mysqli_real_escape_string(DB::$connexion, $this->id_map)."'";
		$delete=mysqli_query(DB::$connexion, $query) or die ('ERREUR Delete Map : '.$query.'<br />'.mysqli_error(DB::$connexion).'<br /><br />');
	}

	public static function GetMaps($order = "", $order_sens = "")
	{
		$query = "SELECT * FROM map";
		if ($order!="")
			$query .= " ORDER BY ".mysqli_real_escape_string(DB::$connexion, $order)." ".mysqli_real_escape_string(DB::$connexion, $order_sens);
		else 
			$query .= " ORDER BY id_map ASC";
		$result = mysqli_query(DB::$connexion, $query);
		$array = array();
		while ($row = @mysqli_fetch_object( $result ) )
		{
			$array[] = new Map($row, true);
		}
		@mysqli_free_result( $result );
		return $array;
	}
}
?>