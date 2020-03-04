<?php
class TaskQueueCore
{
	public $id_task_queue = -1;
	public $id_task = -1;
	public $position = -1;
	public $state = "";
	public $progress = "";
	public $step = -1;

	public function __construct( $id_task_queue = null, $byrow=false ) 
	{
		if ($byrow)
		{
			$this->Copy($id_task_queue);
		}
		elseif(! is_null($id_task_queue) && $id_task_queue != -1 )
		{
			$object = TaskQueue::getTaskQueue( $id_task_queue );
			if ($object)
			{
				$this->Copy($object);
			}
		}
	}

	protected function Copy($object)
	{
		$this->id_task_queue = $object->id_task_queue;
		$this->id_task = $object->id_task;
		$this->position = $object->position;
		$this->state = $object->state;
		$this->progress = $object->progress;
		$this->step = $object->step;
	}

	public static function getTaskQueue( $id_task_queue )
	{
		$query = "SELECT * FROM task_queue a1 WHERE id_task_queue = '".mysqli_real_escape_string(DB::$connexion, $id_task_queue)."'";
		$resultat=mysqli_query(DB::$connexion, $query);
		return mysqli_fetch_object($resultat);
	}

	public function Save()
	{
		if( $this->id_task_queue == -1 || is_null($this->id_task_queue) )
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
		$query = "INSERT INTO task_queue ( id_task, position, state, progress, step ) VALUES ( 

			'". mysqli_real_escape_string(DB::$connexion, $this->id_task) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->position) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->state) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->progress) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->step) ."'
			) ";
		$insert=mysqli_query(DB::$connexion, $query) or die ('ERREUR Insert TaskQueue : '.$query.'<br />'.mysqli_error(DB::$connexion).'<br /><br />');
		$this->id_task_queue = mysqli_insert_id(DB::$connexion);
	}

	public function Update( )
	{
		global $_CONFIG;
		$query = "UPDATE task_queue SET

			id_task = '". mysqli_real_escape_string(DB::$connexion,  $this->id_task )."', 
			position = '". mysqli_real_escape_string(DB::$connexion,  $this->position )."', 
			state = '". mysqli_real_escape_string(DB::$connexion,  $this->state )."', 
			progress = '". mysqli_real_escape_string(DB::$connexion,  $this->progress )."', 
			step = '". mysqli_real_escape_string(DB::$connexion,  $this->step )."'
		WHERE id_task_queue = '". mysqli_real_escape_string(DB::$connexion, $this->id_task_queue)."'";
		$update=mysqli_query(DB::$connexion, $query) or die ('ERREUR Update TaskQueue : '.$query.'<br />'.mysqli_error(DB::$connexion).'<br /><br />');
	}
	
	public function Supprimer()
	{
		$query="DELETE FROM task_queue WHERE id_task_queue = '".mysqli_real_escape_string(DB::$connexion, $this->id_task_queue)."'";
		$delete=mysqli_query(DB::$connexion, $query) or die ('ERREUR Delete TaskQueue : '.$query.'<br />'.mysqli_error(DB::$connexion).'<br /><br />');
	}

	public static function GetTaskQueues($order = "", $order_sens = "")
	{
		$query = "SELECT * FROM task_queue";
		if ($order!="")
			$query .= " ORDER BY ".mysqli_real_escape_string(DB::$connexion, $order)." ".mysqli_real_escape_string(DB::$connexion, $order_sens);
		else 
			$query .= " ORDER BY id_task_queue ASC";
		$result = mysqli_query(DB::$connexion, $query);
		$array = array();
		while ($row = @mysqli_fetch_object( $result ) )
		{
			$array[] = new TaskQueue($row, true);
		}
		@mysqli_free_result( $result );
		return $array;
	}
}
?>