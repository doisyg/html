<?php
class TaskActionCore
{
	public $id_task_action = -1;
	public $id_task = -1;
	public $action_type = -1;
	public $action_detail = "";
	public $position = -1;

	public function __construct( $id_task_action = null, $byrow=false ) 
	{
		if ($byrow)
		{
			$this->Copy($id_task_action);
		}
		elseif(! is_null($id_task_action) && $id_task_action != -1 )
		{
			$object = TaskAction::getTaskAction( $id_task_action );
			if ($object)
			{
				$this->Copy($object);
			}
		}
	}

	protected function Copy($object)
	{
		$this->id_task_action = $object->id_task_action;
		$this->id_task = $object->id_task;
		$this->action_type = $object->action_type;
		$this->action_detail = $object->action_detail;
		$this->position = $object->position;
	}

	public static function getTaskAction( $id_task_action )
	{
		$query = "SELECT * FROM task_action a1 WHERE id_task_action = '".mysqli_real_escape_string(DB::$connexion, $id_task_action)."'";
		$resultat=mysqli_query(DB::$connexion, $query);
		return mysqli_fetch_object($resultat);
	}

	public function Save()
	{
		if( $this->id_task_action == -1 || is_null($this->id_task_action) )
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
		$query = "INSERT INTO task_action ( id_task, action_type, action_detail, position ) VALUES ( 

			'". mysqli_real_escape_string(DB::$connexion, $this->id_task) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->action_type) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->action_detail) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->position) ."'
			) ";
		$insert=mysqli_query(DB::$connexion, $query) or die ('ERREUR Insert TaskAction : '.$query.'<br />'.mysqli_error(DB::$connexion).'<br /><br />');
		$this->id_task_action = mysqli_insert_id(DB::$connexion);
	}

	public function Update( )
	{
		global $_CONFIG;
		$query = "UPDATE task_action SET

			id_task = '". mysqli_real_escape_string(DB::$connexion,  $this->id_task )."', 
			action_type = '". mysqli_real_escape_string(DB::$connexion,  $this->action_type )."', 
			action_detail = '". mysqli_real_escape_string(DB::$connexion,  $this->action_detail )."', 
			position = '". mysqli_real_escape_string(DB::$connexion,  $this->position )."'
		WHERE id_task_action = '". mysqli_real_escape_string(DB::$connexion, $this->id_task_action)."'";
		$update=mysqli_query(DB::$connexion, $query) or die ('ERREUR Update TaskAction : '.$query.'<br />'.mysqli_error(DB::$connexion).'<br /><br />');
	}
	
	public function Supprimer()
	{
		$query="DELETE FROM task_action WHERE id_task_action = '".mysqli_real_escape_string(DB::$connexion, $this->id_task_action)."'";
		$delete=mysqli_query(DB::$connexion, $query) or die ('ERREUR Delete TaskAction : '.$query.'<br />'.mysqli_error(DB::$connexion).'<br /><br />');
	}

	public static function GetTaskActions($order = "", $order_sens = "")
	{
		$query = "SELECT * FROM task_action";
		if ($order!="")
			$query .= " ORDER BY ".mysqli_real_escape_string(DB::$connexion, $order)." ".mysqli_real_escape_string(DB::$connexion, $order_sens);
		else 
			$query .= " ORDER BY id_task_action ASC";
		$result = mysqli_query(DB::$connexion, $query);
		$array = array();
		while ($row = @mysqli_fetch_object( $result ) )
		{
			$array[] = new TaskAction($row, true);
		}
		@mysqli_free_result( $result );
		return $array;
	}
}
?>