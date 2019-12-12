<?php
class DroitCore
{
	public $id_droit = -1;
	public $section = "";
	public $sous_section = "";
	public $action = "";

	public function __construct( $id_droit = null, $byrow=false ) 
	{
		if ($byrow)
		{
			$this->Copy($id_droit);
		}
		elseif(! is_null($id_droit) && $id_droit != -1 )
		{
			$object = Droit::getDroit( $id_droit );
			if ($object)
			{
				$this->Copy($object);
			}
		}
	}

	protected function Copy($object)
	{
		$this->id_droit = $object->id_droit;
		$this->section = $object->section;
		$this->sous_section = $object->sous_section;
		$this->action = $object->action;
	}

	public static function getDroit( $id_droit )
	{
		$query = "SELECT * FROM droit a1 WHERE id_droit = '".mysqli_real_escape_string(DB::$connexion, $id_droit)."'";
		$resultat=mysqli_query(DB::$connexion, $query);
		return mysqli_fetch_object($resultat);
	}

	public function Save()
	{
		if( $this->id_droit == -1 || is_null($this->id_droit) )
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
		$query = "INSERT INTO droit ( section, sous_section, action ) VALUES ( 

			'". mysqli_real_escape_string(DB::$connexion, $this->section) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->sous_section) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->action) ."'
			) ";
		$insert=mysqli_query(DB::$connexion, $query) or die ('ERREUR Insert Droit : '.$query.'<br />'.mysqli_error(DB::$connexion).'<br /><br />');
		$this->id_droit = mysqli_insert_id(DB::$connexion);
	}

	public function Update( )
	{
		global $_CONFIG;
		$query = "UPDATE droit SET

			section = '". mysqli_real_escape_string(DB::$connexion,  $this->section )."', 
			sous_section = '". mysqli_real_escape_string(DB::$connexion,  $this->sous_section )."', 
			action = '". mysqli_real_escape_string(DB::$connexion,  $this->action )."'
		WHERE id_droit = '". mysqli_real_escape_string(DB::$connexion, $this->id_droit)."'";
		$update=mysqli_query(DB::$connexion, $query) or die ('ERREUR Update Droit : '.$query.'<br />'.mysqli_error(DB::$connexion).'<br /><br />');
	}
	
	public function Supprimer()
	{
		$query="DELETE FROM droit WHERE id_droit = '".mysqli_real_escape_string(DB::$connexion, $this->id_droit)."'";
		$delete=mysqli_query(DB::$connexion, $query) or die ('ERREUR Delete Droit : '.$query.'<br />'.mysqli_error(DB::$connexion).'<br /><br />');
	}

	public static function GetDroits($order = "", $order_sens = "")
	{
		$query = "SELECT * FROM droit";
		if ($order!="")
			$query .= " ORDER BY ".mysqli_real_escape_string(DB::$connexion, $order)." ".mysqli_real_escape_string(DB::$connexion, $order_sens);
		else 
			$query .= " ORDER BY id_droit ASC";
		$result = mysqli_query(DB::$connexion, $query);
		$array = array();
		while ($row = @mysqli_fetch_object( $result ) )
		{
			$array[] = new Droit($row, true);
		}
		@mysqli_free_result( $result );
		return $array;
	}
}
?>