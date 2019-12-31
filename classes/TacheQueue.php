<?php
class TacheQueue extends TacheQueueCore
{
	public static function ClearQueue()
	{
		$query='TRUNCATE tache_queue';
		mysqli_query(DB::$connexion, $query);		
	}
	
	public function Supprimer()
	{
		$query="DELETE FROM tache_queue WHERE id_tache_queue = '".mysqli_real_escape_string(DB::$connexion, $this->id_tache_queue)."'";
		$delete=mysqli_query(DB::$connexion, $query) or die ('ERREUR Delete TacheQueue : '.$query.'<br />'.mysqli_error(DB::$connexion).'<br /><br />');
		
		$query="UPDATE tache_queue WHERE position=position-1 WHERE position > '".((int)$this->position)."'";
		$delete=mysqli_query(DB::$connexion, $query) or die ('ERREUR Delete TacheQueue : '.$query.'<br />'.mysqli_error(DB::$connexion).'<br /><br />');
	}

	
	public static function GetLastPosition()
	{
		$query='SELECT MAX(position) FROM tache_queue';
		$result = mysqli_query(DB::$connexion, $query);
		$max = 0;
		if ($row = @mysqli_fetch_array( $result ) )
		{
			$max = $row[0];
		}
		@mysqli_free_result( $result );
		if ($max == '') $max = 0; else $max++;
		return $max;
	}
	
	public static function GetCurrentTask()
	{
		$query = "SELECT * FROM tache_queue a1 WHERE position = 0";
		$resultat=mysqli_query(DB::$connexion, $query);
		if ($row = mysqli_fetch_object($resultat))
			return new TacheQueue($row, true);
		else
			return new TacheQueue();
	}
	
	
	public static function GetTasks()
	{
		$query = "SELECT * FROM tache_queue WHERE position > 0";
		$query .= " ORDER BY position ASC";
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