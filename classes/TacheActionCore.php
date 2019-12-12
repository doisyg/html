<?php
class TacheActionCore
{
	public $id_tache_action = -1;
	public $action_type = -1;
	public $action_detail = "";
	public $position = -1;

	public function __construct( $id_tache_action = null, $byrow=false ) 
	{
		if ($byrow)
		{
			$this->Copy($id_tache_action);
		}
		elseif(! is_null($id_tache_action) && $id_tache_action != -1 )
		{
			$object = TacheAction::getTacheAction( $id_tache_action );
			if ($object)
			{
				$this->Copy($object);
			}
		}
	}

	protected function Copy($object)
	{
		$this->id_tache_action = $object->id_tache_action;
		$this->action_type = $object->action_type;
		$this->action_detail = $object->action_detail;
		$this->position = $object->position;
	}

	public static function getTacheAction( $id_tache_action )
	{
		$query = "SELECT * FROM tache_action a1 WHERE id_tache_action = '".mysqli_real_escape_string(DB::$connexion, $id_tache_action)."'";
		$resultat=mysqli_query(DB::$connexion, $query);
		return mysqli_fetch_object($resultat);
	}

	public function Save()
	{
		if( $this->id_tache_action == -1 || is_null($this->id_tache_action) )
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
		$query = "INSERT INTO tache_action ( action_type, action_detail, position ) VALUES ( 

			'". mysqli_real_escape_string(DB::$connexion, $this->action_type) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->action_detail) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->position) ."'
			) ";
		$insert=mysqli_query(DB::$connexion, $query) or die ('ERREUR Insert TacheAction : '.$query.'<br />'.mysqli_error(DB::$connexion).'<br /><br />');
		$this->id_tache_action = mysqli_insert_id(DB::$connexion);
	}

	public function Update( )
	{
		global $_CONFIG;
		$query = "UPDATE tache_action SET

			action_type = '". mysqli_real_escape_string(DB::$connexion,  $this->action_type )."', 
			action_detail = '". mysqli_real_escape_string(DB::$connexion,  $this->action_detail )."', 
			position = '". mysqli_real_escape_string(DB::$connexion,  $this->position )."'
		WHERE id_tache_action = '". mysqli_real_escape_string(DB::$connexion, $this->id_tache_action)."'";
		$update=mysqli_query(DB::$connexion, $query) or die ('ERREUR Update TacheAction : '.$query.'<br />'.mysqli_error(DB::$connexion).'<br /><br />');
	}
	
	public function Supprimer()
	{
		$query="DELETE FROM tache_action WHERE id_tache_action = '".mysqli_real_escape_string(DB::$connexion, $this->id_tache_action)."'";
		$delete=mysqli_query(DB::$connexion, $query) or die ('ERREUR Delete TacheAction : '.$query.'<br />'.mysqli_error(DB::$connexion).'<br /><br />');
	}

	public static function GetTacheActions($order = "", $order_sens = "")
	{
		$query = "SELECT * FROM tache_action";
		if ($order!="")
			$query .= " ORDER BY ".mysqli_real_escape_string(DB::$connexion, $order)." ".mysqli_real_escape_string(DB::$connexion, $order_sens);
		else 
			$query .= " ORDER BY id_tache_action ASC";
		$result = mysqli_query(DB::$connexion, $query);
		$array = array();
		while ($row = @mysqli_fetch_object( $result ) )
		{
			$array[] = new TacheAction($row, true);
		}
		@mysqli_free_result( $result );
		return $array;
	}
}
?>