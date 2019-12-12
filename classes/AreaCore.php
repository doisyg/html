<?php
class AreaCore
{
	public $id_area = -1;
	public $id_plan = -1;
	public $nom = "";
	public $comment = "";
	public $deleted = 0;

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
		$this->id_plan = $object->id_plan;
		$this->nom = $object->nom;
		$this->comment = $object->comment;
		$this->deleted = $object->deleted;
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
		$query = "INSERT INTO area ( id_plan, nom, comment, deleted ) VALUES ( 

			'". mysqli_real_escape_string(DB::$connexion, $this->id_plan) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->nom) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->comment) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->deleted) ."'
			) ";
		$insert=mysqli_query(DB::$connexion, $query) or die ('ERREUR Insert Area : '.$query.'<br />'.mysqli_error(DB::$connexion).'<br /><br />');
		$this->id_area = mysqli_insert_id(DB::$connexion);
	}

	public function Update( )
	{
		global $_CONFIG;
		$query = "UPDATE area SET

			id_plan = '". mysqli_real_escape_string(DB::$connexion,  $this->id_plan )."', 
			nom = '". mysqli_real_escape_string(DB::$connexion,  $this->nom )."', 
			comment = '". mysqli_real_escape_string(DB::$connexion,  $this->comment )."', 
			deleted = '". mysqli_real_escape_string(DB::$connexion,  $this->deleted )."'
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