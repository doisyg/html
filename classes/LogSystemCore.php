<?php
class LogSystemCore
{
	public $id_log_system = -1;
	public $level = "";
	public $type = "";
	public $detail = "";
	public $date = "";

	public function __construct( $id_log_system = null, $byrow=false ) 
	{
		if ($byrow)
		{
			$this->Copy($id_log_system);
		}
		elseif(! is_null($id_log_system) && $id_log_system != -1 )
		{
			$object = LogSystem::getLogSystem( $id_log_system );
			if ($object)
			{
				$this->Copy($object);
			}
		}
	}

	protected function Copy($object)
	{
		$this->id_log_system = $object->id_log_system;
		$this->level = $object->level;
		$this->type = $object->type;
		$this->detail = $object->detail;
		$this->date = $object->date;
	}

	public static function getLogSystem( $id_log_system )
	{
		$query = "SELECT * FROM log_system a1 WHERE id_log_system = '".mysqli_real_escape_string(DB::$connexion, $id_log_system)."'";
		$resultat=mysqli_query(DB::$connexion, $query);
		return mysqli_fetch_object($resultat);
	}

	public function Save()
	{
		if( $this->id_log_system == -1 || is_null($this->id_log_system) )
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
		$query = "INSERT INTO log_system ( level, type, detail, date ) VALUES ( 

			'". mysqli_real_escape_string(DB::$connexion, $this->level) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->type) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->detail) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->date) ."'
			) ";
		$insert=mysqli_query(DB::$connexion, $query) or die ('ERREUR Insert LogSystem : '.$query.'<br />'.mysqli_error(DB::$connexion).'<br /><br />');
		$this->id_log_system = mysqli_insert_id(DB::$connexion);
	}

	public function Update( )
	{
		global $_CONFIG;
		$query = "UPDATE log_system SET

			level = '". mysqli_real_escape_string(DB::$connexion,  $this->level )."', 
			type = '". mysqli_real_escape_string(DB::$connexion,  $this->type )."', 
			detail = '". mysqli_real_escape_string(DB::$connexion,  $this->detail )."', 
			date = '". mysqli_real_escape_string(DB::$connexion,  $this->date )."'
		WHERE id_log_system = '". mysqli_real_escape_string(DB::$connexion, $this->id_log_system)."'";
		$update=mysqli_query(DB::$connexion, $query) or die ('ERREUR Update LogSystem : '.$query.'<br />'.mysqli_error(DB::$connexion).'<br /><br />');
	}
	
	public function Supprimer()
	{
		$query="DELETE FROM log_system WHERE id_log_system = '".mysqli_real_escape_string(DB::$connexion, $this->id_log_system)."'";
		$delete=mysqli_query(DB::$connexion, $query) or die ('ERREUR Delete LogSystem : '.$query.'<br />'.mysqli_error(DB::$connexion).'<br /><br />');
	}

	public static function GetLogSystems($order = "", $order_sens = "")
	{
		$query = "SELECT * FROM log_system";
		if ($order!="")
			$query .= " ORDER BY ".mysqli_real_escape_string(DB::$connexion, $order)." ".mysqli_real_escape_string(DB::$connexion, $order_sens);
		else 
			$query .= " ORDER BY id_log_system ASC";
		$result = mysqli_query(DB::$connexion, $query);
		$array = array();
		while ($row = @mysqli_fetch_object( $result ) )
		{
			$array[] = new LogSystem($row, true);
		}
		@mysqli_free_result( $result );
		return $array;
	}
}
?>