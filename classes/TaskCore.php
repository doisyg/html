<?php
class TaskCore
{
	public $id_task = -1;
	public $id_site = -1;
	public $id_map = -1;
	public $name = "";
	public $action_fin = 0;

	public function __construct( $id_task = null, $byrow=false ) 
	{
		if ($byrow)
		{
			$this->Copy($id_task);
		}
		elseif(! is_null($id_task) && $id_task != -1 )
		{
			$object = Task::getTask( $id_task );
			if ($object)
			{
				$this->Copy($object);
			}
		}
	}

	protected function Copy($object)
	{
		$this->id_task = $object->id_task;
		$this->id_site = $object->id_site;
		$this->id_map = $object->id_map;
		$this->name = $object->name;
		$this->action_fin = $object->action_fin;
	}

	public static function getTask( $id_task )
	{
		$query = "SELECT * FROM task a1 WHERE id_task = '".mysqli_real_escape_string(DB::$connexion, $id_task)."'";
		$resultat=mysqli_query(DB::$connexion, $query);
		return mysqli_fetch_object($resultat);
	}

	public function Save()
	{
		if( $this->id_task == -1 || is_null($this->id_task) )
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
		$query = "INSERT INTO task ( id_site, id_map, name, action_fin ) VALUES ( 

			'". mysqli_real_escape_string(DB::$connexion, $this->id_site) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->id_map) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->name) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->action_fin) ."'
			) ";
		$insert=mysqli_query(DB::$connexion, $query) or die ('ERREUR Insert Task : '.$query.'<br />'.mysqli_error(DB::$connexion).'<br /><br />');
		$this->id_task = mysqli_insert_id(DB::$connexion);
	}

	public function Update( )
	{
		global $_CONFIG;
		$query = "UPDATE task SET

			id_site = '". mysqli_real_escape_string(DB::$connexion,  $this->id_site )."', 
			id_map = '". mysqli_real_escape_string(DB::$connexion,  $this->id_map )."', 
			name = '". mysqli_real_escape_string(DB::$connexion,  $this->name )."', 
			action_fin = '". mysqli_real_escape_string(DB::$connexion,  $this->action_fin )."'
		WHERE id_task = '". mysqli_real_escape_string(DB::$connexion, $this->id_task)."'";
		$update=mysqli_query(DB::$connexion, $query) or die ('ERREUR Update Task : '.$query.'<br />'.mysqli_error(DB::$connexion).'<br /><br />');
	}
	
	public function Supprimer()
	{
		$query="DELETE FROM task WHERE id_task = '".mysqli_real_escape_string(DB::$connexion, $this->id_task)."'";
		$delete=mysqli_query(DB::$connexion, $query) or die ('ERREUR Delete Task : '.$query.'<br />'.mysqli_error(DB::$connexion).'<br /><br />');
	}

	public static function GetTasks($order = "", $order_sens = "")
	{
		$query = "SELECT * FROM task";
		if ($order!="")
			$query .= " ORDER BY ".mysqli_real_escape_string(DB::$connexion, $order)." ".mysqli_real_escape_string(DB::$connexion, $order_sens);
		else 
			$query .= " ORDER BY id_task ASC";
		$result = mysqli_query(DB::$connexion, $query);
		$array = array();
		while ($row = @mysqli_fetch_object( $result ) )
		{
			$array[] = new Task($row, true);
		}
		@mysqli_free_result( $result );
		return $array;
	}
}
?>