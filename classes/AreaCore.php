<?php
class AreaCore
{
	public $id_area = -1;
	public $id_map = -1;
	public $name = "";
	public $comment = "";
	public $color_r = -1;
	public $color_g = -1;
	public $color_b = -1;
	public $is_forbidden = 0;
	public $deleted = 0;
	public $from_install = 0;

	public function __construct( $id_area = null, $byrow=false ) 
	{
		if ($byrow)
		{
			$this->Copy($id_area);
		}
		elseif(! is_null($id_area) && $id_area != -1 )
		{
			$object = Area::getArea( $id_area );
			if ($object)
			{
				$this->Copy($object);
			}
		}
	}

	protected function Copy($object)
	{
		$this->id_area = $object->id_area;
		$this->id_map = $object->id_map;
		$this->name = $object->name;
		$this->comment = $object->comment;
		$this->color_r = $object->color_r;
		$this->color_g = $object->color_g;
		$this->color_b = $object->color_b;
		$this->is_forbidden = $object->is_forbidden;
		$this->deleted = $object->deleted;
		$this->from_install = $object->from_install;
	}

	public static function getArea( $id_area )
	{
		$query = "SELECT * FROM area a1 WHERE id_area = '".mysqli_real_escape_string(DB::$connexion, $id_area)."'";
		$resultat=mysqli_query(DB::$connexion, $query);
		return mysqli_fetch_object($resultat);
	}

	public function Save()
	{
		if( $this->id_area == -1 || is_null($this->id_area) )
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
		$query = "INSERT INTO area ( id_map, name, comment, color_r, color_g, color_b, is_forbidden, deleted, from_install ) VALUES ( 

			'". mysqli_real_escape_string(DB::$connexion, $this->id_map) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->name) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->comment) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->color_r) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->color_g) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->color_b) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->is_forbidden) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->deleted) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->from_install) ."'
			) ";
		$insert=mysqli_query(DB::$connexion, $query) or die ('ERREUR Insert Area : '.$query.'<br />'.mysqli_error(DB::$connexion).'<br /><br />');
		$this->id_area = mysqli_insert_id(DB::$connexion);
	}

	public function Update( )
	{
		global $_CONFIG;
		$query = "UPDATE area SET

			id_map = '". mysqli_real_escape_string(DB::$connexion,  $this->id_map )."', 
			name = '". mysqli_real_escape_string(DB::$connexion,  $this->name )."', 
			comment = '". mysqli_real_escape_string(DB::$connexion,  $this->comment )."', 
			color_r = '". mysqli_real_escape_string(DB::$connexion,  $this->color_r )."', 
			color_g = '". mysqli_real_escape_string(DB::$connexion,  $this->color_g )."', 
			color_b = '". mysqli_real_escape_string(DB::$connexion,  $this->color_b )."', 
			is_forbidden = '". mysqli_real_escape_string(DB::$connexion,  $this->is_forbidden )."', 
			deleted = '". mysqli_real_escape_string(DB::$connexion,  $this->deleted )."', 
			from_install = '". mysqli_real_escape_string(DB::$connexion,  $this->from_install )."'
		WHERE id_area = '". mysqli_real_escape_string(DB::$connexion, $this->id_area)."'";
		$update=mysqli_query(DB::$connexion, $query) or die ('ERREUR Update Area : '.$query.'<br />'.mysqli_error(DB::$connexion).'<br /><br />');
	}
	
	public function Supprimer()
	{
		$this->deleted=1;
		$this->Save();
	}

	public static function GetAreas($order = "", $order_sens = "")
	{
		$query = "SELECT * FROM area WHERE deleted=0 ";
		if ($order!="")
			$query .= " ORDER BY ".mysqli_real_escape_string(DB::$connexion, $order)." ".mysqli_real_escape_string(DB::$connexion, $order_sens);
		else 
			$query .= " ORDER BY id_area ASC";
		$result = mysqli_query(DB::$connexion, $query);
		$array = array();
		while ($row = @mysqli_fetch_object( $result ) )
		{
			$array[] = new Area($row, true);
		}
		@mysqli_free_result( $result );
		return $array;
	}
}
?>