<?php
class LogTaskCore
{
	public $id_log_task = -1;
	public $level = "";
	public $type = "";
	public $detail = "";
	public $date = "";

	public function __construct( $id_log_task = null, $byrow=false ) 
	{
		if ($byrow)
		{
			$this->Copy($id_log_task);
		}
		elseif(! is_null($id_log_task) && $id_log_task != -1 )
		{
			$object = LogTask::getLogTask( $id_log_task );
			if ($object)
			{
				$this->Copy($object);
			}
		}
	}

	protected function Copy($object)
	{
		$this->id_log_task = $object->id_log_task;
		$this->level = $object->level;
		$this->type = $object->type;
		$this->detail = $object->detail;
		$this->date = $object->date;
	}

	public static function getLogTask( $id_log_task )
	{
		$query = "SELECT * FROM log_task a1 WHERE id_log_task = '".mysqli_real_escape_string(DB::$connexion, $id_log_task)."'";
		$resultat=mysqli_query(DB::$connexion, $query);
		return mysqli_fetch_object($resultat);
	}

	public function Save()
	{
		if( $this->id_log_task == -1 || is_null($this->id_log_task) )
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
		$query = "INSERT INTO log_task ( level, type, detail, date ) VALUES ( 

			'". mysqli_real_escape_string(DB::$connexion, $this->level) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->type) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->detail) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->date) ."'
			) ";
		$insert=mysqli_query(DB::$connexion, $query) or die ('ERREUR Insert LogTask : '.$query.'<br />'.mysqli_error(DB::$connexion).'<br /><br />');
		$this->id_log_task = mysqli_insert_id(DB::$connexion);
	}

	public function Update( )
	{
		global $_CONFIG;
		$query = "UPDATE log_task SET

			level = '". mysqli_real_escape_string(DB::$connexion,  $this->level )."', 
			type = '". mysqli_real_escape_string(DB::$connexion,  $this->type )."', 
			detail = '". mysqli_real_escape_string(DB::$connexion,  $this->detail )."', 
			date = '". mysqli_real_escape_string(DB::$connexion,  $this->date )."'
		WHERE id_log_task = '". mysqli_real_escape_string(DB::$connexion, $this->id_log_task)."'";
		$update=mysqli_query(DB::$connexion, $query) or die ('ERREUR Update LogTask : '.$query.'<br />'.mysqli_error(DB::$connexion).'<br /><br />');
	}
	
	public function Supprimer()
	{
		$query="DELETE FROM log_task WHERE id_log_task = '".mysqli_real_escape_string(DB::$connexion, $this->id_log_task)."'";
		$delete=mysqli_query(DB::$connexion, $query) or die ('ERREUR Delete LogTask : '.$query.'<br />'.mysqli_error(DB::$connexion).'<br /><br />');
	}

	public static function GetLogTasks($order = "", $order_sens = "")
	{
		$query = "SELECT * FROM log_task";
		if ($order!="")
			$query .= " ORDER BY ".mysqli_real_escape_string(DB::$connexion, $order)." ".mysqli_real_escape_string(DB::$connexion, $order_sens);
		else 
			$query .= " ORDER BY id_log_task ASC";
		$result = mysqli_query(DB::$connexion, $query);
		$array = array();
		while ($row = @mysqli_fetch_object( $result ) )
		{
			$array[] = new LogTask($row, true);
		}
		@mysqli_free_result( $result );
		return $array;
	}
}
?>