<?php
class TacheQueueCore
{
	public $id_tache_queue = -1;
	public $id_tache = -1;
	public $position = -1;

	public function __construct( $id_tache_queue = null, $byrow=false ) 
	{
		if ($byrow)
		{
			$this->Copy($id_tache_queue);
		}
		elseif(! is_null($id_tache_queue) && $id_tache_queue != -1 )
		{
			$object = TacheQueue::getTacheQueue( $id_tache_queue );
			if ($object)
			{
				$this->Copy($object);
			}
		}
	}

	protected function Copy($object)
	{
		$this->id_tache_queue = $object->id_tache_queue;
		$this->id_tache = $object->id_tache;
		$this->position = $object->position;
	}

	public static function getTacheQueue( $id_tache_queue )
	{
		$query = "SELECT * FROM tache_queue a1 WHERE id_tache_queue = '".mysqli_real_escape_string(DB::$connexion, $id_tache_queue)."'";
		$resultat=mysqli_query(DB::$connexion, $query);
		return mysqli_fetch_object($resultat);
	}

	public function Save()
	{
		if( $this->id_tache_queue == -1 || is_null($this->id_tache_queue) )
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
		$query = "INSERT INTO tache_queue ( id_tache, position ) VALUES ( 

			'". mysqli_real_escape_string(DB::$connexion, $this->id_tache) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->position) ."'
			) ";
		$insert=mysqli_query(DB::$connexion, $query) or die ('ERREUR Insert TacheQueue : '.$query.'<br />'.mysqli_error(DB::$connexion).'<br /><br />');
		$this->id_tache_queue = mysqli_insert_id(DB::$connexion);
	}

	public function Update( )
	{
		global $_CONFIG;
		$query = "UPDATE tache_queue SET

			id_tache = '". mysqli_real_escape_string(DB::$connexion,  $this->id_tache )."', 
			position = '". mysqli_real_escape_string(DB::$connexion,  $this->position )."'
		WHERE id_tache_queue = '". mysqli_real_escape_string(DB::$connexion, $this->id_tache_queue)."'";
		$update=mysqli_query(DB::$connexion, $query) or die ('ERREUR Update TacheQueue : '.$query.'<br />'.mysqli_error(DB::$connexion).'<br /><br />');
	}
	
	public function Supprimer()
	{
		$query="DELETE FROM tache_queue WHERE id_tache_queue = '".mysqli_real_escape_string(DB::$connexion, $this->id_tache_queue)."'";
		$delete=mysqli_query(DB::$connexion, $query) or die ('ERREUR Delete TacheQueue : '.$query.'<br />'.mysqli_error(DB::$connexion).'<br /><br />');
	}

	public static function GetTacheQueues($order = "", $order_sens = "")
	{
		$query = "SELECT * FROM tache_queue";
		if ($order!="")
			$query .= " ORDER BY ".mysqli_real_escape_string(DB::$connexion, $order)." ".mysqli_real_escape_string(DB::$connexion, $order_sens);
		else 
			$query .= " ORDER BY id_tache_queue ASC";
		$result = mysqli_query(DB::$connexion, $query);
		$array = array();
		while ($row = @mysqli_fetch_object( $result ) )
		{
			$array[] = new TacheQueue($row, true);
		}
		@mysqli_free_result( $result );
		return $array;
	}
}
?>