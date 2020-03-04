<?php
class TaskCronCore
{
	public $id_task_cron = -1;
	public $id_task = -1;
	public $minute = -1;
	public $hour = -1;
	public $day = -1;
	public $month = -1;
	public $name = "";
	public $comment = "";

	public function __construct( $id_task_cron = null, $byrow=false ) 
	{
		if ($byrow)
		{
			$this->Copy($id_task_cron);
		}
		elseif(! is_null($id_task_cron) && $id_task_cron != -1 )
		{
			$object = TaskCron::getTaskCron( $id_task_cron );
			if ($object)
			{
				$this->Copy($object);
			}
		}
	}

	protected function Copy($object)
	{
		$this->id_task_cron = $object->id_task_cron;
		$this->id_task = $object->id_task;
		$this->minute = $object->minute;
		$this->hour = $object->hour;
		$this->day = $object->day;
		$this->month = $object->month;
		$this->name = $object->name;
		$this->comment = $object->comment;
	}

	public static function getTaskCron( $id_task_cron )
	{
		$query = "SELECT * FROM task_cron a1 WHERE id_task_cron = '".mysqli_real_escape_string(DB::$connexion, $id_task_cron)."'";
		$resultat=mysqli_query(DB::$connexion, $query);
		return mysqli_fetch_object($resultat);
	}

	public function Save()
	{
		if( $this->id_task_cron == -1 || is_null($this->id_task_cron) )
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
		$query = "INSERT INTO task_cron ( id_task, minute, hour, day, month, name, comment ) VALUES ( 

			'". mysqli_real_escape_string(DB::$connexion, $this->id_task) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->minute) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->hour) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->day) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->month) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->name) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->comment) ."'
			) ";
		$insert=mysqli_query(DB::$connexion, $query) or die ('ERREUR Insert TaskCron : '.$query.'<br />'.mysqli_error(DB::$connexion).'<br /><br />');
		$this->id_task_cron = mysqli_insert_id(DB::$connexion);
	}

	public function Update( )
	{
		global $_CONFIG;
		$query = "UPDATE task_cron SET

			id_task = '". mysqli_real_escape_string(DB::$connexion,  $this->id_task )."', 
			minute = '". mysqli_real_escape_string(DB::$connexion,  $this->minute )."', 
			hour = '". mysqli_real_escape_string(DB::$connexion,  $this->hour )."', 
			day = '". mysqli_real_escape_string(DB::$connexion,  $this->day )."', 
			month = '". mysqli_real_escape_string(DB::$connexion,  $this->month )."', 
			name = '". mysqli_real_escape_string(DB::$connexion,  $this->name )."', 
			comment = '". mysqli_real_escape_string(DB::$connexion,  $this->comment )."'
		WHERE id_task_cron = '". mysqli_real_escape_string(DB::$connexion, $this->id_task_cron)."'";
		$update=mysqli_query(DB::$connexion, $query) or die ('ERREUR Update TaskCron : '.$query.'<br />'.mysqli_error(DB::$connexion).'<br /><br />');
	}
	
	public function Supprimer()
	{
		$query="DELETE FROM task_cron WHERE id_task_cron = '".mysqli_real_escape_string(DB::$connexion, $this->id_task_cron)."'";
		$delete=mysqli_query(DB::$connexion, $query) or die ('ERREUR Delete TaskCron : '.$query.'<br />'.mysqli_error(DB::$connexion).'<br /><br />');
	}

	public static function GetTaskCrons($order = "", $order_sens = "")
	{
		$query = "SELECT * FROM task_cron";
		if ($order!="")
			$query .= " ORDER BY ".mysqli_real_escape_string(DB::$connexion, $order)." ".mysqli_real_escape_string(DB::$connexion, $order_sens);
		else 
			$query .= " ORDER BY id_task_cron ASC";
		$result = mysqli_query(DB::$connexion, $query);
		$array = array();
		while ($row = @mysqli_fetch_object( $result ) )
		{
			$array[] = new TaskCron($row, true);
		}
		@mysqli_free_result( $result );
		return $array;
	}
}
?>