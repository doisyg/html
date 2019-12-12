<?php
class GroupeDroitCore
{
	public $id_groupe_droit = -1;
	public $id_groupe_user = -1;
	public $id_droit = -1;

	public function __construct( $id_groupe_droit = null, $byrow=false ) 
	{
		if ($byrow)
		{
			$this->Copy($id_groupe_droit);
		}
		elseif(! is_null($id_groupe_droit) && $id_groupe_droit != -1 )
		{
			$object = GroupeDroit::getGroupeDroit( $id_groupe_droit );
			if ($object)
			{
				$this->Copy($object);
			}
		}
	}

	protected function Copy($object)
	{
		$this->id_groupe_droit = $object->id_groupe_droit;
		$this->id_groupe_user = $object->id_groupe_user;
		$this->id_droit = $object->id_droit;
	}

	public static function getGroupeDroit( $id_groupe_droit )
	{
		$query = "SELECT * FROM groupe_droit a1 WHERE id_groupe_droit = '".mysqli_real_escape_string(DB::$connexion, $id_groupe_droit)."'";
		$resultat=mysqli_query(DB::$connexion, $query);
		return mysqli_fetch_object($resultat);
	}

	public function Save()
	{
		if( $this->id_groupe_droit == -1 || is_null($this->id_groupe_droit) )
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
		$query = "INSERT INTO groupe_droit ( id_groupe_user, id_droit ) VALUES ( 

			'". mysqli_real_escape_string(DB::$connexion, $this->id_groupe_user) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->id_droit) ."'
			) ";
		$insert=mysqli_query(DB::$connexion, $query) or die ('ERREUR Insert GroupeDroit : '.$query.'<br />'.mysqli_error(DB::$connexion).'<br /><br />');
		$this->id_groupe_droit = mysqli_insert_id(DB::$connexion);
	}

	public function Update( )
	{
		global $_CONFIG;
		$query = "UPDATE groupe_droit SET

			id_groupe_user = '". mysqli_real_escape_string(DB::$connexion,  $this->id_groupe_user )."', 
			id_droit = '". mysqli_real_escape_string(DB::$connexion,  $this->id_droit )."'
		WHERE id_groupe_droit = '". mysqli_real_escape_string(DB::$connexion, $this->id_groupe_droit)."'";
		$update=mysqli_query(DB::$connexion, $query) or die ('ERREUR Update GroupeDroit : '.$query.'<br />'.mysqli_error(DB::$connexion).'<br /><br />');
	}
	
	public function Supprimer()
	{
		$query="DELETE FROM groupe_droit WHERE id_groupe_droit = '".mysqli_real_escape_string(DB::$connexion, $this->id_groupe_droit)."'";
		$delete=mysqli_query(DB::$connexion, $query) or die ('ERREUR Delete GroupeDroit : '.$query.'<br />'.mysqli_error(DB::$connexion).'<br /><br />');
	}

	public static function GetGroupeDroits($order = "", $order_sens = "")
	{
		$query = "SELECT * FROM groupe_droit";
		if ($order!="")
			$query .= " ORDER BY ".mysqli_real_escape_string(DB::$connexion, $order)." ".mysqli_real_escape_string(DB::$connexion, $order_sens);
		else 
			$query .= " ORDER BY id_groupe_droit ASC";
		$result = mysqli_query(DB::$connexion, $query);
		$array = array();
		while ($row = @mysqli_fetch_object( $result ) )
		{
			$array[] = new GroupeDroit($row, true);
		}
		@mysqli_free_result( $result );
		return $array;
	}
}
?>