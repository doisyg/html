<?php
class TacheCore
{
	public $id_tache = -1;
	public $id_site = -1;
	public $name = "";
	public $action_fin = 0;

	public function __construct( $id_tache = null, $byrow=false ) 
	{
		if ($byrow)
		{
			$this->Copy($id_tache);
		}
		elseif(! is_null($id_tache) && $id_tache != -1 )
		{
			$object = Tache::getTache( $id_tache );
			if ($object)
			{
				$this->Copy($object);
			}
		}
	}

	protected function Copy($object)
	{
		$this->id_tache = $object->id_tache;
		$this->id_site = $object->id_site;
		$this->name = $object->name;
		$this->action_fin = $object->action_fin;
	}

	public static function getTache( $id_tache )
	{
		$query = "SELECT * FROM tache a1 WHERE id_tache = '".mysqli_real_escape_string(DB::$connexion, $id_tache)."'";
		$resultat=mysqli_query(DB::$connexion, $query);
		return mysqli_fetch_object($resultat);
	}

	public function Save()
	{
		if( $this->id_tache == -1 || is_null($this->id_tache) )
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
		$query = "INSERT INTO tache ( id_site, name, action_fin ) VALUES ( 

			'". mysqli_real_escape_string(DB::$connexion, $this->id_site) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->name) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->action_fin) ."'
			) ";
		$insert=mysqli_query(DB::$connexion, $query) or die ('ERREUR Insert Tache : '.$query.'<br />'.mysqli_error(DB::$connexion).'<br /><br />');
		$this->id_tache = mysqli_insert_id(DB::$connexion);
	}

	public function Update( )
	{
		global $_CONFIG;
		$query = "UPDATE tache SET

			id_site = '". mysqli_real_escape_string(DB::$connexion,  $this->id_site )."', 
			name = '". mysqli_real_escape_string(DB::$connexion,  $this->name )."', 
			action_fin = '". mysqli_real_escape_string(DB::$connexion,  $this->action_fin )."'
		WHERE id_tache = '". mysqli_real_escape_string(DB::$connexion, $this->id_tache)."'";
		$update=mysqli_query(DB::$connexion, $query) or die ('ERREUR Update Tache : '.$query.'<br />'.mysqli_error(DB::$connexion).'<br /><br />');
	}
	
	public function Supprimer()
	{
		$query="DELETE FROM tache WHERE id_tache = '".mysqli_real_escape_string(DB::$connexion, $this->id_tache)."'";
		$delete=mysqli_query(DB::$connexion, $query) or die ('ERREUR Delete Tache : '.$query.'<br />'.mysqli_error(DB::$connexion).'<br /><br />');
	}

	public static function GetTaches($order = "", $order_sens = "")
	{
		$query = "SELECT * FROM tache";
		if ($order!="")
			$query .= " ORDER BY ".mysqli_real_escape_string(DB::$connexion, $order)." ".mysqli_real_escape_string(DB::$connexion, $order_sens);
		else 
			$query .= " ORDER BY id_tache ASC";
		$result = mysqli_query(DB::$connexion, $query);
		$array = array();
		while ($row = @mysqli_fetch_object( $result ) )
		{
			$array[] = new Tache($row, true);
		}
		@mysqli_free_result( $result );
		return $array;
	}
}
?>